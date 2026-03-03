import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

export type TeamStatus = "waiting" | "answering" | "locked" | "timeout" | "buzzed";

export interface Team {
  id: string;
  name: string;
  score: number;
  status: TeamStatus;
  code: string;
}

export interface Question {
  id: string;
  round: number;
  question: string;
  answer: string;
  options?: string[];
}

export type RoundType = "general" | "pass-the-mic" | "buzzer" | "rapid-fire";

export interface GameSession {
  id: string;
  current_round: number;
  current_question_index: number;
  active_team: string | null;
  timer_seconds: number;
  is_timer_running: boolean;
  round_type: RoundType;
  buzzer_enabled: boolean;
  buzzer_order: string[];
  question_revealed: boolean;
  game_started: boolean;
}

interface GameContextType {
  teams: Team[];
  questions: Question[];
  gameSession: GameSession | null;
  refreshSession: () => void;
  refreshTeams: () => void;
  submitAnswer: (teamId: string, questionId: string, answer: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  // 🔥 FETCH TEAMS
  const refreshTeams = useCallback(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/teams/`);

    if (!res.ok) {
      console.error("Failed to fetch teams:", res.status);
      setTeams([]); // prevent .find crash
      return;
    }

    const data = await res.json();

    // Ensure it's always an array
    setTeams(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Network error:", err);
    setTeams([]);
  }
}, []);

  // 🔥 FETCH QUESTIONS
  const refreshQuestions = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/questions/`);
    const data = await res.json();
    setQuestions(data);
  }, []);

  // 🔥 FETCH ACTIVE SESSION
  const refreshSession = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/session/active/`);
    const data = await res.json();
    setGameSession(data);
  }, []);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    refreshTeams();
    refreshQuestions();
    refreshSession();
  }, [refreshTeams, refreshQuestions, refreshSession]);

  // 🔥 SUBMIT ANSWER TO BACKEND
  const submitAnswer = useCallback(
    async (teamId: string, questionId: string, answer: string) => {
      await fetch(`${API_BASE_URL}/answers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: teamId,
          question: questionId,
          session: gameSession?.id,
          answer_text: answer,
          time_taken: 0,
        }),
      });

      // refresh teams after submission (score might change)
      await refreshTeams();
    },
    [gameSession, refreshTeams]
  );

  const value: GameContextType = {
    teams,
    questions,
    gameSession,
    refreshSession,
    refreshTeams,
    submitAnswer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}