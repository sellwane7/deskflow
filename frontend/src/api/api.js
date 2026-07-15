import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });

export const createTicket = (ticket) => api.post('/tickets', ticket);

export const getTickets = () => api.get('/tickets');

export const updateTicketStatus = (id, status) => api.put(`/tickets/${id}`, { status });

export default api;
