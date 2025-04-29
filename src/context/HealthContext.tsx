
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our context
type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

interface UserInfo {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
}

interface BodyMeasurement {
  id: string;
  date: string;
  neck: number;
  shoulders: number;
  chest: number;
  rightArm: number;
  leftArm: number;
  abdomen: number;
  waist: number;
  hips: number;
  rightThigh: number;
  leftThigh: number;
  rightCalf: number;
  leftCalf: number;
}

interface HealthContextType {
  userInfo: UserInfo;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  bodyMeasurements: BodyMeasurement[];
  addBodyMeasurement: (measurement: Omit<BodyMeasurement, 'id' | 'date'>) => void;
  deleteBodyMeasurement: (id: string) => void;
  bmr: number;
  tdee: number;
}

// Default values
const defaultUserInfo: UserInfo = {
  age: 30,
  gender: 'male',
  weight: 70,
  height: 170,
  activityLevel: 'moderate',
};

// Create context
const HealthContext = createContext<HealthContextType | undefined>(undefined);

// Provider component
export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : defaultUserInfo;
  });
  
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('bodyMeasurements');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = (info: UserInfo): number => {
    if (info.gender === 'male') {
      return 10 * info.weight + 6.25 * info.height - 5 * info.age + 5;
    } else {
      return 10 * info.weight + 6.25 * info.height - 5 * info.age - 161;
    }
  };
  
  // Calculate TDEE
  const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,         // Light exercise 1-3 days/week
      moderate: 1.55,       // Moderate exercise 3-5 days/week
      active: 1.725,        // Hard exercise 6-7 days/week
      veryActive: 1.9       // Very hard exercise & physical job
    };
    
    return bmr * activityMultipliers[activityLevel];
  };
  
  const bmr = calculateBMR(userInfo);
  const tdee = calculateTDEE(bmr, userInfo.activityLevel);
  
  // Update user info
  const updateUserInfo = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
  };
  
  // Add new body measurement
  const addBodyMeasurement = (measurement: Omit<BodyMeasurement, 'id' | 'date'>) => {
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    setBodyMeasurements(prev => [newMeasurement, ...prev]);
  };
  
  // Delete body measurement
  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(prev => prev.filter(m => m.id !== id));
  };
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);
  
  useEffect(() => {
    localStorage.setItem('bodyMeasurements', JSON.stringify(bodyMeasurements));
  }, [bodyMeasurements]);
  
  return (
    <HealthContext.Provider
      value={{
        userInfo,
        updateUserInfo,
        bodyMeasurements,
        addBodyMeasurement,
        deleteBodyMeasurement,
        bmr,
        tdee,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

// Custom hook for using the context
export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
