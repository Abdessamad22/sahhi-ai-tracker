import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Save, Shuffle } from 'lucide-react';
import { WorkoutPlan, WorkoutGoal, DayPlan, DAYS_OF_WEEK, Exercise } from '@/types/workout';
import { generateWorkoutPlan } from '@/lib/workout-generator';

interface WeeklyPlanCreatorProps {
  goal: WorkoutGoal;
  onSave: (plan: WorkoutPlan) => void;
  onCancel: () => void;
}

export const WeeklyPlanCreator = ({ goal, onSave, onCancel }: WeeklyPlanCreatorProps) => {
  const [planName, setPlanName] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState<{[key: string]: DayPlan}>(() => 
    generateWorkoutPlan(goal)
  );

  const handleSave = () => {
    if (!planName.trim()) {
      alert('يرجى إدخال اسم الخطة');
      return;
    }

    const plan: WorkoutPlan = {
      id: Date.now().toString(),
      name: planName,
      goal,
      weeklySchedule,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(plan);
  };

  const handleRegeneratePlan = () => {
    setWeeklySchedule(generateWorkoutPlan(goal));
  };

  const toggleRestDay = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isRestDay: !prev[day].isRestDay,
        exercises: prev[day].isRestDay ? [] : prev[day].exercises
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plan-name">اسم الخطة</Label>
          <Input
            id="plan-name"
            placeholder="مثال: خطة بناء العضل - المبتدئين"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">الخطة الأسبوعية</h3>
            <p className="text-sm text-muted-foreground">
              يمكنك تعديل التمارين لاحقاً
            </p>
          </div>
          <Button variant="outline" onClick={handleRegeneratePlan} className="gap-2">
            <Shuffle className="h-4 w-4" />
            إعادة توليد
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayPlan = weeklySchedule[day];
          
          return (
            <Card key={day} className={`${dayPlan.isRestDay ? 'bg-muted/30' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{day}</CardTitle>
                    {dayPlan.isRestDay ? (
                      <Badge variant="secondary">يوم راحة</Badge>
                    ) : (
                      <Badge variant="default">
                        {dayPlan.exercises?.length || 0} تمرين
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rest-${day}`} className="text-sm">
                      يوم راحة
                    </Label>
                    <Switch
                      id={`rest-${day}`}
                      checked={dayPlan.isRestDay}
                      onCheckedChange={() => toggleRestDay(day)}
                    />
                  </div>
                </div>
                {dayPlan.focus && !dayPlan.isRestDay && (
                  <CardDescription>التركيز: {dayPlan.focus}</CardDescription>
                )}
              </CardHeader>
              
              {!dayPlan.isRestDay && dayPlan.exercises && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {dayPlan.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-md border">
                        <div>
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets && exercise.reps ? 
                              `${exercise.sets} مجموعات × ${exercise.reps} تكرار` :
                              exercise.duration ? `${exercise.duration} دقيقة` : ''
                            }
                          </p>
                        </div>
                        <Badge variant="outline">{exercise.muscle}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          حفظ الخطة
        </Button>
      </div>
    </div>
  );
};