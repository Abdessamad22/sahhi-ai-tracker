export type WorkoutGoal = 'muscle-building' | 'weight-loss' | 'general-fitness' | 'flexibility';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets?: number;
  reps?: number;
  duration?: number; // in minutes for cardio
  restTime?: number; // in seconds
  notes?: string;
}

export interface DayPlan {
  isRestDay: boolean;
  exercises: Exercise[];
  focus?: string; // e.g., "صدر وثلاثية", "كارديو"
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: WorkoutGoal;
  weeklySchedule: {
    [key: string]: DayPlan; // day names as keys
  };
  createdAt: Date;
  updatedAt: Date;
}

export const WORKOUT_GOALS = {
  'muscle-building': 'زيادة العضل',
  'weight-loss': 'خسارة الوزن', 
  'general-fitness': 'لياقة عامة',
  'flexibility': 'مرونة'
} as const;

export const MUSCLE_GROUPS = [
  'صدر',
  'ظهر', 
  'أكتاف',
  'ذراعين',
  'أرجل',
  'بطن',
  'كارديو',
  'كامل الجسم'
] as const;

export const DAYS_OF_WEEK = [
  'الأحد',
  'الاثنين', 
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
] as const;