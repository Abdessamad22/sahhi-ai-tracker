import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatDateWestern } from '@/lib/number-utils';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Dumbbell, 
  Target, 
  CheckCircle,
  Circle,
  Copy,
  Share2
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  notes?: string;
}

interface DayProgram {
  id: string;
  dayName: string;
  dayIndex: number;
  exercises: Exercise[];
  isRestDay: boolean;
  notes?: string;
}

interface WeeklyProgram {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  days: DayProgram[];
  isActive: boolean;
}

const WeeklyProgramPage = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<WeeklyProgram[]>([]);
  const [activeProgram, setActiveProgram] = useState<WeeklyProgram | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayProgram | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const [programForm, setProgramForm] = useState({
    name: '',
    description: ''
  });

  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    sets: 3,
    reps: '10',
    weight: '',
    duration: '',
    notes: ''
  });

  const daysOfWeek = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  // Load programs from localStorage
  useEffect(() => {
    const savedPrograms = localStorage.getItem('weeklyPrograms');
    if (savedPrograms) {
      const parsedPrograms = JSON.parse(savedPrograms);
      setPrograms(parsedPrograms);
      
      // Set active program
      const active = parsedPrograms.find((p: WeeklyProgram) => p.isActive);
      if (active) {
        setActiveProgram(active);
      }
    }
  }, []);

  // Save programs to localStorage
  const savePrograms = (updatedPrograms: WeeklyProgram[]) => {
    setPrograms(updatedPrograms);
    localStorage.setItem('weeklyPrograms', JSON.stringify(updatedPrograms));
  };

  // Create new program
  const createProgram = () => {
    if (!programForm.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم البرنامج",
        variant: "destructive"
      });
      return;
    }

    const newProgram: WeeklyProgram = {
      id: Date.now().toString(),
      name: programForm.name,
      description: programForm.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: programs.length === 0,
      days: daysOfWeek.map((dayName, index) => ({
        id: `${Date.now()}-${index}`,
        dayName,
        dayIndex: index,
        exercises: [],
        isRestDay: false,
        notes: ''
      }))
    };

    const updatedPrograms = [...programs, newProgram];
    savePrograms(updatedPrograms);

    if (programs.length === 0) {
      setActiveProgram(newProgram);
    }

    setProgramForm({ name: '', description: '' });
    setIsCreateDialogOpen(false);

    toast({
      title: "تم الإنشاء",
      description: "تم إنشاء البرنامج الأسبوعي بنجاح"
    });
  };

  // Set active program
  const setActiveProgramHandler = (program: WeeklyProgram) => {
    const updatedPrograms = programs.map(p => ({
      ...p,
      isActive: p.id === program.id
    }));
    
    savePrograms(updatedPrograms);
    setActiveProgram(program);

    toast({
      title: "تم التفعيل",
      description: `تم تفعيل برنامج "${program.name}"`
    });
  };

  // Delete program
  const deleteProgram = (programId: string) => {
    const updatedPrograms = programs.filter(p => p.id !== programId);
    savePrograms(updatedPrograms);

    if (activeProgram?.id === programId) {
      const newActive = updatedPrograms.find(p => p.isActive) || updatedPrograms[0] || null;
      setActiveProgram(newActive);
    }

    toast({
      title: "تم الحذف",
      description: "تم حذف البرنامج بنجاح"
    });
  };

  // Add/Edit exercise
  const saveExercise = () => {
    if (!selectedDay || !exerciseForm.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم التمرين",
        variant: "destructive"
      });
      return;
    }

    const exercise: Exercise = {
      id: editingExercise?.id || Date.now().toString(),
      name: exerciseForm.name,
      sets: exerciseForm.sets,
      reps: exerciseForm.reps,
      weight: exerciseForm.weight,
      duration: exerciseForm.duration,
      notes: exerciseForm.notes
    };

    const updatedPrograms = programs.map(program => {
      if (program.id === activeProgram?.id) {
        return {
          ...program,
          updatedAt: new Date().toISOString(),
          days: program.days.map(day => {
            if (day.id === selectedDay.id) {
              const exercises = editingExercise 
                ? day.exercises.map(ex => ex.id === editingExercise.id ? exercise : ex)
                : [...day.exercises, exercise];
              
              return { ...day, exercises };
            }
            return day;
          })
        };
      }
      return program;
    });

    savePrograms(updatedPrograms);
    
    const updatedActiveProgram = updatedPrograms.find(p => p.id === activeProgram?.id);
    if (updatedActiveProgram) {
      setActiveProgram(updatedActiveProgram);
    }

    // Reset form
    setExerciseForm({
      name: '',
      sets: 3,
      reps: '10',
      weight: '',
      duration: '',
      notes: ''
    });
    setEditingExercise(null);
    setIsEditExerciseOpen(false);

    toast({
      title: editingExercise ? "تم التحديث" : "تم الإضافة",
      description: editingExercise ? "تم تحديث التمرين بنجاح" : "تم إضافة التمرين بنجاح"
    });
  };

  // Delete exercise
  const deleteExercise = (dayId: string, exerciseId: string) => {
    const updatedPrograms = programs.map(program => {
      if (program.id === activeProgram?.id) {
        return {
          ...program,
          updatedAt: new Date().toISOString(),
          days: program.days.map(day => {
            if (day.id === dayId) {
              return {
                ...day,
                exercises: day.exercises.filter(ex => ex.id !== exerciseId)
              };
            }
            return day;
          })
        };
      }
      return program;
    });

    savePrograms(updatedPrograms);
    
    const updatedActiveProgram = updatedPrograms.find(p => p.id === activeProgram?.id);
    if (updatedActiveProgram) {
      setActiveProgram(updatedActiveProgram);
    }

    toast({
      title: "تم الحذف",
      description: "تم حذف التمرين بنجاح"
    });
  };

  // Toggle rest day
  const toggleRestDay = (dayId: string) => {
    const updatedPrograms = programs.map(program => {
      if (program.id === activeProgram?.id) {
        return {
          ...program,
          updatedAt: new Date().toISOString(),
          days: program.days.map(day => {
            if (day.id === dayId) {
              return { ...day, isRestDay: !day.isRestDay, exercises: day.isRestDay ? day.exercises : [] };
            }
            return day;
          })
        };
      }
      return program;
    });

    savePrograms(updatedPrograms);
    
    const updatedActiveProgram = updatedPrograms.find(p => p.id === activeProgram?.id);
    if (updatedActiveProgram) {
      setActiveProgram(updatedActiveProgram);
    }
  };

  // Open exercise dialog
  const openExerciseDialog = (day: DayProgram, exercise?: Exercise) => {
    setSelectedDay(day);
    setEditingExercise(exercise || null);
    
    if (exercise) {
      setExerciseForm({
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight || '',
        duration: exercise.duration || '',
        notes: exercise.notes || ''
      });
    } else {
      setExerciseForm({
        name: '',
        sets: 3,
        reps: '10',
        weight: '',
        duration: '',
        notes: ''
      });
    }
    
    setIsEditExerciseOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="header-gradient rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">البرنامج الأسبوعي</h1>
        <p className="text-white/90">أنشئ وتابع برنامجك التدريبي الأسبوعي المخصص</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Programs List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>برامجي</span>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إنشاء برنامج جديد</DialogTitle>
                    <DialogDescription>
                      أنشئ برنامجك التدريبي الأسبوعي المخصص
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="program-name">اسم البرنامج</Label>
                      <Input
                        id="program-name"
                        value={programForm.name}
                        onChange={(e) => setProgramForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="مثال: برنامج كمال الأجسام"
                      />
                    </div>
                    <div>
                      <Label htmlFor="program-description">الوصف (اختياري)</Label>
                      <Textarea
                        id="program-description"
                        value={programForm.description}
                        onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="وصف مختصر للبرنامج..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={createProgram}>إنشاء البرنامج</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {programs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد برامج. أنشئ برنامجك الأول!
              </p>
            ) : (
              programs.map(program => (
                <div
                  key={program.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    program.isActive ? 'bg-primary/10 border-primary' : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setActiveProgramHandler(program)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{program.name}</h3>
                      {program.description && (
                        <p className="text-xs text-muted-foreground mt-1">{program.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        تم الإنشاء: {formatDateWestern(program.createdAt)}
                      </p>
                      {program.isActive && (
                        <Badge variant="default" className="mt-2 text-xs">نشط</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProgram(program.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Weekly Schedule */}
        <div className="lg:col-span-3">
          {activeProgram ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {activeProgram.name}
                  </CardTitle>
                  {activeProgram.description && (
                    <CardDescription>{activeProgram.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProgram.days.map((day) => (
                  <Card key={day.id} className={day.isRestDay ? 'bg-muted/50' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{day.dayName}</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleRestDay(day.id)}
                          >
                            {day.isRestDay ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          {!day.isRestDay && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => openExerciseDialog(day)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {day.isRestDay && (
                        <Badge variant="secondary" className="w-fit">يوم راحة</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {day.isRestDay ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          يوم راحة - لا توجد تمارين
                        </p>
                      ) : day.exercises.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          لا توجد تمارين. اضغط + لإضافة تمرين
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {day.exercises.map((exercise) => (
                            <div key={exercise.id} className="bg-muted p-2 rounded-md">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{exercise.name}</h4>
                                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                    <span>{exercise.sets} مجموعات</span>
                                    <span>×</span>
                                    <span>{exercise.reps} تكرار</span>
                                    {exercise.weight && (
                                      <>
                                        <span>•</span>
                                        <span>{exercise.weight} كجم</span>
                                      </>
                                    )}
                                    {exercise.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{exercise.duration} دقيقة</span>
                                      </>
                                    )}
                                  </div>
                                  {exercise.notes && (
                                    <p className="text-xs text-muted-foreground mt-1">{exercise.notes}</p>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => openExerciseDialog(day, exercise)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive"
                                    onClick={() => deleteExercise(day.id, exercise.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">لا يوجد برنامج نشط</h3>
                <p className="text-muted-foreground mb-4">
                  أنشئ برنامجك التدريبي الأول أو فعّل برنامج موجود
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء برنامج جديد
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Exercise Dialog */}
      <Dialog open={isEditExerciseOpen} onOpenChange={setIsEditExerciseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? 'تعديل التمرين' : 'إضافة تمرين جديد'}
            </DialogTitle>
            <DialogDescription>
              {selectedDay && `إضافة تمرين ليوم ${selectedDay.dayName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exercise-name">اسم التمرين</Label>
              <Input
                id="exercise-name"
                value={exerciseForm.name}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: تمرين الضغط"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sets">المجموعات</Label>
                <Input
                  id="sets"
                  type="number"
                  value={exerciseForm.sets}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="reps">التكرارات</Label>
                <Input
                  id="reps"
                  value={exerciseForm.reps}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: e.target.value }))}
                  placeholder="10 أو 8-12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">الوزن (كجم)</Label>
                <Input
                  id="weight"
                  value={exerciseForm.weight}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="اختياري"
                />
              </div>
              <div>
                <Label htmlFor="duration">المدة (دقيقة)</Label>
                <Input
                  id="duration"
                  value={exerciseForm.duration}
                  onChange={(e) => setExerciseForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="اختياري"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={exerciseForm.notes}
                onChange={(e) => setExerciseForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditExerciseOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={saveExercise}>
              {editingExercise ? 'تحديث' : 'إضافة'} التمرين
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyProgramPage;