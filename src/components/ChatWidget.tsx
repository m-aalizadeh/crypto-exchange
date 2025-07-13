import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types/user";
import { Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  socket: Socket | null;
  onlineUsers: User[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const ChatWidget = ({
  socket,
  onlineUsers,
  isOpen,
  onClose,
  onOpen,
}: ChatProps) => {
  const {
    state: { user: currentUser },
  } = useAuth();
  const filteredOnlineUsers = onlineUsers.filter(
    (user) => user._id !== currentUser?._id
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeRecipient, setActiveRecipient] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !currentUser) {
      return;
    }

    const handleMessage = (message: Message) => {
      if (
        !activeRecipient ||
        message.sender === activeRecipient._id ||
        message.sender === currentUser._id
      ) {
        setMessages((prev) => [...prev, message]);
      } else {
        console.log(
          "ChatWidget: Skipping message - not for current recipient:",
          message
        );
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket, activeRecipient, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [activeRecipient]);

  const sendMessage = () => {
    if (input.trim() && activeRecipient && currentUser && socket) {
      const newMessage: Message = {
        sender: currentUser._id,
        content: input,
        timestamp: new Date(),
      };

      socket.emit(
        "sendMessage",
        {
          recipientId: activeRecipient._id,
          content: input,
        },
        (acknowledgement: any) => {
          console.log(
            "ChatWidget: Message send acknowledgement:",
            acknowledgement
          );
        }
      );

      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onOpen}
          className="bg-blue-500 text-white rounded-full p-3 shadow-md hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-[400px] bg-white shadow-lg flex flex-col h-[450px] z-50">
      {/* Header */}
      <div className="px-4 py-2 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="font-medium text-base">
          {activeRecipient ? `Chat with ${activeRecipient.username}` : "Chat"}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Users List */}
        <div className="w-[140px] border-r border-gray-200 bg-white flex flex-col">
          <div className="p-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Online Users</h4>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredOnlineUsers.map((user) => (
              <div
                key={user._id}
                className={`px-3 py-1.5 cursor-pointer ${
                  activeRecipient?._id === user._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveRecipient(user)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.username}
                    </div>
                    <div className="text-xs text-green-500 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeRecipient ? (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                      className={`max-w-[75%] px-3 py-1.5 rounded-lg ${
                        msg.sender === currentUser?._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm break-words">{msg.content}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          msg.sender === currentUser?._id
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">Select a user to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
