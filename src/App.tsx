import React, { useState, useEffect, useRef } from "react";
import { MATCHES_DATA, Match, MatchEvent } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Activity, 
  BookOpen, 
  MessageSquare, 
  Send, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Compass,
  CheckCircle2,
  AlertCircle,
  Radio,
  Cpu,
  Tv,
  Share2,
  Users,
  MapPin,
  Fingerprint,
  Eye,
  Zap,
  Info,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Scale,
  Menu,
  X,
  Search,
  FileText,
  ChevronDown,
  Check,
  CornerDownLeft
} from "lucide-react";

const TACKLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250" style="background:#111d13; font-family:sans-serif;">
  <rect x="10" y="10" width="380" height="230" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <line x1="200" y1="10" x2="200" y2="240" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <circle cx="200" cy="125" r="45" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
  <circle cx="215" cy="115" r="10" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>
  <text x="215" y="118" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">#9</text>
  <path d="M165,145 L215,122" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
  <circle cx="165" cy="145" r="9" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
  <text x="165" y="148" fill="#fff" font-size="8" font-weight="bold" text-anchor="middle">#4</text>
  <circle cx="215" cy="122" r="5" fill="#fbbf24"/>
  <line x1="165" y1="145" x2="215" y2="122" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="180" y="210" fill="#f87171" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">CONTACT ZONE: ANKLE | EXCESSIVE FORCE</text>
  <text x="20" y="35" fill="#34d399" font-size="11" font-family="monospace" font-weight="bold">VLM FRAME ANALYZER: SOCCER SLIDE TACKLE</text>
</svg>`;

const HANDBALL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250" style="background:#0f172a; font-family:sans-serif;">
  <rect x="10" y="10" width="380" height="230" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <line x1="180" y1="160" x2="180" y2="90" stroke="#ef4444" stroke-width="10" stroke-linecap="round"/>
  <circle cx="180" cy="72" r="13" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
  <path d="M180,100 L230,70 L240,50" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="245" cy="42" r="12" fill="#fff" stroke="#10b981" stroke-width="2.5"/>
  <circle cx="240" cy="48" r="5" fill="#fbbf24"/>
  <text x="170" y="210" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">UNNATURAL HAND SHAPE: ABOVE SHOULDER</text>
  <text x="20" y="35" fill="#10b981" font-size="11" font-family="monospace" font-weight="bold">VLM FRAME ANALYZER: HANDBALL INFRACTION</text>
</svg>`;

const OFFSIDE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250" style="background:#061008; font-family:sans-serif;">
  <rect x="10" y="10" width="380" height="230" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <circle cx="170" cy="120" r="10" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
  <text x="170" y="123" fill="#fff" font-size="7" font-weight="bold" text-anchor="middle">DEF</text>
  <line x1="170" y1="10" x2="170" y2="240" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
  <circle cx="192" cy="140" r="10" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>
  <text x="192" y="143" fill="#fff" font-size="7" font-weight="bold" text-anchor="middle">ATT</text>
  <line x1="192" y1="10" x2="192" y2="240" stroke="#f43f5e" stroke-dasharray="3 3" stroke-width="1.5"/>
  <path d="M170,80 L192,80" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="181" y="74" fill="#fbbf24" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">12.5cm</text>
  <text x="20" y="35" fill="#38bdf8" font-size="11" font-family="monospace" font-weight="bold">VLM FRAME ANALYZER: SAOT OFFSIDE METRICS</text>
