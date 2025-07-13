import { useState, useEffect } from "react";
import ChatWidget from "../../components/ChatWidget";
import type { User } from "../../types/user";
import { setupChatSocket } from "../../lib/sockets";
import { Socket } from "socket.io-client";

export const Dashboard = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const chatSocket = setupChatSocket(token);

    chatSocket.on("connect", () => {
      console.log("Dashboard: Socket connected successfully");
    });

    chatSocket.on("connect_error", (error) => {
      console.error("Dashboard: Socket connection error:", error);
    });

    setSocket(chatSocket);

    chatSocket.on(
      "userOnline",
      ({ userId, username }: { userId: string; username: string }) => {
        setOnlineUsers((prev) => {
          if (!prev.some((u) => u._id === userId)) {
            return [
              ...prev,
              {
                _id: userId,
                username,
                email: "",
                online: true,
              },
            ];
          }
          return prev;
        });
      }
    );

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

  return (
    <div className="container mx-auto p-4">
      <ChatWidget
        socket={socket}
        onlineUsers={onlineUsers}
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
