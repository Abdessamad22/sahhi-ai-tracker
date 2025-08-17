import { WorkoutGoal, DayPlan, Exercise, DAYS_OF_WEEK } from '@/types/workout';

// Exercise database organized by muscle groups
interface ExerciseTemplate {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
}

const EXERCISE_DATABASE: { [key: string]: ExerciseTemplate[] } = {
  صدر: [
    { name: 'ضغط صدر بالبار', sets: 4, reps: 8 },
    { name: 'ضغط صدر بالدامبل', sets: 3, reps: 10 },
    { name: 'ضغط صدر مائل', sets: 3, reps: 10 },
    { name: 'فتح صدر بالدامبل', sets: 3, reps: 12 },
    { name: 'ضغط أرضي', sets: 3, reps: 15 }
  ],
  ظهر: [
    { name: 'سحب أرضي', sets: 4, reps: 8 },
    { name: 'سحب بالكابل', sets: 3, reps: 10 },
    { name: 'تجديف بالبار', sets: 3, reps: 10 },
    { name: 'تجديف بالدامبل', sets: 3, reps: 12 },
    { name: 'عقلة', sets: 3, reps: 8 }
  ],
  أكتاف: [
    { name: 'ضغط كتف بالبار', sets: 4, reps: 8 },
    { name: 'ضغط كتف بالدامبل', sets: 3, reps: 10 },
    { name: 'رفع جانبي', sets: 3, reps: 12 },
    { name: 'رفع أمامي', sets: 3, reps: 12 },
    { name: 'رفع خلفي', sets: 3, reps: 12 }
  ],
  ذراعين: [
    { name: 'ثني ذراع بالبار', sets: 3, reps: 10 },
    { name: 'ثني ذراع بالدامبل', sets: 3, reps: 12 },
    { name: 'ثني ذراع بالكابل', sets: 3, reps: 12 },
    { name: 'تمديد ذراع بالبار', sets: 3, reps: 10 },
    { name: 'تمديد ذراع بالدامبل', sets: 3, reps: 12 }
  ],
  أرجل: [
    { name: 'سكوات بالبار', sets: 4, reps: 10 },
    { name: 'ديد ليفت', sets: 4, reps: 8 },
    { name: 'رفع أرجل أمامي', sets: 3, reps: 12 },
    { name: 'رفع أرجل خلفي', sets: 3, reps: 12 },
    { name: 'رفع سمانة', sets: 4, reps: 15 }
  ],
  بطن: [
    { name: 'رفع أرجل معلق', sets: 3, reps: 12 },
    { name: 'كرانش', sets: 3, reps: 20 },
    { name: 'بلانك', duration: 3 },
    { name: 'رفع ركبة', sets: 3, reps: 15 },
    { name: 'التواء جانبي', sets: 3, reps: 20 }
  ],
  كارديو: [
    { name: 'جري', duration: 30 },
    { name: 'دراجة', duration: 25 },
    { name: 'مشي سريع', duration: 40 },
    { name: 'تجديف', duration: 20 },
    { name: 'سباحة', duration: 30 }
  ]
};

// Training splits based on goals
interface DayConfig {
  muscles?: string[];
  focus?: string;
  isRest?: boolean;
}

