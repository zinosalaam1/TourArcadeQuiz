import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useGame } from "../contexts/GameContext";
import Scoreboard from "../components/Scoreboard";
import { Users, Play, Eye } from "lucide-react";
import { LogOut} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import QuestionManager from "../components/QuestionManager";
import { Check, X, Timer, RotateCcw, SkipForward, ChevronLeft, Plus, Minus } from "lucide-react";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

export default function AdminPanel() {
  const navigate = useNavigate();
  const {
    teams,
    questions,
    gameSession,
    refreshSession,
    refreshTeams,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const [customPoints, setCustomPoints] = useState(10);

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  if (!gameSession) return <div className="p-6">Loading session...</div>;

  if (!Array.isArray(teams) || !Array.isArray(questions)) {
  return <div className="p-6 text-white">Loading game data...</div>;
}

  const currentQuestion = Array.isArray(questions)
  ? questions.find(
      (q) => q.id === gameSession?.current_question_index
    )
  : undefined;

  // 🔥 Start Game
  const handleStartGame = async () => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/session/${gameSession.id}/start/`, {
      method: "POST",
    });
    await refreshSession();
    setLoading(false);
  };

  // 🔥 Next Question
  const handleNextQuestion = async () => {
    setLoading(true);
    await fetch(`${API_BASE_URL}/session/${gameSession.id}/next-question/`, {
      method: "POST",
    });
    await refreshSession();
    setLoading(false);
  };

  // 🔥 Set Active Team
  const handleSelectTeam = async (teamId: string) => {
    await fetch(`${API_BASE_URL}/session/${gameSession.id}/set-active-team/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_id: teamId }),
    });
    await refreshSession();
  };

  // 🔥 Mark Answer Result
  const handleScore = async (teamId: string, correct: boolean) => {
    await fetch(`${API_BASE_URL}/teams/${teamId}/score/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correct }),
    });

    await refreshTeams();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/");
  };

  const roundQuestions = questions ?? []

const handleStartTimer = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/start-timer/`, {
    method: "POST",
  });
  await refreshSession();
};

const stopTimer = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/stop-timer/`, {
    method: "POST",
  });
  await refreshSession();
};

const resetTimer = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/reset-timer/`, {
    method: "POST",
  });
  await refreshSession();
};

const handleCorrect = async () => {
  if (!gameSession.activeTeamId) return;

  await fetch(`${API_BASE_URL}/teams/${gameSession.activeTeamId}/score/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correct: true }),
  });

  await refreshTeams();
};

const handleWrong = async () => {
  if (!gameSession.activeTeamId) return;

  await fetch(`${API_BASE_URL}/teams/${gameSession.activeTeamId}/score/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correct: false }),
  });

  await refreshTeams();
};

const previousQuestion = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/previous-question/`, {
    method: "POST",
  });

  await refreshSession();
};

const updateTeamScore = async (teamId, points) => {
  await fetch(`${API_BASE_URL}/teams/${teamId}/update-score/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points }),
  });

  await refreshTeams();
};

