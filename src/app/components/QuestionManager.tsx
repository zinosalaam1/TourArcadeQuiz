import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

interface Question {
  id: string;
  round: number;
  question: string;
  answer: string;
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    round: 1,
    question: "",
    answer: "",
  });

  // 🔥 Fetch Questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 🔥 Add Question
  const handleAdd = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/questions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add question");

      await fetchQuestions();
      setFormData({ round: 1, question: "", answer: "" });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🔥 Update Question
  const handleUpdate = async (id: string) => {
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update question");

      await fetchQuestions();
      setEditingId(null);
      setFormData({ round: 1, question: "", answer: "" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🔥 Delete Question
  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete question");

      await fetchQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (question: Question) => {
    setEditingId(question.id);
    setFormData({
      round: question.round,
      question: question.question,
      answer: question.answer,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ round: 1, question: "", answer: "" });
  };

  const getRoundName = (round: number) => {
    switch (round) {
      case 1:
        return "General Questions";
      case 2:
        return "Pass The Mic";
      case 3:
        return "Buzzer Round";
      case 4:
        return "Rapid Fire";
      default:
        return `Round ${round}`;
    }
  };

  const questionsByRound = [1, 2, 3, 4].map((round) => ({
    round,
    name: getRoundName(round),
    questions: questions.filter((q) => q.round === round),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white tracking-wider">QUESTION BANK</h2>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-black"
        >
          <Plus className="w-5 h-5 mr-2" />
          ADD QUESTION
        </Button>
      </div>

      {/* Demo Note */}
      <div className="p-4 bg-blue-600/10 border-2 border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-300 font-mono">
          ℹ️ Sample questions are pre-loaded for demo. You can add, edit, or delete any questions.
        </p>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl"
        >
          <h3 className="text-xl font-black text-white mb-4">
            {isAdding ? 'ADD NEW QUESTION' : 'EDIT QUESTION'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-purple-300 font-mono mb-2 block">ROUND</label>
              <Select
                value={formData.round.toString()}
                onValueChange={(value) => setFormData({ ...formData, round: parseInt(value) })}
              >
                <SelectTrigger className="bg-black/40 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Round 1 - General Questions</SelectItem>
                  <SelectItem value="2">Round 2 - Pass The Mic</SelectItem>
                  <SelectItem value="3">Round 3 - Buzzer Round</SelectItem>
                  <SelectItem value="4">Round 4 - Rapid Fire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-purple-300 font-mono mb-2 block">QUESTION</label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question..."
                className="bg-black/40 border-purple-500/50 text-white min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-purple-300 font-mono mb-2 block">ANSWER</label>
              <Input
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the correct answer..."
                className="bg-black/40 border-purple-500/50 text-white"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-5 h-5 mr-2" />
                {editingId ? 'UPDATE' : 'ADD'}
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <X className="w-5 h-5 mr-2" />
                CANCEL
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Questions by Round */}
      <div className="space-y-6">
        {questionsByRound.map((roundData) => (
          <div key={roundData.round}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-black text-purple-400">
                ROUND {roundData.round}: {roundData.name}
              </h3>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300 font-mono">
                {roundData.questions.length} questions
              </span>
            </div>

            {roundData.questions.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-purple-500/30 rounded-xl text-center text-purple-400/60 font-mono">
                No questions added for this round yet
              </div>
            ) : (
              <div className="space-y-3">
                {roundData.questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-black/40 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl font-black text-white/30">#{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-2">{question.question}</p>
                        <p className="text-sm text-green-400 font-mono">
                          ✓ Answer: {question.answer}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(question)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteQuestion(question.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}