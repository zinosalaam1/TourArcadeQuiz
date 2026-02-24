const API_BASE_URL = "https://tourarcade-quiz.onrender.com/api";

export const api = {
  async getTeams() {
    const res = await fetch(`${API_BASE_URL}/teams/`);
    return res.json();
  },

  async getSession() {
    const res = await fetch(`${API_BASE_URL}/session/active/`);
    return res.json();
  },

  async submitAnswer(payload: any) {
    const res = await fetch(`${API_BASE_URL}/answers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async startGame() {
    return fetch(`${API_BASE_URL}/session/start/`, {
      method: "POST",
    });
  },
};