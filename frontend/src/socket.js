import { io } from "socket.io-client";

export const initSocket = async () => {
  const backendURL =
    import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
  const options = {
    'force new connection': true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(backendURL, options);
};
