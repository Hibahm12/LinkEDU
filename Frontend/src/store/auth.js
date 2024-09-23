import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      groupId: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      setGroup: (groupId) => set({ isAuthenticated: true, groupId }),

    }),
    {
      name: 'auth',
   // unique name for the persisted state in storage
      getStorage: () => sessionStorage, // (optional) by default it uses localStorage
    }
  )
);

export default useAuthStore;