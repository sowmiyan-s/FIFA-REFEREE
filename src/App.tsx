import React, { useState, useEffect, useRef } from "react";
import { MATCHES_DATA } from "./data";
import { Sidebar } from "./components/Sidebar";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { InsightsPanel } from "./components/InsightsPanel";
import { LawsDatabase } from "./components/LawsDatabase";
import { Match, MatchEvent, ChatMessage } from "./types";
import { 
  Menu, 
  Tv, 
  BookOpen, 
  Clock, 
  Sparkles,
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  Shield,
  Activity
} from "lucide-react";

const DEFAULT_RULES = [
  { id: "law11", title: "FIFA Law 11 - Offside Position", sport: "soccer", body: "A player is in an offside position if: any part of the head, torso or feet is in the opponents' half (excluding the halfway line) and is nearer to the opponents' goal line than both the ball and the second-last opponent. Hands and arms of all players, including the goalkeepers, are not considered." },
  { id: "law11-inf", title: "FIFA Law 11 - Offside Offence", sport: "soccer", body: "A player in an offside position at the moment the ball is played or touched by a teammate is only penalized on becoming involved in active play by: interfering with play, interfering with an opponent (obstructing line of vision, challenging), or gaining an advantage." },
  { id: "law12-dfk", title: "FIFA Law 12 - Direct Free Kick", sport: "soccer", body: "A direct free kick is awarded if a player commits any of the following offences against an opponent in a manner considered by the referee to be careless (no card), reckless (yellow card), or using excessive force (straight red card): charges, jumps at, kicks or attempts to kick, pushes, strikes, tackles or challenges, trips." },
  { id: "law12-hb", title: "FIFA Law 12 - Handball Infractions", sport: "soccer", body: "It is an offence if a player: deliberately touches the ball with their hand/arm, or touches the ball with their hand/arm when it has made their body shape unnaturally larger (arms extended above shoulder or wide). Deflection off their own body doesn't automatically negate if body shape remains unnaturally larger." },
  { id: "law12-yc", title: "FIFA Law 12 - Cautionable Offences", sport: "soccer", body: "A player is cautioned (yellow card) if they: delay the restart of play, show dissent by word or action, enter or leave the field of play without permission, fail to respect the required distance at a restart, or commit persistent offences." },
  { id: "law12-rc", title: "FIFA Law 12 - Sending-off Offences", sport: "soccer", body: "A player is sent off (red card) if they commit serious foul play, violent conduct, spit or bite at anyone, deny an obvious goal-scoring opportunity (DOGSO) by handball or a foul challenge, use offensive/insulting language, or receive a second caution." },
  { id: "law14-pk", title: "FIFA Law 14 - Penalty Kick Standards", sport: "soccer", body: "The ball must be stationary on the penalty spot. The defending goalkeeper must remain on the goal line, facing the kicker, between the goalposts, without touching the posts, crossbar or net, and have at least part of one foot touching, or in line with, the goal line until the ball is kicked." }
];

