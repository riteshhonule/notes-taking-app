import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch {
        // Token parsing failed, continue without token
      }
    }
  }
  return config;
});

export const authAPI = {
  signup: (userData: {
    user_name: string;
    user_email: string;
    password: string;
  }) => api.post('/auth/signup', userData),
  signin: (credentials: { user_email: string; password: string }) =>
    api.post('/auth/signin', credentials),
};

export const notesAPI = {
  getAll: () => api.get('/notes'),
  getOne: (id: string) => api.get(`/notes/${id}`),
  create: (noteData: { note_title: string; note_content: string }) =>
    api.post('/notes', noteData),
  update: (id: string, noteData: { note_title: string; note_content: string }) =>
    api.put(`/notes/${id}`, noteData),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
