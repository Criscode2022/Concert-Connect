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
    ? `${otherUser.name}`
    : matchLoading
    ? "Cargando..."
    : "Chat";

  return (
    <AppLayout title={title} showBack>
      <div className="flex flex-col h-[calc(100dvh-72px)] md:h-[calc(100dvh-64px)] w-full max-w-3xl mx-auto bg-card border-x-2 border-foreground relative overflow-hidden">
        {/* Background Noise inside chat */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><filter id="noiseChat"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseChat)"/></svg>
        </div>
        
        {/* Event banner */}
        {event && (
          <div className="flex items-center gap-4 px-6 py-5 bg-background border-b-2 border-foreground flex-shrink-0 shadow-[0_4px_0px_0px_hsl(var(--foreground))] z-20 relative">
            <div className="w-14 h-14 rounded-xl bg-primary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] transform rotate-3">
              <Music className="w-7 h-7 text-primary-foreground stroke-[2]" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-serif font-bold uppercase tracking-tight text-foreground truncate mb-1">{event.artistName}</p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span className="truncate">{event.venueName}</span>
                <span className="text-foreground/30">•</span>
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-shrink-0">{format(new Date(event.date), "d MMM", { locale: es })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-6 bg-card relative z-10">
          {messagesLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Skeleton className={`h-16 border-2 border-foreground ${i % 2 === 0 ? "w-64 rounded-2xl rounded-bl-none" : "w-48 rounded-2xl rounded-br-none"}`} />
                </div>
              ))}
            </div>
          )}

          {!messagesLoading && (!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-24 h-24 rounded-2xl bg-background border-2 border-foreground flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transform rotate-6">
                <Music className="w-10 h-10 text-foreground stroke-[2]" />
              </div>
              <p className="text-foreground font-serif font-bold uppercase text-3xl mb-3">Rompe el hielo</p>
              <p className="text-muted-foreground font-medium text-lg max-w-xs border-l-4 border-primary pl-4 text-left">
                Saluda para quedar antes del bolo y tomar algo.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages?.map((msg, idx) => {
              const isOwn = msg.senderClerkId === clerkUser?.id;
              // Group messages logic (simplified)
              const prevMsg = messages[idx - 1];
              const showAvatar = !isOwn && (!prevMsg || prevMsg.senderClerkId !== msg.senderClerkId);
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                  className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <div className="w-10 flex-shrink-0">
                      {showAvatar && (
                        <Avatar className="w-10 h-10 border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] rounded-lg transform -rotate-6">
                          <AvatarImage src={otherUser?.avatarUrl ?? undefined} className="rounded-md object-cover" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-serif font-bold rounded-md">
                            {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 text-base font-medium shadow-[4px_4px_0px_0px_hsl(var(--foreground))] border-2 border-foreground ${
                      isOwn
                        ? "bg-foreground text-background rounded-br-none"
                        : "bg-background text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-2 font-bold uppercase tracking-wider text-right ${
                        isOwn ? "text-background/50" : "text-muted-foreground/70"
                      }`}
                    >
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 p-5 border-t-2 border-foreground bg-background z-20 relative shadow-[0_-4px_0px_0px_hsl(var(--foreground))]">
          <div className="flex items-center gap-3 bg-card border-2 border-foreground rounded-2xl pl-6 pr-2 py-2 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] focus-within:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] focus-within:-translate-y-0.5 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe algo guapo..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base font-bold outline-none h-12"
            />
            <motion.button
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              className="w-12 h-12 rounded-xl border-2 border-transparent disabled:border-transparent [&:not(:disabled)]:border-foreground bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition-all [&:not(:disabled)]:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6 ml-1" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}