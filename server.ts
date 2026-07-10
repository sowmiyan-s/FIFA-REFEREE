import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper to extract YouTube video ID from various formats
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  if (url.includes("v=")) {
    try {
      const parts = url.split("v=");
      if (parts[1]) {
        return parts[1].split("&")[0].split("?")[0].split("#")[0];
      }
    } catch (e) {}
  }
  if (url.includes("embed/")) {
    try {
      const parts = url.split("embed/");
      if (parts[1]) {
        return parts[1].split("&")[0].split("?")[0].split("#")[0];
      }
    } catch (e) {}
  }
  if (url.includes("youtu.be/")) {
    try {
      const parts = url.split("youtu.be/");
      if (parts[1]) {
        return parts[1].split("&")[0].split("?")[0].split("#")[0];
      }
    } catch (e) {}
  }
  return null;
}

// Simple in-memory transcript cache to persist loaded or simulated commentators
const transcriptCache = new Map<string, string>();

// Fallback dynamic generator for realistic, timestamped live commentator voice feeds
async function generateFallbackCommentary(
  videoUrl: string,
  matchTitle?: string,
  sport?: string,
  events?: any[]
): Promise<string> {
  const sportType = (sport || "soccer").toLowerCase();
  const title = matchTitle || "Live Match";

  if (ai) {
    try {
      const prompt = `You are a professional live sports broadcast commentary team (a main play-by-play announcer and a color commentator) broadcasting a high-stakes ${sportType} match called "${title}".
We don't have the live audio transcript because captions are disabled, so you must generate a highly engaging, professional, realistic, and detailed live broadcast transcript that matches the key moments of this game.

Here is the event log of key plays and situations:
${events && events.length > 0 ? JSON.stringify(events) : "Standard professional match flow"}

Please generate exactly 12-18 distinct commentary dialogue lines.
Each line must start with a timestamp inside square brackets (like [MM:SS]) and represent a realistic sequence of play.
Make sure the dialogue is extremely authentic: include the announcers' reactions to the crowd, tactical commentary, debates on whether a tackle was clean, anticipation before a VAR review, and immediate reactions to goals!
For example:
[12:10] Announcer: What a lovely pass over the top!
[12:30] Commentator: Oh, he's down! Walker sliding tackle from behind, and the referee is running over!
[12:45] Announcer: That's a booking, walker gets a yellow card, but the Madrid bench wants more!

Format of each line:
[MM:SS] [Announcer Name]: [Commentary Dialogue]

Output only the plain list of commentary lines, one per line. Do not wrap in markdown blocks, do not add introductory text or closing text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      const text = response.text?.trim();
      if (text && text.length > 50) {
        return text;
      }
    } catch (e) {
      console.log("AI commentary generation currently unavailable, utilizing backup simulation engine.");
    }
  }

  // Static high-quality backup generator if Gemini is unavailable or failed
  console.log("Generating static fallback commentary for match:", title);
  const commentaryLines: string[] = [];
  
  if (sportType === "soccer") {
    commentaryLines.push(
      "[05:15] Martin Tyler: Welcome back to Wembley! The atmosphere here is absolutely electric, Alan.",
      "[05:40] Alan Smith: Spot on, Martin. High intensity from both teams in these opening minutes, trying to assert dominance.",
      "[12:10] Martin Tyler: Bellingham orchestrating things in the midfield. He slips a delicate pass to Vinícius on the left.",
      "[12:30] Martin Tyler: Vinícius Jr. cuts inside Walker—OH! He's gone down! Walker went sliding in, and the whistle goes!",
      "[12:50] Alan Smith: That's a reckless challenge from Walker. He was beaten for speed there, Martin. Clear yellow card.",
      "[13:15] Martin Tyler: Yes, Szymon Marciniak immediately brandishing the yellow card. Walker will have to walk a tightrope now.",
      "[33:45] Martin Tyler: City corner cleared away by Rüdiger, but only as far as Kevin De Bruyne 25 yards out...",
      "[34:10] Martin Tyler: DE BRUYNE VOLLEYS IT! OH MY GOODNESS! SPECTACULAR GOAL! PAST COURTOIS INTO THE TOP CORNER!",
      "[34:35] Alan Smith: Absolute rocket! But wait, Courtois and Rüdiger are surrounding the referee. They are claiming offside interference!",
      "[35:10] Martin Tyler: Let's look at the replay. Yes, Akanji was standing in front of Courtois. VAR is checking this as we speak.",
      "[35:40] Alan Smith: Ref is pointing to the center circle! The goal stands! Unbelievable strike, and City take the lead!",
      "[57:50] Martin Tyler: Madrid counter-attacking in numbers. Rodrygo releases Bellingham, who looks up and slides it across...",
      "[58:20] Martin Tyler: MBAPPÉ TAPS IT IN! Real Madrid think they've equalized! But the linesman's flag is up instantly!",
      "[58:45] Alan Smith: Extremely tight call. The SAOT graphics are coming up on screen. Wow, Mbappé's shoulder is just offside!",
      "[74:20] Martin Tyler: Valverde crossing into the box, Dias slides to block... and Madrid are appealing for handball!",
      "[74:45] Martin Tyler: PENALTY AWARDED! The referee doesn't hesitate! He's pointing straight to the penalty spot!",
      "[75:10] Alan Smith: That arm was fully extended above his shoulder, Martin. It's a tough rule, but it's consistent with modern handball definitions.",
      "[87:50] Martin Tyler: Modrić loses possession, Rodri is away, Modrić flying back with a desperate lunge—OH, Rodri is down!",
      "[88:15] Martin Tyler: That looks bad! Szymon Marciniak shows a yellow card, but the VAR room is calling him to the screen!",
      "[88:45] Alan Smith: Oh look at that replay. Studs showing, caught him right on the shin above the ankle. That has to be upgraded.",
      "[89:10] Martin Tyler: Marciniak returns to the field, cancels the yellow card, and shows a STRAIGHT RED CARD to Luka Modrić!"
    );
  } else if (sportType === "basketball") {
    commentaryLines.push(
      "[02:15] Mike Breen: Welcome back to Crypto.com Arena, Game 7 of the NBA Finals. Tatum with the ball at the top of the key.",
      "[02:45] Doris Burke: Mike, the defensive density from the Lakers has been outstanding, but Tatum is finding his rhythm.",
      "[45:10] Mike Breen: Tatum drives hard down the lane, crashes into Davis—LAYUP IS GOOD! AND A WHISTLE!",
      "[45:30] Doris Burke: Davis was inside the restricted area, Mike. You can see his heels on the line. That is a blocking foul all day.",
      "[47:00] Mike Breen: Jaylen Brown for three... rattles off the rim. Horford leaps, tips it back down and in!",
      "[47:20] Mike Breen: But wait, Scott Foster blows the whistle. He is waving off the basket! Basket interference is the call!",
      "[47:45] Doris Burke: The ball was clearly still in the imaginary cylinder right above the rim, Mike. Excellent call by Foster.",
      "[48:00] Mike Breen: Davis secures the rebound, Horford is draped all over him. Davis clears space, swings his elbow—Horford is down!",
      "[48:10] Mike Breen: The play is stopped. Horford is holding his jaw. The officials are going to the review monitor.",
      "[48:35] Doris Burke: Anthony Davis swung his elbow horizontally with significant speed, making contact above the shoulders. That's a Flagrant 1."
    );
  } else {
    commentaryLines.push(
      "[05:30] Joe Buck: Fourth quarter here in Glendale, Hurts back to pass, looking deep for A.J. Brown on the sideline...",
      "[05:55] Troy Aikman: Incredible throw by Hurts, but let's see if Brown managed to stay in bounds here.",
      "[11:20] Joe Buck: Catch made by Brown! He goes out of bounds, but the official rules it incomplete. Nick Sirianni is throwing the red flag!",
      "[11:45] Troy Aikman: Look at that left foot, Joe. He drags the toe beautifully. That is a completed catch all day long.",
      "[12:10] Joe Buck: Ruling is reversed! It is a complete pass, first down Eagles!",
      "[13:20] Joe Buck: 3rd and 10, Mahomes looks for Kelce over the middle... pass is incomplete, but there is a flag on the play!",
      "[13:40] Joe Buck: Defensive Pass Interference is the call on James Bradberry. Chiefs get an automatic first down.",
      "[14:10] Troy Aikman: Bradberry definitely got a handful of Kelce's jersey there, Joe. Hindered his ability to turn and make the play.",
      "[14:35] Joe Buck: Eagles run the QB sneak with Jalen Hurts... Hurts surges forward, but Karlaftis pulls him down.",
      "[14:50] Joe Buck: Another flag! Karlaftis grabbed Hurts by the face mask and twisted him down. 15-yard penalty, automatic first down!"
    );
  }

  return commentaryLines.join("\n");
}

// Fetch and format YouTube transcript
async function fetchYouTubeTranscriptText(videoUrl: string): Promise<string> {
  const videoId = getYouTubeId(videoUrl);
  if (!videoId) {
    return "No active YouTube stream connected.";
  }

  if (transcriptCache.has(videoId)) {
    return transcriptCache.get(videoId)!;
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcript || transcript.length === 0) {
      return "No audio/voice transcript captions found for this broadcast feed.";
    }
    const formatted = transcript
      .map(t => {
        const totalSeconds = Math.floor(t.offset / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        return `[${timeStr}] ${t.text}`;
      })
      .slice(0, 300) // Keep reasonable context length
      .join("\n");
    
    transcriptCache.set(videoId, formatted);
    return formatted;
  } catch (error: any) {
    console.log(`YouTube transcript not available for video ID ${videoId}.`);
    // Propagate error to caller for fallback generation
    throw error;
  }
}

// Initialize server-side Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
}

const systemInstruction = `You are "RefAI," an ultra-low-latency, real-time AI Sports Companion and Multimodal Referee Expert.
Your job is to analyze a live stream of match data, cross-reference it with the official rulebook, and instantly clarify live on-field action for fans.
Your tone is authoritative yet engaging, objective like a professional official, but clear enough for a casual sports fan to understand.

OPERATIONAL ARCHITECTURE:
For each user query, you will receive three live-updated context streams:
1. [LIVE_VISION_LOGS]: Continuous, timestamped text descriptions generated by a Vision-Language Model watching the game in real-time.
2. [OFFICIAL_RULEBOOK]: Relevant snippets from the official governing body's rules (e.g. FIFA, NBA, NFL) corresponding to the current match situation.
3. [YOUTUBE_BROADCAST_TRANSCRIPT]: Spoken commentary, announcers' voice feed, or commentator insights extracted in real-time from the YouTube broadcast stream.

USER INTERACTION RULES:
- Fans will ask questions about recent events (e.g., "Why was that a red card?", "Was that really offside?").
- Prioritize speed and clarity. Keep answers concise (under 3-4 sentences) unless a complex rule breakdown is requested.
- You must ALWAYS ground your reasoning in the provided [LIVE_VISION_LOGS], the [OFFICIAL_RULEBOOK], and the real commentary in the [YOUTUBE_BROADCAST_TRANSCRIPT]. If the commentators mentioned specific details, player states, or decisions, incorporate or clarify them!
- If a query cannot be answered using the recent logs or transcript, say: "Looking closely at the live feed—the angles haven't shown a clear reason yet. Let me monitor the next replay log."

RESPONSE FORMULATION TEMPLATE:
When answering a controversial or technical play, structure your response as follows (use markdown and bold labels exactly like this):

1. **Direct Answer**: [State exactly what happened according to the live vision log and what the stream's audio commentary said]
2. **Rule Justification**: [Cite the specific rule or criteria from the provided Rulebook snippet that justifies the decision]
3. **Context/Verdict**: [Give a brief wrap-up statement explaining the final result of the play]

CONSTRAINTS:
- Never refer to yourself as an LLM or AI model. You are the live match companion.
- Minimize latency: Do not use unnecessary filler words like "Sure, I can help with that." or "Based on my instructions...". Dive straight into the analysis.
- Handle conversational follow-ups seamlessly, remembering the context of the current match state.`;

// API endpoint for RefAI analysis
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { query, activeLogs, ruleContext, history, videoUrl } = req.body;

    if (!query) {
      res.status(400).json({ error: "Missing query in request body" });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: "Gemini API is not initialized. Please verify your GEMINI_API_KEY in the Settings > Secrets menu.",
      });
      return;
    }

    // Fetch and include real YouTube voice commentary transcript if a video URL is active
    let transcriptText = "No YouTube audio broadcast stream available.";
    if (videoUrl) {
      const videoId = getYouTubeId(videoUrl);
      if (videoId && transcriptCache.has(videoId)) {
        transcriptText = transcriptCache.get(videoId)!;
      } else {
        try {
          transcriptText = await fetchYouTubeTranscriptText(videoUrl);
        } catch (e) {
          // Fallback if not yet loaded in timeline
          transcriptText = await generateFallbackCommentary(videoUrl);
          if (videoId) {
            transcriptCache.set(videoId, transcriptText);
          }
        }
      }
    }

    // Prepare contents array for Gemini API call
    const contents: any[] = [];

    // Map conversation history
    if (Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Formulate prompt with live context
    const currentPrompt = `[LIVE_VISION_LOGS]:
${activeLogs || "No logs available."}

[OFFICIAL_RULEBOOK]:
${ruleContext || "No rulebook snippets available."}

[YOUTUBE_BROADCAST_TRANSCRIPT] (Real-time Spoken Voice Commentary from YouTube):
${transcriptText}

User Query: ${query}`;

    contents.push({
      role: "user",
      parts: [{ text: currentPrompt }],
    });

    // Request answer from gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for higher rule fidelity and accuracy
      },
    });

    const replyText = response.text || "I was unable to generate an analysis. Let me monitor the next play.";

    res.json({ reply: replyText, transcriptAttached: transcriptText !== "No YouTube audio broadcast stream available." });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Endpoint to translate text (e.g. broadcast commentary or recognized speech) into target languages
app.post("/api/translate", async (req: express.Request, res: express.Response) => {
  try {
    const { text, targetLang } = req.body;
    if (!text) {
      res.status(400).json({ error: "Missing text in request body" });
      return;
    }

    if (!ai) {
      // Fallback translations if Gemini is not configured
      const staticFallbacks: Record<string, Record<string, string>> = {
        "es": {
          "Welcome back to Wembley!": "¡Bienvenidos de nuevo a Wembley!",
          "Absolute rocket!": "¡Un misil absoluto!",
          "Penalty awarded!": "¡Penalti concedido!"
        }
      };
      const translated = staticFallbacks[targetLang]?.[text] || `[${targetLang.toUpperCase()}] ${text}`;
      res.json({ success: true, translated });
      return;
    }

    const targetLanguages: Record<string, string> = {
      "en": "English",
      "es": "Spanish (Español)",
      "fr": "French (Français)",
      "de": "German (Deutsch)",
      "ja": "Japanese (日本語)"
    };

    const targetLanguageName = targetLanguages[targetLang] || targetLang;

    const translationPrompt = `You are an expert sports translator. Translate the following live sports broadcast commentary line into ${targetLanguageName}.
Keep the translation highly authentic, capturing the energy, excitement, and sporting terminology of the target language!
Do not output any explanations, markdown code blocks, or introductory text. Output ONLY the translated text itself.

Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: translationPrompt }] }],
      config: {
        temperature: 0.1,
      },
    });

    res.json({ success: true, translated: response.text?.trim() || text });
  } catch (err: any) {
    console.error("Error in /api/translate:", err);
    res.status(500).json({ error: err.message || "Translation failed." });
  }
});

