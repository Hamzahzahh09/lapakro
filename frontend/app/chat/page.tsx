"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { io, Socket } from "socket.io-client";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeTxId, setActiveTxId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const { token, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    if (!token) return;

    // Fetch conversations
    api.get<{ success: boolean, data: any[] }>("/chat/conversations")
      .then((res) => {
        if (res.success) {
          setConversations(res.data);
          if (res.data.length > 0) {
            setActiveTxId(res.data[0].transactionId);
          }
        }
      })
      .catch(console.error);

    // Init socket
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/chat", {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("chat_history", (history) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [token, scrollToBottom]);

  useEffect(() => {
    if (activeTxId && socketRef.current) {
      socketRef.current.emit("join_room", { transactionId: activeTxId });
    }
  }, [activeTxId]);



  const sendMessage = () => {
    if (!message.trim() || !activeTxId || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      transactionId: activeTxId,
      content: message,
      type: "text",
    });
    setMessage("");
  };

  const activeConversation = conversations.find(c => c.transactionId === activeTxId);

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex overflow-hidden bg-[#F5F5F5]">
      {/* Sidebar / Chat List */}
      <div className="w-80 shrink-0 border-r border-[#EAEAEA] bg-white flex flex-col h-full">
        <div className="p-4 border-b border-[#EAEAEA]">
          <h2 className="text-xl font-black text-[#111827] mb-4">Pesan</h2>
          <Input
            placeholder="Cari percakapan..."
            className="h-10 rounded-xl bg-[#F5F5F5] border-transparent focus:bg-white"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveTxId(conv.transactionId)}
              className={`p-4 flex gap-3 cursor-pointer border-b border-[#EAEAEA] transition-colors ${activeTxId === conv.transactionId ? "bg-[rgba(255,215,0,0.05)] border-l-4 border-l-[#FFD700]" : "hover:bg-[#F5F5F5]"}`}
            >
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 border border-[#EAEAEA]">
                  <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#22C55E] border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm text-[#111827] truncate">
                    User {conv.otherUserId.substring(0, 5)}...
                  </h3>
                  <span className="text-[10px] text-[#6B7280]">
                    {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] truncate">
                  {conv.lastMessage || "Belum ada pesan"}
                </p>
              </div>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              Belum ada percakapan
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />

        {/* Chat Header */}
        {activeConversation ? (
          <>
            <div className="h-16 shrink-0 border-b border-[#EAEAEA] px-6 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">
                    User {activeConversation.otherUserId.substring(0, 5)}...
                  </h3>
                  <p className="text-[10px] text-[#22C55E] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />{" "}
                    Online
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#EAEAEA]"
              >
                Detail Transaksi
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={idx} className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto justify-end' : ''}`}>
                    {!isMe && (
                      <Avatar className="h-8 w-8 mt-auto shrink-0">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={isMe ? 'text-right' : ''}>
                      <div className={`${isMe ? 'bg-[#FFD700] text-[#111827] rounded-br-none' : 'bg-[#F5F5F5] text-[#111827] rounded-bl-none'} rounded-2xl p-3 shadow-sm text-sm ${isMe ? 'text-left font-medium' : ''}`}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-[10px] text-[#6B7280]">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCircle2 className="h-3 w-3 text-[#D4A017]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-white border-t border-[#EAEAEA] z-10">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex gap-1 shrink-0 pb-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-[#6B7280] hover:text-[#111827]"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-[#6B7280] hover:text-[#111827]"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 bg-[#F5F5F5] rounded-3xl border border-[#EAEAEA] flex items-center pr-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ketik pesan..."
                    className="border-0 bg-transparent h-12 focus-visible:ring-0 shadow-none"
                  />
                  <Button
                    size="icon"
                    variant="gold"
                    onClick={sendMessage}
                    className="h-9 w-9 rounded-full shrink-0 shadow-sm"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 flex-col gap-4 z-10">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p>Pilih percakapan untuk memulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