const TRAINING_SPLITS: { [key in WorkoutGoal]: { [day: string]: DayConfig } } = {
  'muscle-building': {
    'الأحد': { muscles: ['صدر', 'ذراعين'], focus: 'صدر وثلاثية' },
    'الاثنين': { muscles: ['ظهر', 'ذراعين'], focus: 'ظهر وبايسيبس' },
    'الثلاثاء': { muscles: ['كارديو'], focus: 'كارديو خفيف' },
    'الأربعاء': { muscles: ['أكتاف', 'بطن'], focus: 'أكتاف وبطن' },
    'الخميس': { muscles: ['أرجل'], focus: 'أرجل' },
    'الجمعة': { muscles: ['صدر', 'ذراعين'], focus: 'صدر وثلاثية' },
    'السبت': { isRest: true }
  },
  'weight-loss': {
    'الأحد': { muscles: ['كارديو', 'بطن'], focus: 'كارديو وبطن' },
    'الاثنين': { muscles: ['كامل الجسم'], focus: 'تمارين مركبة' },
    'الثلاثاء': { muscles: ['كارديو'], focus: 'كارديو متوسط' },
    'الأربعاء': { muscles: ['أرجل', 'بطن'], focus: 'أرجل وبطن' },
    'الخميس': { muscles: ['كارديو'], focus: 'كارديو عالي' },
    'الجمعة': { muscles: ['صدر', 'ظهر'], focus: 'جزء علوي' },
    'السبت': { isRest: true }
  },
  'general-fitness': {
    'الأحد': { muscles: ['صدر', 'ذراعين'], focus: 'جزء علوي' },
    'الاثنين': { muscles: ['كارديو'], focus: 'كارديو' },
    'الثلاثاء': { muscles: ['أرجل', 'بطن'], focus: 'جزء سفلي' },
    'الأربعاء': { isRest: true },
    'الخميس': { muscles: ['ظهر', 'أكتاف'], focus: 'ظهر وأكتاف' },
    'الجمعة': { muscles: ['كارديو', 'بطن'], focus: 'كارديو وبطن' },
    'السبت': { isRest: true }
  },
  'flexibility': {
    'الأحد': { muscles: ['مرونة'], focus: 'يوغا صباحية' },
    'الاثنين': { muscles: ['مرونة'], focus: 'تمدد كامل' },
    'الثلاثاء': { muscles: ['مرونة'], focus: 'مرونة العمود الفقري' },
    'الأربعاء': { isRest: true },
    'الخميس': { muscles: ['مرونة'], focus: 'مرونة الأرجل' },
    'الجمعة': { muscles: ['مرونة'], focus: 'يوغا مسائية' },
    'السبت': { muscles: ['مرونة'], focus: 'تمدد واسترخاء' }
  }
};

// Flexibility exercises
const FLEXIBILITY_EXERCISES: ExerciseTemplate[] = [
  { name: 'تمدد الرقبة', duration: 2 },
  { name: 'تمدد الكتفين', duration: 3 },
  { name: 'تمدد العمود الفقري', duration: 5 },
  { name: 'تمدد الوركين', duration: 4 },
  { name: 'تمدد عضلة الساق الخلفية', duration: 3 },
  { name: 'تمدد عضلة الساق الأمامية', duration: 3 },
  { name: 'وضعية الكوبرا', duration: 3 },
  { name: 'وضعية الطفل', duration: 5 }
];

function getRandomExercises(muscle: string, count: number = 3): Exercise[] {
  if (muscle === 'مرونة') {
    return FLEXIBILITY_EXERCISES
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((ex, index) => ({
        id: `${muscle}-${index}`,
        name: ex.name,
        muscle: 'مرونة',
        duration: ex.duration,
        sets: 1,
        reps: 1
      }));
  }

  if (muscle === 'كامل الجسم') {
    // Mix exercises from different muscle groups
    const allExercises = [
      ...EXERCISE_DATABASE.صدر.slice(0, 1),
      ...EXERCISE_DATABASE.ظهر.slice(0, 1),
      ...EXERCISE_DATABASE.أرجل.slice(0, 1),
      ...EXERCISE_DATABASE.بطن.slice(0, 1)
    ];
    
    return allExercises.map((ex, index) => ({
      id: `mixed-${index}`,
      name: ex.name,
      muscle: 'كامل الجسم',
        sets: ex.sets || 1,
        reps: ex.reps || 1,
        duration: ex.duration
    }));
  }

  const exercises = EXERCISE_DATABASE[muscle as keyof typeof EXERCISE_DATABASE] || [];
  
  return exercises
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((ex, index) => ({
      id: `${muscle}-${index}`,
      name: ex.name,
      muscle,
      sets: ex.sets || 1,
      reps: ex.reps || 1,
      duration: ex.duration
    }));
}

export function generateWorkoutPlan(goal: WorkoutGoal): { [key: string]: DayPlan } {
  const split = TRAINING_SPLITS[goal];
  const weeklySchedule: { [key: string]: DayPlan } = {};

  DAYS_OF_WEEK.forEach(day => {
    const dayConfig = split[day];
    
    if (dayConfig.isRest) {
      weeklySchedule[day] = {
        isRestDay: true,
        exercises: []
      };
    } else {
      const exercises: Exercise[] = [];
      
      if (dayConfig.muscles) {
        dayConfig.muscles.forEach(muscle => {
          const muscleExercises = getRandomExercises(muscle, muscle === 'كارديو' ? 2 : 3);
          exercises.push(...muscleExercises);
        });
      }

      weeklySchedule[day] = {
        isRestDay: false,
        exercises,
        focus: dayConfig.focus
      };
    }
  });

  return weeklySchedule;
}