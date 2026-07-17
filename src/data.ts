import { Match, MatchEvent } from "./types";

export const MATCHES_DATA: Match[] = [
  {
    id: "worldcup-2022-final",
    sport: "soccer",
    title: "FIFA World Cup Qatar 2022 Final",
    videoUrl: "https://www.youtube.com/embed/S_B7b-CidM8",
    teams: {
      home: { name: "Argentina", score: 3, logo: "ARG", color: "#7dd3fc" },
      away: { name: "France", score: 3, logo: "FRA", color: "#1e3a8a" }
    },
    period: "Extra Time",
    gameTime: "108:15",
    stadium: "Lusail Stadium, Doha",
    refereeName: "Szymon Marciniak",
    events: [
      {
        id: "arg-1",
        time: "21:45",
        type: "penalty",
        title: "Ángel Di María penalty award",
        description: "[21:45] Argentina #11 (Di María) cuts past France defender #11 (Dembélé) inside the penalty box. Dembélé makes contact from behind, clipping Di María's trailing heel. Di María loses balance and falls. Referee Szymon Marciniak immediately blows for a penalty kick. France players protest claiming minimal contact.",
        visualData: {
          playerPosition: { x: 18, y: 35 },
          opponentPosition: { x: 20, y: 36 },
          actionType: "tackle",
          severity: "none"
        },
        rulebookContext: "FIFA Law 12 - Fouls and Misconduct: A penalty kick is awarded if a player commits a direct free kick offence (such as tripping or attempting to trip an opponent) inside their own penalty area, irrespective of the position of the ball, provided it is in play.",
        suggestedQuestions: [
          "Was the contact by Dembélé sufficient to award a FIFA World Cup penalty?",
          "How does VAR assess heel-clip incidents with trailing legs?",
          "What is the recommended referee positioning for Law 12 penalty box calls?"
        ]
      },
      {
        id: "arg-2",
        time: "35:40",
        type: "goal",
        title: "Masterclass counter-attack goal by Di María",
        description: "[35:40] Argentina launches a breathtaking counter-attack. Messi plays a deft flick to Mac Allister, who slides a perfect horizontal low cross across the face of the French box. Di María rushes in at the far post and strikes a clean bounce-shot over Lloris into the net. Goal confirmed.",
        visualData: {
          playerPosition: { x: 88, y: 25 },
          actionType: "goal"
        },
        rulebookContext: "FIFA Law 10 - Determining the Outcome of a Match: A goal is scored when the whole of the ball passes over the goal line, between the goalposts and under the crossbar, provided that no offence has been committed by the team scoring the goal.",
        suggestedQuestions: [
          "Was Di María in an offside position when Mac Allister made the final pass?",
          "How did Argentina's build-up play comply with Law 11?",
          "Are there any VAR checks on offside positions for quick counter-attacks?"
        ]
      },
      {
        id: "arg-3",
        time: "79:20",
        type: "penalty",
        title: "Kylian Mbappé penalty award",
        description: "[79:20] Kolo Muani bursts into the Argentina box, outpacing Otamendi. Otamendi, caught on the wrong side, drags him down with an arm around Muani's shoulder and a leg tangle. The referee points to the spot. Mbappé converts to make it 2-1.",
        visualData: {
          playerPosition: { x: 85, y: 72 },
          opponentPosition: { x: 83, y: 70 },
          actionType: "tackle"
        },
        rulebookContext: "FIFA Law 12 - Holding an opponent: Holding an opponent includes the act of preventing them from moving past or around using the hands, arms or body. A penalty is assessed if this occurs inside the defender's own area.",
        suggestedQuestions: [
          "Should Otamendi have received a yellow card under the 'double jeopardy' rule?",
          "How does FIFA guide referees on holding vs. mutual shoulder-to-shoulder contact?",
          "What is the statistical conversion rate of penalties in World Cup Finals?"
        ]
      },
      {
        id: "arg-4",
        time: "108:15",
        type: "goal",
        title: "Messi extra-time goal: Goal-line clearance check",
        description: "[108:15] Lautaro Martínez unleashes a fierce shot that Lloris parries. Lionel Messi pounces on the rebound and taps it toward goal. France defender Upamecano clears the ball, but Goal-Line Technology instantly signals to the referee's watch that the ball fully crossed the line by 9cm. France players appeal for offside, but VAR verifies Lautaro Martínez was onside at the moment of the pass.",
        visualData: {
          playerPosition: { x: 95, y: 50 },
          actionType: "goal"
        },
        rulebookContext: "FIFA Law 10 - Goal-Line Technology (GLT): GLT applies solely to determine whether a goal has been scored to support the referee's decision. The crossing of the goal line must be complete (100% of the ball circumference).",
        suggestedQuestions: [
          "Did Messi's extra-time goal fully cross the line before Upamecano cleared it?",
          "Why did France complain about Argentina bench players encroaching onto the field?",
          "How does the semi-automated system check Lautaro Martínez's shoulder position?"
        ]
      },
      {
        id: "arg-5",
        time: "116:40",
        type: "penalty",
        title: "Mbappé shot blocks on Montiel handball",
        description: "[116:40] Kylian Mbappé fires a powerful shot from the edge of the box. Argentina defender Gonzalo Montiel blocks the shot with his elbow. Montiel's arm is raised away from his body, blocking the flight of the ball towards the net. The referee immediately points to the spot for handball.",
        visualData: {
          playerPosition: { x: 15, y: 55 },
          actionType: "handball"
        },
        rulebookContext: "FIFA Law 12 - Handball: It is a handball offense when a player's hand/arm makes their body unnaturally bigger, or when the hand/arm is above/beyond their shoulder level. Blocking a direct shot on goal with an unnaturally extended arm is penalized with a penalty and a yellow card.",
        suggestedQuestions: [
          "Why was Montiel given a yellow card for this handball?",
          "What constitutes 'unnatural silhouette expansion' in the modern FIFA rulebook?",
          "Should this handball be considered deliberate or block-accidental?"
        ]
      }
    ]
  },
  {
    id: "worldcup-2018-final",
    sport: "soccer",
    title: "FIFA World Cup Russia 2018 Final",
    videoUrl: "https://www.youtube.com/embed/S_B7b-CidM8",
    teams: {
      home: { name: "France", score: 4, logo: "FRA", color: "#1e3a8a" },
      away: { name: "Croatia", score: 2, logo: "CRO", color: "#ef4444" }
    },
    period: "2nd Half",
    gameTime: "38:10",
    stadium: "Luzhniki Stadium, Moscow",
    refereeName: "Néstor Pitana",
    events: [
      {
        id: "rus-1",
        time: "18:00",
        type: "foul",
        title: "Antoine Griezmann controversial free-kick",
        description: "[18:00] Griezmann is tackled by Croatia #11 (Brozović) 30 yards out. Griezmann appears to begin falling before contact is made, simulating a trip. The referee awards a free-kick. Griezmann crosses it, and Mario Mandžukić inadvertently headers it into his own net for an own goal. Croatia players express outrage.",
        visualData: {
          playerPosition: { x: 30, y: 40 },
          opponentPosition: { x: 31, y: 39 },
          actionType: "tackle",
          severity: "none"
        },
        rulebookContext: "FIFA Law 12 - Simulation: Any intentional act to deceive the referee by pretending to have been fouled or tripped is penalized as simulation (unsporting behavior, yellow card). If a free-kick is awarded incorrect, VAR cannot intervene as free-kicks outside the box are out of VAR scope.",
        suggestedQuestions: [
          "Did Griezmann simulate the foul to win the free-kick?",
          "Why couldn't VAR review the free-kick decision that led to the own goal?",
          "How do FIFA referees identify simulation in live speed?"
        ]
      },
      {
        id: "rus-2",
        time: "38:10",
        type: "penalty",
        title: "Ivan Perišić handball penalty award",
        description: "[38:10] A French corner is flicked on by Blaise Matuidi. The ball travels fast and strikes the hand of Croatia's Ivan Perišić. Perišić's hand is in a low but unnatural position, moving downward. Argentine referee Néstor Pitana does not initially see it, but after a prolonged VAR on-field review, he awards a penalty.",
        visualData: {
          playerPosition: { x: 88, y: 60 },
          actionType: "handball"
        },
        rulebookContext: "FIFA Law 12 - Handball Review: VAR recommends an on-field review for potential penalty area handballs. The referee evaluates proximity, reaction time, and whether the hand is moving towards the ball vs. naturally positioned.",
        suggestedQuestions: [
          "Why did it take referee Néstor Pitana 3 minutes to confirm the handball penalty?",
          "Was Perišić's hand movement natural or a deliberate block?",
          "How did this rule influence the 2022 FIFA handball rule revisions?"
        ]
      }
    ]
  }
];
