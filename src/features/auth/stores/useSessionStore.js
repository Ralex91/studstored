import { create } from "zustand"

export const useSessionStore = create((set) => ({
  session: null,
  setSession: (newSession) => set({ session: newSession }),
}))
