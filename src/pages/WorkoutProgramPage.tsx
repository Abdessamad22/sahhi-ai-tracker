import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, Target, Edit3, Trash2, Dumbbell } from 'lucide-react';
import { GoalSelector } from '@/components/workout/GoalSelector';
import { WeeklyPlanCreator } from '@/components/workout/WeeklyPlanCreator';
import { ExerciseManager } from '@/components/workout/ExerciseManager';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WorkoutPlan, WorkoutGoal } from '@/types/workout';

const WorkoutProgramPage = () => {
  const [workoutPlans, setWorkoutPlans] = useLocalStorage<WorkoutPlan[]>('workout-plans', []);
  const [selectedGoal, setSelectedGoal] = useState<WorkoutGoal | null>(null);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [editingDay, setEditingDay] = useState<string | null>(null);

  useEffect(() => {
    if (workoutPlans.length > 0 && !activePlan) {
      setActivePlan(workoutPlans[0]);
    }
  }, [workoutPlans, activePlan]);

  const handleCreatePlan = (goal: WorkoutGoal) => {
    setSelectedGoal(goal);
    setShowCreatePlan(true);
  };

  const handleSavePlan = (plan: WorkoutPlan) => {
    const newPlans = [...workoutPlans, plan];
    setWorkoutPlans(newPlans);
    setActivePlan(plan);
    setShowCreatePlan(false);
    setSelectedGoal(null);
  };

  const handleDeletePlan = (planId: string) => {
    const newPlans = workoutPlans.filter(plan => plan.id !== planId);
    setWorkoutPlans(newPlans);
    if (activePlan?.id === planId) {
      setActivePlan(newPlans[0] || null);
    }
  };

  const handleUpdatePlan = (updatedPlan: WorkoutPlan) => {
    const newPlans = workoutPlans.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setWorkoutPlans(newPlans);
    setActivePlan(updatedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              برنامج التمرين الأسبوعي
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            أنشئ وخصص برنامج تمرين أسبوعي يناسب أهدافك الصحية واللياقية
          </p>
        </div>

        {/* Goal Selection */}
        {workoutPlans.length === 0 ? (
          <GoalSelector onSelectGoal={handleCreatePlan} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Plans Sidebar */}
            <div className="lg:w-1/3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">خططي</h2>
                <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      خطة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>إنشاء خطة تمرين جديدة</DialogTitle>
                    </DialogHeader>
                    {!selectedGoal ? (
                      <GoalSelector onSelectGoal={setSelectedGoal} />
                    ) : (
                      <WeeklyPlanCreator 
                        goal={selectedGoal}
                        onSave={handleSavePlan}
                        onCancel={() => {
                          setShowCreatePlan(false);
                          setSelectedGoal(null);
                        }}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {workoutPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activePlan?.id === plan.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActivePlan(plan)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlan(plan.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">{plan.goal}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/3">
              {activePlan && (
                <Tabs defaultValue="weekly" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="weekly" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      الخطة الأسبوعية
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      التقويم
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="weekly" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{activePlan.name}</CardTitle>
                            <CardDescription>
                              الهدف: {activePlan.goal}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Target className="h-3 w-3" />
                            {activePlan.goal}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {Object.entries(activePlan.weeklySchedule).map(([day, dayPlan]) => (
                            <Card key={day} className="border border-border/50">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{day}</h3>
                                    {dayPlan.isRestDay ? (
                                      <Badge variant="secondary">يوم راحة</Badge>
                                    ) : (
                                      <Badge variant="default">
                                        {dayPlan.exercises?.length || 0} تمرين
                                      </Badge>
                                    )}
                                  </div>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Edit3 className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>تعديل تمارين {day}</DialogTitle>
                                      </DialogHeader>
                                      <ExerciseManager
                                        day={day}
                                        dayPlan={dayPlan}
                                        onUpdate={(updatedDayPlan) => {
                                          const updatedPlan = {
                                            ...activePlan,
                                            weeklySchedule: {
                                              ...activePlan.weeklySchedule,
                                              [day]: updatedDayPlan
                                            }
                                          };
                                          handleUpdatePlan(updatedPlan);
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </CardHeader>
                              {!dayPlan.isRestDay && dayPlan.exercises && (
                                <CardContent className="pt-0">
                                  <div className="space-y-2">
                                    {dayPlan.exercises.map((exercise, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
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
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <WorkoutCalendar workoutPlan={activePlan} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutProgramPage;