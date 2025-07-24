import { io as socketIOClient } from 'socket.io-client';
import axios from 'axios';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3001';
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001/api';
let socket = null;

export interface Application {
  id: string;
  studentName: string;
  email: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedDate: string;
  documents: string[];
}

export async function fetchApplications(token: string): Promise<Application[]> {
  const res = await axios.get(`${API_BASE}/applications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function approveApplication(appId: string, token: string) {
  return axios.post(`${API_BASE}/applications/${appId}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function rejectApplication(appId: string, token: string) {
  return axios.post(`${API_BASE}/applications/${appId}/reject`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export function connectSocket(userId: string) {
  if (!socket) {
    socket = socketIOClient(SOCKET_URL);
    socket.on('connect', () => {
      socket.emit('join', userId);
    });
  }
  return socket;
}

export function emitToUser(userId: string, event: string, data: any) {
  // For demo only: in real use, backend emits events
  if (socket) {
    socket.emit('toUser', { userId, event, data });
  }
} 