import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, TrendingDown, Activity, Zap } from 'lucide-react';
import { WorkoutGoal, WORKOUT_GOALS } from '@/types/workout';

interface GoalSelectorProps {
  onSelectGoal: (goal: WorkoutGoal) => void;
}

const goalConfig = {
  'muscle-building': {
    icon: Target,
    title: 'زيادة العضل',
    description: 'تمارين مقاومة لبناء الكتلة العضلية',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  'weight-loss': {
    icon: TrendingDown,
    title: 'خسارة الوزن',
    description: 'تمارين كارديو ومقاومة لحرق الدهون',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100'
  },
  'general-fitness': {
    icon: Activity,
    title: 'لياقة عامة',
    description: 'برنامج متوازن لتحسين اللياقة الشاملة',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  'flexibility': {
    icon: Zap,
    title: 'مرونة',
    description: 'تمارين إطالة ويوغا لتحسين المرونة',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  }
};

export const GoalSelector = ({ onSelectGoal }: GoalSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">اختر هدفك</h2>
        <p className="text-muted-foreground">
          حدد هدفك الرئيسي لإنشاء برنامج تمرين مناسب لك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(goalConfig) as WorkoutGoal[]).map((goal) => {
          const config = goalConfig[goal];
          const Icon = config.icon;
          
          return (
            <Card 
              key={goal}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50 ${config.bgColor}`}
              onClick={() => onSelectGoal(goal)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full bg-white shadow-sm`}>
                    <Icon className={`h-8 w-8 ${config.color}`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{config.title}</CardTitle>
                <CardDescription className="text-base">
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full" variant="outline">
                  اختيار هذا الهدف
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};