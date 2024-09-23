import { create } from 'zustand';

const usePresenceStore = create(
  (set) => ({
    members: [],
    typingUsers:[],
    addMember: (member) =>
      set((state) => ({
        members: [...state.members, member],
      })),
    removeMember: (memberId) =>
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
      })),
    setMembers: (members) =>
      set(() => ({
        members,
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

export default usePresenceStore;
