import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types/user";
import { setupChatSocket } from "../lib/sockets";
import { getCookie } from "../services/cookieUtils";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  onlineUsers: User[];
}

const Chat = ({ onlineUsers }: ChatProps) => {
  const {
    state: { user: currentUser },
  } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeRecipient, setActiveRecipient] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log("currentUser", currentUser);
  useEffect(() => {
    if (!currentUser) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const chatSocket = setupChatSocket(token);
    setSocket(chatSocket);

    chatSocket.on("receiveMessage", (message: Message) => {
      console.log("message", message);
      if (
        !activeRecipient ||
        message.sender === activeRecipient._id ||
        message.sender === currentUser._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      chatSocket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [activeRecipient]);

  const sendMessage = () => {
    if (input.trim() && activeRecipient && currentUser) {
      const newMessage: Message = {
        sender: currentUser._id,
        content: input,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      socket.emit("sendMessage", {
        recipientId: activeRecipient._id,
        content: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r border-gray-200">
        <div className="p-4 font-bold border-b border-gray-200">
          Online Users
        </div>
        <div className="overflow-y-auto">
          {onlineUsers.map((user) => (
            <div
              key={user._id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                activeRecipient?._id === user._id ? "bg-blue-50" : ""
              }`}
              onClick={() => setActiveRecipient(user)}
            >
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-green-500">Online</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col w-3/4">
        {activeRecipient ? (
          <>
            <div className="p-4 font-bold border-b border-gray-200">
              Chat with {activeRecipient.username}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === currentUser?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === currentUser?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 border border-gray-300 rounded px-4 py-2"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Select a user to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
