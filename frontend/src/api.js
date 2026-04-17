import axios from 'axios';

export const USER_ID = "demo";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'X-User-Id': USER_ID,
  }
});

export const connectGmail = async () => {
    try {
      const res = await api.get('/gmail/oauth/start');
      if (res.data.auth_url) {
        window.open(res.data.auth_url, '_blank', 'width=600,height=700');
      }
    } catch (err) {
      console.error("Failed to start OAuth:", err);
      alert("Failed to start Connection flow. Please check console.");
    }
};
