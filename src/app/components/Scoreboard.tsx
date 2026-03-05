import { useEffect } from "react";
import { motion } from "motion/react";
import { useGame } from "../contexts/GameContext";
import { Trophy, Clock } from "lucide-react";

interface ScoreboardProps {
  compact?: boolean;
}

export default function Scoreboard({ compact = false }: ScoreboardProps) {
  const { teams, gameSession, refreshTeams, refreshSession } = useGame();

  // 🔥 Auto refresh every 5 seconds (temporary until WebSocket phase)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTeams();
      refreshSession();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshTeams, refreshSession]);

  const sortedTeams = [...(teams ?? [])].sort((a, b) => b.score - a.score);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answering":
        return "border-yellow-500 bg-yellow-500/10";
      case "locked":
        return "border-red-500 bg-red-500/10";
      case "timeout":
        return "border-gray-500 bg-gray-500/10";
      case "buzzed":
        return "border-green-500 bg-green-500/10";
      default:
        return "border-purple-500/50 bg-purple-900/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "answering":
        return "⚡ ANSWERING";
      case "locked":
        return "🔒 LOCKED";
      case "timeout":
        return "⏱ TIMEOUT";
      case "buzzed":
        return "🔔 BUZZED";
      default:
        return "⏳ WAITING";
    }
  };

  if (!gameSession) {
    return <div className="p-4 text-white">Loading scoreboard...</div>;
  }

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {sortedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-3 rounded-xl border-2 ${getStatusColor(
              team.status
            )} backdrop-blur-sm transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">
                  {team.name}
                </p>
                <p className="text-xs text-purple-400 font-mono">
                  {getStatusText(team.status)}
                </p>
              </div>
              <div className="text-3xl font-black text-white ml-2">
                {team.score}
              </div>
            </div>

            {index === 0 && team.score > 0 && (
              <Trophy className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
            )}
          </motion.div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black text-white tracking-wider flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          SCOREBOARD
        </h2>
        {gameSession.isTimerRunning && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border-2 border-red-500 rounded-lg">
            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-2xl font-black text-red-400 font-mono">
              {gameSession?.timerSeconds ?? 0}s
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sortedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl border-2 ${getStatusColor(team.status)} backdrop-blur-sm transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl font-black text-white/30">#{index + 1}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white tracking-wide">{team.name}</h3>
                  <p className="text-sm text-purple-400 font-mono mt-1">{getStatusText(team.status)}</p>
                </div>
              </div>
              <div className="text-6xl font-black text-white">{team.score}</div>
            </div>
            
            {index === 0 && team.score > 0 && (
              <div className="absolute -top-3 -right-3">
                <div className="relative">
                  <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
                  <div className="absolute inset-0 w-12 h-12 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
                </div>
              </div>
            )}

            {team.status === 'answering' && (
              <div className="absolute inset-0 rounded-2xl bg-yellow-500/10 animate-pulse pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
