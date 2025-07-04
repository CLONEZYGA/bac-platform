const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Mock data for Thuto and Amy
const users = {
  thuto: {
    id: 'thuto',
    name: 'Thuto Moleps',
    initials: 'TM',
    program: 'BSc (Hons) Computer Systems Engineering',
    group: 'CSE-2',
    notifications: [
      { id: '1', title: 'Welcome Thuto!', description: 'Your semester starts soon.', date: '2024-07-01' },
      { id: '2', title: 'Exam Reminder', description: 'Maths exam on 2024-07-10.', date: '2024-07-05' },
    ],
    classes: [
      { id: '1', subject: 'DM-Discrete Mathematics', instructor: 'Dr. Smith', time: 'Mon 10:00-12:00' },
      { id: '2', subject: 'CS-Computer Science', instructor: 'Prof. Lee', time: 'Wed 14:00-16:00' },
    ],
    lessons: [
      { id: '1', name: 'DM-Discrete Mathematics', week: 'Week 1' },
      { id: '2', name: 'CS-Computer Science', week: 'Week 2' },
    ],
  },
  amy: {
    id: 'amy',
    name: 'Amy Mosdada',
    initials: 'AM',
    program: 'BSc (Hons) Information Technology',
    group: 'IT-1',
    notifications: [
      { id: '1', title: 'Welcome Amy!', description: 'Orientation is on 2024-07-02.', date: '2024-07-01' },
      { id: '2', title: 'Assignment Due', description: 'Submit your project by 2024-07-15.', date: '2024-07-10' },
    ],
    classes: [
      { id: '1', subject: 'IT Fundamentals', instructor: 'Dr. Adams', time: 'Tue 09:00-11:00' },
      { id: '2', subject: 'Web Development', instructor: 'Ms. Green', time: 'Thu 13:00-15:00' },
    ],
    lessons: [
      { id: '1', name: 'IT Fundamentals', week: 'Week 1' },
      { id: '2', name: 'Web Development', week: 'Week 2' },
    ],
  }
};

app.get('/api/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
});

app.get('/api/users/:id/notifications', (req, res) => {
  const user = users[req.params.id];
  if (user) res.json(user.notifications);
  else res.status(404).json({ error: 'User not found' });
});

app.get('/api/users/:id/classes', (req, res) => {
  const user = users[req.params.id];
  if (user) res.json(user.classes);
  else res.status(404).json({ error: 'User not found' });
});

app.get('/api/users/:id/lessons', (req, res) => {
  const user = users[req.params.id];
  if (user) res.json(user.lessons);
  else res.status(404).json({ error: 'User not found' });
});

app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  if (Object.values(users).find(u => u.email === email)) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }
  const id = email.split('@')[0];
  users[id] = {
    id,
    name,
    email,
    password,
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase(),
    group: 'NEW',
    notifications: [],
    classes: [],
    lessons: [],
  };
  res.json({ success: true, userId: id });
});

app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const user = Object.values(users).find(u => u.email === email);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  user.password = newPassword;
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}/api`));