export interface Goal {
  id: string;
  title: string;
  subject: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  createdAt: Date;
  color: string;
  dailyTarget?: number;
  streak: number;
  lastUpdated?: Date;
  freezesAvailable: number;
}

export interface ProgressEntry {
  id: string;
  goalId: string;
  date: Date;
  value: number;
  notes?: string;
}

export interface FocusSession {
  id: string;
  goalId?: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  type: 'streak' | 'completion' | 'focus' | 'special';
}
