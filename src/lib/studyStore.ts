import { create } from 'zustand';
import { Goal, ProgressEntry, FocusSession, Achievement } from '@/types/study';
import { v4 as uuidv4 } from 'uuid';
import {
  createGoal as dbCreateGoal,
  updateGoal as dbUpdateGoal,
  deleteGoal as dbDeleteGoal,
  createProgressEntry as dbCreateProgressEntry,
  createFocusSession as dbCreateFocusSession,
  createAchievement as dbCreateAchievement,
  loadUserData,
} from '@/lib/supabaseService';

interface StudyStore {
  goals: Goal[];
  progressEntries: ProgressEntry[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  user: { id: string; email: string; name: string } | null;
  loading: boolean;
  error: string | null;

  // Async actions
  loadData: () => Promise<void>;
  clearData: () => void;

  // Sync actions (local state updates)
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'streak' | 'freezesAvailable'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  addProgress: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>;

  addFocusSession: (session: Omit<FocusSession, 'id'>) => Promise<void>;

  unlockAchievement: (achievement: Omit<Achievement, 'id' | 'earnedAt'>) => Promise<void>;

  setUser: (user: { id: string; email: string; name: string } | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  goals: [],
  progressEntries: [],
  focusSessions: [],
  achievements: [],
  user: null,
  loading: false,
  error: null,

  loadData: async () => {
    const user = get().user;
    if (!user) {
      console.warn('loadData called without user');
      return;
    }

    set({ loading: true, error: null });
    try {
      console.log('Loading data for user:', user.id);
      const data = await loadUserData(user.id);
      console.log('Loaded data:', data);
      set({
        goals: data.goals,
        progressEntries: data.progressEntries,
        focusSessions: data.focusSessions,
        achievements: data.achievements,
        loading: false,
      });
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Failed to load user data:', error);
      set({ error: 'Failed to load data', loading: false });
      throw error; // Re-throw to let caller handle it
    }
  },

  clearData: () => {
    set({
      goals: [],
      progressEntries: [],
      focusSessions: [],
      achievements: [],
    });
  },

  addGoal: async (goal) => {
    const user = get().user;
    if (!user) throw new Error('User not authenticated');

    console.log('addGoal called with user:', user);
    console.log('addGoal called with goal data:', goal);

    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
      streak: 0,
      freezesAvailable: 2,
      userId: user.id,
    };

    console.log('New goal object created:', newGoal);

    // Update local state immediately
    set((state) => ({ goals: [...state.goals, newGoal] }));
    console.log('Local state updated with new goal');

    try {
      console.log('Calling dbCreateGoal...');
      await dbCreateGoal(newGoal);
      console.log('dbCreateGoal completed successfully');
    } catch (error) {
      console.error('Failed to save goal:', error);
      // Revert local state on error
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== newGoal.id),
        error: 'Failed to save goal',
      }));
      throw error; // Re-throw to let the component handle it
    }
  },

  updateGoal: async (id, updates) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;

    const updatedGoal = { ...goal, ...updates };

    // Update local state immediately
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? updatedGoal : goal
      ),
    }));

    try {
      await dbUpdateGoal(updatedGoal);
    } catch (error) {
      console.error('Failed to update goal:', error);
      // Revert local state on error
      set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? { ...goal, ...updates } : goal
        ),
        error: 'Failed to update goal',
      }));
    }
  },

  deleteGoal: async (id) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;

    // Update local state immediately
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));

    try {
      await dbDeleteGoal(id);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      // Revert local state on error
      set((state) => ({
        goals: [...state.goals, goal],
        error: 'Failed to delete goal',
      }));
    }
  },

  addProgress: async (entry) => {
    const user = get().user;
    if (!user) return;

    const newEntry: ProgressEntry = {
      ...entry,
      id: uuidv4(),
      userId: user.id,
    };

    // Update local state immediately
    set((state) => ({
      progressEntries: [...state.progressEntries, newEntry],
    }));

    // Update goal's current value and streak
    const goal = get().goals.find(g => g.id === entry.goalId);
    if (goal) {
      const updatedValue = goal.currentValue + entry.value;
      const today = new Date();
      const lastUpdate = goal.lastUpdated ? new Date(goal.lastUpdated) : null;

      let newStreak = goal.streak;
      if (lastUpdate) {
        const daysSinceLastUpdate = Math.floor(
          (today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastUpdate === 1) {
          newStreak += 1;
        } else if (daysSinceLastUpdate > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await get().updateGoal(entry.goalId, {
        currentValue: updatedValue,
        streak: newStreak,
        lastUpdated: today,
      });
    }

    try {
      await dbCreateProgressEntry(newEntry);
    } catch (error) {
      console.error('Failed to save progress entry:', error);
      // Revert local state on error
      set((state) => ({
        progressEntries: state.progressEntries.filter((e) => e.id !== newEntry.id),
        error: 'Failed to save progress entry',
      }));
    }
  },

  addFocusSession: async (session) => {
    const user = get().user;
    if (!user) return;

    const newSession: FocusSession = {
      ...session,
      id: uuidv4(),
      userId: user.id,
    };

    // Update local state immediately
    set((state) => ({
      focusSessions: [...state.focusSessions, newSession],
    }));

    try {
      await dbCreateFocusSession(newSession);
    } catch (error) {
      console.error('Failed to save focus session:', error);
      // Revert local state on error
      set((state) => ({
        focusSessions: state.focusSessions.filter((s) => s.id !== newSession.id),
        error: 'Failed to save focus session',
      }));
    }
  },

  unlockAchievement: async (achievement) => {
    const user = get().user;
    if (!user) return;

    const newAchievement: Achievement = {
      ...achievement,
      id: uuidv4(),
      earnedAt: new Date(),
      userId: user.id,
    };

    // Update local state immediately
    set((state) => ({
      achievements: [...state.achievements, newAchievement],
    }));

    try {
      await dbCreateAchievement(newAchievement);
    } catch (error) {
      console.error('Failed to save achievement:', error);
      // Revert local state on error
      set((state) => ({
        achievements: state.achievements.filter((a) => a.id !== newAchievement.id),
        error: 'Failed to save achievement',
      }));
    }
  },

  setUser: (user) => {
    set({ user });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
