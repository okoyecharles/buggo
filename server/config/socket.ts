import type http from "http";
import jwt from "jsonwebtoken";
import { DefaultEventsMap, Server } from "socket.io";
import User from "../models/userModel";
import Project from "../models/projectModel";

const secret = process.env.JWT_SECRET!;

type SocketData = {
  userId: string;
  isAdmin: boolean;
  projectIds: string[];
};

export const adminsRoom = "admins";

/*
 * Admins are sent every project over http, so the realtime layer has to match.
 * Emitting to several rooms de-duplicates sockets, so an admin who is also a
 * member still receives a single copy.
 */
export const projectRoom = (projectId: unknown) => [
  `project:${projectId}`,
  adminsRoom,
];
let io: Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

export const initSocket = (httpServer: http.Server, allowed: string[]) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowed,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    // A middleware denial stops the client's automatic reconnection, so
    // `retriable` tells it whether minting a fresh ticket is worth trying.
    const deny = (message: string, retriable: boolean) => {
      const error = new Error(message);
      (error as any).data = { retriable };
      return next(error);
    };

    const { ticket } = socket.handshake.auth;
    if (!ticket) return deny("Missing ticket", true);

    let decoded: { id: string; typ?: string };
    try {
      decoded = jwt.verify(ticket, secret) as typeof decoded;
    } catch (err: any) {
      // Expired only means we were too slow; anything else means forged.
      return deny("Bad ticket", err?.name === "TokenExpiredError");
    }

    if (decoded.typ !== "socket") return deny("Bad ticket type", false);

    try {
      const user = await User.findById(decoded.id);
      if (!user) return deny("Unauthorized", false);

      const projects = await Project.find({
        $or: [{ author: user._id }, { team: user._id }],
      }).select("_id");

      socket.data.userId = decoded.id;
      socket.data.isAdmin = user.admin;
      socket.data.projectIds = projects.map((project) =>
        project._id.toString(),
      );
      next();
    } catch (err: any) {
      return deny("Something went wrong", true);
    }
  });

  io.on("connection", (socket) => {
    const { userId, isAdmin, projectIds } = socket.data;
    socket.join(`user:${userId}`);
    projectIds.forEach((id) => socket.join(`project:${id}`));
    // One room instead of every project's, so projects created after this
    // connection are covered too.
    if (isAdmin) socket.join(adminsRoom);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
