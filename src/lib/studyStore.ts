import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, ProgressEntry, FocusSession, Achievement } from '@/types/study';

interface StudyStore {
  goals: Goal[];
  progressEntries: ProgressEntry[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'streak' | 'freezesAvailable'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  addProgress: (entry: Omit<ProgressEntry, 'id'>) => void;
  
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;
  
  unlockAchievement: (achievement: Omit<Achievement, 'id' | 'earnedAt'>) => void;
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      goals: [],
      progressEntries: [],
      focusSessions: [],
      achievements: [],

      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          streak: 0,
          freezesAvailable: 2,
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      addProgress: (entry) => {
        const newEntry: ProgressEntry = {
          ...entry,
          id: crypto.randomUUID(),
        };
        
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
          
          get().updateGoal(entry.goalId, {
            currentValue: updatedValue,
            streak: newStreak,
            lastUpdated: today,
          });
        }
        
        set((state) => ({
          progressEntries: [...state.progressEntries, newEntry],
        }));
      },

      addFocusSession: (session) => {
        const newSession: FocusSession = {
          ...session,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          focusSessions: [...state.focusSessions, newSession],
        }));
      },

      unlockAchievement: (achievement) => {
        const newAchievement: Achievement = {
          ...achievement,
          id: crypto.randomUUID(),
          earnedAt: new Date(),
        };
        set((state) => ({
          achievements: [...state.achievements, newAchievement],
        }));
      },
    }),
    {
      name: 'study-tracker-storage',
    }
  )
);
