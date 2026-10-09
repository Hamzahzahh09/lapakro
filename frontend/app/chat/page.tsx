"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  MessageSquare,
  Check,
  CheckCheck,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Search,
  ExternalLink,
  Store,
  Package,
  Wifi,
  WifiOff,
  Copy,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { formatRupiah, getInitials } from "@/lib/utils";

interface OtherUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  isVerified: boolean;
}

interface ProductContext {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface TransactionContext {
  id: string;
  status: string;
  totalPrice: number;
  quantity: number;
  notes?: string;
  createdAt?: string;
}

interface PopulatedConversation {
  id: string;
  buyerId: string;
  sellerId: string;
  transactionId: string | null;
  productId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: number;
  otherUser: OtherUser;
  product?: ProductContext | null;
  transaction?: TransactionContext | null;
}

interface ChatMessage {
  id: string;
  transactionId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "image" | "file";
  fileUrl?: string;
  readAt?: string | null;
  createdAt: string;
}

function ChatMainContent() {
  const searchParams = useSearchParams();
  const initialTargetId = useRef<string | null>(
    searchParams.get("id") || searchParams.get("tx")
  );

  const { token, user } = useAuthStore();
  const [conversations, setConversations] = useState<PopulatedConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialTargetId.current);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(initialTargetId.current));
  const [isConnected, setIsConnected] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(activeId);
  activeIdRef.current = activeId;

  // Scroll HANYA di dalam container pesan, tidak menggulir window atau footer
  const scrollToBottom = useCallback((smooth = true) => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    }, 60);
  }, []);

  const copyOrderId = (id: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // 1. Fetch conversations HANYA SEKALI saat token siap (tidak me-refresh saat ganti chat)
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    api
      .get<{ success: boolean; data: PopulatedConversation[] }>("/chat/conversations")
      .then(async (res) => {
        if (!isMounted || !res.success || !Array.isArray(res.data)) return;

        let list = res.data;
        const target = initialTargetId.current;

        // Jika ada targetId di query URL tapi belum ada di list (baru dibuat)
        if (target && !list.some((c) => c.id === target || c.transactionId === target)) {
          try {
            const single = await api.get<{
              success: boolean;
              data: PopulatedConversation;
            }>(`/chat/conversations/${target}`);
            if (single.success && single.data) {
              list = [single.data, ...list];
            }
          } catch (err) {
            console.error("Gagal memuat target percakapan:", err);
          }
        }

        setConversations(list);

        // Tentukan percakapan aktif pertama kali
        if (target) {
          const match = list.find((c) => c.id === target || c.transactionId === target);
          if (match) {
            setActiveId(match.id);
            setMobileShowChat(true);
          }
        } else if (list.length > 0 && !activeIdRef.current) {
          setActiveId(list[0].id);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil daftar percakapan:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingConversations(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // 2. Setup Native WebSocket (Murni WS tanpa polling Socket.IO)
  useEffect(() => {
    if (!token) return;

    let isCancelled = false;
    let reconnectTimer: NodeJS.Timeout;

    const connectWs = () => {
      if (isCancelled) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const wsBase = apiUrl.replace(/^http/, "ws").replace(/\/api$/, "");
      const wsUrl = `${wsBase}/ws/chat?token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isCancelled) return;
        setIsConnected(true);

        // Jika sudah ada percakapan aktif, join room
        if (activeIdRef.current) {
          ws.send(
            JSON.stringify({
              event: "join_room",
              data: { conversationId: activeIdRef.current, token },
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const { event: evt, data } = parsed;

          if (evt === "chat_history" && Array.isArray(data)) {
            setMessages(data);
            scrollToBottom(false);
          } else if (evt === "new_message" && data) {
            const msg: ChatMessage = data;
            const currentActive = activeIdRef.current;

            // Jika pesan berada di room yang sedang dibuka
            if (currentActive && msg.transactionId === currentActive) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
              });
              scrollToBottom(true);

              // Tandai read jika dari lawan bicara
              if (user?.id && msg.senderId !== user.id) {
                api
                  .patch(`/chat/conversations/${currentActive}/read`)
                  .catch(() => {});
              }
            }

            // Update state percakapan di memori secara lokal TANPA refetch/reload
            setConversations((prev) => {
              const index = prev.findIndex((c) => c.id === msg.transactionId);
              if (index === -1) return prev;
              const copy = [...prev];
              const conv = { ...copy[index] };
              conv.lastMessage = msg.content;
              conv.lastMessageAt = msg.createdAt;
              if (user?.id && msg.senderId !== user.id && conv.id !== currentActive) {
                conv.unread = (conv.unread || 0) + 1;
              }
              copy.splice(index, 1);
              return [conv, ...copy];
            });
          } else if (evt === "all_read" && data) {
            setMessages((prev) =>
              prev.map((m) =>
                m.senderId !== data.userId && !m.readAt
                  ? { ...m, readAt: new Date().toISOString() }
                  : m
              )
            );
          }
        } catch (e) {
          console.error("Gagal parsing pesan WebSocket:", e);
        }
      };

      ws.onclose = () => {
        if (isCancelled) return;
        setIsConnected(false);
        // Reconnect otomatis setelah 3 detik tanpa me-refresh halaman
        reconnectTimer = setTimeout(connectWs, 3000);
      };

      ws.onerror = (err) => {
        console.warn("WebSocket status:", err);
      };
    };

    connectWs();

    return () => {
      isCancelled = true;
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token, user?.id, scrollToBottom]);

  // 3. Bergabung ke room & muat riwayat saat activeId berubah (Tanpa refresh halaman)
  useEffect(() => {
    if (!activeId) return;

    setLoadingMessages(true);

    // Ambil riwayat pesan via REST
    api
      .get<{ success: boolean; data: ChatMessage[] }>(`/chat/messages/${activeId}`)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setMessages(res.data);
          scrollToBottom(false);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat pesan:", err);
      })
      .finally(() => {
        setLoadingMessages(false);
      });

    // Bergabung ke room via native WebSocket jika terbuka
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: "join_room",
          data: { conversationId: activeId, token },
        })
      );
    }

    // Tandai pesan sudah dibaca secara lokal & server
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
    );
    api.patch(`/chat/conversations/${activeId}/read`).catch(() => {});

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeId) {
        wsRef.current.send(
          JSON.stringify({
            event: "leave_room",
            data: { conversationId: activeId },
          })
        );
      }
    };
  }, [activeId, token, scrollToBottom]);

  // 4. Kirim pesan
  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || !activeId || sending) return;

    setSending(true);
    setInputText("");

    const payload = {
      content: text,
      type: "text" as const,
    };

    try {
      // Jika native WebSocket aktif, kirim via WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            event: "send_message",
            data: {
              conversationId: activeId,
              content: text,
              type: "text",
              token,
            },
          })
        );
      } else {
        // Fallback ke REST API
        const res = await api.post<{ success: boolean; data: ChatMessage }>(
          `/chat/messages/${activeId}`,
          payload
        );
        if (res.success && res.data) {
          setMessages((prev) => [...prev, res.data]);
          scrollToBottom(true);
        }
      }

      // Update ringkasan list percakapan di memori (instan & tanpa reload)
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === activeId);
        if (index === -1) return prev;
        const copy = [...prev];
        const conv = { ...copy[index] };
        conv.lastMessage = text;
        conv.lastMessageAt = new Date().toISOString();
        copy.splice(index, 1);
        return [conv, ...copy];
      });
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    } finally {
      setSending(false);
    }
  };

  // Pilih percakapan: Update state & URL tanpa me-refresh atau re-mount Next.js
  const handleSelectConversation = (conv: PopulatedConversation) => {
    setActiveId(conv.id);
    setMobileShowChat(true);

    // Ganti URL secara silent tanpa router.replace yang memicu re-render
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/chat?id=${conv.id}`);
    }
  };

  // Filter percakapan lokal
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.otherUser?.name?.toLowerCase().includes(q) ||
        c.otherUser?.email?.toLowerCase().includes(q) ||
        c.product?.title?.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId]
  );

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "seller":
        return (
          <Badge variant="gold" className="text-[10px] py-0 px-1.5 h-4 gap-1">
            <Store className="h-2.5 w-2.5" /> Penjual
          </Badge>
        );
      case "admin":
      case "owner":
        return (
          <Badge variant="premium" className="text-[10px] py-0 px-1.5 h-4">
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
            Pembeli
          </Badge>
        );
    }
  };

  const getTransactionStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return (
          <Badge variant="success" className="gap-1 text-[10px] font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Selesai
          </Badge>
        );
      case "awaiting_seller":
        return (
          <Badge variant="warning" className="gap-1 text-[10px] font-semibold bg-amber-500 text-white">
            <Clock className="h-3 w-3" /> Menunggu Penjual
          </Badge>
        );
      case "awaiting_buyer":
        return (
          <Badge variant="default" className="gap-1 text-[10px] font-semibold bg-blue-500 text-white">
            <Package className="h-3 w-3" /> Pesanan Dikirim
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1 text-[10px] font-semibold bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3" /> Menunggu Bayar
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1 text-[10px] font-semibold">
            Dibatalkan
          </Badge>
        );
      case "disputed":
        return (
          <Badge variant="warning" className="gap-1 text-[10px] font-semibold bg-orange-500 text-white">
            Komplain
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {status || "Diproses"}
          </Badge>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex overflow-hidden bg-[#F9FAFB]">
      {/* Kolom Kiri: Daftar Percakapan */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-[#EAEAEA] bg-white flex flex-col h-full ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-[#EAEAEA]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-[#111827] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#FFD700]" />
              Pesan & Diskusi
            </h1>
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  <Wifi className="h-3 w-3" /> Live WS
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                  <WifiOff className="h-3 w-3" /> Menghubungkan
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563]">
                {conversations.length}
              </span>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari seller, produk, atau pesan..."
              className="h-10 pl-9 rounded-xl bg-[#F9FAFB] border-[#E5E7EB] focus:bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#F3F4F6]">
          {loadingConversations ? (
            <div className="p-8 text-center text-sm text-[#9CA3AF] space-y-3">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#FFD700] border-r-transparent" />
              <p>Memuat percakapan...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = activeId === conv.id;
              const other = conv.otherUser;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 flex gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[rgba(255,215,0,0.08)] border-l-4 border-l-[#FFD700]"
                      : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border border-[#EAEAEA]">
                      <AvatarImage src={other?.photo} alt={other?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white font-bold text-sm">
                        {getInitials(other?.name || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#22C55E] border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="font-bold text-sm text-[#111827] truncate">
                          {other?.name || other?.email || "Pengguna"}
                        </h3>
                        {other?.isVerified && (
                          <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#9CA3AF] shrink-0 ml-1">
                        {conv.lastMessageAt
                          ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1.5">
                      {getRoleBadge(other?.role)}
                      {conv.product?.title && (
                        <span className="text-[11px] text-[#4B5563] truncate bg-[#F3F4F6] px-1.5 py-0.5 rounded max-w-[130px]">
                          📦 {conv.product.title}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#6B7280] truncate flex-1 pr-2">
                        {conv.lastMessage || (
                          <span className="italic text-[#9CA3AF]">
                            Mulai percakapan...
                          </span>
                        )}
                      </p>
                      {conv.unread > 0 && (
                        <span className="shrink-0 flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white shadow-sm">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-[#6B7280] space-y-2">
              <MessageSquare className="h-10 w-10 text-[#D1D5DB] mx-auto" />
              <p className="font-semibold text-[#374151]">Belum ada percakapan</p>
              <p className="text-xs text-[#9CA3AF]">
                Tekan tombol &quot;Hubungi Seller&quot; pada produk atau detail
                pesanan untuk memulai chat.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Area Chat Utama */}
      <div
        className={`flex-1 flex flex-col bg-white relative h-full ${
          !mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        {activeConversation ? (
          <>
            {/* Header Percakapan */}
            <div className="h-16 shrink-0 border-b border-[#EAEAEA] px-4 md:px-6 flex items-center justify-between z-10 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden h-8 w-8 -ml-1 text-[#4B5563]"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10 border border-[#EAEAEA]">
                  <AvatarImage
                    src={activeConversation.otherUser?.photo}
                    alt={activeConversation.otherUser?.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#111827] to-[#1F2937] text-white font-bold text-sm">
                    {getInitials(activeConversation.otherUser?.name || "User")}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-[#111827] text-sm md:text-base truncate">
                      {activeConversation.otherUser?.name ||
                        activeConversation.otherUser?.email}
                    </h2>
                    {activeConversation.otherUser?.isVerified && (
                      <ShieldCheck className="h-4 w-4 text-[#3B82F6] shrink-0" />
                    )}
                    {getRoleBadge(activeConversation.otherUser?.role)}
                  </div>
                  <p className="text-[11px] text-[#22C55E] flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                    Online &bull; Respon Cepat
                  </p>
                </div>
              </div>

              {/* Tautan Cepat ke Transaksi atau Produk */}
              <div className="flex items-center gap-2">
                {activeConversation.transaction ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-[#E5E7EB] text-xs h-8 px-3 gap-1.5 font-semibold text-[#374151] hover:text-[#111827]"
                  >
                    <Link
                      href={`/transactions/${activeConversation.transaction.id}`}
                    >
                      <Package className="h-3.5 w-3.5 text-[#D4A017]" />
                      <span className="hidden sm:inline">Halaman Transaksi</span>
                      <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                    </Link>
                  </Button>
                ) : activeConversation.product ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-[#E5E7EB] text-xs h-8 px-3 gap-1.5 font-semibold text-[#374151] hover:text-[#111827]"
                  >
                    <Link href={`/products/${activeConversation.product.id}`}>
                      <ShoppingBag className="h-3.5 w-3.5 text-[#D4A017]" />
                      <span className="hidden sm:inline">Lihat Produk</span>
                      <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            {/* DETAIL PESANAN LENGKAP & DINAMIS */}
            {(activeConversation.transaction || activeConversation.product) && (
              <div className="border-b border-[#FEEBC8] bg-[#FFFDF5] text-xs transition-all duration-200">
                {activeConversation.transaction ? (
                  <div className="p-3 md:px-6">
                    {/* Baris Atas Ringkas: ID Pesanan, Status, dan Tombol Toggle Detail */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-bold text-[#78350F] flex items-center gap-1 text-[11px] uppercase tracking-wider bg-[#FEF3C7] px-2 py-0.5 rounded-md border border-[#FDE68A]">
                          <Package className="h-3.5 w-3.5 text-[#D97706]" />
                          Pesanan Terkait
                        </span>

                        <div className="flex items-center gap-1.5 text-[#92400E]">
                          <span className="font-mono font-bold text-xs">
                            #{activeConversation.transaction.id.substring(0, 13)}...
                          </span>
                          <button
                            type="button"
                            onClick={() => copyOrderId(activeConversation.transaction!.id)}
                            className="p-1 hover:bg-[#FEEBC8] rounded text-[#B45309] transition-colors"
                            title="Salin ID Pesanan"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {copiedId && (
                            <span className="text-[10px] text-[#22C55E] font-semibold">
                              Tersalin!
                            </span>
                          )}
                        </div>

                        {getTransactionStatusBadge(activeConversation.transaction.status)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowOrderDetails(!showOrderDetails)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#B45309] hover:text-[#78350F] px-2 py-1 rounded hover:bg-[#FEEBC8] transition-colors shrink-0"
                      >
                        <span>{showOrderDetails ? "Sembunyikan" : "Detail Pesanan"}</span>
                        {showOrderDetails ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Konten Detail Pesanan yang Dapat Di-expand */}
                    {showOrderDetails && (
                      <div className="mt-2.5 pt-2.5 border-t border-[#FDE68A]/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[#92400E]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-5 w-5 text-[#D97706]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#111827] truncate text-xs">
                              {activeConversation.product?.title || "Item Roblox"}
                            </p>
                            <p className="text-[11px] text-[#B45309]">
                              {activeConversation.transaction.quantity}x &bull;{" "}
                              <span className="font-bold text-[#B45309]">
                                {formatRupiah(activeConversation.transaction.totalPrice)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {activeConversation.transaction.notes && (
                          <div className="bg-white/80 border border-[#FDE68A] rounded-lg p-2 flex items-start gap-1.5 min-w-0">
                            <FileText className="h-3.5 w-3.5 text-[#D97706] shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-[#78350F] uppercase tracking-wide">
                                Catatan / Username Roblox:
                              </p>
                              <p className="text-xs font-semibold text-[#111827] truncate">
                                {activeConversation.transaction.notes}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:col-span-1 md:col-auto">
                          {activeConversation.transaction.createdAt && (
                            <span className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activeConversation.transaction.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}

                          <Button
                            variant="gold"
                            size="sm"
                            asChild
                            className="h-7 text-[11px] px-2.5 rounded-lg shadow-none"
                          >
                            <Link href={`/transactions/${activeConversation.transaction.id}`}>
                              Buka Pesanan
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeConversation.product ? (
                  // Jika belum ada transaksi tapi ada produk yang dibicarakan
                  <div className="p-3 md:px-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-4 w-4 text-[#D97706]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#111827] truncate text-xs">
                          {activeConversation.product.title}
                        </p>
                        <p className="text-[#B45309] font-bold text-[11px]">
                          {formatRupiah(activeConversation.product.price)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 text-[11px] px-2.5 rounded-lg border-[#FDE68A] text-[#78350F] bg-white hover:bg-[#FEF3C7]"
                    >
                      <Link href={`/products/${activeConversation.product.id}`}>
                        Lihat Produk
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Area Daftar Pesan (Scroll Khusus di Container ini) */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 z-10 bg-[#FAFAFA]/40"
            >
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center text-sm text-[#9CA3AF]">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-[#FFD700] border-r-transparent mr-2" />
                  Memuat riwayat chat...
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#6B7280]">
                  <div className="h-14 w-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
                    <Store className="h-7 w-7 text-[#D97706]" />
                  </div>
                  <h4 className="font-bold text-[#111827] mb-1">
                    Mulai Percakapan dengan{" "}
                    {activeConversation.otherUser?.name || "Seller"}
                  </h4>
                  <p className="text-xs text-[#6B7280] max-w-sm">
                    Tanyakan ketersediaan produk, proses pengiriman, atau konfirmasi
                    pesanan langsung kepada penjual secara real-time.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;
                  const isRead = Boolean(msg.readAt);
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex gap-2.5 max-w-[85%] md:max-w-[75%] ${
                        isMe ? "ml-auto justify-end" : "mr-auto"
                      }`}
                    >
                      {!isMe && (
                        <Avatar className="h-7 w-7 mt-auto shrink-0 border border-[#EAEAEA]">
                          <AvatarImage
                            src={activeConversation.otherUser?.photo}
                            alt={activeConversation.otherUser?.name}
                          />
                          <AvatarFallback className="text-[10px] font-bold bg-[#374151] text-white">
                            {getInitials(
                              activeConversation.otherUser?.name || "U"
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={isMe ? "text-right" : ""}>
                        <div
                          className={`rounded-2xl p-3.5 shadow-sm text-sm ${
                            isMe
                              ? "bg-gradient-to-r from-[#FFD700] to-[#FFC700] text-[#111827] rounded-br-xs font-medium text-left"
                              : "bg-white text-[#111827] rounded-bl-xs border border-[#EAEAEA]"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words leading-relaxed">
                            {msg.content}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-1 mt-1 px-1 ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-[10px] text-[#9CA3AF]">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                          {isMe &&
                            (isRead ? (
                              <CheckCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
                            ) : (
                              <Check className="h-3 w-3 text-[#9CA3AF]" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <div className="shrink-0 p-3 md:p-4 bg-white border-t border-[#EAEAEA] z-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <div className="flex-1 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] focus-within:border-[#FFD700] focus-within:bg-white transition-all flex items-center pr-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Tulis pesan untuk ${
                      activeConversation.otherUser?.name || "seller"
                    }...`}
                    className="border-0 bg-transparent h-11 focus-visible:ring-0 shadow-none text-sm text-[#111827] placeholder:text-[#9CA3AF]"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    variant="gold"
                    disabled={!inputText.trim() || sending}
                    className="h-8.5 w-8.5 rounded-xl shrink-0 shadow-sm"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#6B7280] flex-col gap-3 p-6 text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#FFFDF5] border border-[#FEEBC8] flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-[#FFD700]" />
            </div>
            <h3 className="font-bold text-base text-[#111827]">
              Pilih Percakapan
            </h3>
            <p className="text-sm text-[#6B7280] max-w-sm">
              Pilih salah satu percakapan di sebelah kiri untuk melihat pesan atau
              berkomunikasi langsung dengan penjual secara aman dan cepat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F9FAFB]">
          <div className="text-center space-y-2">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD700] border-r-transparent align-[-0.125em]" />
            <p className="text-sm font-medium text-[#6B7280]">
              Memuat percakapan...
            </p>
          </div>
        </div>
      }
    >
      <ChatMainContent />
    </Suspense>
  );
}
