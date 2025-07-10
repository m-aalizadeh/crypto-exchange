import { io, Socket } from "socket.io-client";

const API_URL = "http://localhost:8000";

export const setupChatSocket = (token: string): Socket => {
  return io(`${API_URL}/chat`, {
    auth: { token },
    transports: ["websocket"],
  });
};

export const setupCryptoSocket = (): Socket => {
  return io(`${API_URL}/crypto`, {
    transports: ["websocket"],
  });
};
