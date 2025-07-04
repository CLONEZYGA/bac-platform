import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const users = {
  thuto: {
    id: 'thuto',
    name: 'Thuto Moleps',
    initials: 'TM',
    program: 'BSc (Hons) Computer Systems Engineering',
    group: 'CSE-2',
    avatar: null,
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
    avatar: null,
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
  },
};

const UserContext = createContext({
  user: users.thuto,
  setUser: (user) => {},
  refreshUser: (userId) => {},
  useMock: true,
  setUseMock: (val) => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(users.thuto);
  const [useMock, setUseMock] = useState(true); // Toggle for demo/real

  const loadUser = async (userId) => {
    if (useMock) {
      setUser(users[userId] || users.thuto);
    } else {
      const userData = await api.fetchUser(userId);
      setUser(userData);
    }
  };

  useEffect(() => {
    loadUser(user.id);
    // eslint-disable-next-line
  }, [useMock]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: loadUser, useMock, setUseMock }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 