import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

export default function AdminLogin() {
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
      const res = await fetch(`${API_BASE_URL}/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error("Invalid admin code");
      }

      const data = await res.json();

      // Store session token (or simple flag)
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (err) {
      setError("Invalid admin code");
      setCode("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        className="absolute top-8 left-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
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
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)]">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-black text-center text-white mb-2 tracking-wider">
            ADMIN ACCESS
          </h2>
          <p className="text-center text-purple-300 mb-8 font-mono text-sm">
            Enter Quiz Master Code
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="ENTER CODE"
                className="w-full h-14 bg-black/40 border-2 border-purple-500/50 text-white text-center text-xl font-mono tracking-widest placeholder:text-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50"
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
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-black tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all"
            >
              ENTER CONTROL ROOM
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <p className="text-xs text-purple-400/60 text-center font-mono">
              Default Code: QUIZ-MASTER-2024
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
