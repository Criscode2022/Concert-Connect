import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useGetMatch,
  useListMessages,
  useSendMessage,
  getListMessagesQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Music, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Chat() {
  const { matchId } = useParams<{ matchId: string }>();
  const matchIdNum = Number(matchId);
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { data: match, isLoading: matchLoading } = useGetMatch(matchIdNum, {
    query: { enabled: !!matchIdNum },
  });

  const { data: messages, isLoading: messagesLoading } = useListMessages(matchIdNum, {
    query: {
      enabled: !!matchIdNum,
      refetchInterval: 3000,
    },
  });

  const sendMessage = useSendMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || sendMessage.isPending) return;
    setInput("");
    sendMessage.mutate(
      { matchId: matchIdNum, data: { content } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(matchIdNum) });
        },
      }
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherUser = match?.otherUser;
  const event = match?.event;

  const title = otherUser
    ? `Chat con ${otherUser.name}`
    : matchLoading
    ? "Cargando..."
    : "Chat";

  return (
    <AppLayout title={title} showBack>
      <div className="flex flex-col h-[calc(100dvh-120px)] md:h-[calc(100dvh-64px)] max-w-2xl mx-auto w-full">
        {/* Event banner */}
        {event && (
          <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{event.artistName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{event.venueName}</span>
                <span>·</span>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(event.date), "d MMM yyyy", { locale: es })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messagesLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-36"}`} />
                </div>
              ))}
            </div>
          )}

          {!messagesLoading && (!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Music className="w-8 h-8 text-primary/50" />
              </div>
              <p className="text-muted-foreground text-sm">
                Di hola y quedáis para el concierto.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages?.map((msg) => {
              const isOwn = msg.senderClerkId === clerkUser?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarImage src={otherUser?.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-background">
          <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2 focus-within:border-primary/50 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
              ) : (
                <Send className="w-4 h-4 text-primary-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