const resetGame = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/reset/`, {
    method: "POST",
  });

  await refreshSession();
  await refreshTeams();
};

const setRound = async (round) => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/set-round/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ round }),
  });

  await refreshSession();
};

const revealQuestion = async () => {
  await fetch(`${API_BASE_URL}/session/${gameSession.id}/reveal/`, {
    method: "POST",
  });

  await refreshSession();
};



  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-purple-500/30 bg-black/40 backdrop-blur-sm">
          <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-wider">
                🎮 QUIZ MASTER CONTROL
              </h1>
              <p className="text-sm text-purple-400 font-mono">Admin Panel</p>
            </div>
            <div className="flex items-center gap-4">
              {!gameSession.gameStarted && (
                <Button
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-black"
                >
                  <Play className="w-5 h-5 mr-2" />
                  START QUIZ
                </Button>
              )}
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
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <Tabs defaultValue="game" className="space-y-6">
            <TabsList className="bg-purple-900/30 border border-purple-500/30">
              <TabsTrigger value="game" className="data-[state=active]:bg-purple-600">
                GAME CONTROL
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-purple-600">
                QUESTION MANAGER
              </TabsTrigger>
            </TabsList>

            <TabsContent value="game" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Game Control */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Round Selection */}
                  <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl">
                    <h3 className="text-xl font-black text-white mb-4">ROUND CONTROL</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((round) => (
                        <Button
                          key={round}
                          onClick={() => setRound(round)}
                          variant={gameSession.currentRound === round ? 'default' : 'outline'}
                          className={`font-black ${
                            gameSession.currentRound === round
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                              : 'border-purple-500/50 text-purple-300'
                          }`}
                        >
                          ROUND {round}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-purple-400 mt-3 font-mono text-center">
                      Current: Round {gameSession.currentRound} - {gameSession?.roundType?.toUpperCase() || ""}
                    </p>
                  </div>

                  {/* Question Display */}
                  <div className="p-8 bg-black/60 border-2 border-blue-500/50 rounded-xl min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-black text-blue-400">
                        QUESTION {(gameSession?.currentQuestionIndex ?? 0) + 1} /
                        {roundQuestions.length}
                      </h3>
                      {gameSession?.roundType === 'buzzer' && !gameSession.questionRevealed && (
                        <Button
                          onClick={revealQuestion}
                          className="bg-yellow-600 hover:bg-yellow-700 font-black"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          REVEAL (R)
                        </Button>
                      )}
                    </div>

                    {currentQuestion ? (
                      <div className="flex-1 flex flex-col">
                        {gameSession.roundType === 'buzzer' && !gameSession.questionRevealed ? (
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-4xl font-black text-white/30">QUESTION HIDDEN</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="text-3xl text-white font-bold leading-relaxed">
                                {currentQuestion.question}
                              </p>
                            </div>
                            <div className="mt-6 p-4 bg-green-600/20 border-2 border-green-500/50 rounded-lg">
                              <p className="text-sm text-green-400 font-mono mb-1">CORRECT ANSWER:</p>
                              <p className="text-xl text-white font-black">{currentQuestion.answer}</p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-2xl font-black text-white/30">
                          NO QUESTIONS FOR THIS ROUND
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Team Selection */}
                  <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/50 rounded-xl">
                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      SELECT ACTIVE TEAM
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(teams ?? []).map((team) => (
                        <Button
                          key={team.id}
                          onClick={() => handleSelectTeam(team.id)}
                          variant={gameSession.activeTeamId === team.id ? 'default' : 'outline'}
                          className={`font-black h-16 ${
                            gameSession.activeTeamId === team.id
                              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 animate-pulse'
                              : 'border-blue-500/50 text-blue-300'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{team.name.replace('Tour Arcade ', '')}</span>
                            <span className="text-xs opacity-60">Score: {team.score}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl">
                    <h3 className="text-xl font-black text-white mb-4">GAME ACTIONS</h3>
                    
                    {/* Timer Controls */}
                    <div className="mb-6 p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-purple-300 font-mono">TIMER</span>
                        <span className="text-4xl font-black text-white font-mono">
                          {gameSession?.timerSeconds ?? 0}s
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleStartTimer}
                          disabled={gameSession.isTimerRunning}
                          className="flex-1 bg-green-600 hover:bg-green-700 font-black"
                        >
                          <Timer className="w-5 h-5 mr-2" />
                          START
                        </Button>
                        <Button
                          onClick={stopTimer}
                          disabled={!gameSession.isTimerRunning}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700 font-black"
                        >
                          STOP
                        </Button>
                        <Button
                          onClick={resetTimer}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 font-black"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Answer Controls */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Button
                        onClick={handleCorrect}
                        disabled={!gameSession.activeTeamId}
                        className="h-16 bg-green-600 hover:bg-green-700 font-black text-xl"
                      >
                        <Check className="w-6 h-6 mr-2" />
                        CORRECT (C)
                      </Button>
                      <Button
                        onClick={handleWrong}
                        disabled={!gameSession.activeTeamId}
                        className="h-16 bg-red-600 hover:bg-red-700 font-black text-xl"
                      >
                        <X className="w-6 h-6 mr-2" />
                        WRONG (W)
                      </Button>
                    </div>

                    {/* Navigation */}
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={previousQuestion}
                        disabled={gameSession.currentQuestionIndex === 0}
                        variant="outline"
                        className="border-purple-500/50 text-purple-300"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        PREV
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 font-black"
                      >
                        <SkipForward className="w-5 h-5 mr-2" />
                        NEXT (N)
                      </Button>
                      <Button
                        onClick={resetGame}
                        variant="outline"
                        className="border-red-500/50 text-red-400"
                      >
                        <RotateCcw className="w-5 h-5" />
                        RESET
                      </Button>
                    </div>
                  </div>

                  {/* Manual Score Adjustment */}
                  <div className="p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-xl">
                    <h3 className="text-xl font-black text-white mb-4">MANUAL SCORE ADJUSTMENT</h3>
                    {(teams ?? []).map((team) => (
                      <div key={team.id} className="flex items-center gap-3 mb-3">
                        <span className="text-white font-mono flex-1">{team.name}</span>
                        <span className="text-2xl font-black text-white w-16 text-center">{team.score}</span>
                        <Button
                          size="sm"
                          onClick={() => updateTeamScore(team.id, -customPoints)}
                          variant="outline"
                          className="border-red-500/50 text-red-400"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateTeamScore(team.id, customPoints)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Scoreboard */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <Scoreboard />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions">
              <QuestionManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 p-4 bg-black/80 border border-purple-500/50 rounded-lg backdrop-blur-sm">
        <p className="text-xs text-purple-400 font-mono mb-2">KEYBOARD SHORTCUTS:</p>
        <div className="space-y-1 text-xs text-purple-300 font-mono">
          <div>C = Correct</div>
          <div>W = Wrong</div>
          <div>N = Next</div>
          <div>R = Reveal (Buzzer)</div>
        </div>
      </div>
    </div>
  );
}
