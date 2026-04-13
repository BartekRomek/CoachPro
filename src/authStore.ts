import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface AuthState {
  users: User[];
  currentUser: User | null;
  parentAccessCode: string | null;
  register: (user: Omit<User, 'id'>) => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  loginAsParent: (code: string) => void;
  logoutParent: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      parentAccessCode: null,
      register: (user) => {
        const newUser = { ...user, id: `u_${Date.now()}` };
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser
        }));
      },
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      loginAsParent: (code) => set({ parentAccessCode: code }),
      logoutParent: () => set({ parentAccessCode: null })
    }),
    { name: 'coachpro-auth' }
  )
);
