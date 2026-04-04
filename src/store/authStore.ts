import { create } from 'zustand';
import type { IUser } from '../types/IUser';

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  
  setUser: (user: IUser | null, rememberMe: boolean) => void;
  logout: () => void;
}

const getInitialState = () => {
  try {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const rememberMeStr = localStorage.getItem('rememberMe');
    const rememberMe = rememberMeStr ? JSON.parse(rememberMeStr) : false;

    if (localUser && rememberMe) {
      return { user: JSON.parse(localUser), isAuthenticated: true, rememberMe: true };
    } else if (sessionUser) {
      return { user: JSON.parse(sessionUser), isAuthenticated: true, rememberMe: false };
    }
  } catch (e) {
    console.error('Failed to parse auth state', e);
  }
  return { user: null, isAuthenticated: false, rememberMe: false };
};

export const useAuthStore = create<IAuthState>((set) => ({
  ...getInitialState(),

  setUser: (user, rememberMe) => {
    if (user) {
      if (rememberMe) {
        sessionStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', JSON.stringify(true));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        sessionStorage.setItem('user', JSON.stringify(user));
      }
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
  }
}));
