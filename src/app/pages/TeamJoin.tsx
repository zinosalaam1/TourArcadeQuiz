import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

export default function TeamJoin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/teams/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      if (!res.ok) {
        throw new Error("Invalid team code");
      }

      const data = await res.json();

      // Store auth session
      sessionStorage.setItem(`teamAuth_${data.team_id}`, "true");
      sessionStorage.setItem("teamId", data.team_id);

      navigate(`/team/${data.team_id}`);
    } catch (err) {
      setError("Invalid team code");
      setCode("");
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        className="absolute top-8 left-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-center text-white mb-2 tracking-wider">
            JOIN YOUR TEAM
          </h2>
          <p className="text-center text-blue-300 mb-8 font-mono text-sm">
            Enter Your Team Code
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="ARCADE-X-2024"
                className="w-full h-14 bg-black/40 border-2 border-blue-500/50 text-white text-center text-xl font-mono tracking-widest placeholder:text-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 uppercase"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 text-center font-mono"
                >
                  ⚠ {error}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xl font-black tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all"
            >
              ENTER GAME
            </Button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
