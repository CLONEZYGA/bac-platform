import axios from 'axios';

const API_BASE = 'https://your-backend-api.com/api'; // Replace with your backend URL

export async function fetchUser(userId) {
  const res = await axios.get(`${API_BASE}/users/${userId}`);
  return res.data;
}

export async function fetchUserDocuments(userId) {
  const res = await axios.get(`${API_BASE}/users/${userId}/documents`);
  return res.data;
}

export async function fetchUserApplicationStatus(userId) {
  const res = await axios.get(`${API_BASE}/users/${userId}/application-status`);
  return res.data;
}

export async function fetchUserSponsorships(userId) {
  const res = await axios.get(`${API_BASE}/users/${userId}/sponsorships`);
  return res.data;
}

export async function fetchUserNotifications(userId) {
  const res = await axios.get(`${API_BASE}/users/${userId}/notifications`);
  return res.data;
} 