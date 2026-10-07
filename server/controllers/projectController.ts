import { Response } from "express";
import { ProtectedRequest } from "../types/request";
import Ticket from "../models/ticketModel";
import Project from "./../models/projectModel";
import User from "../models/userModel";
import { ProjectInviteNotification } from "../models/notificationModel";
import mongoose, { Types } from "mongoose";
import { adminsRoom, getIO, projectRoom } from "../config/socket";
import {
  CreateProjectBody,
  InviteToProjectBody,
  UpdateProjectBody,
} from "../types/project";
import { CreateTicketBody } from "../types/ticket";

const fetchProject = async (id: Types.ObjectId | string) => {
  const project = await Project.findById(id)
    .populate("author", "name")
    .populate("team", "name image email")
    .populate({
      path: "tickets",
      populate: {
        path: "team",
        select: "name image email",
      },
    })
    .populate("invitees.user", "name image email");

  return project;
};

/*
 * @route   GET /projects
 * @desc    Get all projects
 * @access  Private
 */
export const getProjects = async (req: ProtectedRequest, res: Response) => {
  try {
    const filter = req.admin
      ? {}
      : { $or: [{ author: req.user }, { team: req.user }] };
    const projects = await Project.find(filter)
      .populate("author", "name")
      .populate("team", "name email image")
      .populate("invitees.user", "name image email")
      // Only the count is rendered, but populating keeps `tickets` a list of
      // documents here as well as on the detail fetch.
      .populate("tickets", "_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   GET /projects/:id
 * @desc    Get a project by id
 * @access  Private
 */
export const getProjectById = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const project = await fetchProject(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (
      project.author.id.toString() !== req.user &&
      !project.team.some((member) => member.id.toString() === req.user) &&
      !req.admin
    )
      return res.status(403).json({ message: "User not authorized" });

    res.status(200).json({ project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   POST /projects
 * @desc    Create a new project
 * @access  Private
 */
export const createProject = async (
  req: ProtectedRequest<CreateProjectBody>,
  res: Response,
) => {
  try {
    const { title } = req.body;
    const project = new Project({
      title,
      author: req.user,
      team: [req.user],
    });

    const newProject = await project.save();
    const returnProject = await fetchProject(newProject._id);

    const io = getIO();

    /*
     * Rooms are joined on connect, so a project made during a session has no
     * room for its author to be in -- without this they receive nothing about
     * it until they reconnect.
     */
    io.in(`user:${req.user}`).socketsJoin(`project:${newProject._id}`);

    // Only the author is a member and they have the response, but admins are
    // sent every project and so have to hear about a new one.
    io.to(adminsRoom).emit("project:create", { project: returnProject });
    res.status(201).json({ project: returnProject });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   PUT /projects/:id
 * @desc    Update a project by id
 * @access  Private
 */
export const updateProject = async (
  req: ProtectedRequest<UpdateProjectBody, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { title, team } = req.body;
    const project = await Project.findById(id).populate("author", "name");

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project?.author._id.toString() !== req.user && !req.admin)
      return res.status(403).json({ message: "User not authorized" });

    const previousTeam = project.team.map((member) => member.toString());

    if (title) project.title = title;
    // The body carries validated id strings; the document expects ObjectIds.
    if (team) project.team = team.map((member) => new Types.ObjectId(member));

    const updatedProject = await project.save();
    const returnProject = await fetchProject(updatedProject.id);

    /*
     * Membership decides who the room reaches, so it has to be corrected
     * before the update goes out -- otherwise a removed member is still
     * listening and a new one hears nothing.
     */
    const io = getIO();
    const room = `project:${updatedProject._id}`;
    const currentTeam = updatedProject.team.map((member) => member.toString());

    currentTeam
      .filter((member) => !previousTeam.includes(member))
      .forEach((member) => io.in(`user:${member}`).socketsJoin(room));

    // The author keeps access through `author` regardless of the team, so
    // dropping them from it revokes nothing.
    const authorId = updatedProject.author._id.toString();

    previousTeam
      .filter((member) => member !== authorId && !currentTeam.includes(member))
      .forEach((member) => {
        // Their own room is the only way left to reach them, so tell them
        // before the project room stops including them.
        io.to(`user:${member}`).emit("project:removed", { projectId: id });
        io.in(`user:${member}`).socketsLeave(room);
      });

    io.to(projectRoom(updatedProject._id)).emit("project:update", {
      project: returnProject,
    });
    res.status(200).json({ project: returnProject });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   PUT /projects/:id/invite
 * @desc    Invite users to a project
 * @access  Private
 */
export const inviteToProject = async (
  req: ProtectedRequest<InviteToProjectBody, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { invitees } = req.body;
    const project = await Project.findById(id).populate("author", "name");

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project?.author.id.toString() !== req.user && !req.admin)
      return res.status(403).json({ message: "User not authorized" });

    // Inviting someone already pending should not add a second entry or a
    // second notification
    const pendingInvites = new Set(
      project.invitees.map((invitee) => invitee.user.toString()),
    );
    const newInvitees = invitees
      .filter((invitee) => !pendingInvites.has(invitee.user))
      .map((invitee) => ({
        user: new Types.ObjectId(invitee.user),
        email: invitee.email,
        createdAt: new Date(),
      }));

    const actor = await User.findById(req.user).select("name");

    if (!actor) return res.status(404).json({ message: "User not found" });

    // An invitee without its notification is invisible to them, so the two
    // writes land together or not at all
    const session = await mongoose.startSession();
    let notifications: any[] = [];

    try {
      await session.withTransaction(async () => {
        await Project.findByIdAndUpdate(
          id,
          { $push: { invitees: { $each: newInvitees } } },
          { session },
        );

        notifications = await ProjectInviteNotification.insertMany(
          newInvitees.map((invitee) => ({
            recipient: invitee.user,
            snapshot: {
              project: { _id: project._id, title: project.title },
              actor: { _id: actor._id, name: actor.name },
            },
          })),
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    const returnProject = await fetchProject(id);
    const io = getIO();

    // Only members are told. An invitee is not one yet, so what reaches them
    // is their notification, not the project.
    io.to(projectRoom(project._id)).emit("project:invite", {
      project: returnProject,
    });

    // Announced after the transaction commits, so a rolled back write is
    // never advertised, and only ever into its recipient's own room.
    notifications.forEach((notification) =>
      io
        .to(`user:${notification.recipient}`)
        .emit("notification:create", { notification }),
    );

    res.status(200).json({ project: returnProject });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   PUT /projects/:id/accept-invite
 * @desc    Accept an invite to a project
 * @access  Private
 */
export const acceptInvite = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isInvited = project.invitees.some(
      (invitee) => invitee.user.toString() === req.user,
    );

    if (!isInvited)
      return res.status(403).json({ message: "Invitation invalid or expired" });

    // The invite, the membership and the notification that announced it all
    // go together
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await Project.findByIdAndUpdate(
          id,
          {
            $pull: { invitees: { user: req.user } },
            $addToSet: { team: new Types.ObjectId(req.user) },
          },
          { session },
        );

        await ProjectInviteNotification.deleteMany(
          { recipient: req.user, "snapshot.project._id": id },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    const returnProject = await fetchProject(id);

    // Joining before the emit means the accepter's own tabs hear it too.
    const io = getIO();
    const room = `project:${project._id}`;
    io.in(`user:${req.user}`).socketsJoin(room);
    // `projectId` is what clears the invite's notification.
    io.to(projectRoom(project._id)).emit("project:accept-invite", {
      project: returnProject,
      projectId: id,
    });

    res.status(200).json({ project: returnProject });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   PUT /projects/:id/decline-invite
 * @desc    Decline an invite to a project
 * @access  Private
 */
export const declineInvite = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isInvited = project.invitees.some(
      (invitee) => invitee.user.toString() === req.user,
    );

    if (!isInvited)
      return res.status(403).json({ message: "Invitation invalid or expired" });

    // The invite and the notification that announced it go together
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await Project.findByIdAndUpdate(
          id,
          { $pull: { invitees: { user: req.user } } },
          { session },
        );

        await ProjectInviteNotification.deleteMany(
          { recipient: req.user, "snapshot.project._id": id },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    // The decliner leaves nothing behind but a shorter invitee list, which
    // the members still need.
    const returnProject = await fetchProject(id);
    getIO()
      .to(projectRoom(project._id))
      .emit("project:update", { project: returnProject });

    res.status(200).json({ message: "Invitation declined" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 * @route   DELETE /projects/:id
 * @desc    Delete a project by id
 * @access  Private
 */
export const deleteProject = async (
  req: ProtectedRequest<undefined, { id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("author", "name");

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.author._id.toString() !== req.user && !req.admin)
      return res.status(403).json({ message: "User not authorized" });

    await project.remove();

    // The reducers key this one off a bare id. Emit before emptying the room.
    const io = getIO();
    const room = `project:${id}`;
    io.to(projectRoom(id)).emit("project:delete", id);
    io.in(room).socketsLeave(room);

    res.status(200).json({ message: "Project removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/*
 *  @route   POST /projects/:id/tickets
 *  @desc    Create ticket for a project
 *  @access  Private
 */
export const createTicket = async (
  req: ProtectedRequest<CreateTicketBody, { id: string }>,
  res: Response,
) => {
  const { priority, status, type, time_estimate, title, description } =
    req.body;
  const { id } = req.params;

  try {
    // Get ticket's project and author
    const ticketProject = await Project.findById(id);
    if (!ticketProject)
      return res.status(404).json({ message: "Project not found" });

    if (
      !req.admin &&
      !ticketProject.team.some((member) => member.toString() === req.user)
    ) {
      return res.status(403).json({ message: "User not authorized" });
    }

    let ticket = new Ticket({
      priority,
      status,
      type,
      time_estimate,
      title,
      description,
    });
    // Assign project and author to tickets relationship
    ticket.project = ticketProject.id;
    ticket.author = new Types.ObjectId(req.user);
    ticket = await ticket.save();
    // The my-tickets list groups by project, so the id alone is not enough.
    await ticket.populate({ path: "project", select: "title" });

    getIO()
      .to(projectRoom(ticketProject._id))
      .emit("ticket:create", { ticket });

    // Assign ticket to project's relationship
    ticketProject.tickets.unshift(ticket._id);
    await ticketProject.save();

    res.status(201).json({ ticket });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
