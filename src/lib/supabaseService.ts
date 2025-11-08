import { supabase } from '@/integrations/supabase/client';
import { Goal, ProgressEntry, FocusSession, Achievement } from '@/types/study';
// import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Database to local type transformations
const transformDbGoalToLocal = (dbGoal: any): Goal => ({
  id: dbGoal.id,
  title: dbGoal.title,
  subject: dbGoal.subject,
  targetValue: dbGoal.target_value,
  currentValue: dbGoal.current_value,
  unit: dbGoal.unit,
  deadline: dbGoal.deadline ? new Date(dbGoal.deadline) : new Date(),
  createdAt: new Date(dbGoal.created_at || ''),
  color: dbGoal.color,
  dailyTarget: dbGoal.daily_target || undefined,
  streak: dbGoal.streak,
  lastUpdated: dbGoal.last_updated ? new Date(dbGoal.last_updated) : undefined,
  freezesAvailable: dbGoal.freezes_available,
  userId: dbGoal.user_id,
});

const transformLocalGoalToDb = (goal: Goal): any => ({
  id: goal.id,
  title: goal.title,
  subject: goal.subject,
  target_value: goal.targetValue,
  current_value: goal.currentValue,
  unit: goal.unit,
  deadline: goal.deadline.toISOString(),
  created_at: goal.createdAt.toISOString(),
  color: goal.color,
  daily_target: goal.dailyTarget,
  streak: goal.streak,
  last_updated: goal.lastUpdated?.toISOString(),
  freezes_available: goal.freezesAvailable,
  user_id: goal.userId,
  updated_at: new Date().toISOString(),
});

const transformDbProgressToLocal = (dbProgress: any): ProgressEntry => ({
  id: dbProgress.id,
  goalId: dbProgress.goal_id,
  date: new Date(dbProgress.date),
  value: dbProgress.value,
  notes: dbProgress.notes || undefined,
  userId: dbProgress.user_id,
});

const transformLocalProgressToDb = (progress: ProgressEntry): any => ({
  id: progress.id,
  goal_id: progress.goalId,
  date: progress.date.toISOString().split('T')[0],
  value: progress.value,
  notes: progress.notes,
  user_id: progress.userId,
});

const transformDbFocusSessionToLocal = (dbSession: any): FocusSession => ({
  id: dbSession.id,
  goalId: dbSession.goal_id || undefined,
  duration: dbSession.duration,
  startTime: new Date(dbSession.start_time),
  endTime: dbSession.end_time ? new Date(dbSession.end_time) : undefined,
  completed: dbSession.completed,
  userId: dbSession.user_id,
});

const transformLocalFocusSessionToDb = (session: FocusSession): any => ({
  id: session.id,
  goal_id: session.goalId,
  duration: session.duration,
  start_time: session.startTime.toISOString(),
  end_time: session.endTime?.toISOString(),
  completed: session.completed,
  user_id: session.userId,
});

const transformDbAchievementToLocal = (dbAchievement: any): Achievement => ({
  id: dbAchievement.id,
  title: dbAchievement.title,
  description: dbAchievement.description,
  icon: dbAchievement.icon,
  earnedAt: dbAchievement.earned_at ? new Date(dbAchievement.earned_at) : undefined,
  type: dbAchievement.type as 'streak' | 'completion' | 'focus' | 'special',
  userId: dbAchievement.user_id,
});

const transformLocalAchievementToDb = (achievement: Achievement): any => ({
  id: achievement.id,
  title: achievement.title,
  description: achievement.description,
  icon: achievement.icon,
  type: achievement.type,
  earned_at: achievement.earnedAt?.toISOString(),
  user_id: achievement.userId,
});

// Goals CRUD
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(transformDbGoalToLocal);
};

export const createGoal = async (goal: Goal): Promise<void> => {
  console.log('Creating goal in database:', goal);
  const dbGoal = transformLocalGoalToDb(goal);
  console.log('Transformed goal for DB:', dbGoal);

  const { error } = await supabase
    .from('goals')
    .insert(dbGoal);

  if (error) {
    console.error('Database error creating goal:', error);
    throw error;
  }

  console.log('Goal created successfully');
};

export const updateGoal = async (goal: Goal): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .update(transformLocalGoalToDb(goal))
    .eq('id', goal.id);

  if (error) throw error;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
};

// Progress Entries CRUD
export const getProgressEntries = async (userId: string): Promise<ProgressEntry[]> => {
  const { data, error } = await supabase
    .from('progress_entries')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(transformDbProgressToLocal);
};

export const createProgressEntry = async (entry: ProgressEntry): Promise<void> => {
  const { error } = await supabase
    .from('progress_entries')
    .insert(transformLocalProgressToDb(entry));

  if (error) throw error;
};

// Focus Sessions CRUD
export const getFocusSessions = async (userId: string): Promise<FocusSession[]> => {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(transformDbFocusSessionToLocal);
};

export const createFocusSession = async (session: FocusSession): Promise<void> => {
  const { error } = await supabase
    .from('focus_sessions')
    .insert(transformLocalFocusSessionToDb(session));

  if (error) throw error;
};

// Achievements CRUD
export const getAchievements = async (userId: string): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(transformDbAchievementToLocal);
};

export const createAchievement = async (achievement: Achievement): Promise<void> => {
  const { error } = await supabase
    .from('achievements')
    .insert(transformLocalAchievementToDb(achievement));

  if (error) throw error;
};

// Bulk data loading
export const loadUserData = async (userId: string) => {
  const [goals, progressEntries, focusSessions, achievements] = await Promise.all([
    getGoals(userId),
    getProgressEntries(userId),
    getFocusSessions(userId),
    getAchievements(userId),
  ]);

  return {
    goals,
    progressEntries,
    focusSessions,
    achievements,
  };
};
