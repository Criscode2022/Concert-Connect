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
      <div className="flex flex-col h-[calc(100dvh-72px)] md:h-[calc(100dvh-64px)] w-full max-w-3xl mx-auto bg-card border-x border-border">
        {/* Event banner */}
        {event && (
          <div className="flex items-center gap-4 px-5 py-4 bg-muted/30 border-b border-border flex-shrink-0 shadow-sm z-10">
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
              <Music className="w-6 h-6 text-foreground stroke-[1.5]" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-serif font-medium text-foreground truncate mb-0.5">{event.artistName}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="truncate">{event.venueName}</span>
                <span>·</span>
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-shrink-0">{format(new Date(event.date), "d MMM", { locale: es })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 bg-background">
          {messagesLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Skeleton className={`h-12 rounded-2xl ${i % 2 === 0 ? "w-64" : "w-48"}`} />
                </div>
              ))}
            </div>
          )}

          {!messagesLoading && (!messages || messages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
              </div>
              <p className="text-foreground font-serif text-xl mb-2">Rompe el hielo</p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Saluda para quedar el día del concierto.
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  {!isOwn && (
                    <div className="w-8 flex-shrink-0">
                      {showAvatar && (
                        <Avatar className="w-8 h-8 border border-border shadow-sm">
                          <AvatarImage src={otherUser?.avatarUrl ?? undefined} />
                          <AvatarFallback className="bg-secondary text-foreground text-xs font-serif font-bold">
                            {otherUser?.name?.[0]?.toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 text-[15px] shadow-sm ${
                      isOwn
                        ? "bg-foreground text-background rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1.5 font-medium text-right ${
                        isOwn ? "text-background/60" : "text-muted-foreground"
                      }`}
                    >
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 bg-background border border-border rounded-full pl-6 pr-2 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-[15px] outline-none h-9"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground transition-all"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}