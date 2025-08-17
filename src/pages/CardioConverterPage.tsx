import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealth } from '@/context/HealthContext';
import { useToast } from '@/hooks/use-toast';
import { calculateMinutesToBurnCalories, metValues, formatNumber } from '@/lib/utils';
import { toWesternNumerals, formatNumberWestern } from '@/lib/number-utils';
import { ClipboardCopy, Clock, Dumbbell, Flame, Waves } from 'lucide-react';

const CardioConverterPage = () => {
  const { userInfo } = useHealth();
  const { toast } = useToast();
  
  const [calories, setCalories] = useState('300');
  const [activity, setActivity] = useState('running');
  const [minutes, setMinutes] = useState(0);
  const [weight, setWeight] = useState(userInfo.weight.toString());
  const [recentResults, setRecentResults] = useState<{
    calories: number;
    activity: string;
    minutes: number;
    timestamp: number;
  }[]>([]);
  
  // Load recent results from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('recentCardioResults');
    if (savedResults) {
      setRecentResults(JSON.parse(savedResults));
    }
  }, []);
  
  // Update localStorage when recent results change
  useEffect(() => {
    localStorage.setItem('recentCardioResults', JSON.stringify(recentResults));
  }, [recentResults]);
  
  const activityLabels: Record<string, string> = {
    walking: "المشي (3 ميل/الساعة)",
    jogging: "الجري الخفيف (5 ميل/الساعة)",
    running: "الجري (8 ميل/الساعة)",
    cycling: "ركوب الدراجة (12-14 ميل/الساعة)",
    swimming: "السباحة",
    jumpingRope: "نط الحبل",
    stairs: "صعود السلالم",
    dancingAerobic: "رقص هوائي"
  };
  
  const activityIcons: Record<string, JSX.Element> = {
    walking: <Dumbbell className="h-5 w-5" />,
    jogging: <Dumbbell className="h-5 w-5" />,
    running: <Dumbbell className="h-5 w-5" />,
    cycling: <Dumbbell className="h-5 w-5" />,
    swimming: <Waves className="h-5 w-5" />,
    jumpingRope: <Dumbbell className="h-5 w-5" />,
    stairs: <Dumbbell className="h-5 w-5" />,
    dancingAerobic: <Dumbbell className="h-5 w-5" />
  };
  
  const handleCalculate = () => {
    // Validate inputs
    const caloriesNum = parseFloat(calories);
    const weightNum = parseFloat(weight);
    
    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      toast({
        title: "خطأ في السعرات",
        description: "يرجى إدخال عدد صالح للسعرات الحرارية",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "خطأ في الوزن",
        description: "يرجى إدخال وزن صالح",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate minutes
    const activityMet = metValues[activity as keyof typeof metValues];
    const minutesResult = calculateMinutesToBurnCalories(caloriesNum, weightNum, activityMet);
    setMinutes(Math.round(minutesResult));
    
    // Add to recent results (only keep the last 5)
    const newResult = {
      calories: caloriesNum,
      activity,
      minutes: Math.round(minutesResult),
      timestamp: Date.now()
    };
    
    setRecentResults(prev => [newResult, ...prev].slice(0, 5));
    
    toast({
      title: "تم الحساب",
      description: `ستحتاج إلى ${toWesternNumerals(Math.round(minutesResult).toString())} دقيقة من ${activityLabels[activity]} لحرق ${formatNumberWestern(caloriesNum)} سعرة حرارية`
    });
  };
  
  const copyToClipboard = (result: typeof recentResults[0]) => {
    const text = `لحرق ${result.calories} سعرة حرارية، أحتاج إلى ${result.minutes} دقيقة من ${activityLabels[result.activity]}.`;
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "تم النسخ",
        description: "تم نسخ النتيجة إلى الحافظة"
      });
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="header-gradient rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">تحويل السعرات إلى دقائق كارديو</h1>
        <p className="text-white/90">احسب الوقت اللازم لحرق سعرات حرارية محددة عبر أنواع مختلفة من التمارين</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>حاسبة الكارديو</CardTitle>
            <CardDescription>أدخل السعرات الحرارية ونوع التمرين لحساب الوقت اللازم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="calories">السعرات الحرارية</Label>
                  <div className="relative">
                     <Input 
                       id="calories" 
                       value={calories} 
                       onChange={(e) => setCalories(e.target.value)}
                       type="number" 
                       placeholder="أدخل السعرات" 
                       className="pl-20 western-numbers" 
                     />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      سعرة حرارية
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">الوزن</Label>
                  <div className="relative">
                     <Input 
                       id="weight" 
                       value={weight} 
                       onChange={(e) => setWeight(e.target.value)}
                       type="number" 
                       step="0.1"
                       placeholder="أدخل وزنك" 
                       className="pl-12 western-numbers" 
                     />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      كجم
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity">نوع التمرين</Label>
                  <Select value={activity} onValueChange={setActivity}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="اختر نوع التمرين" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(activityLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button size="lg" className="w-full" onClick={handleCalculate}>
                حساب الوقت اللازم
              </Button>
              
              {minutes > 0 && (
                <div className="bg-muted p-6 rounded-lg text-center space-y-2 mt-4">
                  <p className="text-sm text-muted-foreground">الوقت اللازم لحرق السعرات الحرارية</p>
                  <div className="flex justify-center items-center gap-2">
                    <Clock className="text-health-600 h-6 w-6" />
                    <span className="text-3xl font-bold western-numbers">{formatNumberWestern(minutes)} دقيقة</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{activityLabels[activity]}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>النتائج الأخيرة</CardTitle>
            <CardDescription>حساباتك السابقة</CardDescription>
          </CardHeader>
          <CardContent>
            {recentResults.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-4">
                لم تقم بأي حسابات بعد. قم بحساب الوقت اللازم لحرق السعرات الحرارية لرؤية النتائج هنا.
              </p>
            ) : (
              <div className="space-y-3">
                {recentResults.map((result, index) => (
                  <div key={result.timestamp} className="bg-muted p-3 rounded-lg flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-health-600" />
                        <span className="font-medium western-numbers">{formatNumberWestern(result.calories)} سعرة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm western-numbers">{formatNumberWestern(result.minutes)} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activityIcons[result.activity]}
                        <span className="text-xs text-muted-foreground">{activityLabels[result.activity]}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => copyToClipboard(result)}
                    >
                      <ClipboardCopy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات مفيدة</CardTitle>
          <CardDescription>تعرف على المزيد حول حرق السعرات الحرارية وتمارين الكارديو</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">حقائق عن السعرات الحرارية</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>لخسارة 0.5 كجم من الوزن، يجب حرق حوالي 3500 سعرة حرارية</li>
                <li>يحرق الشخص العادي من 1600-3000 سعرة حرارية يوميًا</li>
                <li>تختلف السعرات الحرارية المحروقة حسب الوزن والعمر ومستوى اللياقة</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">فوائد تمارين الكارديو</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>تحسين صحة القلب والأوعية الدموية</li>
                <li>زيادة السعة الرئوية وتحسين التنفس</li>
                <li>خفض ضغط الدم ومستويات الكوليسترول</li>
                <li>تحسين الحالة المزاجية وتقليل التوتر</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">نصائح لتمارين فعالة</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>ابدأ ببطء وقم بزيادة الكثافة تدريجياً</li>
                <li>استهدف 150 دقيقة على الأقل من التمارين المعتدلة أسبوعياً</li>
                <li>دمج التمارين عالية الكثافة مع فترات الراحة للحصول على أفضل النتائج</li>
                <li>تأكد من الاستمتاع بالتمارين لضمان الاستمرارية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardioConverterPage;
