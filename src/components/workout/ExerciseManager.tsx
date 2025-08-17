import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save } from 'lucide-react';
import { DayPlan, Exercise, MUSCLE_GROUPS } from '@/types/workout';

interface ExerciseManagerProps {
  day: string;
  dayPlan: DayPlan;
  onUpdate: (dayPlan: DayPlan) => void;
}

export const ExerciseManager = ({ day, dayPlan, onUpdate }: ExerciseManagerProps) => {
  const [isRestDay, setIsRestDay] = useState(dayPlan.isRestDay);
  const [exercises, setExercises] = useState<Exercise[]>(dayPlan.exercises || []);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    muscle: '',
    sets: 3,
    reps: 10
  });

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.muscle) {
      alert('يرجى ملء اسم التمرين والعضلة المستهدفة');
      return;
    }

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name!,
      muscle: newExercise.muscle!,
      sets: newExercise.sets || 3,
      reps: newExercise.reps || 10,
      duration: newExercise.duration,
      restTime: newExercise.restTime || 60
    };

    setExercises([...exercises, exercise]);
    setNewExercise({
      name: '',
      muscle: '',
      sets: 3,
      reps: 10
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const handleUpdateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    ));
  };

  const handleSave = () => {
    const updatedDayPlan: DayPlan = {
      isRestDay,
      exercises: isRestDay ? [] : exercises,
      focus: dayPlan.focus
    };
    onUpdate(updatedDayPlan);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">تعديل تمارين {day}</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="rest-day" className="text-sm">
            يوم راحة
          </Label>
          <Switch
            id="rest-day"
            checked={isRestDay}
            onCheckedChange={setIsRestDay}
          />
        </div>
      </div>

      {!isRestDay && (
        <>
          {/* Existing Exercises */}
          <div className="space-y-4">
            <h4 className="font-medium">التمارين الحالية</h4>
            {exercises.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                لا توجد تمارين مضافة بعد
              </p>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <Card key={exercise.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{exercise.name}</h5>
                            <Badge variant="outline">{exercise.muscle}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div>
                              <Label className="text-xs">المجموعات</Label>
                              <Input
                                type="number"
                                value={exercise.sets || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { 
                                  sets: parseInt(e.target.value) || 0 
                                })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">التكرارات</Label>
                              <Input
                                type="number"
                                value={exercise.reps || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { 
                                  reps: parseInt(e.target.value) || 0 
                                })}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">المدة (دقيقة)</Label>
                              <Input
                                type="number"
                                value={exercise.duration || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { 
                                  duration: parseInt(e.target.value) || undefined 
                                })}
                                className="h-8"
                                placeholder="اختياري"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">الراحة (ثانية)</Label>
                              <Input
                                type="number"
                                value={exercise.restTime || ''}
                                onChange={(e) => handleUpdateExercise(exercise.id, { 
                                  restTime: parseInt(e.target.value) || 60 
                                })}
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add New Exercise */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                إضافة تمرين جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم التمرين</Label>
                  <Input
                    value={newExercise.name || ''}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    placeholder="مثال: ضغط صدر بالبار"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العضلة المستهدفة</Label>
                  <Select 
                    value={newExercise.muscle || ''} 
                    onValueChange={(value) => setNewExercise({ ...newExercise, muscle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العضلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSCLE_GROUPS.map((muscle) => (
                        <SelectItem key={muscle} value={muscle}>
                          {muscle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>المجموعات</Label>
                  <Input
                    type="number"
                    value={newExercise.sets || ''}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>التكرارات</Label>
                  <Input
                    type="number"
                    value={newExercise.reps || ''}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button onClick={handleAddExercise} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                إضافة التمرين
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};
