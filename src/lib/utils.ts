
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toWesternNumerals } from "@/lib/number-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with commas
export function formatNumber(num: number): string {
  return toWesternNumerals(num.toLocaleString('en-US'));
}

// Round number to specific decimal places
export function roundToDecimals(num: number, decimals: number = 1): number {
  return Number(Math.round(parseFloat(num + 'e' + decimals)) + 'e-' + decimals);
}

// Format date to French friendly format with Western numerals
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const formatted = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);
  return toWesternNumerals(formatted);
}

// Calculate calories burned during exercise
export function calculateCaloriesBurned(
  weight: number, // weight in kg
  met: number, // Metabolic Equivalent of Task
  durationMinutes: number
): number {
  // Formula: calories = MET * weight in kg * duration in hours
  const durationHours = durationMinutes / 60;
  return met * weight * durationHours;
}

// Calculate minutes needed to burn calories
export function calculateMinutesToBurnCalories(
  calories: number,
  weight: number, // weight in kg
  met: number // Metabolic Equivalent of Task
): number {
  // Rearranged formula: minutes = (calories / (MET * weight)) * 60
  return (calories / (met * weight)) * 60;
}

// MET values for different activities
export const metValues = {
  walking: 3.5, // Walking 3 mph
  jogging: 7.0, // Jogging 5 mph
  running: 11.0, // Running 8 mph
  cycling: 8.0, // Cycling 12-14 mph
  swimming: 8.0, // Swimming laps
  jumpingRope: 10.0, // Jumping rope
  stairs: 8.0, // Stair climbing
  dancingAerobic: 7.3, // Aerobic dancing
};

// Activity level multipliers
export const activityMultipliers = {
  sedentary: { value: 1.2, label: "خامل (قليل أو معدوم التمارين)", description: "مستوى نشاط منخفض جدًا" },
  light: { value: 1.375, label: "خفيف (1-3 أيام/أسبوع)", description: "تمارين خفيفة" },
  moderate: { value: 1.55, label: "متوسط (3-5 أيام/أسبوع)", description: "تمارين متوسطة" },
  active: { value: 1.725, label: "نشط (6-7 أيام/أسبوع)", description: "تمارين مكثفة" },
  veryActive: { value: 1.9, label: "نشط جدًا", description: "تمارين شاقة جدًا ووظيفة بدنية" }
};
