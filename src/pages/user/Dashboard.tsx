import { useState, useEffect } from "react";
import Chat from "../../components/Chat";
import type { User } from "../../types/user";
import { setupChatSocket } from "../../lib/sockets";
import { Socket } from "socket.io-client";

export const Dashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const chatSocket = setupChatSocket(token);
    setSocket(chatSocket);
    chatSocket.on("userOnline", (userId: string) => {
      setOnlineUsers((prev) => {
        if (!prev.some((u) => u._id === userId)) {
          return [
            ...prev,
            {
              _id: userId,
              username: `User-${userId.substring(0, 4)}`,
              email: "",
              online: true,
            },
          ];
        }
        return prev;
      });
    });

    chatSocket.on("userOffline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((u) => u._id !== userId));
    });

    chatSocket.emit("getOnlineUsers", (users: User[]) => {
      setOnlineUsers(users);
    });

    return () => {
      chatSocket.disconnect();
    };
  }, []);
  console.log("onlineUsers", onlineUsers);
  return (
    <div className="container mx-auto p-4">
      <Chat onlineUsers={onlineUsers} />
    </div>
  );
};
