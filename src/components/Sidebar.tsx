import React from "react";
import { Match } from "../types";
import { MATCHES_DATA } from "../data";
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Radio, 
  Sparkles,
  X 
} from "lucide-react";

interface SidebarProps {
  selectedMatchId: string;
  onSelectMatchId: (id: string) => void;
  isAudioEnabled: boolean;
  onToggleAudio: (enabled: boolean) => void;
  audioFeedback: string;
  translationLanguage: string;
  onChangeTranslationLanguage: (lang: string) => void;
  isSpeechListening: boolean;
  onToggleSpeechMic: () => void;
  systemLatency: number;
  onOpenIngestModal: () => void;
  onCloseSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedMatchId,
  onSelectMatchId,
  isAudioEnabled,
  onToggleAudio,
  audioFeedback,
  translationLanguage,
  onChangeTranslationLanguage,
  isSpeechListening,
  onToggleSpeechMic,
  systemLatency,
  onOpenIngestModal,
  onCloseSidebar
}) => {
  return (
    <div id="left-sidebar-panel" className="h-full flex flex-col bg-[#141416] text-slate-100 border-r border-[#242426] select-none">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-[#242426] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-4.5 h-4.5 fill-emerald-500/5" />
          </div>
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-white font-sans block">
              RefAI Live
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-500 tracking-widest uppercase block">
              World Cup Monitor
            </span>
          </div>
        </div>
        <button aria-label="Button"
          onClick={onCloseSidebar}
          className="p-1 text-slate-400 hover:text-white rounded-lg lg:hidden transition"
          title="Close Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Trigger for Custom Streams */}
      <div className="p-3 border-b border-[#242426] bg-[#111112]">
        <button aria-label="Button"
          onClick={onOpenIngestModal}
          className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ingest Stream Feed</span>
        </button>
      </div>

      {/* Matches / Broadcast Threads list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 custom-scrollbar">
        <span className="px-3 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2">
          Active FIFA Broadcasts
        </span>

        {MATCHES_DATA.map((m) => {
          const isSelected = m.id === selectedMatchId;
          return (
            <button aria-label="Button"
              key={m.id}
              onClick={() => onSelectMatchId(m.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition relative ${
                isSelected 
                  ? "bg-[#212124] border border-slate-800 text-white font-semibold" 
                  : "text-slate-400 hover:bg-[#212124]/40 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="h-6 w-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-mono font-extrabold text-slate-400">
                  {m.teams.home.logo}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-mono font-bold text-slate-200 uppercase tracking-wide block">
                    {m.teams.home.name.substring(0, 3)} vs {m.teams.away.name.substring(0, 3)}
                  </span>
                  <span className="text-[8px] font-mono text-emerald-500 font-extrabold bg-emerald-500/5 px-1 rounded uppercase shrink-0">
                    {m.period}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 truncate block mt-0.5">{m.stadium}</span>
              </div>

              {isSelected && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Control Panel Footer */}
      <div className="p-3 border-t border-[#242426] bg-[#0c0c0d] space-y-3 shrink-0">
        
        {/* Synthesizer TTS Voice switch */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#141416] border border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              {isAudioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-300 block">AI Voice Assistant</span>
              <span className="text-[8px] font-mono text-slate-500 block">Read live events</span>
            </div>
          </div>
          <input aria-label="Input field"
            type="checkbox"
            checked={isAudioEnabled}
            onChange={(e) => onToggleAudio(e.target.checked)}
            className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-emerald-500"
          />
        </div>

        {audioFeedback && (
          <div className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 py-1 px-2 rounded border border-emerald-500/10 text-center animate-pulse uppercase">
            {audioFeedback}
          </div>
        )}

        {/* Translation and Mic Control Area */}
        <div className="p-2.5 rounded-lg bg-[#141416] border border-slate-800/80 space-y-2.5 text-left">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Sliders className="w-3 h-3 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-300 block">Stream Language Translation</span>
              <span className="text-[8px] font-mono text-slate-500 block">Live speech & commentary translations</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Target</span>
              <select aria-label="Select"
                value={translationLanguage}
                onChange={(e) => onChangeTranslationLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-emerald-500 font-mono w-full cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div className="flex flex-col gap-0.5 justify-end">
              <button aria-label="Button"
                type="button"
                onClick={onToggleSpeechMic}
                className={`py-1 px-1.5 rounded border text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isSpeechListening
                    ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                }`}
                title="Uses speech recognition to transcribe game commentary and translate in real-time"
              >
                <Radio className="w-3 h-3" />
                <span>{isSpeechListening ? "Listening" : "Speak Mic"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry latency parameters */}
        <div className="text-[8px] text-slate-500 space-y-1 font-mono px-1">
          <div className="flex justify-between">
            <span>TRANSCRIPTION LATENCY:</span>
            <span className="text-slate-300 font-bold">{systemLatency}ms</span>
          </div>
          <div className="flex justify-between">
            <span>RULEBOOK GROUNDED:</span>
            <span className="text-emerald-400 font-bold">12 LAWS ACTIVE</span>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-[#141416] p-2 rounded border border-emerald-500/20 text-emerald-400/90 text-[9px] font-sans leading-relaxed text-center">
          Optimizing stadium operations & enhancing the <strong>FIFA World Cup 2026</strong> experience through GenAI intelligent real-time assistance.
        </div>

        {/* User Account segment */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
          <div className="h-6 w-6 rounded-full bg-emerald-600/80 text-white font-extrabold text-[9px] flex items-center justify-center">
            SO
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-200 font-bold block truncate">sowmisowmiyan58@gmail.com</span>
            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold tracking-wider">FIFA Analyst Tier</span>
          </div>
        </div>

      </div>

    </div>
  );
};
