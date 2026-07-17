export interface MatchEvent {
  id: string;
  time: string; // Match clock timestamp e.g. "21:45"
  type: "foul" | "goal" | "penalty" | "card" | "injury" | "general" | "reversal";
  title: string;
  description: string; // VLM live vision logs
  visualData: {
    playerPosition?: { x: number; y: number };
    opponentPosition?: { x: number; y: number };
    actionType: "tackle" | "goal" | "offside" | "handball" | "block_charge";
    severity?: "yellow" | "red" | "none";
  };
  rulebookContext: string; // FIFA Law citation context snippet
  suggestedQuestions: string[];
}

export interface Match {
  id: string;
  sport: "soccer";
  title: string;
  videoUrl?: string;
  teams: {
    home: { name: string; score: number; logo: string; color: string };
    away: { name: string; score: number; logo: string; color: string };
  };
  period: string;
  gameTime: string;
  stadium: string;
  refereeName: string;
  events: MatchEvent[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ref";
  text: string;
  timestamp: string;
  verdictBadge?: string;
  confidenceBadge?: string;
  associatedEventId?: string;
}
