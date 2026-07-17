import React, { useRef, useEffect } from "react";
import { ChatMessage, MatchEvent } from "../types";
import { 
  Shield, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Cpu 
} from "lucide-react";

interface ChatWorkspaceProps {
  chatMessages: ChatMessage[];
  activePlayEvent: MatchEvent | null;
  inputMessage: string;
  setInputMessage: (msg: string) => void;
  isTyping: boolean;
  onSendMessage: (queryText: string) => void;
  onOpenIngestModal: () => void;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  chatMessages,
  activePlayEvent,
  inputMessage,
  setInputMessage,
  isTyping,
  onSendMessage,
  onOpenIngestModal
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Private markdown formatter
  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const content = line.trim();
      
      if (content.startsWith("### ")) {
        return (
          <h3 key={lineIdx} className="text-xs font-mono font-bold text-slate-100 mt-3 mb-1.5 first:mt-0 tracking-wide uppercase">
            {content.substring(4)}
          </h3>
        );
      }
      if (content.startsWith("## ")) {
        return (
          <h2 key={lineIdx} className="text-sm font-bold text-slate-100 mt-4 mb-2 first:mt-0 border-b border-slate-800 pb-1 font-sans">
            {content.substring(3)}
          </h2>
        );
      }
      if (content.startsWith("# ")) {
        return (
          <h1 key={lineIdx} className="text-base font-black text-white mt-5 mb-2 first:mt-0 font-sans">
            {content.substring(2)}
          </h1>
        );
      }

