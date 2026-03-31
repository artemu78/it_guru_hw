import { create } from 'zustand';
import type { IUser } from '../types/IUser';

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  
  setUser: (user: IUser | null, rememberMe: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  rememberMe: false,

  setUser: (user, rememberMe) => {
    if (user) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
      storage.setItem('rememberMe', JSON.stringify(rememberMe));
      set({ user, isAuthenticated: true, rememberMe });
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      sessionStorage.removeItem('user');
      set({ user: null, isAuthenticated: false, rememberMe: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, rememberMe: false });
  },

  initialize: () => {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const rememberMeStr = localStorage.getItem('rememberMe');
    const rememberMe = rememberMeStr ? JSON.parse(rememberMeStr) : false;

    if (localUser && rememberMe) {
      set({ user: JSON.parse(localUser), isAuthenticated: true, rememberMe: true });
    } else if (sessionUser) {
      set({ user: JSON.parse(sessionUser), isAuthenticated: true, rememberMe: false });
    }
  }
}));
