import SERVER_URL, { API_ORIGIN } from "@/core/data/backend";
import generateConfig from "@/redux/actions/config/axios";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import bindSocketEvents from "./events";

const fetchSocketTicket = async () => {
  const { data } = await axios.post(
    `${SERVER_URL}/users/socket-ticket`,
    {},
    generateConfig(),
  );
  return data.ticket as string;
};

const socket: Socket = io(API_ORIGIN, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  // Runs before every attempt, so a reconnect always carries a fresh ticket.
  auth: async (cb) => {
    try {
      cb({ ticket: await fetchSocketTicket() });
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      // A rejected session means retrying with a fresh ticket will fail.
      if (status === 401 || status === 403) return socket.disconnect();
      cb({});
    }
  },
});

// A denial stops the manager, so the retriable ones need our own clock.
socket.on("connect_error", (error: any) => {
  if (socket.active) return;
  if (error?.data?.retriable) setTimeout(() => socket.connect(), 3000);
});

bindSocketEvents(socket);

export default socket;
