import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Gamepad2, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="text-8xl">🎮</div>
              <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-8xl font-black mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
            TOUR ARCADE
          </h1>
          <h2 className="text-5xl font-black text-white mb-4 tracking-wider">
            QUIZ SHOWDOWN
          </h2>
          <p className="text-xl text-purple-300 mb-16 font-mono">
            ⚡ Quiz Show ⚡
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate('/admin-login')}
            className="group relative w-64 h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl font-black tracking-wider overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Shield className="w-8 h-8 mr-3 relative z-10" />
            <span className="relative z-10">ADMIN</span>
          </Button>

          <Button
            onClick={() => navigate('/team-join')}
            className="group relative w-64 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-2xl font-black tracking-wider overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-all"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Gamepad2 className="w-8 h-8 mr-3 relative z-10" />
            <span className="relative z-10">JOIN TEAM</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-purple-400 font-mono text-sm"
        >
          <p>ROUND 1: General Questions • ROUND 2: Pass The Mic</p>
          <p>ROUND 3: Buzzer Round • ROUND 4: Rapid Fire</p>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-purple-500/50" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-blue-500/50" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-blue-500/50" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-purple-500/50" />
    </div>
  );
}