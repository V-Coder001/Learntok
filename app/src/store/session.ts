import { create } from 'zustand';

import type { User } from '@/services/types';

// Lokaler Sitzungszustand (Onboarding, Login, Einstellungen). Server-Daten gehören in react-query.
interface SessionState {
  onboarded: boolean;
  user: User | null;
  /** Wochenziel in Minuten. */
  weeklyGoalMinutes: number;
  reminderEnabled: boolean;
  /** Letzter bekannter Pro-Status. Wird aus customerInfo gespeist, nie als einzige Quelle genutzt. */
  lastKnownPro: boolean;
  completeOnboarding: () => void;
  setUser: (user: User | null) => void;
  setWeeklyGoal: (minutes: number) => void;
  setReminder: (enabled: boolean) => void;
  setLastKnownPro: (isPro: boolean) => void;
}

export const useSession = create<SessionState>()((set) => ({
  onboarded: false,
  user: null,
  weeklyGoalMinutes: 120,
  reminderEnabled: true,
  lastKnownPro: false,
  completeOnboarding: () => set({ onboarded: true }),
  setUser: (user) => set({ user }),
  setWeeklyGoal: (weeklyGoalMinutes) => set({ weeklyGoalMinutes }),
  setReminder: (reminderEnabled) => set({ reminderEnabled }),
  setLastKnownPro: (lastKnownPro) => set({ lastKnownPro }),
}));