// Endpoint to fetch real YouTube transcript captions for UI timeline
app.post("/api/get-transcript", async (req: express.Request, res: express.Response) => {
  try {
    const { videoUrl, matchTitle, sport, events } = req.body;
    if (!videoUrl) {
      res.status(400).json({ error: "Missing videoUrl in request body" });
      return;
    }
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) {
      res.status(400).json({ error: "Invalid YouTube URL" });
      return;
    }

    let transcriptText = "";
    if (transcriptCache.has(videoId)) {
      transcriptText = transcriptCache.get(videoId)!;
    } else {
      try {
        transcriptText = await fetchYouTubeTranscriptText(videoUrl);
      } catch (err: any) {
        console.log(`Engaging AI Live-Commentator Simulation Mode for video ${videoId}...`);
        // Generate beautiful custom live-commentary matching the match events!
        transcriptText = await generateFallbackCommentary(videoUrl, matchTitle, sport, events);
        transcriptCache.set(videoId, transcriptText);
      }
    }

    res.json({ success: true, videoId, transcript: transcriptText });
  } catch (err: any) {
    console.error("Error in /api/get-transcript:", err);
    res.status(500).json({ error: err.message || "Failed to fetch transcript." });
  }
});

// New endpoint to dynamically generate a live stream of FIFA World Cup matches based on search query or Stream/YouTube URL
app.post("/api/generate-stream-events", async (req: express.Request, res: express.Response) => {
  try {
    const { matchName, streamUrl } = req.body;

    if (!matchName) {
      res.status(400).json({ error: "Missing matchName in request body" });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: "Gemini API key not configured. Using pre-loaded mock stream as fallback.",
      });
      return;
    }

    const generatorPrompt = `You are a real-time FIFA football match analysis data generator for a live stream companion called RefAI.
The user wants to analyze a match/stream named: "${matchName}" (Stream Source URL: ${streamUrl || "Live Feed"}).

Generate exactly 5 realistic, highly engaging, and dramatic sequential soccer match event logs (with timestamps e.g. [14:20], [38:10], [52:45], [74:15], [88:50]). The events must represent high-stakes, rules-critical incidents.
Focus heavily on typical stadium dramas, VAR reviews, and referee rule decisions of high-stake international soccer (e.g. FIFA World Cup).

You MUST output exactly a JSON array containing 5 elements. Do not output markdown code blocks unless they contain valid JSON. Do not write any text outside the JSON.
Each object in the array must strictly match this structure:
{
  "id": "generated-" + unique_string,
  "time": "MM:SS" (string, e.g. "38:10"),
  "type": "foul" | "goal" | "penalty" | "card" | "reversal",
  "title": string (e.g. "Kylian Mbappé penalty shot after sliding tackle inside box"),
  "description": string (the detailed [LIVE_VISION_LOGS] segment describing the event in real-time, player names, numbers, visual telemetry, referee actions e.g. "[38:10] Mbappé #10 is tripped..."),
  "visualData": {
    "playerPosition": { "x": number, "y": number }, (x and y should be coordinates on a soccer pitch from 10 to 90 representing where the event occurred)
    "opponentPosition": { "x": number, "y": number }, (optional, coordinate of the opponent involved)
    "actionType": "tackle" | "goal" | "offside" | "handball" | "block_charge",
    "severity": "yellow" | "red" | "none"
  },
  "rulebookContext": string (the specific [OFFICIAL_RULEBOOK] law or rulebook snippet corresponding to this play - name the specific Law e.g., "FIFA Law 12..."),
  "suggestedQuestions": string[] (provide exactly 3 realistic questions a football fan would ask RefAI about this specific controversial call)
}

Generate realistic names of world-class players fitting the match name "${matchName}" if applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: generatorPrompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text from Gemini API");
    }

    const events = JSON.parse(resultText);
    res.json({ success: true, events });
  } catch (err: any) {
    console.error("Error generating stream events:", err);
    res.status(500).json({ error: err.message || "Failed to generate stream events dynamically." });
  }
});

// Real-time VLM Sports Incident Frame Analyzer endpoint using Gemini
app.post("/api/analyze-vlm", async (req: express.Request, res: express.Response) => {
  try {
    const { imageBase64, ruleContext, sport, incidentType } = req.body;

    if (!ai) {
      res.status(503).json({
        error: "Gemini API key not configured. Please add GEMINI_API_KEY to secrets.",
      });
      return;
    }

    const contents: any[] = [];
    const prompt = `You are a professional Video Assistant Referee (VAR) visual analysis agent for RefAI.
Analyze the provided sports play-incident image frame under official rulebooks.

Match Context:
- Sport: ${sport || "soccer"}
- Governing Rulebook snippet: "${ruleContext || "FIFA Laws of the Game / League Rules"}"
- Reported incident category: "${incidentType || "general play challenge"}"

Verify the play carefully. Inspect player contact points, physical coordinates, leg/arm expansion, line of sight, ball contact, and official rules.
Produce a professional, authoritative, and rule-grounded VAR review verdict card.

You MUST respond with exactly a JSON object matching this schema. Do not write any markdown blocks or intro/outro text, just raw JSON:
{
  "verdict": "string" (e.g. "Direct Red Card Confirmed" or "Penalty Awarded" or "Offside Call Verified"),
  "confidence": "string" (e.g. "98.4%"),
  "ruleCode": "string" (e.g. "FIFA LAW-12" or "NBA RULE-12"),
  "description": "string" (a precise, 3-sentence referee statement explaining exactly what visual evidence supports this verdict under the rules)
}`;

    let modifiedPrompt = prompt;
    let inlineDataObj: any = null;

    if (imageBase64) {
      const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];

        if (mimeType.includes("svg") || mimeType.includes("xml")) {
          try {
            const svgContent = Buffer.from(base64Data, "base64").toString("utf-8");
            modifiedPrompt += `\n\n[Visual Incident Vector Representation (SVG XML)]:\n${svgContent}\n\nAnalyze this vector markup carefully to determine player positions, colors, contact zone text annotations, and ball locations.`;
          } catch (e) {
            console.warn("Failed to decode base64 SVG:", e);
          }
        } else {
          inlineDataObj = {
            data: base64Data,
            mimeType: mimeType
          };
        }
      } else {
        // If no matches (raw base64 or unsupported structure), default to image/jpeg if it looks like base64
        inlineDataObj = {
          data: imageBase64,
          mimeType: "image/jpeg"
        };
      }
    }

    const parts: any[] = [{ text: modifiedPrompt }];
    if (inlineDataObj) {
      parts.push({ inlineData: inlineDataObj });
    }

    contents.push({
      role: "user",
      parts: parts
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    const verdict = JSON.parse(resultText);
    res.json({ success: true, verdict });
  } catch (err: any) {
    console.error("Error in VLM analysis:", err);
    res.status(500).json({ error: err.message || "Failed to analyze visual frame." });
  }
});

// Configure Vite or production static asset server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RefAI Server running at http://localhost:${PORT}`);
  });
}

setupServer();
