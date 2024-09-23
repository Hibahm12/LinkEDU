import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useActiveGroup = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth', // unique name for the persisted state in storage
      getStorage: () => sessionStorage, // (optional) by default it uses localStorage
    }
  )
);

export default useActiveGroup;