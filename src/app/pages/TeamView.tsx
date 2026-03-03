import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { LogOut, Zap, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useGame } from "../contexts/GameContext";
import Scoreboard from "../components/Scoreboard";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

const WS_BASE_URL =
  window.location.protocol === "https:"
    ? "wss://tourarcade-quiz.onrender.com/ws/game/"
    : "ws://localhost:8000/ws/game/";

export default function TeamView() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { teams, questions, gameSession, refreshSession, submitAnswer } =
    useGame();

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const team = (teams || []).find((t) => t.id === teamId);

  useEffect(() => {
    if (sessionStorage.getItem(`teamAuth_${teamId}`) !== "true") {
      navigate("/team-join");
    }
  }, [navigate, teamId]);

  // Auto refresh session (temporary until WebSocket phase)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshSession();
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [refreshSession]);

  if (!team || !gameSession) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  const currentQuestion = Array.isArray(questions)
  ? questions.find(
      (q) => q.id === gameSession?.current_question_index
    )
  : undefined;

  const isActiveTeam = gameSession.active_team === team.id;

  const handleBuzz = async () => {
    try {
      await fetch(`${API_BASE_URL}/session/${gameSession.id}/buzz/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: team.id }),
      });

      await refreshSession();
    } catch (err) {
      console.error("Buzz failed");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return;

    setLoading(true);

    await submitAnswer(team.id, currentQuestion.id, answer);

    setAnswer("");
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(`teamAuth_${team.id}`);
    navigate("/");
  };

useEffect(() => {
  if (!gameSession?.id) return;

  const ws = new WebSocket(`${WS_BASE_URL}${gameSession.id}/`);

  ws.onopen = () => {
    console.log("Connected to WebSocket");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("WS Message:", data);

    // Backend sends: { type: "game_state", session, teams }
    if (data.type === "game_state") {
      refreshSession(); 
    }

    if (data.type === "timer") {
      console.log("Timer:", data.seconds);
    }

    if (data.type === "answer_submitted") {
      console.log("Answer submitted:", data);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return () => {
    ws.close();
  };
}, [gameSession?.id]);
  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-blue-500/30 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-wider">{team.name}</h1>
              <p className="text-sm text-blue-400 font-mono">Team Code: {team.code}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-blue-400 font-mono">YOUR SCORE</p>
                <p className="text-5xl font-black text-white">{team.score}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <motion.div
                animate={{
                  boxShadow: isActiveTeam
                    ? '0 0 60px rgba(251, 191, 36, 0.5)'
                    : '0 0 20px rgba(59, 130, 246, 0.2)',
                }}
                className={`p-8 rounded-xl border-2 ${
                  isActiveTeam
                    ? 'bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500'
                    : 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-white">
                    ROUND {gameSession.currentRound} - {gameSession.roundType.toUpperCase()}
                  </h2>
                  {gameSession.isTimerRunning && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border-2 border-red-500 rounded-lg">
                      <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                      <span className="text-3xl font-black text-red-400 font-mono">
                        {gameSession.timerSeconds}s
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center py-8">
                  {isActiveTeam ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="inline-block px-6 py-3 bg-yellow-600 rounded-full animate-pulse">
                        <p className="text-2xl font-black text-white">⚡ YOUR TURN TO ANSWER!</p>
                      </div>
                      <p className="text-lg text-yellow-300 font-mono">Status: {team.status.toUpperCase()}</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div className="inline-block px-6 py-3 bg-blue-600/30 rounded-full">
                        <p className="text-xl font-black text-blue-300">⏳ Waiting for your turn...</p>
                      </div>
                      <p className="text-lg text-blue-400 font-mono">Status: {team.status.toUpperCase()}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Question Display */}
              <div className="p-8 bg-black/60 border-2 border-purple-500/50 rounded-xl min-h-[300px]">
                <h3 className="text-xl font-black text-purple-400 mb-4">
                  QUESTION {gameSession.currentQuestionIndex + 1}
                </h3>

                {!gameSession.gameStarted ? (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-2xl font-black text-white/30 text-center">
                      Waiting for Quiz Master to start the game...
                    </p>
                  </div>
                ) : currentQuestion ? (
                  <div>
                    {gameSession.roundType === 'buzzer' && !gameSession.questionRevealed ? (
                      <div className="flex items-center justify-center h-48">
                        <div className="text-center">
                          <p className="text-4xl font-black text-white/30 mb-6">QUESTION HIDDEN</p>
                          <Button
                            onClick={handleBuzz}
                            disabled={!canBuzz || !gameSession.buzzerEnabled}
                            className="h-32 w-32 rounded-full bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-black text-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)]"
                          >
                            <Zap className="w-16 h-16" />
                          </Button>
                          <p className="text-sm text-white/50 mt-4 font-mono">
                            {canBuzz ? 'Press to buzz in!' : 'Already buzzed!'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-2xl text-white font-bold leading-relaxed">
                          {currentQuestion.question}
                        </p>

                        {/* Answer Input */}
                        {canAnswer && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <Textarea
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              placeholder="Type your answer here..."
                              className="w-full min-h-[120px] bg-black/60 border-2 border-yellow-500/50 text-white text-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/50"
                            />
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={!answer.trim()}
                              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-black text-xl"
                            >
                              <Send className="w-6 h-6 mr-2" />
                              SUBMIT ANSWER
                            </Button>
                            <p className="text-xs text-yellow-400/60 text-center font-mono">
                              * Admin will mark your answer as correct or wrong
                            </p>
                          </motion.div>
                        )}

                        {/* Buzzer for revealed questions */}
                        {gameSession.roundType === 'buzzer' && gameSession.questionRevealed && !isActiveTeam && (
                          <div className="text-center">
                            <Button
                              onClick={handleBuzz}
                              disabled={!canBuzz || !gameSession.buzzerEnabled}
                              className="h-24 w-24 rounded-full bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-black text-xl shadow-[0_0_40px_rgba(239,68,68,0.5)]"
                            >
                              <Zap className="w-12 h-12" />
                            </Button>
                            <p className="text-sm text-white/50 mt-3 font-mono">
                              {canBuzz ? 'Buzz in to answer!' : 'Already buzzed!'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-2xl font-black text-white/30">
                      No question for this round yet
                    </p>
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl">
                <h3 className="text-xl font-black text-white mb-4">ROUND RULES</h3>
                <div className="space-y-2 text-sm text-purple-300 font-mono">
                  {gameSession.roundType === 'general' && (
                    <>
                      <p>• Turn-based answering (20 seconds)</p>
                      <p>• +10 points for correct answer</p>
                      <p>• No penalty for wrong answer</p>
                      <p>• Can pass to next team</p>
                    </>
                  )}
                  {gameSession.roundType === 'pass-the-mic' && (
                    <>
                      <p>• Must answer, no passing (15 seconds)</p>
                      <p>• +15 points for correct answer</p>
                      <p>• -5 points for wrong answer</p>
                      <p>• Creates pressure!</p>
                    </>
                  )}
                  {gameSession.roundType === 'buzzer' && (
                    <>
                      <p>• First to buzz gets to answer (10 seconds)</p>
                      <p>• +20 points for correct answer</p>
                      <p>• -10 points for wrong answer</p>
                      <p>• Next fastest can steal if wrong</p>
                    </>
                  )}
                  {gameSession.roundType === 'rapid-fire' && (
                    <>
                      <p>• 60 seconds per team</p>
                      <p>• 5 quick questions</p>
                      <p>• +10 points per correct answer</p>
                      <p>• No passing allowed</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Scoreboard */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Scoreboard compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
