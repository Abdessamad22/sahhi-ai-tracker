import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { WorkoutPlan, DAYS_OF_WEEK } from '@/types/workout';

interface WorkoutCalendarProps {
  workoutPlan: WorkoutPlan;
}

export const WorkoutCalendar = ({ workoutPlan }: WorkoutCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCurrentMonth = () => {
    return currentDate.toLocaleDateString('ar-SA', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDayWorkout = (date: Date) => {
    const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
    return workoutPlan.weeklySchedule[dayName];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            تقويم التمارين
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-medium text-lg px-4">
              {getCurrentMonth()}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2">
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
              <div key={day} className="text-center font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2"></div>;
              }

              const dayWorkout = getDayWorkout(date);
              const today = isToday(date);

              return (
                <div
                  key={index}
                  className={`p-2 min-h-[80px] border rounded-md transition-colors hover:bg-muted/50 ${
                    today ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="space-y-1">
                    <div className={`text-sm font-medium ${today ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </div>
                    
                    {dayWorkout && (
                      <div className="space-y-1">
                        {dayWorkout.isRestDay ? (
                          <Badge variant="secondary" className="text-xs">
                            راحة
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="default" className="text-xs">
                              {dayWorkout.exercises?.length || 0} تمرين
                            </Badge>
                            {dayWorkout.focus && (
                              <div className="text-xs text-muted-foreground truncate">
                                {dayWorkout.focus}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};