import { IUser } from '@/interfaces/IUser';
import { decodeJwt } from 'jose';
import { create } from 'zustand';

export type useAuthType = {
  user: IUser | null,
  token: string | null,
  setUser: (token: string) => void,
  getToken: () => string | null,
  clearUser: () => void
}


const useAuth = create<useAuthType>((set, get) => ({
  user: null,
  token: null,
  
  setUser: (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = decodeJwt(token);

      const user: IUser = {
        name: decoded.name as string
      }

      set({ token, user });
    } catch (error) {
      console.error('Invalid token format', error);
      set({ token, user: null });
    }
  },

  getToken: () => {
    const token = localStorage.getItem('token');
    if(token) {
      get().setUser(token);
    }
    return token
  },
  
  clearUser: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useAuth;
