import { User } from "@/types/users";
import { create } from "zustand";

interface UserState {
  user: User | null;
  removeUser: () => void;
  setUser: (user: User) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  removeUser: () => set({ user: null }),
  setUser: (user: User) => set({ user }),
}));

export default useUserStore;