      if (content.startsWith("- ") || content.startsWith("* ")) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-300 text-[11px] leading-relaxed mb-1 font-sans">
            {parseInlineStyling(content.substring(2))}
          </li>
        );
      }

      if (content.startsWith("> ")) {
        return (
          <blockquote key={lineIdx} className="border-l-2 border-emerald-500/40 bg-slate-900/40 px-3 py-1.5 rounded-r my-1.5 text-slate-400 font-mono text-[10px] leading-relaxed">
            {parseInlineStyling(content.substring(2))}
          </blockquote>
        );
      }

      if (content === "") {
        return <div key={lineIdx} className="h-1" />;
      }

      return (
        <p key={lineIdx} className="text-slate-300 text-[11px] leading-relaxed mb-2 last:mb-0 font-sans">
          {parseInlineStyling(line)}
        </p>
      );
    });
  };

  const parseInlineStyling = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-extrabold text-white text-[11px]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      return part.split(/(`.*?`)/g).map((subPart, subIdx) => {
        if (subPart.startsWith("`") && subPart.endsWith("`")) {
          return (
            <code key={subIdx} className="bg-slate-950 border border-slate-800 px-1 py-0.5 rounded text-[9.5px] font-mono text-emerald-400 mx-0.5 font-bold">
              {subPart.slice(1, -1)}
            </code>
          );
        }
        
        return subPart.split(/(\[\d{2}:\d{2}\]|Yellow Card|RED CARD|foul|penalty|offside|handball|VAR|Goal)/gi).map((token, tokenIdx) => {
          const lower = token.toLowerCase();
          if (/\[\d{2}:\d{2}\]/.test(token)) {
            return (
              <span key={tokenIdx} className="text-emerald-400 font-mono font-extrabold text-[10px]">
                {token}
              </span>
            );
          }
          if (lower === "yellow card") {
            return (
              <span key={tokenIdx} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded text-[9.5px] font-bold font-mono">
                {token}
              </span>
            );
          }
          if (lower === "red card") {
            return (
              <span key={tokenIdx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.5 rounded text-[9.5px] font-bold font-mono">
                {token}
              </span>
            );
          }
          if (lower === "goal") {
            return (
              <span key={tokenIdx} className="text-emerald-400 font-bold uppercase tracking-wider font-mono text-[10px]">
                {token}
              </span>
            );
          }
          return token;
        });
      });
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
  };

  return (
    <div id="conversational-chat-container" className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0c]">
      
      {/* Scrollable Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
          
          {/* GREETING VIEW */}
          {chatMessages.length <= 1 && (
            <div className="flex flex-col items-center justify-center text-center py-12 my-auto">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Shield className="w-5 h-5 fill-emerald-500/5" />
              </div>
              
              <h1 className="text-lg font-black text-white tracking-tight font-sans uppercase mb-1">
                RefAI Rules Grounding Analyst
              </h1>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-8 font-sans">
                Real-time regulatory assistant. Select play events on the right, or prompt questions to clarify referee decisions under FIFA Laws.
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
                {activePlayEvent?.suggestedQuestions?.slice(0, 4).map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => onSendMessage(q)}
                    className="p-4 bg-[#141416] hover:bg-[#18181c] border border-[#242426] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-20"
                  >
                    <span className="line-clamp-2 font-medium font-sans">{q}</span>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                      <span>Analyze Play</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
                
                {(!activePlayEvent || !activePlayEvent.suggestedQuestions) && (
                  <>
                    <button
                      onClick={() => onSendMessage("Explain FIFA Law 11 Millimeter Offside standards.")}
                      className="p-4 bg-[#141416] hover:bg-[#18181c] border border-[#242426] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-20"
                    >
                      <span className="line-clamp-2 font-medium font-sans">Explain Law 11 Millimeter Offside standards.</span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                        <span>Ask RefAI</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                    <button
                      onClick={() => onSendMessage("What conditions constitute a direct handball offence in FIFA box?")}
                      className="p-4 bg-[#141416] hover:bg-[#18181c] border border-[#242426] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-20"
                    >
                      <span className="line-clamp-2 font-medium font-sans">What conditions constitute a direct handball offence in FIFA box?</span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                        <span>Ask RefAI</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ACTIVE MESSAGES STREAM */}
          {chatMessages.length > 1 && (
            <div className="space-y-6">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={msg.id}
                    className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
                        <Shield className="w-4 h-4 fill-emerald-500/5" />
                      </div>
                    )}

                    <div className={`max-w-[85%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      {/* Text Bubble Card */}
                      <div className={`rounded-2xl px-4 py-3 text-xs ${
                        isUser 
                          ? "bg-emerald-600/10 border border-emerald-500/20 text-slate-100 rounded-tr-none" 
                          : "text-slate-300 bg-transparent"
                      }`}>
                        {isUser ? (
                          <p className="font-sans leading-relaxed whitespace-pre-wrap text-[11px]">{msg.text}</p>
                        ) : (
                          <div className="space-y-1.5">
                            {formatMarkdown(msg.text)}
                          </div>
                        )}
                      </div>

                      {/* Verdict Badge Box */}
                      {!isUser && msg.id !== "welcome" && msg.verdictBadge && (
                        <div className="mt-2 w-full bg-[#141416] border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-lg">
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 text-[9px] font-mono">
                            <span className="text-emerald-400 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                              <Cpu className="w-3.5 h-3.5" />
                              Rule Grounding Verdict
                            </span>
                            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black">
                              CONFIDENCE: {msg.confidenceBadge || "96%"}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold">Standard Call</span>
                              <span className="text-xs font-black text-white">{msg.verdictBadge}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold">Citation Code</span>
                              <span className="text-xs font-bold text-emerald-400 font-mono">
                                {activePlayEvent?.rulebookContext?.split(":")[0]?.trim() || "FIFA CITE"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Message suggested actions list */}
                      {!isUser && msg.id !== "welcome" && activePlayEvent?.suggestedQuestions && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {activePlayEvent.suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => onSendMessage(q)}
                              className="px-2.5 py-1 bg-[#141416] hover:bg-[#1c1c1f] border border-slate-800 text-[9.5px] text-slate-400 hover:text-white rounded-full transition"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-slate-600 block mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0 select-none">
                        U
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing state */}
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="bg-[#141416]/50 border border-slate-800/40 rounded-2xl px-4 py-3.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Floating Prompt Capsule Input Bar */}
      <div className="p-4 border-t border-[#1a1a1c] bg-[#0c0c0d] shrink-0">
        <div className="max-w-2xl mx-auto w-full">
          
          <form 
            onSubmit={handleFormSubmit}
            className="bg-[#141416] border border-[#242426] focus-within:border-emerald-500/30 rounded-2xl p-1.5 flex items-end gap-1.5 transition"
          >
            {/* Quick access Ingestion trigger */}
            <button
              type="button"
              onClick={onOpenIngestModal}
              className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
              title="Ingest video or simulate custom matchup"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>

            <textarea
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage(inputMessage);
                }
              }}
              placeholder={`Ask RefAI about ${activePlayEvent ? `"${activePlayEvent.title}"` : "the soccer rules..."}`}
              className="flex-1 bg-transparent border-0 outline-none resize-none text-slate-200 placeholder-slate-600 py-2.5 px-1 focus:ring-0 max-h-32 font-sans text-xs"
              style={{ overflowY: "auto" }}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer ${
                inputMessage.trim() && !isTyping
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-[#0a0a0c] text-slate-700 cursor-not-allowed"
              }`}
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>

          <p className="text-[9px] font-mono text-slate-600 text-center mt-2.5 select-none uppercase tracking-wider">
            RefAI matches video transcript captions with the official FIFA rulebook in real-time.
          </p>
        </div>
      </div>

    </div>
  );
};
