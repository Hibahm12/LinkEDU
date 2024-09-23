import { create } from 'zustand';

const useOnlineUsersStore = create(
  (set) => ({
    users: [],
    typingUsers:[],
    addUser: (user) =>
      set((state) => ({
        users: [...state.users, user],
      })),
    removeUser: (userId) =>
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      })),
    setUsers: (users) =>
      set(() => ({
        users,
      })),
    startTyping: (username) =>
        set((state) => ({
          typingUsers: state.typingUsers.includes(username)
            ? state.typingUsers // Username is already typing, do not add again
            : [...state.typingUsers, username],
        })),
    stopTyping: (username) =>
        set((state) => ({
          typingUsers: state.typingUsers.filter((u) => u !== username),
        })),
  })
);

export default useOnlineUsersStore;