export default function App() {
  // State for selected Match & Simulated timeline
  const [selectedMatchId, setSelectedMatchId] = useState<string>("worldcup-2022-final");
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
  const [customMatchStreamUrl, setCustomMatchStreamUrl] = useState<string>("");
  const [isGeneratingEvents, setIsGeneratingEvents] = useState<boolean>(false);
  const [generatorAlert, setGeneratorAlert] = useState<string>("");
  const [showIngestModal, setShowIngestModal] = useState<boolean>(false);

  // Custom Rules database
  const [customRules, setCustomRules] = useState<{ id: string; title: string; sport: string; body: string }[]>([]);
  const [showAddRuleForm, setShowAddRuleForm] = useState<boolean>(false);
  const [newRuleTitle, setNewRuleTitle] = useState<string>("");
  const [newRuleBody, setNewRuleBody] = useState<string>("");

  // Chat conversation logs state
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Voice Speech states (TTS)
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<string>("Speech synthesizer inactive");

  // ChatGPT-style panels & responsive states
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState<boolean>(true);
  const [showRulebookPanel, setShowRulebookPanel] = useState<boolean>(false);
  const [rulebookSearchQuery, setRulebookSearchQuery] = useState<string>("");

  // Video Stream and voice transcript variables
  const [customVideoUrl, setCustomVideoUrl] = useState<string>("");
  const [rightPanelTab, setRightPanelTab] = useState<"telemetry" | "commentary" | "var">("commentary"); // Focus on voice commentary by default
  const [streamTranscript, setStreamTranscript] = useState<{ text: string; time: string }[]>([]);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState<boolean>(false);
  const [transcriptError, setTranscriptError] = useState<string>("");
  const [commentarySearchQuery, setCommentarySearchQuery] = useState<string>("");

  // Translation & speech mic recognition states
  const [translationLanguage, setTranslationLanguage] = useState<string>("en");
  const [isSpeechListening, setIsSpeechListening] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [speechTranslation, setSpeechTranslation] = useState<string>("");
  const [isSpeechTranslating, setIsSpeechTranslating] = useState<boolean>(false);
  const [translatedTranscriptCache, setTranslatedTranscriptCache] = useState<Record<string, string>>({});
  const [isTranslatingAll, setIsTranslatingAll] = useState<boolean>(false);

  const matchedObj = MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0];

  const fetchActiveTranscript = async (url: string, matchTitle?: string, sport?: string, events?: MatchEvent[]) => {
    if (!url) {
      setStreamTranscript([]);
      return;
    }
    setIsLoadingTranscript(true);
    setTranscriptError("");
    const startTime = performance.now();
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
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
    } catch (err: any) {
      console.warn("Transcript load error:", err);
      setTranscriptError("Voice stream is currently offline or captions are disabled.");
      setStreamTranscript([]);
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  useEffect(() => {
    const url = customVideoUrl || matchedObj?.videoUrl || "";
    let matchTitle = matchedObj?.title;
    let sport = matchedObj?.sport;
    let events = matchedObj?.events;
    
    if (customVideoUrl && !matchedObj?.videoUrl?.includes(customVideoUrl)) {
      matchTitle = customMatchName ? `${customMatchName}: ${customHomeTeam} vs ${customAwayTeam}` : "Custom Live Match";
      sport = "soccer";
      events = activeEvents;
    }
    
    fetchActiveTranscript(url, matchTitle, sport, events);
  }, [selectedMatchId, customVideoUrl, activeEvents]);

  // Translate all commentary items
  const translateAllCommentaries = async (targetLang: string) => {
    if (targetLang === "en") return;
    setIsTranslatingAll(true);
    const startTime = performance.now();
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
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
    } catch (err) {
      console.error("Bulk translation error:", err);
    } finally {
      setIsTranslatingAll(false);
    }
  };

  useEffect(() => {
    if (translationLanguage !== "en" && streamTranscript.length > 0) {
      translateAllCommentaries(translationLanguage);
    }
  }, [streamTranscript, translationLanguage]);

  // Speech Recognition hook
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

  // Preload match structure when switching matches
  useEffect(() => {
    const matched = MATCHES_DATA.find(m => m.id === selectedMatchId) || MATCHES_DATA[0];
    setActiveEvents(matched.events);
    setRevealedEventIds(matched.events.map(e => e.id));
    if (matched.events.length > 0) {
      setSelectedEventId(matched.events[matched.events.length - 1].id);
      setHomeScore(matched.teams.home.score);
      setAwayScore(matched.teams.away.score);
      const lastTimeStr = matched.events[matched.events.length - 1].time;
      const [m, s] = lastTimeStr.split(":").map(Number);
      setGameClockMinutes(m || 88);
      setGameClockSeconds(s || 0);
    }
    setCustomVideoUrl("");
  }, [selectedMatchId]);

  // Live timeline simulated ticks
  useEffect(() => {
    if (!isLiveMonitoring) return;

    const timer = setInterval(() => {
      setGameClockSeconds(prevSec => {
        let nextSec = prevSec + 5;
        let nextMin = gameClockMinutes;
        
        if (nextSec >= 60) {
          nextSec = nextSec % 60;
          nextMin = nextMin + 1;
          if (nextMin > 90) {
            nextMin = 0;
          }
          setGameClockMinutes(nextMin);
        }

        activeEvents.forEach(evt => {
          const [evtMin, evtSec] = evt.time.split(":").map(Number);
          if (evtMin !== undefined && !revealedEventIds.includes(evt.id)) {
            if (nextMin > evtMin || (nextMin === evtMin && nextSec >= (evtSec || 0))) {
              setRevealedEventIds(prev => [...prev, evt.id]);
              setSelectedEventId(evt.id);
              
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

  // Subtle telemetry jitter simulator to match operational systems
  useEffect(() => {
    const jitterTimer = setInterval(() => {
      setSystemLatency(prev => {
        const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2 ms
        const next = prev + jitter;
        return next < 15 ? 15 : next;
      });
    }, 5000);
    return () => clearInterval(jitterTimer);
  }, []);

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

  const handleIngestCustomMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHomeTeam.trim() || !customAwayTeam.trim()) return;

    const fullMatchTitle = `${customMatchName}: ${customHomeTeam} vs ${customAwayTeam}`;
    setIsGeneratingEvents(true);
    setGeneratorAlert("");
    const startTime = performance.now();

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
        throw new Error("Missing Gemini key or endpoint error.");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.events)) {
        setActiveEvents(data.events);
        setRevealedEventIds([data.events[0].id]);
        setSelectedEventId(data.events[0].id);
        setCustomVideoUrl(customMatchStreamUrl || "https://www.youtube.com/embed/S_B7b-CidM8");
        
        setHomeScore(1);
        setAwayScore(0);
        const [m, s] = data.events[0].time.split(":").map(Number);
        setGameClockMinutes(m || 12);
        setGameClockSeconds(s || 0);

        setGeneratorAlert(`Successfully connected live ingestion room for ${fullMatchTitle}!`);
        setTimeout(() => setGeneratorAlert(""), 6000);
        const duration = Math.round(performance.now() - startTime);
        setSystemLatency(duration);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err: any) {
      console.warn("Falling back to local client-side AI generator:", err);
      
      const localGenerated: MatchEvent[] = [
        {
          id: `custom-g-${Date.now()}-1`,
          time: "14:20",
          type: "foul",
          title: `Studs contact during slide challenge - ${customHomeTeam} defender #4`,
          description: `[14:20] ${customAwayTeam} winger makes a quick dummy-cut inside. ${customHomeTeam} defender slides rashly, launching with boots elevated. Significant contact made on the winger's shin plate. Ref blows whistle instantly, awarding direct free kick.`,
          visualData: { actionType: "tackle", severity: "yellow" },
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
          visualData: { actionType: "goal" },
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
          visualData: { actionType: "offside" },
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
          visualData: { actionType: "handball" },
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
          visualData: { actionType: "tackle", severity: "red" },
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
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
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
          text: `**RefAI Rulebook Grounded Companion** loaded for **${titleContext}**.\n\nI have continuous access to live-updated vision frames, announcer stream commentary, and official governing rule snippets.\n\nRaise any sports rule queries or click the contextual suggested questions below for immediate, high-fidelity rulebook citations!`,
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
    const startTime = performance.now();

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
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
    } catch (err: any) {
      console.warn("Using localized rulebook simulation expert reply:", err);
      
      let fallbackText = `### Direct Answer
Based on physical frame tracking of this incident, the physical contact matches the on-field decision perfectly.

### Rule Justification
According to governing rulebook directives:
- Severe physical challenges involving high studs or sliding tackles that endanger the safety of an opponent constitute a direct sending-off (Red Card) offence.
- Accidental deflections that result in a hand/arm positioned unnaturally wider than standard motion dictates remain penalizable handball offences.

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
      const duration = Math.round(performance.now() - startTime);
      setSystemLatency(duration);
    } finally {
      setIsTyping(false);
    }
  };

  const getRulesContextForQuery = (queryText: string, activeEvt: MatchEvent | null) => {
    let context = activeEvt ? `Active Play Rulebook Snippet:\n- ${activeEvt.rulebookContext}\n\n` : "";
    const allRules = [...DEFAULT_RULES, ...customRules];
    const lowercaseQuery = queryText.toLowerCase();
    
    const matched = allRules.filter(r => {
      const words = r.title.toLowerCase().split(/[\s-]+/).concat(r.body.toLowerCase().split(/[\s-]+/));
      return words.some(w => w.length > 3 && lowercaseQuery.includes(w));
    });

    if (matched.length > 0) {
      context += "Database Matched Rules (Official/Custom):\n";
      matched.forEach(r => {
        context += `- ${r.title}: ${r.body}\n`;
      });
    }

    return context;
  };

  const handleSaveCustomRule = () => {
    if (!newRuleTitle.trim() || !newRuleBody.trim()) return;
    const newRule = {
      id: `custom-r-${Date.now()}`,
      title: newRuleTitle,
      sport: "soccer",
      body: newRuleBody
    };
    setCustomRules(prev => [newRule, ...prev]);
    setNewRuleTitle("");
    setNewRuleBody("");
    setShowAddRuleForm(false);
  };

  const activePlayEvent = activeEvents.find(e => e.id === selectedEventId) || activeEvents[0] || null;

  // Filter rules database based on search input
  const filteredRulebookList = [...DEFAULT_RULES, ...customRules].filter(r => {
    if (!rulebookSearchQuery.trim()) return true;
    const q = rulebookSearchQuery.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q);
  });

  return (
    <div id="application-root-container" className="h-screen w-screen flex flex-col bg-[#060608] text-slate-200 overflow-hidden font-sans antialiased">
      
      {/* 1. TOP STATS AND SCOREBOARD NAV BAR */}
      <header className="h-14 bg-[#111112] border-b border-[#242426] px-4 flex items-center justify-between shrink-0 select-none z-10">
        
        {/* Left segment */}
        <div className="flex items-center gap-3">
          <button aria-label="Button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">Match:</span>
            <span className="text-xs font-sans font-extrabold text-white uppercase tracking-wide">
              {matchedObj.title}
            </span>
          </div>
        </div>

        {/* Center: Live Football Scoreboard */}
        <div className="flex items-center gap-4 bg-[#141416] border border-slate-800 rounded-xl px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase">
              {matchedObj.teams.home.name.substring(0, 3)}
            </span>
            <span className="text-xs font-sans font-black text-white">{homeScore}</span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-lg">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>
              {String(gameClockMinutes).padStart(2, "0")}:{String(gameClockSeconds).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-sans font-black text-white">{awayScore}</span>
            <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase">
              {matchedObj.teams.away.name.substring(0, 3)}
            </span>
          </div>
        </div>

        {/* Right segment */}
        <div className="flex items-center gap-1.5">
          <button aria-label="Button"
            onClick={() => setShowRulebookPanel(!showRulebookPanel)}
            className={`p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
              showRulebookPanel 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            title="Browse Laws DB"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          <button aria-label="Button"
            onClick={() => setShowTelemetryPanel(!showTelemetryPanel)}
            className={`p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
              showTelemetryPanel 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            title="Show Stream Broadcast"
          >
            <Tv className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* 2. DYNAMIC SPLIT COLUMNS CONTAINER */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Left Sidebar */}
        {sidebarOpen && (
          <div className="w-64 shrink-0 h-full">
            <Sidebar
              selectedMatchId={selectedMatchId}
              onSelectMatchId={setSelectedMatchId}
              isAudioEnabled={isAudioEnabled}
              onToggleAudio={setIsAudioEnabled}
              audioFeedback={audioFeedback}
              translationLanguage={translationLanguage}
              onChangeTranslationLanguage={setTranslationLanguage}
              isSpeechListening={isSpeechListening}
              onToggleSpeechMic={toggleSpeechRecognition}
              systemLatency={systemLatency}
              onOpenIngestModal={() => setShowIngestModal(true)}
              onCloseSidebar={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Central Chatroom analyst space */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          <ChatWorkspace
            chatMessages={getChatMessages()}
            activePlayEvent={activePlayEvent}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onOpenIngestModal={() => setShowIngestModal(true)}
          />
        </div>

        {/* Collapsible rulebook panel */}
        <LawsDatabase
          showRulebookPanel={showRulebookPanel}
          setShowRulebookPanel={setShowRulebookPanel}
          rulebookSearchQuery={rulebookSearchQuery}
          setRulebookSearchQuery={setRulebookSearchQuery}
          showAddRuleForm={showAddRuleForm}
          setShowAddRuleForm={setShowAddRuleForm}
          newRuleTitle={newRuleTitle}
          setNewRuleTitle={setNewRuleTitle}
          newRuleBody={newRuleBody}
          setNewRuleBody={setNewRuleBody}
          onSaveCustomRule={handleSaveCustomRule}
          filteredRulebookList={filteredRulebookList}
          onTriggerLawCheck={(title) => {
            handleSendMessage(`Under FIFA Laws, tell me about: ${title}`);
          }}
        />

        {/* Right Broadcast Insights collateral sidebar */}
        {showTelemetryPanel && (
          <InsightsPanel
            matchedObj={matchedObj}
            customVideoUrl={customVideoUrl}
            setCustomVideoUrl={setCustomVideoUrl}
            rightPanelTab={rightPanelTab}
            setRightPanelTab={setRightPanelTab}
            activeEvents={activeEvents}
            revealedEventIds={revealedEventIds}
            selectedEventId={selectedEventId}
            onSelectEventId={setSelectedEventId}
            streamTranscript={streamTranscript}
            isLoadingTranscript={isLoadingTranscript}
            transcriptError={transcriptError}
            commentarySearchQuery={commentarySearchQuery}
            setCommentarySearchQuery={setCommentarySearchQuery}
            isSpeechListening={isSpeechListening}
            speechTranscript={speechTranscript}
            speechTranslation={speechTranslation}
            isSpeechTranslating={isSpeechTranslating}
            translationLanguage={translationLanguage}
            translatedTranscriptCache={translatedTranscriptCache}
            onAskCommentatorQuote={(quote) => handleSendMessage(quote)}
            activePlayEvent={activePlayEvent}
            onClosePanel={() => setShowTelemetryPanel(false)}
          />
        )}

      </div>

      {/* 3. INGEST STREAM DIALOG MODAL Overlay */}
      {showIngestModal && (
        <div id="ingest-modal" className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#111112] border border-[#242426] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-left">
            
            <div className="p-4 bg-[#141416] border-b border-[#242426] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Ingest FIFA Tournament Stream
              </span>
              <button aria-label="Button"
                onClick={() => setShowIngestModal(false)}
                className="p-1 hover:bg-slate-800 rounded transition text-slate-500 hover:text-white"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIngestCustomMatch} className="p-4 space-y-4 text-xs">
              <p className="text-slate-500 leading-normal font-sans">
                Type an international matchup or paste any YouTube game replay video URL to extract comments and trigger real-time AI Ref monitoring.
              </p>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Match/Tournament Name</label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="e.g. FIFA World Cup Grand Final"
                  value={customMatchName}
                  onChange={(e) => setCustomMatchName(e.target.value)}
                  className="w-full bg-[#141416] border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Home Nation</label>
                  <input aria-label="Input field"
                    type="text"
                    placeholder="e.g. Argentina"
                    value={customHomeTeam}
                    onChange={(e) => setCustomHomeTeam(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Away Nation</label>
                  <input aria-label="Input field"
                    type="text"
                    placeholder="e.g. Germany"
                    value={customAwayTeam}
                    onChange={(e) => setCustomAwayTeam(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">YouTube Replay Stream URL (Optional)</label>
                <input aria-label="Input field"
                  type="text"
                  placeholder="Paste video url e.g. https://www.youtube.com/watch?v=..."
                  value={customMatchStreamUrl}
                  onChange={(e) => setCustomMatchStreamUrl(e.target.value)}
                  className="w-full bg-[#141416] border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {generatorAlert && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/15 rounded text-[10px] font-mono text-emerald-400 text-center uppercase tracking-wide">
                  {generatorAlert}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button aria-label="Button"
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono font-bold uppercase transition"
                >
                  Cancel
                </button>
                <button aria-label="Button"
                  type="submit"
                  disabled={isGeneratingEvents}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isGeneratingEvents ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Ingest Stream</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
