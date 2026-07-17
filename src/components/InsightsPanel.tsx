import React from "react";
import { Match, MatchEvent } from "../types";
import { 
  Tv, 
  Radio, 
  Search, 
  CornerDownLeft, 
  RefreshCw, 
  AlertCircle,
  Clock,
  BookOpen
} from "lucide-react";

interface InsightsPanelProps {
  matchedObj: Match;
  customVideoUrl: string;
  setCustomVideoUrl: (url: string) => void;
  rightPanelTab: "telemetry" | "commentary";
  setRightPanelTab: (tab: "telemetry" | "commentary") => void;
  activeEvents: MatchEvent[];
  revealedEventIds: string[];
  selectedEventId: string;
  onSelectEventId: (id: string) => void;
  streamTranscript: { text: string; time: string }[];
  isLoadingTranscript: boolean;
  transcriptError: string;
  commentarySearchQuery: string;
  setCommentarySearchQuery: (query: string) => void;
  isSpeechListening: boolean;
  speechTranscript: string;
  speechTranslation: string;
  isSpeechTranslating: boolean;
  translationLanguage: string;
  translatedTranscriptCache: Record<string, string>;
  onAskCommentatorQuote: (quote: string) => void;
  activePlayEvent: MatchEvent | null;
  onClosePanel: () => void;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  matchedObj,
  customVideoUrl,
  setCustomVideoUrl,
  rightPanelTab,
  setRightPanelTab,
  activeEvents,
  revealedEventIds,
  selectedEventId,
  onSelectEventId,
  streamTranscript,
  isLoadingTranscript,
  transcriptError,
  commentarySearchQuery,
  setCommentarySearchQuery,
  isSpeechListening,
  speechTranscript,
  speechTranslation,
  isSpeechTranslating,
  translationLanguage,
  translatedTranscriptCache,
  onAskCommentatorQuote,
  activePlayEvent,
  onClosePanel
}) => {

  // Helper to resolve clean embedded YouTube URL
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
    if (url.includes("youtube.com/watch")) {
      try {
        const parts = url.split("?");
        const query = parts[1] || "";
        const urlParams = new URLSearchParams(query);
        const id = urlParams.get("v");
        if (id) {
          return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
        }
      } catch (e) {}
    }
    return url;
  };

  const activeVideoUrl = customVideoUrl || matchedObj.videoUrl || "";
  const embedUrl = getEmbedUrl(activeVideoUrl);
  const isIframe = embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com") || embedUrl.includes("embed");

  return (
    <div id="right-insights-panel" className="h-full bg-[#111112] border-l border-[#242426] flex flex-col w-[380px] shrink-0 overflow-hidden text-left select-none">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-[#242426] bg-[#141416] flex items-center justify-between shrink-0">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Tv className="w-4 h-4 text-emerald-400" />
          Live Broadcast & Insights
        </span>
        <button 
          onClick={onClosePanel}
          className="text-[10px] font-mono text-slate-500 hover:text-white px-2 py-0.5 rounded border border-slate-800 bg-[#1c1c1f] hover:bg-slate-800 transition uppercase"
        >
          Hide
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/10">

        {/* 1. VIDEO REPLAY MONITOR */}
        <div className="bg-[#141416] border border-slate-800/80 rounded-xl p-3 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Ingestion Stream View
            </span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase font-bold">
              HD Feed
            </span>
          </div>

          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/90 border border-slate-900 flex items-center justify-center">
            {activeVideoUrl ? (
              isIframe ? (
                <iframe
                  src={embedUrl}
                  title="Stream replay"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-center p-4">
                <Tv className="w-7 h-7 text-slate-700 mx-auto mb-1 animate-pulse" />
                <p className="text-[10px] font-mono text-slate-500">No Stream URL Hooked</p>
              </div>
            )}
          </div>

          {/* Stream link input bar */}
          <div className="space-y-1">
            <label className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
              Custom YouTube Replay or Stream URL
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Paste video url..."
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                className="flex-1 bg-[#0c0c0d] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/50 font-mono transition"
              />
              {customVideoUrl && (
                <button
                  onClick={() => setCustomVideoUrl("")}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9.5px] font-mono transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. TAB SWITCHER FOR LIVE AUDIO TRANSCRIPT VS EVENT LOGS */}
        <div className="flex bg-[#141416] border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setRightPanelTab("commentary")}
            className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition relative ${
              rightPanelTab === "commentary"
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            Voice Monitor
            {streamTranscript.length > 0 && (
              <span className="absolute top-1.5 right-2 flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
              </span>
            )}
          </button>
          
          <button
            onClick={() => setRightPanelTab("telemetry")}
            className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition ${
              rightPanelTab === "telemetry"
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            Vision Events
          </button>
        </div>

        {/* 3. CONDITIONAL TAB CONTENTS */}
        {rightPanelTab === "commentary" ? (
          
          /* LIVE COMMENTARY INGESTION PANEL */
          <div className="space-y-3.5 flex flex-col">
            
            {/* Explanatory text block */}
            <div className="bg-[#141416]/40 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Live Speech Ingestor
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                  {streamTranscript.length} lines
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                Broadcaster voice commentaries are captured in real-time. Click to ask RefAI to verify or translate announcer statements.
              </p>

              {/* Caption Search Bar */}
              <div className="relative bg-[#0c0c0d] border border-slate-800 rounded-lg p-1.5 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-slate-600 shrink-0 ml-1" />
                <input
                  type="text"
                  value={commentarySearchQuery}
                  onChange={(e) => setCommentarySearchQuery(e.target.value)}
                  placeholder="Filter commentaries (e.g. card, foul)..."
                  className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[10px] text-slate-300 placeholder-slate-700 font-sans"
                />
                {commentarySearchQuery && (
                  <button onClick={() => setCommentarySearchQuery("")} className="text-[8.5px] font-mono text-slate-500 hover:text-white px-1">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Ingested Captions List */}
            <div className="bg-[#141416]/30 border border-slate-900 rounded-xl p-2.5 min-h-[220px]">
              
              {/* Captured Speech Recognition overlay */}
              {(isSpeechListening || speechTranscript) && (
                <div className="mb-3.5 p-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-mono font-bold text-emerald-400 flex items-center gap-1 uppercase">
                      <span className="h-1 w-1 bg-red-500 rounded-full animate-ping" />
                      Live Mic Capture
                    </span>
                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-300 px-1.5 rounded uppercase">
                      Translated to: {translationLanguage.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div>
                      <span className="text-[8px] font-mono text-slate-500 block uppercase">Detected Speech:</span>
                      <p className="text-slate-300 font-sans italic text-[10.5px]">
                        {speechTranscript || "Listening to mic... speak near match audio"}
                      </p>
                    </div>
                    
                    {isSpeechTranslating ? (
                      <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-emerald-400">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        <span>Translating speech...</span>
                      </div>
                    ) : speechTranslation ? (
                      <div>
                        <span className="text-[8px] font-mono text-emerald-500 block uppercase">Target Language translation:</span>
                        <p className="text-emerald-400 font-sans font-bold text-[11px]">
                          {speechTranslation}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Feed Stream list or Status */}
              {isLoadingTranscript ? (
                <div className="py-12 text-center text-slate-500 font-mono text-[10px] flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
                  <span>INGESTING VOICE CAPTIONS...</span>
                </div>
              ) : transcriptError ? (
                <div className="py-12 text-center text-slate-500 font-mono text-[10px] flex flex-col items-center gap-2 px-4">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="uppercase text-center leading-normal">{transcriptError}</span>
                </div>
              ) : streamTranscript.length === 0 ? (
                <div className="py-12 text-center text-slate-600 font-mono text-[10px] flex flex-col items-center gap-1.5">
                  <Radio className="w-5 h-5 text-slate-800 animate-pulse" />
                  <span>No stream commentaries loaded yet.</span>
                </div>
              ) : (
                <div className="space-y-1.5 overflow-y-auto max-h-[280px] pr-1 custom-scrollbar">
                  {(() => {
                    const query = commentarySearchQuery.toLowerCase().trim();
                    const filtered = streamTranscript.filter(item => 
                      !query || item.text.toLowerCase().includes(query)
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-6 text-slate-600 font-mono text-[9px] uppercase">
                          No captions match "{commentarySearchQuery}"
                        </div>
                      );
                    }

                    return filtered.map((item, idx) => {
                      const keywords = ["foul", "card", "penalty", "offside", "red", "yellow", "handball", "referee", "var", "goal"];
                      const parts = item.text.split(new RegExp(`(${keywords.join("|")})`, "gi"));
                      
                      const highlightedText = parts.length > 1 ? (
                        parts.map((part, pidx) => {
                          const isKeyword = keywords.includes(part.toLowerCase());
                          return isKeyword ? (
                            <span key={pidx} className="bg-emerald-500/10 text-emerald-400 font-extrabold px-1 py-0.5 rounded text-[9.5px]">
                              {part}
                            </span>
                          ) : part;
                        })
                      ) : item.text;

                      return (
                        <div 
                          key={idx} 
                          className="p-2 bg-[#141416]/80 hover:bg-[#1c1c1e] rounded-lg border border-slate-900 flex items-start gap-2.5 transition text-[10.5px] leading-relaxed"
                        >
                          <span className="font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 shrink-0 font-bold select-none text-[9px]">
                            {item.time}
                          </span>
                          <div className="flex-1 text-slate-300 font-sans text-left">
                            <span>{highlightedText}</span>
                            {(() => {
                              const cacheKey = `${translationLanguage}:${item.text}`;
                              const translated = translationLanguage !== "en" ? translatedTranscriptCache[cacheKey] : null;
                              if (translated) {
                                return (
                                  <div className="mt-1 text-emerald-400 font-sans font-medium text-[9.5px] border-t border-slate-900 pt-1 leading-relaxed">
                                    Translate: {translated}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          
                          <button
                            onClick={() => {
                              const contextPrompt = `In the live match commentary stream at ${item.time}, the announcer said: "${item.text}". Does this statement align with official FIFA Laws or does it warrant a different regulatory decision?`;
                              onAskCommentatorQuote(contextPrompt);
                            }}
                            className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-emerald-500/20 text-slate-500 hover:text-emerald-400 transition shrink-0 cursor-pointer"
                            title="Verify quote with RefAI"
                          >
                            <CornerDownLeft className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

          </div>
        ) : (
          
          /* TEXT-BASED ON-FIELD EVENTS TIMELINE (NO GRAPHICS) */
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-black block tracking-widest">
              Live Ingestion Event Stream
            </span>

            <div className="space-y-1.5">
              {activeEvents.map((evt) => {
                const isRevealed = revealedEventIds.includes(evt.id);
                const isSelected = evt.id === selectedEventId;

                if (!isRevealed) {
                  return (
                    <div 
                      key={evt.id}
                      className="p-2.5 border border-dashed border-slate-900/60 rounded-xl opacity-30 select-none flex items-center justify-between text-[10px] font-mono"
                    >
                      <span className="text-slate-600">Pending Stream Event...</span>
                      <span className="bg-slate-900 px-1 rounded font-bold text-[9px] text-slate-700">{evt.time}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={evt.id}
                    onClick={() => onSelectEventId(evt.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#141416] border-emerald-500/30 text-white font-semibold"
                        : "bg-[#141416]/20 border-transparent text-slate-400 hover:border-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        isSelected ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-900 text-slate-500"
                      }`}>
                        {evt.time}'
                      </span>
                      <span className="font-extrabold uppercase tracking-wider text-[8px] text-emerald-500 bg-emerald-500/5 px-1 rounded">
                        {evt.type}
                      </span>
                    </div>
                    <span className="text-[10.5px] block font-sans text-slate-200 font-bold leading-tight truncate">{evt.title}</span>
                    <p className="text-[10px] text-slate-500 font-sans leading-normal line-clamp-2 mt-1">{evt.description.split("]")[1]?.trim() || evt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. CURRENT RULEBOOK CITATION TEXT BOX */}
        {activePlayEvent && (
          <div className="bg-[#141416] border border-slate-800 rounded-xl p-3 text-xs text-left">
            <div className="text-[9px] font-mono text-slate-500 uppercase font-black border-b border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
              <span>Referee Citation Grounding</span>
              <span className="text-emerald-400 font-bold text-[8.5px] font-mono uppercase bg-emerald-500/5 px-1.5 rounded">
                {activePlayEvent.rulebookContext.split(" - ")[0]}
              </span>
            </div>
            
            <h5 className="font-extrabold text-white text-[11px] mb-1.5 font-sans leading-snug">
              {activePlayEvent.rulebookContext.split(": ")[0]}
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans italic bg-slate-950/40 p-2.5 rounded border border-slate-900">
              {activePlayEvent.rulebookContext.split(": ")[1] || activePlayEvent.rulebookContext}
            </p>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="p-3 bg-[#141416] text-[8px] font-mono text-slate-500 text-center uppercase tracking-tight border-t border-[#242426]">
        Laws Source: Official FIFA Laws of the Game
      </div>

    </div>
  );
};