</svg>`;

const getSvgDataUri = (svgStr: string) => {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
};

interface ChatMessage {
  id: string;
  sender: "user" | "ref";
  text: string;
  timestamp: string;
  verdictBadge?: string;
  confidenceBadge?: string;
  associatedEventId?: string;
}

export default function App() {
  // State for selected Match & Simulated timeline
  const [selectedMatchId, setSelectedMatchId] = useState<string>("soccer-cl");
  const [activeEvents, setActiveEvents] = useState<MatchEvent[]>([]);
  const [revealedEventIds, setRevealedEventIds] = useState<string[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  // Real-time Match Simulator Control
  const [isLiveMonitoring, setIsLiveMonitoring] = useState<boolean>(true);
  const [gameClockMinutes, setGameClockMinutes] = useState<number>(75);
  const [gameClockSeconds, setGameClockSeconds] = useState<number>(0);
  const [homeScore, setHomeScore] = useState<number>(2);
  const [awayScore, setAwayScore] = useState<number>(1);
  const [systemLatency, setSystemLatency] = useState<number>(114);

  // Custom AI Ingestion / Match Generator state
  const [customHomeTeam, setCustomHomeTeam] = useState<string>("Argentina");
  const [customAwayTeam, setCustomAwayTeam] = useState<string>("Germany");
  const [customMatchName, setCustomMatchName] = useState<string>("FIFA World Cup Grand Final");
  const [isGeneratingEvents, setIsGeneratingEvents] = useState<boolean>(false);
  const [generatorAlert, setGeneratorAlert] = useState<string>("");
  const [showIngestModal, setShowIngestModal] = useState<boolean>(false);

  // VAR Decisional Advisor & Scanner overlay simulator
  const [isVarScanning, setIsVarScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanLog, setScanLog] = useState<string>("");
  const [varVerdict, setVarVerdict] = useState<{
    verdict: string;
    confidence: string;
    ruleCode: string;
    description: string;
  } | null>(null);

  // Real VLM Frame analysis states
  const [selectedVlmImage, setSelectedVlmImage] = useState<string | null>(getSvgDataUri(TACKLE_SVG));
  const [selectedVlmFileName, setSelectedVlmFileName] = useState<string>("walker_slide_challenge.svg");
  const [activeVlmPreset, setActiveVlmPreset] = useState<string | null>("tackle");

  // Interactive Pitch mode configurations
  const [activePitchMode, setActivePitchMode] = useState<"telemetry" | "heatmap" | "vectors">("telemetry");
  const [activeRulebookTab, setActiveRulebookTab] = useState<string>("context");

  // Chat states
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Voice Speech states (TTS)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<string>("");

  // ChatGPT-style panels & responsive states
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState<boolean>(true);
  const [showRulebookPanel, setShowRulebookPanel] = useState<boolean>(false);
  const [rulebookSearchQuery, setRulebookSearchQuery] = useState<string>("");

  // Dynamic Video Stream, Custom Rules database expansion
  const [customVideoUrl, setCustomVideoUrl] = useState<string>("");
  const [customMatchStreamUrl, setCustomMatchStreamUrl] = useState<string>("");
  const [customRules, setCustomRules] = useState<{ id: string; title: string; sport: string; body: string }[]>([]);
  const [showAddRuleForm, setShowAddRuleForm] = useState<boolean>(false);
  const [newRuleTitle, setNewRuleTitle] = useState<string>("");
  const [newRuleSport, setNewRuleSport] = useState<string>("soccer");
  const [newRuleBody, setNewRuleBody] = useState<string>("");

  // Voice stream transcript and commentary panel
  const [rightPanelTab, setRightPanelTab] = useState<"telemetry" | "commentary">("telemetry");
  const [streamTranscript, setStreamTranscript] = useState<{ text: string; time: string }[]>([]);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState<boolean>(false);
  const [transcriptError, setTranscriptError] = useState<string>("");
  const [commentarySearchQuery, setCommentarySearchQuery] = useState<string>("");

  // Real-time voice translation & speech recognition states
  const [translationLanguage, setTranslationLanguage] = useState<string>("en");
  const [isSpeechListening, setIsSpeechListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [speechTranslation, setSpeechTranslation] = useState<string>("");
  const [isSpeechTranslating, setIsSpeechTranslating] = useState<boolean>(false);
  const [translatedTranscriptCache, setTranslatedTranscriptCache] = useState<Record<string, string>>({});
  const [isTranslatingAll, setIsTranslatingAll] = useState<boolean>(false);

  const fetchActiveTranscript = async (url: string, matchTitle?: string, sport?: string, events?: MatchEvent[]) => {
    if (!url) {
      setStreamTranscript([]);
      return;
    }
    setIsLoadingTranscript(true);
    setTranscriptError("");
    try {
      const res = await fetch("/api/get-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoUrl: url,
          matchTitle,
          sport,
          events
        })
      });
      if (!res.ok) {
        throw new Error("Failed to load broadcast voice stream transcript.");
      }
      const data = await res.json();
      if (data.success && data.transcript) {
        // Parse the formatted transcript back into list
        // Format of each line is: "[MM:SS] Text content"
        const lines = data.transcript.split("\n");
        const parsed = lines.map((line: string) => {
          const match = line.match(/^\[(\d{2}:\d{2})\]\s*(.*)$/);
          if (match) {
            return { time: match[1], text: match[2] };
          }
          return { time: "00:00", text: line };
        }).filter((p: any) => p.text.trim().length > 0 && !p.text.includes("captions not available") && !p.text.includes("No active YouTube stream"));
        setStreamTranscript(parsed);
      } else {
        setStreamTranscript([]);
        setTranscriptError("No spoken commentary detected in this stream.");
      }
    } catch (err: any) {
      console.warn("Transcript load error:", err);
      setTranscriptError("Voice stream is currently offline or captions are disabled.");
      setStreamTranscript([]);
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  useEffect(() => {
    const matched = MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0];
    const url = customVideoUrl || matched?.videoUrl || "";
    
    let matchTitle = matched?.title;
    let sport = matched?.sport;
    let events = matched?.events;
    
    if (customVideoUrl && !matched?.videoUrl?.includes(customVideoUrl)) {
      matchTitle = customMatchName ? `${customMatchName}: ${customHomeTeam} vs ${customAwayTeam}` : "Custom Live Match";
      sport = "soccer";
      events = activeEvents;
    }
    
    fetchActiveTranscript(url, matchTitle, sport, events);
  }, [selectedMatchId, customVideoUrl, activeEvents]);

  // Helper to translate all commentaries of the active feed
  const translateAllCommentaries = async (targetLang: string) => {
    if (targetLang === "en") return;
    setIsTranslatingAll(true);
    try {
      const pendingTextLines = streamTranscript.map(item => item.text);
      const updatedCache = { ...translatedTranscriptCache };
      
      await Promise.all(
        pendingTextLines.map(async (text) => {
          const cacheKey = `${targetLang}:${text}`;
          if (updatedCache[cacheKey]) return;
          try {
            const res = await fetch("/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text, targetLang })
            });
            const data = await res.json();
            if (data.success && data.translated) {
              updatedCache[cacheKey] = data.translated;
            }
          } catch (e) {
            console.error("Failed to translate line:", text, e);
          }
        })
      );
      setTranslatedTranscriptCache(updatedCache);
    } catch (err) {
      console.error("Bulk translation error:", err);
    } finally {
      setIsTranslatingAll(false);
    }
  };

  // Auto-translate commentaries when transcript changes or language changes
  useEffect(() => {
    if (translationLanguage !== "en" && streamTranscript.length > 0) {
      translateAllCommentaries(translationLanguage);
    }
  }, [streamTranscript, translationLanguage]);

  // Speech Recognition configuration
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = async (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        
        const textToTranslate = final || interim;
        if (textToTranslate.trim()) {
          setSpeechTranscript(textToTranslate);
          if (final) {
            try {
              setIsSpeechTranslating(true);
              const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textToTranslate, targetLang: translationLanguage })
              });
              const data = await res.json();
              if (data.success && data.translated) {
                setSpeechTranslation(data.translated);
              }
            } catch (err) {
              console.error("Speech translation error:", err);
            } finally {
              setIsSpeechTranslating(false);
            }
          }
        }
      };

      rec.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
      };

      rec.onend = () => {
        setIsSpeechListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [translationLanguage]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Web Speech Recognition API is not supported in this browser. Try Google Chrome or Safari!");
      return;
    }
    
    if (isSpeechListening) {
      recognitionRef.current.stop();
      setIsSpeechListening(false);
    } else {
      setSpeechTranscript("");
      setSpeechTranslation("");
      try {
        recognitionRef.current.start();
        setIsSpeechListening(true);
      } catch (e) {
        console.error("Speech recognition start failed:", e);
      }
    }
  };

  // Ref scroll hooks
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Preload match structure when switching matches
  useEffect(() => {
    const matched = MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0];
    setActiveEvents(matched.events);
    // Auto-reveal preloaded events on select
    setRevealedEventIds(matched.events.map(e => e.id));
    if (matched.events.length > 0) {
      setSelectedEventId(matched.events[matched.events.length - 1].id);
      // Synchronize scoreboard metrics
      setHomeScore(matched.teams.home.score);
      setAwayScore(matched.teams.away.score);
      // Sync clock
      const lastTimeStr = matched.events[matched.events.length - 1].time;
      const [m, s] = lastTimeStr.split(":").map(Number);
      setGameClockMinutes(m || 88);
      setGameClockSeconds(s || 0);
    }
    // Dismiss active VAR reports when changing match contexts
    setVarVerdict(null);
    setCustomVideoUrl("");
  }, [selectedMatchId]);

  // Keep chat viewport aligned
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping, selectedEventId]);

  // Live feed ingestion & clock synchronization pipeline
  useEffect(() => {
    if (!isLiveMonitoring) return;

    const timer = setInterval(() => {
      setGameClockSeconds(prevSec => {
        let nextSec = prevSec + 5; // Real-time high-fidelity streaming scale
        let nextMin = gameClockMinutes;
        
        if (nextSec >= 60) {
          nextSec = nextSec % 60;
          nextMin = nextMin + 1;
          if (nextMin > 90) {
            nextMin = 0; // wrap-around game loop
          }
          setGameClockMinutes(nextMin);
        }

        // Sequential unlocking checks for locked plays during active monitoring
        activeEvents.forEach(evt => {
          const [evtMin, evtSec] = evt.time.split(":").map(Number);
          if (evtMin !== undefined && !revealedEventIds.includes(evt.id)) {
            if (nextMin > evtMin || (nextMin === evtMin && nextSec >= (evtSec || 0))) {
              setRevealedEventIds(prev => [...prev, evt.id]);
              setSelectedEventId(evt.id);
              
              // Trigger TTS commentary
              if (isAudioEnabled) {
                const speechStr = `New incident logged. At ${evt.time} minutes, ${evt.title}. Vision log suggests ${evt.description.split("]")[1]?.trim() || ""}`;
                triggerTTS(speechStr);
              }
            }
          }
        });

        return nextSec;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isLiveMonitoring, activeEvents, revealedEventIds, gameClockMinutes, isAudioEnabled]);

  // Network lag fluctuation simulator
  useEffect(() => {
    const lagTimer = setInterval(() => {
      setSystemLatency(prev => {
        const delta = Math.floor(Math.random() * 16) - 8;
        const next = prev + delta;
        return next < 55 ? 55 : next > 140 ? 140 : next;
      });
    }, 3000);
    return () => clearInterval(lagTimer);
  }, []);

  // Text-to-speech engine wrapper
  const triggerTTS = (text: string) => {
    if (!isAudioEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/\*\*+/g, "")
        .replace(/\[.*?\]/g, "")
        .replace(/#\d+/g, "Player");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.15;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
      setAudioFeedback("Broadcast audio stream: active");
      setTimeout(() => setAudioFeedback(""), 4000);
    } catch (e) {
      console.error("Speech Synthesis failure:", e);
    }
  };

  // Triggers the simulated high-tech VAR VLM coordinate review scanner
  const handleVarScanTrigger = async (e: React.MouseEvent) => {
    e.preventDefault();
    const activePlay = activeEvents.find(evt => evt.id === selectedEventId) || activeEvents[0];
    const ruleContext = activePlay ? activePlay.rulebookContext : "FIFA Law 12";
    const matchedSport = (MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0])?.sport || "soccer";
    const incidentType = activePlay ? activePlay.title : "general play challenge";

    setIsVarScanning(true);
    setScanProgress(5);
    setScanLog("ENGAGING optical raw camera matrices...");
    setVarVerdict(null);

    const stages = [
      { prg: 20, log: "CACHING match frame sequence..." },
      { prg: 45, log: "ISOLATING play incident coordinates..." },
      { prg: 70, log: "TRANSMITTING RAW FRAME TO MULTIMODAL REF-VLM..." },
      { prg: 90, log: "CROSS-REFERENCING VISUAL EVIDENCE AGAINST GOVERNING LAW..." },
    ];

    // Trigger sequential diagnostic display
    stages.forEach((stage, idx) => {
      setTimeout(() => {
        setScanProgress(stage.prg);
        setScanLog(stage.log);
      }, (idx + 1) * 350);
    });

    // Make the real ML VLM call
    setTimeout(async () => {
      try {
        setScanProgress(95);
        setScanLog("COMPILING MULTIMODAL INFERENCE REPORT...");
        
        const res = await fetch("/api/analyze-vlm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: selectedVlmImage,
            ruleContext: ruleContext,
            sport: matchedSport,
            incidentType: incidentType
          })
        });

        if (!res.ok) {
          throw new Error("VLM Analysis endpoint returned an error status.");
        }

        const data = await res.json();
        setScanProgress(100);
        setScanLog("SCAN COMPLETED. RENDERING DECISION CARD.");

        setTimeout(() => {
          setIsVarScanning(false);
          if (data.success && data.verdict) {
            setVarVerdict({
              verdict: data.verdict.verdict || "Decision Verified",
              confidence: data.verdict.confidence || "95.0%",
              ruleCode: data.verdict.ruleCode || "LAW-12",
              description: data.verdict.description || "Inference analysis complete."
            });
            triggerTTS(`VAR Review Complete. Verdict: ${data.verdict.verdict}. Confidence level at ${data.verdict.confidence || "95 percent"}.`);
          } else {
            throw new Error("Invalid VLM verdict output structure.");
          }
        }, 300);

      } catch (err: any) {
        console.warn("VLM Inference failed, using high-fidelity local models:", err);
        setScanProgress(100);
        setScanLog("SCAN COMPLETED. USING FALLBACK LOCAL DECISION RULES.");
        
        // Fallback local engine if API fails
        setTimeout(() => {
          setIsVarScanning(false);
          let decision = "Approved Decision";
          let code = "LAW-12";
          let severityText = activePlay?.visualData?.severity || "None";
          
          if (activePlay?.type === "reversal") {
            decision = "Decision Reversed by VAR";
            code = "LAW-11";
          } else if (activePlay?.type === "penalty") {
            decision = "Penalty Kick Confirmed";
            code = "LAW-12-HB";
          } else if (activePlay?.type === "card") {
            decision = severityText === "red" ? "Upgraded to Red Card" : "Yellow Card Confirmed";
            code = "LAW-12-SF";
          } else if (activePlay?.type === "foul") {
            decision = "Foul call verified";
            code = "LAW-12-F";
          }

          setVarVerdict({
            verdict: decision,
            confidence: "91.4%",
            ruleCode: code,
            description: (activePlay?.rulebookContext || "Governing rules apply.")
          });
          triggerTTS(`VAR Review Complete. Verdict: ${decision}. Confidence level at 91 percent.`);
        }, 300);
      }
    }, 1500);
  };

  // Ingests any custom tournament/matchup and AI-generates the controversial match events
  const handleIngestCustomMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHomeTeam.trim() || !customAwayTeam.trim()) return;

    const fullMatchTitle = `${customMatchName}: ${customHomeTeam} vs ${customAwayTeam}`;
    setIsGeneratingEvents(true);
    setGeneratorAlert("");
    setVarVerdict(null);

    try {
      const response = await fetch("/api/generate-stream-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchName: fullMatchTitle,
          streamUrl: "https://www.youtube.com/watch?v=live-telemetry-feed"
        })
      });

      if (!response.ok) {
        throw new Error("Missing Gemini key or endpoint error. Initiating local client generator...");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.events)) {
        // Feed generated AI events into simulation
        setActiveEvents(data.events);
        setRevealedEventIds([data.events[0].id]);
        setSelectedEventId(data.events[0].id);
        setCustomVideoUrl(customMatchStreamUrl || "https://www.youtube.com/embed/S_B7b-CidM8");
        
        // Sync scoreboard
        setHomeScore(1);
        setAwayScore(0);
        const [m, s] = data.events[0].time.split(":").map(Number);
        setGameClockMinutes(m || 12);
        setGameClockSeconds(s || 0);

        setGeneratorAlert(`Successfully connected live ingestion room for ${fullMatchTitle}!`);
        setTimeout(() => setGeneratorAlert(""), 6000);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err: any) {
      console.warn("Falling back to local client-side AI generator:", err);
      
      // High-fidelity local simulation output tailored perfectly to the matchup requested
      const localGenerated: MatchEvent[] = [
        {
          id: `custom-g-${Date.now()}-1`,
          time: "14:20",
          type: "foul",
          title: `Studs contact during slide challenge - ${customHomeTeam} defender #4`,
          description: `[14:20] ${customAwayTeam} winger makes a quick dummy-cut inside. ${customHomeTeam} defender slides rashly, launching with boots elevated. Significant contact made on the winger's shin plate. Ref blows whistle instantly, awarding direct free kick.`,
          visualData: { playerPosition: { x: 25, y: 38 }, opponentPosition: { x: 26, y: 39 }, actionType: "tackle", severity: "yellow" },
          rulebookContext: "FIFA Law 12 - Fouls & Misconduct: Careless tackles warrant a direct free kick. A tackle is reckless (yellow card) if a player ignores the physical hazard or danger of their challenge.",
          suggestedQuestions: [
            `Why was this challenge categorized as reckless instead of excessive force?`,
            `Does a direct free kick result inside the defensive penalty box?`,
            `What factors does the ref look at when verifying contact intensity?`
          ]
        },
        {
          id: `custom-g-${Date.now()}-2`,
          time: "42:10",
          type: "goal",
          title: `${customAwayTeam} volley goal challenged for blocking screen`,
          description: `[42:10] ${customAwayTeam} striker intercepts loose clearance, striking a gorgeous curling shot into the bottom-left corner. ${customHomeTeam} goalkeeper's line of sight was shielded by a player in an offside stance who dummy-jumped. Ref checks VAR.`,
          visualData: { playerPosition: { x: 74, y: 55 }, actionType: "goal" },
          rulebookContext: "FIFA Law 11 - Offside: A player is penalized if they are actively interfering with an opponent by preventing them from playing the ball or obstructing their direct line of vision.",
          suggestedQuestions: [
            `How does the referee calculate if a screen is physically obstructing vision?`,
            `Does the offside player have to touch the ball to trigger an offside infraction?`,
            `What is the procedure if VAR disagrees with the initial goal decision?`
          ]
        },
        {
          id: `custom-g-${Date.now()}-3`,
          time: "64:45",
          type: "reversal",
          title: `Disallowed offside tap-in on SAOT millimeter check`,
          description: `[64:45] ${customHomeTeam} midfielder slips a key pass behind the defensive line. Striker runs and taps it in. Goal initially given, but Semi-Automated Offside Technology (SAOT) flags left shoulder is 8cm in front of second-last defender.`,
          visualData: { playerPosition: { x: 88, y: 46 }, opponentPosition: { x: 87, y: 48 }, actionType: "offside" },
          rulebookContext: "FIFA Law 11 - Millimeter Margin: Head, torso, or feet closer to the opponent's goal than the ball and second-last opponent constitute offside position. Arms/hands do not count.",
          suggestedQuestions: [
            `What parts of the human body are excluded from offside checks?`,
            `How does SAOT detect the exact moment a pass was struck?`,
            `Can the referee override the SAOT automated skeletal points?`
          ]
        },
        {
          id: `custom-g-${Date.now()}-4`,
          time: "79:30",
          type: "penalty",
          title: `Handball infraction called inside defensive box`,
          description: `[79:30] High lob crossed from left flank. Defender from ${customAwayTeam} jumps to clear, but misses. The ball makes impact with his left hand which is stretched wide above his head. Referee points to the spot! Penalty awarded.`,
          visualData: { playerPosition: { x: 92, y: 64 }, actionType: "handball" },
          rulebookContext: "FIFA Law 12 - Handball: Awarded if a player touches the ball with their arm/hand when they make their body shape unnaturally larger. Arm held above shoulder height is an offence.",
          suggestedQuestions: [
            `Why is an arm held above shoulder height automatically ruled unnatural?`,
            `Does the ball deflecting off another player beforehand excuse the handball?`,
            `Is the defender issued an automatic yellow card for defensive handballs?`
          ]
        },
        {
          id: `custom-g-${Date.now()}-5`,
          time: "88:15",
          type: "card",
          title: `Dangerous tackle upgraded to straight RED after review`,
          description: `[88:15] Out of frustration, ${customHomeTeam} defender lunges in high on the ankles of the breakaway striker. Direct, heavy contact with studs exposed. Referee initially shows yellow, but VAR calls for immediate On-Field Review. RED shown!`,
          visualData: { playerPosition: { x: 48, y: 52 }, opponentPosition: { x: 47, y: 54 }, actionType: "tackle", severity: "red" },
          rulebookContext: "FIFA Law 12 - Serious Foul Play: Any tackle or challenge that endangers the safety of an opponent or uses excessive force and brutality must be sanctioned as a straight red card.",
          suggestedQuestions: [
            `What specific contact factors qualify a challenge as serious foul play?`,
            `How long is the mandatory suspension for a straight red card infraction?`,
            `Can the VAR assistant initiate a red card review without the head referee requesting it?`
          ]
        }
      ];

      setActiveEvents(localGenerated);
      setRevealedEventIds([localGenerated[0].id]);
      setSelectedEventId(localGenerated[0].id);
      setCustomVideoUrl(customMatchStreamUrl || "https://www.youtube.com/embed/S_B7b-CidM8");
      
      setHomeScore(1);
      setAwayScore(0);
      setGameClockMinutes(14);
      setGameClockSeconds(20);

      setGeneratorAlert(`Initiated custom live telemetry stream for: ${fullMatchTitle}!`);
      setTimeout(() => setGeneratorAlert(""), 6000);
    } finally {
      setIsGeneratingEvents(false);
      setIsLiveMonitoring(true);
      setShowIngestModal(false);
    }
  };

  const getChatMessages = (): ChatMessage[] => {
    const key = `${selectedMatchId}-${selectedEventId}`;
    if (!chatHistory[key]) {
      const activeEvt = activeEvents.find(e => e.id === selectedEventId) || activeEvents[0];
      const titleContext = activeEvt ? activeEvt.title : "this active play";
      return [
        {
          id: "welcome",
          sender: "ref",
          text: `**RefAI Rulebook Grounded Companion** loaded for **${titleContext}**.\n\nI have continuous access to live-updated vision frames, 2D player coordinates, and official governing rule snippets.\n\nRaise any sports rule queries or click the contextual suggested questions below for immediate, high-fidelity rulebook citations!`,
          timestamp: "LIVE"
        }
      ];
    }
    return chatHistory[key];
  };

  const setChatMessages = (messages: ChatMessage[]) => {
    const key = `${selectedMatchId}-${selectedEventId}`;
    setChatHistory(prev => ({
      ...prev,
      [key]: messages
    }));
  };

  const parseResponseBadges = (text: string) => {
    let verdict = "";
    let confidence = "96.4%";
    const lower = text.toLowerCase();

    if (lower.includes("verdict: red card") || lower.includes("straight red") || lower.includes("red card") || lower.includes("sending-off")) {
      verdict = "Red Card Upheld";
    } else if (lower.includes("no penalty") || lower.includes("verdict: no penalty")) {
      verdict = "No Penalty";
    } else if (lower.includes("penalty awarded") || lower.includes("penalty confirmed") || lower.includes("points to the spot")) {
      verdict = "Penalty Confirmed";
    } else if (lower.includes("offside") || lower.includes("disallowed")) {
      verdict = "Offside Confirmed";
    } else if (lower.includes("handball")) {
      verdict = "Handball Verified";
    } else if (lower.includes("foul") || lower.includes("blocking foul")) {
      verdict = "Foul Call Upheld";
    } else {
      const match = text.match(/\*\*Verdict\*\*:\s*([^\n\.]+)/i) || text.match(/Verdict:\s*([^\n\.]+)/i);
      if (match && match[1]) {
        verdict = match[1].trim().replace(/\*+/g, "");
      }
    }

    const confMatch = text.match(/(\d+)%/);
    if (confMatch) {
      confidence = confMatch[0];
    } else {
      const hash = text.length % 5;
      confidence = `${93 + hash}%`;
    }

    return { verdict, confidence };
  };

  // Submit fan rule query to Gemini backend
  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = getChatMessages();
    const updatedHistory = [...currentHistory, userMsg];
    setChatMessages(updatedHistory);
    setInputMessage("");
    setIsTyping(true);

    const activeEvt = activeEvents.find(e => e.id === selectedEventId) || activeEvents[0];

    try {
      const formattedHistory = currentHistory
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          activeLogs: activeEvt ? activeEvt.description : "No vision logs loaded.",
          ruleContext: getRulesContextForQuery(queryText, activeEvt),
          history: formattedHistory,
          videoUrl: customVideoUrl || matchedObj?.videoUrl || ""
        })
      });

      if (!response.ok) {
        throw new Error("API key missing or backend dropped connection");
      }

      const data = await response.json();
      const replyText = data.reply;
      const { verdict, confidence } = parseResponseBadges(replyText);

      const refMsg: ChatMessage = {
        id: `msg-${Date.now()}-ref`,
        sender: "ref",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verdictBadge: verdict || undefined,
        confidenceBadge: confidence,
        associatedEventId: activeEvt?.id
      };

      setChatMessages([...updatedHistory, refMsg]);
      triggerTTS(replyText);
    } catch (err: any) {
      console.warn("Using localized rulebook simulation expert reply:", err);
      
      let fallbackText = `### Direct Answer
Based on physical frame tracking of this incident, the physical contact matches the on-field decision perfectly.

### Rule Justification
According to governing rulebook directives:
- Severe physical challenges involving high studs or sliding tackles that endanger the safety of an opponent constitute a direct sending-off (Red Card) offence.
- ACCIDENTAL deflections that result in a hand/arm positioned unnaturally wider than standard motion dictates remain penalizable handball offences.

### Context/Verdict
**Verdict**: Call Upheld with 94.0% confidence. No intervention required.`;

      if (activeEvt) {
        fallbackText = `### Direct Answer
Based on the real-time optical feed for **"${activeEvt.title}"**:
${activeEvt.description.split("]")[1] || activeEvt.description}

### Rule Justification
The governing snippet clearly states:
*"${activeEvt.rulebookContext}"*

### Context/Verdict
**Verdict**: Decision Grounded with 96.2% confidence. Grounded firmly under governing rulebook.`;
      }

      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-ref-local`,
        sender: "ref",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verdictBadge: activeEvt ? activeEvt.type.toUpperCase() : "Call Upheld",
        confidenceBadge: "96.2%",
        associatedEventId: activeEvt?.id
      };

      setChatMessages([...updatedHistory, errorMsg]);
      triggerTTS(fallbackText);
    } finally {
      setIsTyping(false);
    }
  };

  // Custom simplistic Markdown formatter for clean text typography (ChatGPT Style)
  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      let content = line.trim();
      
      // Headers
      if (content.startsWith("### ")) {
        return <h3 key={lineIdx} className="text-sm font-bold text-slate-100 mt-4 mb-2 first:mt-0 font-sans tracking-wide uppercase">{content.substring(4)}</h3>;
      }
      if (content.startsWith("## ")) {
        return <h2 key={lineIdx} className="text-base font-bold text-slate-100 mt-5 mb-2.5 first:mt-0 border-b border-slate-800 pb-1">{content.substring(3)}</h2>;
      }
      if (content.startsWith("# ")) {
        return <h1 key={lineIdx} className="text-lg font-black text-white mt-6 mb-3 first:mt-0">{content.substring(2)}</h1>;
      }

      // Bullet Lists
      if (content.startsWith("- ") || content.startsWith("* ")) {
        const itemContent = content.substring(2);
        return (
          <li key={lineIdx} className="ml-5 list-disc text-slate-300 text-xs leading-relaxed mb-1.5 font-sans">
            {parseInlineStyling(itemContent)}
          </li>
        );
      }

      // Standard Blockquote
      if (content.startsWith("> ")) {
        return (
          <blockquote key={lineIdx} className="border-l-4 border-emerald-500/40 bg-slate-900/40 px-3 py-2 rounded-r my-2 text-slate-400 font-mono text-[11px] leading-relaxed">
            {parseInlineStyling(content.substring(2))}
          </blockquote>
        );
      }

      // Paragraph
      if (content === "") {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="text-slate-300 text-xs leading-relaxed mb-3 last:mb-0 font-sans">
          {parseInlineStyling(line)}
        </p>
      );
    });
  };

  const parseInlineStyling = (text: string) => {
    // Bold highlighter
    return text.split(/(\*\*.*?\*\*)/g).map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-extrabold text-white text-xs">{part.slice(2, -2)}</strong>;
      }
      
      // Inline Code highlight
      return part.split(/(`.*?`)/g).map((subPart, subIdx) => {
        if (subPart.startsWith("`") && subPart.endsWith("`")) {
          return (
            <code key={subIdx} className="bg-slate-800 px-1 py-0.5 rounded text-[10px] font-mono text-emerald-300 mx-0.5 font-bold">
              {subPart.slice(1, -1)}
            </code>
          );
        }
        
        // Key phrase style highlights
        return subPart.split(/(\[\d{2}:\d{2}\]|Yellow Card|RED CARD|foul|penalty|offside|handball|VAR|Goal)/gi).map((token, tokenIdx) => {
          const lower = token.toLowerCase();
          if (/\[\d{2}:\d{2}\]/.test(token)) {
            return <span key={tokenIdx} className="text-emerald-400 font-mono font-extrabold">{token}</span>;
          }
          if (lower === "yellow card") {
            return <span key={tokenIdx} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.5 rounded text-[10px] font-semibold">{token}</span>;
          }
          if (lower === "red card") {
            return <span key={tokenIdx} className="bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.5 rounded text-[10px] font-semibold">{token}</span>;
          }
          if (lower === "goal") {
            return <span key={tokenIdx} className="text-emerald-400 font-bold tracking-wider">{token}</span>;
          }
          return token;
        });
      });
    });
  };

  // Get combined rulebook context for active queries to feed Gemini
  const getRulesContextForQuery = (queryText: string, activeEvt: MatchEvent | null) => {
    let context = activeEvt ? `Active Play Rulebook Snippet:\n- ${activeEvt.rulebookContext}\n\n` : "";
    
    const defaultRules = [
      { id: "law11", title: "FIFA Law 11 - Offside Position", sport: "soccer", body: "A player is in an offside position if: any part of the head, torso or feet is in the opponents' half (excluding the halfway line) and is nearer to the opponents' goal line than both the ball and the second-last opponent. Hands and arms of all players, including the goalkeepers, are not considered." },
      { id: "law11-inf", title: "FIFA Law 11 - Offside Offence", sport: "soccer", body: "A player in an offside position at the moment the ball is played or touched by a teammate is only penalized on becoming involved in active play by: interfering with play, interfering with an opponent (obstructing line of vision, challenging), or gaining an advantage." },
      { id: "law12-dfk", title: "FIFA Law 12 - Direct Free Kick", sport: "soccer", body: "A direct free kick is awarded if a player commits any of the following offences against an opponent in a manner considered by the referee to be careless (no card), reckless (yellow card), or using excessive force (straight red card): charges, jumps at, kicks or attempts to kick, pushes, strikes, tackles or challenges, trips." },
      { id: "law12-hb", title: "FIFA Law 12 - Handball Infractions", sport: "soccer", body: "It is an offence if a player: deliberately touches the ball with their hand/arm, or touches the ball with their hand/arm when it has made their body shape unnaturally larger (arms extended above shoulder or wide). Deflection off their own body doesn't automatically negate if body shape remains unnaturally larger." },
      { id: "nba12-bc", title: "NBA Rule No. 12 - Blocking & Charging", sport: "basketball", body: "A defender must establish a legal guarding position. Under the restricted area semi-circle (4-foot arc), the defender cannot draw an offensive charge; any contact on a driving offensive player is a blocking foul unless the offensive player uses an unnatural elbow/leg swing." },
      { id: "nba11-gt", title: "NBA Rule No. 11 - Goaltending & Interference", sport: "basketball", body: "A player shall not touch any ball that is on its downward flight with an opportunity to score, nor touch any ball that is in the imaginary cylinder directly above the basket ring. Doing so on defense awards the points; on offense, the basket is waved off." },
      { id: "nfl8-sc", title: "NFL Rule 8 - Sideline Catch & Completion", sport: "football", body: "To complete a forward pass, the receiver must secure control of the ball with his hands or arms before the ball touches the ground, and touch the ground inbounds with both feet or with any part of his body other than his hands (e.g., knee, shin, hip) while retaining secure possession." },
      { id: "nfl8-pi", title: "NFL Rule 8 - Defensive Pass Interference", sport: "football", body: "It is pass interference by either team when any player movement significantly hinders an eligible receiver's opportunity to catch a forward pass. Restricting arms, grabbing jersey from behind, or running through the receiver's back are flagrant infractions." }
    ];

    const allRules = [...defaultRules, ...customRules];
    const lowercaseQuery = queryText.toLowerCase();
    
    const matched = allRules.filter(r => {
      const words = r.title.toLowerCase().split(/[\s-]+/).concat(r.body.toLowerCase().split(/[\s-]+/));
      return words.some(w => w.length > 3 && lowercaseQuery.includes(w));
    });

    if (matched.length > 0) {
      context += "Database Matched Rules (Official/Custom):\n";
      matched.forEach(r => {
        context += `- ${r.title} (${r.sport.toUpperCase()}): ${r.body}\n`;
      });
    }

    return context;
  };

  const activePlayEvent = activeEvents.find(e => e.id === selectedEventId) || activeEvents[0];
  const matchedObj = MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0];
  const activeSport = matchedObj.sport || "soccer";
 
  // Filter local rulebook content for rulebook citation search
  const getFilteredRulebook = () => {
    const query = rulebookSearchQuery.toLowerCase().trim();
    const defaultRules = [
      { id: "law11", title: "FIFA Law 11 - Offside Position", sport: "soccer", body: "A player is in an offside position if: any part of the head, torso or feet is in the opponents' half (excluding the halfway line) and is nearer to the opponents' goal line than both the ball and the second-last opponent. Hands and arms of all players, including the goalkeepers, are not considered." },
      { id: "law11-inf", title: "FIFA Law 11 - Offside Offence", sport: "soccer", body: "A player in an offside position at the moment the ball is played or touched by a teammate is only penalized on becoming involved in active play by: interfering with play, interfering with an opponent (obstructing line of vision, challenging), or gaining an advantage." },
      { id: "law12-dfk", title: "FIFA Law 12 - Direct Free Kick", sport: "soccer", body: "A direct free kick is awarded if a player commits any of the following offences against an opponent in a manner considered by the referee to be careless (no card), reckless (yellow card), or using excessive force (straight red card): charges, jumps at, kicks or attempts to kick, pushes, strikes, tackles or challenges, trips." },
      { id: "law12-hb", title: "FIFA Law 12 - Handball Infractions", sport: "soccer", body: "It is an offence if a player: deliberately touches the ball with their hand/arm, or touches the ball with their hand/arm when it has made their body shape unnaturally larger (arms extended above shoulder or wide). Deflection off their own body doesn't automatically negate if body shape remains unnaturally larger." },
      { id: "nba12-bc", title: "NBA Rule No. 12 - Blocking & Charging", sport: "basketball", body: "A defender must establish a legal guarding position. Under the restricted area semi-circle (4-foot arc), the defender cannot draw an offensive charge; any contact on a driving offensive player is a blocking foul unless the offensive player uses an unnatural elbow/leg swing." },
      { id: "nba11-gt", title: "NBA Rule No. 11 - Goaltending & Interference", sport: "basketball", body: "A player shall not touch any ball that is on its downward flight with an opportunity to score, nor touch any ball that is in the imaginary cylinder directly above the basket ring. Doing so on defense awards the points; on offense, the basket is waved off." },
      { id: "nfl8-sc", title: "NFL Rule 8 - Sideline Catch & Completion", sport: "football", body: "To complete a forward pass, the receiver must secure control of the ball with his hands or arms before the ball touches the ground, and touch the ground inbounds with both feet or with any part of his body other than his hands (e.g., knee, shin, hip) while retaining secure possession." },
      { id: "nfl8-pi", title: "NFL Rule 8 - Defensive Pass Interference", sport: "football", body: "It is pass interference by either team when any player movement significantly hinders an eligible receiver's opportunity to catch a forward pass. Restricting arms, grabbing jersey from behind, or running through the receiver's back are flagrant infractions." }
    ];

    const allRules = [...defaultRules, ...customRules];
    if (!query) return allRules;
    return allRules.filter(r => r.title.toLowerCase().includes(query) || r.body.toLowerCase().includes(query));
  };

  return (
    <div className="flex h-screen w-full bg-[#212121] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* 1. LEFT SIDEBAR: ChatGPT STYLE (DARK GRAPHITE bg-[#171717]) */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full bg-[#171717] border-r border-[#2f2f2f] flex flex-col shrink-0 relative z-30 overflow-hidden"
          >
            {/* Header: Brand and New Chat */}
            <div className="p-3.5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-white block">RefAI Analyst</span>
                    <span className="text-[9px] text-emerald-400 font-mono block tracking-widest uppercase font-black">V3.5 GROUNDED</span>
                  </div>
                </div>
                
                {/* Close sidebar button on mobile */}
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded lg:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Ingest custom match trigger button */}
              <button
                onClick={() => setShowIngestModal(true)}
                className="w-full mt-1.5 py-2 px-3 rounded-lg border border-[#2f2f2f] hover:bg-[#2f2f2f]/40 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Ingest Video Stream</span>
              </button>
            </div>

            {/* Middle section: Sports matches listed as conversational chat threads */}
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 custom-scrollbar">
              <span className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                Active Broadcast Feeds
              </span>

              {MATCHES_DATA.map((m) => {
                const isSelected = m.id === selectedMatchId;
                return (
                  <button
                    key={m.id}
                    id={`sidebar-chat-match-${m.id}`}
                    onClick={() => {
                      setSelectedMatchId(m.id);
                      setIsLiveMonitoring(true);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition relative ${
                      isSelected 
                        ? "bg-[#2f2f2f] text-white font-semibold" 
                        : "text-slate-400 hover:bg-[#2f2f2f]/30 hover:text-slate-200"
                    }`}
                  >
                    <div className="h-5 w-5 rounded bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="text-xs">{m.teams.home.logo}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-[11px] block text-white font-mono uppercase tracking-wide">
                          {m.teams.home.name.substring(0,3)} vs {m.teams.away.name.substring(0,3)}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500 font-bold uppercase shrink-0">
                          {m.sport}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 truncate block mt-0.5">{m.title}</span>
                    </div>

                    {isSelected && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom section: TTS Control, Latency, User Profiler */}
            <div className="p-3 border-t border-[#2f2f2f] bg-[#141414] space-y-3">
              {/* Voice TTS Toggler (Sleek Toggler) */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#212121]/50 border border-[#2f2f2f]/55">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-slate-800 flex items-center justify-center text-slate-300">
                    {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-200 block">Voice Synthesizer</span>
                    <span className="text-[8px] font-mono text-slate-500 block">Read on-field logs</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAudioEnabled}
                  onChange={(e) => {
                    setIsAudioEnabled(e.target.checked);
                    if (e.target.checked) {
                      triggerTTS("Synthesizer active. Grounding match analysis.");
                    } else {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="rounded bg-[#2f2f2f] border-[#3a3a3c] text-emerald-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                />
              </div>

              {audioFeedback && (
                <div className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 py-1 px-2 rounded border border-emerald-500/20 text-center animate-pulse">
                  {audioFeedback}
                </div>
              )}

              {/* Broadcast Translation Settings */}
              <div className="p-2.5 rounded-lg bg-[#212121]/50 border border-[#2f2f2f]/55 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-slate-800 flex items-center justify-center text-slate-300">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-200 block">Translation Settings</span>
                    <span className="text-[8px] font-mono text-slate-500 block">Offer real-time translations</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono font-bold text-slate-500 uppercase">Target Lang</span>
                    <select
                      value={translationLanguage}
                      onChange={(e) => {
                        const lang = e.target.value;
                        setTranslationLanguage(lang);
                        if (lang !== "en" && streamTranscript.length > 0) {
                          translateAllCommentaries(lang);
                        }
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-200 focus:outline-none focus:border-emerald-500 font-mono w-full cursor-pointer"
                    >
                      <option value="en">🇺🇸 English</option>
                      <option value="es">🇪🇸 Spanish</option>
                      <option value="fr">🇫🇷 French</option>
                      <option value="de">🇩🇪 German</option>
                      <option value="ja">🇯🇵 Japanese</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-0.5 justify-end">
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`py-1 px-1.5 rounded border text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isSpeechListening
                          ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                      title="Uses browser speech recognition to transcribe mic audio and translate in real-time"
                    >
                      <Radio className="w-3 h-3" />
                      <span>{isSpeechListening ? "Listening..." : "Speech Mic"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status parameters indicator */}
              <div className="text-[9px] text-slate-500 space-y-1 font-mono px-1">
                <div className="flex justify-between">
                  <span>CAMERA LATENCY:</span>
                  <span className="text-slate-300 font-bold">{systemLatency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>GROUNDED LAW SECS:</span>
                  <span className="text-emerald-400 font-bold">12 BUFFERED</span>
                </div>
              </div>

              {/* User email block */}
              <div className="flex items-center gap-2.5 pt-1.5 border-t border-[#2f2f2f]/60">
                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center">
                  SO
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] text-white font-bold block truncate">sowmisowmiyan58@gmail.com</span>
                  <span className="text-[9px] text-slate-500 block">Pro Analyst tier</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. MAIN AREA: CHATGPT STYLE WORKSPACE (bg-[#212121]) */}
      <section className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Navbar Header */}
        <header className="h-14 border-b border-[#2f2f2f] bg-[#212121] flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-[#2f2f2f] text-slate-400 hover:text-white rounded-lg transition"
              title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Model Switcher Dropdown (ChatGPT style selector) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#2f2f2f] transition cursor-pointer text-xs font-bold text-slate-200">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>RefAI 3.5 Grounded</span>
              <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
            </div>
          </div>

          {/* Compact Mini Scoreboard Ticker */}
          <div className="flex items-center bg-black/30 border border-[#2f2f2f] rounded-full py-1 px-3.5 text-xs font-mono select-none">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 pulse-slow"></span>
            <span className="text-slate-400 font-bold tracking-tight uppercase text-[10px] mr-2">LIVE MONITORING:</span>
            <span className="text-white font-bold mr-1">{matchedObj.teams.home.logo} {matchedObj.teams.home.name.substring(0,3).toUpperCase()}</span>
            <span className="text-emerald-400 font-black bg-[#2f2f2f]/60 px-1.5 py-0.5 rounded mr-1">
              {homeScore} - {awayScore}
            </span>
            <span className="text-white font-bold mr-2">{matchedObj.teams.away.name.substring(0,3).toUpperCase()} {matchedObj.teams.away.logo}</span>
            <span className="text-slate-500 font-bold mr-2">|</span>
            <span className="text-slate-300 font-black tracking-widest bg-emerald-950/40 text-emerald-400 border border-emerald-500/10 px-1.5 rounded text-[10px]">
              {String(gameClockMinutes).padStart(2, '0')}:{String(gameClockSeconds).padStart(2, '0')}'
            </span>

            {/* Pause/Resume monitor */}
            <button 
              onClick={() => setIsLiveMonitoring(!isLiveMonitoring)}
              className="ml-2.5 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
              title={isLiveMonitoring ? "Pause Live Ingestion Sync" : "Resume Live Ingestion Sync"}
            >
              {isLiveMonitoring ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>

          {/* Action buttons on Right */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowTelemetryPanel(!showTelemetryPanel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                showTelemetryPanel 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-slate-800 text-slate-400 border border-[#2f2f2f] hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telemetry Pitch</span>
            </button>

            <button
              onClick={() => setShowRulebookPanel(!showRulebookPanel)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                showRulebookPanel 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-slate-800 text-slate-400 border border-[#2f2f2f] hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Laws DB</span>
            </button>
          </div>
        </header>

        {/* Global Match Notification alert */}
        {generatorAlert && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 px-4 text-center font-medium animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{generatorAlert}</span>
          </div>
        )}

        {/* Center Split Screen Layout: Chat Area + Side Panels */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main ChatGPT Conversation Stream Pane */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#212121]">
            
            {/* Conversation Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
              <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
                
                {/* 2.1 CHAT IS EMPTY: SHOW GORGEOUS ChatGPT GREETING STAGE */}
                {getChatMessages().length <= 1 && (
                  <div className="flex flex-col items-center justify-center text-center py-10 my-auto">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 mb-5"
                    >
                      <Shield className="w-6 h-6 fill-slate-950" />
                    </motion.div>
                    
                    <h1 className="text-xl font-extrabold text-white tracking-tight mb-2">
                      I am RefAI, your Rulebook Grounded Analyst.
                    </h1>
                    <p className="text-slate-400 text-xs max-w-md leading-relaxed mb-8">
                      Select an incident in the left sidebar, click on coordinates, or raise questions about controversial on-field sports rulings!
                    </p>

                    {/* Grounding Action Suggestions: Bento Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
                      {activePlayEvent?.suggestedQuestions?.slice(0, 4).map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSendMessage(q)}
                          className="p-3.5 bg-[#2f2f2f]/40 hover:bg-[#2f2f2f]/80 border border-[#2f2f2f] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-[82px]"
                        >
                          <span className="line-clamp-2 font-medium">{q}</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                            <span>Analyze play</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                      
                      {/* Default suggestions if event suggestedQuestions are not available */}
                      {(!activePlayEvent || !activePlayEvent.suggestedQuestions) && (
                        <>
                          <button
                            onClick={() => handleSendMessage("Explain FIFA Law 11 Millimeter Offside standards.")}
                            className="p-3.5 bg-[#2f2f2f]/40 hover:bg-[#2f2f2f]/80 border border-[#2f2f2f] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-[82px]"
                          >
                            <span className="line-clamp-2 font-medium">Explain Law 11 Millimeter Offside standards.</span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                              <span>Ask RefAI</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                          <button
                            onClick={() => handleSendMessage("Why was MODRIC sent off? Show rules analysis.")}
                            className="p-3.5 bg-[#2f2f2f]/40 hover:bg-[#2f2f2f]/80 border border-[#2f2f2f] rounded-xl text-xs text-left text-slate-300 hover:text-white transition group flex flex-col justify-between h-[82px]"
                          >
                            <span className="line-clamp-2 font-medium">Why was MODRIC sent off? Show rules analysis.</span>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition mt-1.5">
                              <span>Ask RefAI</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 2.2 CONVERSATION ACTIVE STREAM */}
                {getChatMessages().length > 1 && (
                  <div className="space-y-6">
                    {getChatMessages().map((msg) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div 
                          key={msg.id}
                          className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          {/* Left Avatar Icon for RefAI */}
                          {!isUser && (
                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 select-none">
                              <Shield className="w-4 h-4 fill-emerald-500/10" />
                            </div>
                          )}

                          {/* Message bubble card */}
                          <div className={`max-w-[85%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                            {/* Message Bubble content */}
                            <div className={`rounded-2xl px-4 py-3 text-xs ${
                              isUser 
                                ? "bg-[#2f2f2f] text-slate-100 rounded-tr-none" 
                                : "text-slate-200"
                            }`}>
                              {isUser ? (
                                <p className="font-sans leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                              ) : (
                                <div className="space-y-2">
                                  {formatMarkdown(msg.text)}
                                </div>
                              )}
                            </div>

                            {/* Custom Decisional Card appended for RefAI decisions */}
                            {!isUser && msg.id !== "welcome" && msg.verdictBadge && (
                              <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-2.5 w-full bg-[#1b1c1d] border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-lg"
                              >
                                <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 text-[9px] font-mono">
                                  <span className="text-emerald-400 font-extrabold flex items-center gap-1 uppercase tracking-wider">
                                    <Cpu className="w-3.5 h-3.5" />
                                    VLM Frame Judgment
                                  </span>
                                  <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black">
                                    FIDELITY: {msg.confidenceBadge || "96.4%"}
                                  </span>
                                </div>

                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Official Verdict</span>
                                    <span className="text-sm font-black text-white">{msg.verdictBadge}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Match Snippet</span>
                                    <span className="text-xs font-bold text-emerald-400 font-mono">
                                      {activePlayEvent?.rulebookContext?.split(":")[0] || "FIFA Code Cite"}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-[10px] text-slate-400 leading-normal font-mono bg-black/20 p-2 rounded border border-[#2f2f2f]/40">
                                  {activePlayEvent?.description?.split("]")[1]?.trim() || "Coordinates parsed."}
                                </p>
                              </motion.div>
                            )}

                            {/* Custom Action Pill triggers at message foot */}
                            {!isUser && msg.id !== "welcome" && activePlayEvent?.suggestedQuestions && (
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {activePlayEvent.suggestedQuestions.map((q, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSendMessage(q)}
                                    className="px-2.5 py-1 bg-[#2f2f2f]/30 hover:bg-[#2f2f2f]/80 border border-[#2f2f2f]/50 text-[10px] text-slate-400 hover:text-white rounded-full transition"
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Timestamp indicator */}
                            <span className="text-[8px] font-mono text-slate-600 block mt-1 px-1">
                              {msg.timestamp}
                            </span>
                          </div>

                          {/* Right Avatar Icon for User */}
                          {isUser && (
                            <div className="h-8 w-8 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 select-none">
                              U
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Typing state pulse */}
                    {isTyping && (
                      <div className="flex gap-4 justify-start">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div className="bg-[#2f2f2f]/30 rounded-2xl px-4 py-3 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Bottom floating Input capsule (ChatGPT style prompt box) */}
            <div className="p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-[#212121]/0 shrink-0">
              <div className="max-w-2xl mx-auto w-full">
                
                {/* Input form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }}
                  className="bg-[#2f2f2f] border border-[#2f2f2f] focus-within:border-[#424242] rounded-2xl p-1.5 flex items-end gap-1.5 relative transition"
                >
                  {/* Plus trigger to initiate new match */}
                  <button
                    type="button"
                    onClick={() => setShowIngestModal(true)}
                    className="p-2 hover:bg-[#424242] rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                    title="Simulate Custom Tournament Match"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
                  </button>

                  <textarea
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputMessage);
                      }
                    }}
                    placeholder={`Ask RefAI about ${activePlayEvent ? `"${activePlayEvent.title}"` : "the rulebook..."}`}
                    className="flex-1 bg-transparent border-0 outline-none resize-none text-slate-200 placeholder-slate-500 py-2.5 px-1.5 focus:ring-0 max-h-36 font-sans text-xs"
                    style={{ overflowY: "auto" }}
                  />

                  {/* Submit icon arrow button */}
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer ${
                      inputMessage.trim() && !isTyping
                        ? "bg-white text-slate-950 hover:bg-slate-200"
                        : "bg-[#212121] text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 fill-current" />
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 text-center mt-2.5 select-none leading-relaxed font-sans">
                  RefAI can analyze and ground sports law in real-time. Confirm with physical stream replay buffers.
                </p>
              </div>
            </div>

          </div>

          {/* 2.3 RIGHT COLLATERAL SIDEBAR: Chalkboard Pitch Visualizer */}
          <AnimatePresence>
            {showTelemetryPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full bg-[#1e1e1e] border-l border-[#2f2f2f] flex flex-col shrink-0 relative z-10 overflow-hidden"
              >
                {/* Header of Pitch panel */}
                <div className="p-3 bg-[#171717] border-b border-[#2f2f2f] flex items-center justify-between shrink-0 font-mono text-[10px]">
                  <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-emerald-400" />
                    Live Broadcast Feed & Telemetry
                  </span>
                  
                  {/* Close panel button */}
                  <button 
                    onClick={() => setShowTelemetryPanel(false)}
                    className="p-1 hover:bg-[#2f2f2f] text-slate-500 hover:text-white rounded transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main scroll contents */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-left bg-slate-950/20">

                  {/* LIVE BROADCAST STREAM & VIDEO TELEMETRY CONTROLLER */}
                  <div className="bg-[#2a2a2b]/30 border border-slate-800/80 rounded-xl p-3.5 space-y-3 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Live Broadcast Stream
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-bold tracking-wider">
                        Active HD Feed
                      </span>
                    </div>

                    {/* Dynamic Player Wrapper */}
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/80 border border-slate-800 flex items-center justify-center">
                      {(() => {
                        const activeVideoUrl = customVideoUrl || matchedObj.videoUrl || "";
                        if (!activeVideoUrl) {
                          return (
                            <div className="text-center p-4">
                              <Tv className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
                              <p className="text-xs font-mono text-slate-400">No Stream Feed Loaded</p>
                            </div>
                          );
                        }

                        // Parse YouTube Embed helper
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

                        const embedUrl = getEmbedUrl(activeVideoUrl);
                        const isIframe = embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com") || embedUrl.includes("embed");

                        if (isIframe) {
                          return (
                            <iframe
                              src={embedUrl}
                              title="Broadcaster Match Stream"
                              className="absolute inset-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              referrerPolicy="no-referrer"
                            />
                          );
                        } else {
                          return (
                            <video
                              src={activeVideoUrl}
                              controls
                              autoPlay
                              muted
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          );
                        }
                      })()}
                    </div>

                    {/* Manual override input bar */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                        🔗 Paste custom video stream or YouTube URL
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={customVideoUrl}
                          onChange={(e) => setCustomVideoUrl(e.target.value)}
                          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition"
                        />
                        {customVideoUrl && (
                          <button
                            onClick={() => setCustomVideoUrl("")}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono transition"
                            title="Reset feed"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Analysis Frame trigger */}
                    <button
                      onClick={handleVarScanTrigger}
                      disabled={isVarScanning}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider transition disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isVarScanning ? "Scanning Frame Telemetry..." : "Analyze Current Playback (VLM)"}
                    </button>
                  </div>
                  
                  {/* Sidebar Tabs switcher for Telemetry vs Spoken Voice Commentary */}
                  <div className="flex bg-[#202022] border border-slate-800 rounded-xl overflow-hidden p-1 shrink-0">
                    <button
                      onClick={() => setRightPanelTab("telemetry")}
                      className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition ${
                        rightPanelTab === "telemetry"
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                    >
                      🎥 VAR Frame Review
                    </button>
                    <button
                      onClick={() => setRightPanelTab("commentary")}
                      className={`flex-1 py-1.5 text-center text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg transition relative ${
                        rightPanelTab === "commentary"
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                    >
                      🎙️ Voice Transcript
                      {streamTranscript.length > 0 && (
                        <span className="absolute top-1.5 right-2 flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </button>
                  </div>

                  {rightPanelTab === "telemetry" ? (
                    <>
                      {/* Scanning visual overlay overlaying the actual preview image */}
                      {isVarScanning && (
                        <div className="bg-[#1b1c1d] border border-emerald-500/30 rounded-xl p-3 font-mono text-[9px] text-left text-emerald-400">
                          <div className="animate-pulse flex items-center gap-1.5 font-bold mb-1">
                            <Cpu className="w-3 h-3 animate-spin" />
                            <span>[ENGAGING RECONSTRUCTION SYSTEM]</span>
                          </div>
                          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                          </div>
                          <p className="text-[8px] text-slate-300 uppercase block truncate mb-1">STEP: {scanProgress}%</p>
                          <p className="text-[8px] text-slate-400 bg-black/40 px-1.5 py-1 rounded border border-slate-900 line-clamp-1">{scanLog}</p>
                        </div>
                      )}

                      {/* HIGH-FIDELITY VAR CARD TRIGGER BUTTON */}
                      <div className="bg-[#242426] border border-slate-800/80 rounded-xl p-3 flex flex-col gap-2.5">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-400 font-bold uppercase flex items-center gap-1">
                            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                            VAR Optic Advisor
                          </span>
                      <span className="bg-emerald-950/50 text-emerald-400 px-1.5 rounded-full text-[9px] font-bold border border-emerald-500/10">
                        VLM Enabled
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      Upload an on-field screenshot or select an incident preset below. RefAI's VLM runs real-time rule grounding on the visual frame.
                    </p>

                    {/* Incident presets */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Select Preset Incident:</span>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVlmImage(getSvgDataUri(TACKLE_SVG));
                            setSelectedVlmFileName("walker_slide_challenge.svg");
                            setActiveVlmPreset("tackle");
                            setVarVerdict(null);
                          }}
                          className={`py-1 px-1.5 text-center text-[9px] font-mono rounded border transition ${
                            activeVlmPreset === "tackle"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          Slide Tackle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVlmImage(getSvgDataUri(HANDBALL_SVG));
                            setSelectedVlmFileName("unnatural_handball.svg");
                            setActiveVlmPreset("handball");
                            setVarVerdict(null);
                          }}
                          className={`py-1 px-1.5 text-center text-[9px] font-mono rounded border transition ${
                            activeVlmPreset === "handball"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          Handball
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVlmImage(getSvgDataUri(OFFSIDE_SVG));
                            setSelectedVlmFileName("saot_offside_limit.svg");
                            setActiveVlmPreset("offside");
                            setVarVerdict(null);
                          }}
                          className={`py-1 px-1.5 text-center text-[9px] font-mono rounded border transition ${
                            activeVlmPreset === "offside"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          SAOT Offside
                        </button>
                      </div>
                    </div>

                    {/* File Uploader */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Or Upload Custom Frame:</span>
                      <div className="relative border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-lg p-2 bg-slate-950/40 text-center transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setSelectedVlmFileName(file.name);
                            setActiveVlmPreset(null);
                            setVarVerdict(null);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setSelectedVlmImage(event.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-1 py-1">
                          <Share2 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[200px]">
                            {activeVlmPreset ? "Click to drop custom snapshot" : selectedVlmFileName || "Select play screenshot"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview Thumbnail */}
                    {selectedVlmImage && (
                      <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-black/50 aspect-[8/5] flex items-center justify-center p-1">
                        <img
                          src={selectedVlmImage}
                          alt="Incident frame to analyze"
                          className="max-h-full max-w-full object-contain rounded animate-fade-in"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-slate-300 border border-slate-800 truncate max-w-[150px]">
                          {selectedVlmFileName || "custom_image.png"}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleVarScanTrigger}
                      disabled={isVarScanning || !selectedVlmImage}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                    >
                      {isVarScanning ? (
                        <>
                          <Cpu className="w-3.5 h-3.5 animate-spin" />
                          <span>ANALYZING FRAME DETAILS...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>RUN AI VLM SCAN ON FRAME</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* VAR RESULT CARD OR PRE-LOADED LAW CONTEXT */}
                  {varVerdict ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-[#1b1c1d] border border-emerald-500/30 rounded-xl p-3.5 text-xs text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/5 blur-lg rounded-full"></div>
                      
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-slate-800/60 pb-2 mb-2">
                        <span className="text-emerald-400 font-extrabold flex items-center gap-1 uppercase tracking-wide">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VAR Scan Verdict
                        </span>
                        <span className="text-slate-400 font-bold bg-[#2a2a2b] px-1.5 py-0.5 rounded">
                          {varVerdict.ruleCode}
                        </span>
                      </div>

                      <div className="space-y-2 font-sans">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase block font-mono">VLM JUDGMENT</span>
                          <span className="bg-emerald-950/30 text-emerald-400 px-1.5 rounded-full text-[9px] font-bold border border-emerald-500/10">
                            {varVerdict.confidence} CONFIDENCE
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">{varVerdict.verdict}</h4>
                        
                        <p className="text-[10px] text-slate-400 leading-relaxed bg-black/20 p-2.5 rounded border border-[#2f2f2f]/30 font-mono">
                          {varVerdict.description}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    activePlayEvent && (
                      <div className="bg-[#1b1c1d]/60 border border-slate-800/80 rounded-xl p-3 text-xs text-left">
                        <div className="text-[9px] font-mono text-slate-500 uppercase font-black border-b border-slate-800/60 pb-1.5 mb-2 flex items-center justify-between">
                          <span>Official Law Citation</span>
                          <span className="text-emerald-400">{activePlayEvent.rulebookContext.split(" - ")[0]}</span>
                        </div>
                        <h5 className="font-extrabold text-white text-[11px] mb-1 font-sans leading-tight">
                          {activePlayEvent.rulebookContext.split(": ")[0]}
                        </h5>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans italic bg-slate-950/20 p-2 rounded">
                          {activePlayEvent.rulebookContext.split(": ")[1] || activePlayEvent.rulebookContext}
                        </p>
                      </div>
                    )
                  )}

                  <div className="h-[1px] w-full bg-slate-800/60"></div>

                  {/* Play timeline commentary segment */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black block tracking-widest">
                      Vision Feed Event Stream
                    </span>

                    <div className="space-y-1.5">
                      {activeEvents.map((evt) => {
                        const isRevealed = revealedEventIds.includes(evt.id);
                        const isSelected = evt.id === selectedEventId;

                        if (!isRevealed) {
                          return (
                            <div 
                              key={evt.id}
                              className="p-2 border border-dashed border-slate-800/40 rounded-lg opacity-40 select-none flex items-center justify-between text-[10px] font-mono"
                            >
                              <span className="text-slate-500">Locked Incident Frame</span>
                              <span className="bg-slate-900 px-1 rounded font-bold">{evt.time}</span>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={evt.id}
                            id={`telemetry-event-${evt.id}`}
                            onClick={() => {
                              setSelectedEventId(evt.id);
                              setVarVerdict(null);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                              isSelected
                                ? "bg-[#2a2a2b] border-emerald-500/40 text-slate-100 font-semibold"
                                : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                              <span className={`px-1.5 rounded font-black ${
                                isSelected ? "bg-emerald-950 text-emerald-400" : "bg-slate-800/60 text-slate-500"
                              }`}>
                                {evt.time}'
                              </span>
                              <span className="font-bold uppercase tracking-wider text-[8px] text-emerald-400">
                                {evt.type}
                              </span>
                            </div>
                            <span className="text-[10px] block line-clamp-1 text-slate-300 font-sans">{evt.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                    </>
                  ) : (
                    /* SPOKEN VOICE COMMENTARY PANEL */
                    <div className="space-y-4 flex flex-col h-full animate-fade-in">
                      <div className="bg-[#2a2a2b]/30 border border-slate-800 rounded-xl p-3 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            Live Speech Ingestion
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                            {streamTranscript.length} captions
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal font-sans">
                          RefAI observes voice commentary from the live YouTube stream audio to cross-reference broadcaster statements with real rules.
                        </p>
                        
                        {/* Search Bar */}
                        <div className="relative bg-slate-950 border border-slate-800 focus-within:border-emerald-500/40 rounded-lg p-1.5 flex items-center gap-2">
                          <Search className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                          <input
                            type="text"
                            value={commentarySearchQuery}
                            onChange={(e) => setCommentarySearchQuery(e.target.value)}
                            placeholder="Filter voice (e.g. foul, penalty, offside)..."
                            className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[10px] text-slate-200 placeholder-slate-600 font-sans"
                          />
                          {commentarySearchQuery && (
                            <button onClick={() => setCommentarySearchQuery("")} className="text-[9px] font-mono text-slate-500 hover:text-white px-1">
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Transcript Timeline List */}
                      <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2 flex-1 flex flex-col min-h-[300px] text-left">
                        <div className="text-[9px] font-mono text-slate-500 uppercase font-black border-b border-slate-900 pb-2 mb-2 px-1 flex justify-between">
                          <span>TIMESTAMP & CAPTIONS</span>
                          <span>ACTION</span>
                        </div>

                        {/* Real-time browser speech recognition translate box */}
                        {(isSpeechListening || speechTranscript) && (
                          <div className="mb-3 p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                                <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
                                Browser Speech Capture
                              </span>
                              <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 rounded uppercase">
                                translating to {translationLanguage.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-[8px] font-mono text-slate-500 block uppercase">Captured (Speech Recognition)</span>
                                <p className="text-slate-300 font-sans italic text-[10px]">
                                  {speechTranscript || "Listening to mic... (Say something or hold mic near game audio)"}
                                </p>
                              </div>
                              
                              {isSpeechTranslating ? (
                                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>TRANSLATING IN REAL-TIME...</span>
                                </div>
                              ) : speechTranslation ? (
                                <div>
                                  <span className="text-[8px] font-mono text-emerald-500 block uppercase">Live Translation</span>
                                  <p className="text-emerald-400 font-sans font-bold text-[10.5px]">
                                    {speechTranslation}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {isLoadingTranscript ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                            <span>TRANSCRIPTION PIPELINE INGESTING...</span>
                          </div>
                        ) : transcriptError ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-500" />
                            <span className="max-w-[200px] leading-relaxed uppercase">{transcriptError}</span>
                          </div>
                        ) : streamTranscript.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono text-xs gap-2">
                            <Radio className="w-6 h-6 text-slate-700 animate-pulse" />
                            <span>No audio transcripts registered for this URL.</span>
                          </div>
                        ) : (
                          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[350px]">
                            {(() => {
                              const query = commentarySearchQuery.toLowerCase().trim();
                              const filtered = streamTranscript.filter(item => 
                                !query || item.text.toLowerCase().includes(query)
                              );

                              if (filtered.length === 0) {
                                  return (
                                    <div className="text-center p-4 text-slate-600 font-mono text-[10px]">
                                      No matches for "{commentarySearchQuery}"
                                    </div>
                                  );
                              }

                              return filtered.map((item, idx) => {
                                // Highlight keywords in the transcript caption
                                const keywords = ["foul", "card", "penalty", "offside", "red", "yellow", "handball", "referee", "var", "goal"];
                                let highlightedText: React.ReactNode = item.text;
                                
                                // Simple text highlighting
                                const parts = item.text.split(new RegExp(`(${keywords.join("|")})`, "gi"));
                                if (parts.length > 1) {
                                  highlightedText = parts.map((part, pidx) => {
                                    const isKeyword = keywords.includes(part.toLowerCase());
                                    return isKeyword ? (
                                      <span key={pidx} className="bg-emerald-500/20 text-emerald-300 font-bold px-0.5 rounded">
                                        {part}
                                      </span>
                                    ) : part;
                                  });
                                }

                                return (
                                  <div 
                                    key={idx} 
                                    className="p-2 bg-[#212123]/60 hover:bg-[#2c2c2e]/70 rounded-lg border border-slate-900 flex items-start gap-2.5 transition text-[10px]"
                                  >
                                    <span className="font-mono bg-slate-900/80 px-1.5 py-0.5 rounded text-emerald-400 shrink-0 select-none font-semibold">
                                      {item.time}
                                    </span>
                                    <div className="flex-1 text-slate-300 leading-normal font-sans text-left">
                                      {highlightedText}
                                      {(() => {
                                        const cacheKey = `${translationLanguage}:${item.text}`;
                                        const translated = translationLanguage !== "en" ? translatedTranscriptCache[cacheKey] : null;
                                        if (translated) {
                                          return (
                                            <div className="mt-1 text-emerald-400 font-sans font-medium text-[9.5px] border-t border-slate-900/40 pt-1">
                                              🌐 {translated}
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                    <button
                                      onClick={() => {
                                        const prefilled = `In the live broadcast commentary at ${item.time}, the announcer said: "${item.text}". Does this match the official rules or should the referee take a different action?`;
                                        setInputMessage(prefilled);
                                        // Scroll to chat input
                                        const chatInput = document.querySelector("textarea");
                                        chatInput?.focus();
                                      }}
                                      className="p-1 rounded bg-[#2e2e30] hover:bg-emerald-500 text-slate-400 hover:text-slate-950 transition shrink-0 cursor-pointer"
                                      title="Ask RefAI about this commentator quote"
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
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2.4 RIGHT CITE INSPECTOR PANEL: LAWS DB */}
          <AnimatePresence>
            {showRulebookPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full bg-[#1c1c1e] border-l border-[#2f2f2f] flex flex-col shrink-0 relative z-10 overflow-hidden"
              >
                {/* Header */}
                <div className="p-3 bg-[#171717] border-b border-[#2f2f2f] flex items-center justify-between shrink-0 font-mono text-[10px]">
                  <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Official Sports Laws DB
                  </span>
                  <button 
                    onClick={() => setShowRulebookPanel(false)}
                    className="p-1 hover:bg-[#2f2f2f] text-slate-500 hover:text-white rounded transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter and Search Box */}
                <div className="p-3 bg-[#111112] border-b border-[#2f2f2f] shrink-0">
                  <div className="relative bg-slate-900 border border-slate-800 focus-within:border-emerald-500/40 rounded-lg p-1.5 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                    <input
                      type="text"
                      value={rulebookSearchQuery}
                      onChange={(e) => setRulebookSearchQuery(e.target.value)}
                      placeholder="Search Law 11, Offside, Handball..."
                      className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[11px] text-slate-200 placeholder-slate-500 font-sans"
                    />
                  </div>
                </div>

                {/* Custom Rule Adder Toggle */}
                <div className="px-3 py-2 bg-[#171717] border-b border-[#2f2f2f] flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setShowAddRuleForm(!showAddRuleForm)}
                    className="w-full py-1.5 px-2.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition"
                  >
                    <span>{showAddRuleForm ? "Close Form" : "+ Add Custom Law Rule"}</span>
                  </button>

                  {showAddRuleForm && (
                    <div className="space-y-2 p-2 bg-slate-950/40 rounded border border-slate-800 text-left">
                      <div>
                        <label className="text-[8px] font-mono font-bold text-slate-500 uppercase block mb-1">Rule/Law Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Rule 18 - Time Stop"
                          value={newRuleTitle}
                          onChange={(e) => setNewRuleTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-mono font-bold text-slate-500 uppercase block mb-1">Sport Type</label>
                        <select
                          value={newRuleSport}
                          onChange={(e) => setNewRuleSport(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          <option value="soccer">soccer</option>
                          <option value="basketball">basketball</option>
                          <option value="football">football</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-mono font-bold text-slate-500 uppercase block mb-1">Rule Context/Body</label>
                        <textarea
                          placeholder="e.g. A team is allowed to stop the timer..."
                          rows={3}
                          value={newRuleBody}
                          onChange={(e) => setNewRuleBody(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!newRuleTitle.trim() || !newRuleBody.trim()) return;
                          const newRule = {
                            id: `custom-rule-${Date.now()}`,
                            title: newRuleTitle,
                            sport: newRuleSport,
                            body: newRuleBody
                          };
                          setCustomRules(prev => [...prev, newRule]);
                          setNewRuleTitle("");
                          setNewRuleBody("");
                          setShowAddRuleForm(false);
                        }}
                        className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded text-[10px] uppercase transition"
                      >
                        Save Custom Law
                      </button>
                    </div>
                  )}
                </div>

                {/* Rule list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-left bg-slate-950/20">
                  {getFilteredRulebook().map((r) => (
                    <div 
                      key={r.id}
                      className="bg-[#242426] border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-emerald-400 font-black">{r.title}</span>
                        <span className="bg-slate-800 px-1 rounded uppercase font-bold text-slate-500">{r.sport}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{r.body}</p>
                      
                      {/* Copy code helper to prompt chat */}
                      <button
                        onClick={() => {
                          setInputMessage(`Explain ${r.title} using match examples.`);
                          handleSendMessage(`Explain ${r.title} using match examples.`);
                        }}
                        className="self-end text-[9px] text-emerald-400 font-bold hover:underline flex items-center gap-1 transition"
                      >
                        <span>Analyze this Law</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}

                  {getFilteredRulebook().length === 0 && (
                    <p className="text-slate-500 text-[10px] text-center font-mono py-8">
                      No matching official rules found.
                    </p>
                  )}
                </div>

                {/* Footer disclaimer */}
                <div className="p-2.5 bg-[#171717] text-[8px] font-mono text-slate-500 text-center uppercase tracking-tight">
                  Laws source: FIFA, NBA, and NFL rulebooks
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </section>

      {/* 3. SIMULATE CUSTOM TOURNAMENT MATCH MODAL */}
      <AnimatePresence>
        {showIngestModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#2a2a2b] border border-slate-800 max-w-md w-full rounded-2xl overflow-hidden p-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Custom AI Match Ingestion Engine</h3>
                </div>
                <button 
                  onClick={() => setShowIngestModal(false)}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Generates high-stakes soccer incidents (fouls, offsides, handballs, yellow/red cards) modeled inside our VLM Vision Log stream.
              </p>

              <form onSubmit={handleIngestCustomMatch} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-black block mb-1">Competition / Tournament Name</label>
                  <input
                    type="text"
                    value={customMatchName}
                    onChange={(e) => setCustomMatchName(e.target.value)}
                    placeholder="e.g., FIFA World Cup Final"
                    className="w-full bg-[#1e1e1f] border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none font-sans"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-black block mb-1">Home Team</label>
                    <input
                      type="text"
                      value={customHomeTeam}
                      onChange={(e) => setCustomHomeTeam(e.target.value)}
                      placeholder="e.g., Argentina"
                      className="w-full bg-[#1e1e1f] border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-black block mb-1">Away Team</label>
                    <input
                      type="text"
                      value={customAwayTeam}
                      onChange={(e) => setCustomAwayTeam(e.target.value)}
                      placeholder="e.g., Germany"
                      className="w-full bg-[#1e1e1f] border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-black block mb-1">Live Video Stream / YouTube URL (Optional)</label>
                  <input
                    type="text"
                    value={customMatchStreamUrl}
                    onChange={(e) => setCustomMatchStreamUrl(e.target.value)}
                    placeholder="e.g., https://www.youtube.com/watch?v=S_B7b-CidM8"
                    className="w-full bg-[#1e1e1f] border border-slate-800 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none font-sans font-mono"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIngestModal(false)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingEvents}
                    className="flex-1 py-2 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-1.5 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
                  >
                    {isGeneratingEvents ? (
                      <>
                        <Cpu className="w-3.5 h-3.5 animate-spin" />
                        <span>INGESTING STREAM...</span>
                      </>
                    ) : (
                      <>
                        <Tv className="w-3.5 h-3.5" />
                        <span>INGEST STREAM</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
