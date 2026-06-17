import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders() {
  const token = localStorage.getItem('ls_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(name, email, password) {
  const { data } = await axios.post(`${BASE}/auth/register`, { name, email, password });
  return data;
}

export async function login(email, password) {
  const { data } = await axios.post(`${BASE}/auth/login`, { email, password });
  return data;
}

export async function getMe() {
  const { data } = await axios.get(`${BASE}/auth/me`, { headers: authHeaders() });
  return data.user;
}

export async function updateMe(updates) {
  const { data } = await axios.patch(`${BASE}/auth/me`, updates, { headers: authHeaders() });
  return data.user;
}
