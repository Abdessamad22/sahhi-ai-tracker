
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useHealth } from '@/context/HealthContext';
import { Activity, ArrowRight, HeartPulse, Scale } from 'lucide-react';
import { activityMultipliers, formatNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CalorieCalculatorPage = () => {
  const { userInfo, updateUserInfo, bmr, tdee } = useHealth();
  const { toast } = useToast();
  
  const [age, setAge] = useState(userInfo.age.toString());
  const [weight, setWeight] = useState(userInfo.weight.toString());
  const [height, setHeight] = useState(userInfo.height.toString());
  const [gender, setGender] = useState<'male' | 'female'>(userInfo.gender);
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "veryActive">(userInfo.activityLevel);

  // Update the context when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    // Validate inputs
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      toast({
        title: "خطأ في العمر",
        description: "يرجى إدخال عمر صالح (1-120)",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      toast({
        title: "خطأ في الوزن",
        description: "يرجى إدخال وزن صالح (1-300 كجم)",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 250) {
      toast({
        title: "خطأ في الطول",
        description: "يرجى إدخال طول صالح (1-250 سم)",
        variant: "destructive"
      });
      return;
    }
    
    updateUserInfo({
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      gender,
      activityLevel,
    });
    
    toast({
      title: "تم تحديث المعلومات",
      description: "تم حساب السعرات الحرارية بنجاح"
    });
  };
  
  // Calculate calories needed for different goals
  const calculateGoals = () => {
    return {
      lose: Math.round(tdee * 0.8), // 20% deficit
      maintain: Math.round(tdee),
      gain: Math.round(tdee * 1.15) // 15% surplus
    };
  };
  
  const goals = calculateGoals();

  // Handle activity level change with proper type casting
  const handleActivityLevelChange = (value: string) => {
    setActivityLevel(value as "sedentary" | "light" | "moderate" | "active" | "veryActive");
  };

  return (
    <div className="space-y-6">
      <div className="header-gradient rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">حساب السعرات الحرارية</h1>
        <p className="text-white/90">احسب احتياجاتك اليومية من السعرات الحرارية بناءً على معلوماتك الشخصية</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>أدخل معلوماتك الشخصية</CardTitle>
            <CardDescription>قم بملء النموذج بدقة للحصول على نتائج دقيقة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">العمر</Label>
                  <div className="relative">
                    <Input 
                      id="age" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      type="number" 
                      placeholder="أدخل عمرك" 
                      className="pl-12" 
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      سنة
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>الجنس</Label>
                  <RadioGroup 
                    value={gender} 
                    onValueChange={(value) => setGender(value as 'male' | 'female')}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">ذكر</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">أنثى</Label>
                    </div>
                  </RadioGroup>
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
                      className="pl-12" 
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      كجم
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">الطول</Label>
                  <div className="relative">
                    <Input 
                      id="height" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      type="number" 
                      step="0.1"
                      placeholder="أدخل طولك" 
                      className="pl-12" 
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      سم
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity-level">مستوى النشاط</Label>
                <Select 
                  value={activityLevel} 
                  onValueChange={handleActivityLevelChange}
                >
                  <SelectTrigger id="activity-level">
                    <SelectValue placeholder="اختر مستوى نشاطك" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(activityMultipliers).map(([key, { label, description }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">{description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                حساب السعرات الحرارية
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>النتائج</CardTitle>
            <CardDescription>تقدير احتياجاتك اليومية من السعرات الحرارية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium">معدل الأيض الأساسي (BMR)</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HeartPulse className="text-health-600 mr-2" size={20} />
                  <span className="text-sm text-muted-foreground">السعرات في الراحة</span>
                </div>
                <span className="text-xl font-bold">{formatNumber(Math.round(bmr))}</span>
              </div>
              <Separator />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium">إجمالي الطاقة اليومية (TDEE)</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="text-health-600 mr-2" size={20} />
                  <span className="text-sm text-muted-foreground">إجمالي السعرات اليومية</span>
                </div>
                <span className="text-xl font-bold">{formatNumber(Math.round(tdee))}</span>
              </div>
              <Separator />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">أهدافك</p>
              <Tabs defaultValue="maintain" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="lose">إنقاص</TabsTrigger>
                  <TabsTrigger value="maintain">حفاظ</TabsTrigger>
                  <TabsTrigger value="gain">زيادة</TabsTrigger>
                </TabsList>
                <TabsContent value="lose" className="space-y-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">لفقدان الوزن (0.5 كجم/أسبوع)</p>
                    <p className="text-xl font-bold">{formatNumber(goals.lose)} سعرة</p>
                  </div>
                  <p className="text-xs text-muted-foreground">عجز 20% من إجمالي السعرات</p>
                </TabsContent>
                <TabsContent value="maintain" className="space-y-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">للحفاظ على الوزن الحالي</p>
                    <p className="text-xl font-bold">{formatNumber(goals.maintain)} سعرة</p>
                  </div>
                  <p className="text-xs text-muted-foreground">الحفاظ على وزن متوازن</p>
                </TabsContent>
                <TabsContent value="gain" className="space-y-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">لزيادة العضلات (0.25 كجم/أسبوع)</p>
                    <p className="text-xl font-bold">{formatNumber(goals.gain)} سعرة</p>
                  </div>
                  <p className="text-xs text-muted-foreground">زيادة 15% من إجمالي السعرات</p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline" 
              className="flex gap-2 w-full"
              onClick={() => window.print()}
            >
              <span>طباعة النتائج</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح صحية</CardTitle>
          <CardDescription>نصائح مخصصة بناءً على بياناتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Scale className="mr-2 text-health-600" size={18} />
                نصيحة للوزن
              </h3>
              <p className="text-sm text-muted-foreground">
                تناول وجبات متوازنة تحتوي على البروتينات والكربوهيدرات المعقدة والدهون الصحية.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Activity className="mr-2 text-health-600" size={18} />
                نصيحة للنشاط
              </h3>
              <p className="text-sm text-muted-foreground">
                حاول أن تحافظ على 150 دقيقة على الأقل من النشاط البدني المعتدل كل أسبوع.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <HeartPulse className="mr-2 text-health-600" size={18} />
                نصيحة عامة
              </h3>
              <p className="text-sm text-muted-foreground">
                شرب 8-10 أكواب من الماء يوميًا للحفاظ على الترطيب والصحة العامة.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalorieCalculatorPage;
