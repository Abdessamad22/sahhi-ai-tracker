import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useHealth } from '@/context/HealthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { ArrowDown, ArrowUp, Equal, Scale, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BodyMeasurementsPage = () => {
  const { bodyMeasurements, addBodyMeasurement, deleteBodyMeasurement } = useHealth();
  const { toast } = useToast();

  const initialFormState = {
    neck: '',
    shoulders: '',
    chest: '',
    rightArm: '',
    leftArm: '',
    abdomen: '',
    waist: '',
    hips: '',
    rightThigh: '',
    leftThigh: '',
    rightCalf: '',
    leftCalf: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedMeasurement, setSelectedMeasurement] = useState('waist');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert all values to numbers and validate
    const measurementData = {
      neck: parseFloatOrZero(formData.neck),
      shoulders: parseFloatOrZero(formData.shoulders),
      chest: parseFloatOrZero(formData.chest),
      rightArm: parseFloatOrZero(formData.rightArm),
      leftArm: parseFloatOrZero(formData.leftArm),
      abdomen: parseFloatOrZero(formData.abdomen),
      waist: parseFloatOrZero(formData.waist),
      hips: parseFloatOrZero(formData.hips),
      rightThigh: parseFloatOrZero(formData.rightThigh),
      leftThigh: parseFloatOrZero(formData.leftThigh),
      rightCalf: parseFloatOrZero(formData.rightCalf),
      leftCalf: parseFloatOrZero(formData.leftCalf),
    };
    
    let isValid = true;
    
    // Check if all values are valid (between 0 and 200)
    Object.values(measurementData).forEach(value => {
      if (value < 0 || value > 200) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      toast({
        title: "قيم غير صالحة",
        description: "يرجى إدخال قيم صالحة (0-200 سم)",
        variant: "destructive"
      });
      return;
    }
    
    // Check if at least one measurement is provided
    if (Object.values(measurementData).every(val => val === 0)) {
      toast({
        title: "بيانات غير كافية",
        description: "يرجى إدخال قياس واحد على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new measurement
    addBodyMeasurement(measurementData);
    
    // Reset form and show success message
    setFormData(initialFormState);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ القياسات بنجاح"
    });
  };

  // Helper function to parse float or return 0
  const parseFloatOrZero = (value: string): number => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  // Function to prepare chart data
  const prepareChartData = () => {
    return bodyMeasurements
      .slice()
      .reverse()
      .map((measurement) => {
        const date = new Date(measurement.date);
        return {
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          [selectedMeasurement]: measurement[selectedMeasurement as keyof typeof measurement] || 0,
        };
      });
  };

  // Function to calculate difference between latest and previous measurement
  const calculateDifference = (key: string) => {
    if (bodyMeasurements.length < 2) return null;
    
    const latest = bodyMeasurements[0][key as keyof typeof bodyMeasurements[0]] || 0;
    const previous = bodyMeasurements[1][key as keyof typeof bodyMeasurements[1]] || 0;
    
    if (latest === 0 || previous === 0) return null;
    
    const diff = latest - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      increased: diff > 0,
      decreased: diff < 0,
      unchanged: diff === 0
    };
  };

  // Labels for the measurements in Arabic
  const measurementLabels: Record<string, string> = {
    neck: "الرقبة",
    shoulders: "الكتفين",
    chest: "الصدر",
    rightArm: "الذراع اليمنى",
    leftArm: "الذراع اليسرى",
    abdomen: "البطن",
    waist: "الخصر",
    hips: "الوركين",
    rightThigh: "الفخذ الأيمن",
    leftThigh: "الفخذ الأيسر",
    rightCalf: "ساق اليمنى",
    leftCalf: "ساق اليسرى",
  };

  return (
    <div className="space-y-6">
      <div className="header-gradient rounded-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">تتبع قياسات الجسم</h1>
        <p className="text-white/90">سجل قياسات جسمك وتابع تقدمك مع مرور الوقت</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>إضافة قياسات جديدة</CardTitle>
            <CardDescription>أدخل القياسات بالسنتيمتر، اترك الحقول فارغة للقياسات غير المتوفرة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(measurementLabels).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <div className="relative">
                      <Input
                        id={key}
                        name={key}
                        value={formData[key as keyof typeof formData]}
                        onChange={handleInputChange}
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="pl-12"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        سم
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button type="submit" size="lg" className="w-full">
                حفظ القياسات
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* History & Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>سجل القياسات</CardTitle>
            <CardDescription>تتبع التغيرات في قياساتك مع مرور الوقت</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bodyMeasurements.length === 0 ? (
              <Alert>
                <Scale className="h-4 w-4" />
                <AlertTitle>لا توجد قياسات</AlertTitle>
                <AlertDescription>
                  أضف قياساتك الأولى باستخدام النموذج المجاور.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="measurement-select">اختر قياس للعرض</Label>
                  <select
                    id="measurement-select"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={selectedMeasurement}
                    onChange={(e) => setSelectedMeasurement(e.target.value)}
                  >
                    {Object.entries(measurementLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Chart */}
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} سم`, measurementLabels[selectedMeasurement]]}
                      />
                      <Line
                        type="monotone"
                        dataKey={selectedMeasurement}
                        stroke="#0abe70"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <Separator />
                
                {/* Latest Measurements */}
                <div>
                  <h3 className="text-sm font-medium mb-2">آخر القياسات</h3>
                  {bodyMeasurements.length > 0 && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(bodyMeasurements[0].date)}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(measurementLabels).map(([key, label]) => {
                          const value = bodyMeasurements[0][key as keyof typeof bodyMeasurements[0]];
                          if (!value) return null;
                          
                          const diff = calculateDifference(key);
                          
                          return (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-xs">{label}</span>
                              <div className="flex items-center">
                                <span className="text-sm font-medium ml-1">{value} سم</span>
                                {diff && (
                                  <span className={`text-xs flex items-center ${
                                    diff.decreased ? "text-green-600" : 
                                    diff.increased ? "text-red-500" : "text-gray-500"
                                  }`}>
                                    {diff.decreased && <ArrowDown className="h-3 w-3" />}
                                    {diff.increased && <ArrowUp className="h-3 w-3" />}
                                    {diff.unchanged && <Equal className="h-3 w-3" />}
                                    {diff.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">عرض التاريخ</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>سجل القياسات</DialogTitle>
                  <DialogDescription>
                    جميع القياسات المسجلة مرتبة حسب تاريخ الإدخال
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[50vh] overflow-y-auto">
                  {bodyMeasurements.length === 0 ? (
                    <Alert>
                      <Scale className="h-4 w-4" />
                      <AlertTitle>لا توجد قياسات</AlertTitle>
                      <AlertDescription>
                        أضف قياساتك الأولى باستخدام النموذج.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {bodyMeasurements.map((measurement) => (
                        <div key={measurement.id} className="bg-muted p-3 rounded-md relative">
                          <div className="absolute top-2 right-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                deleteBodyMeasurement(measurement.id);
                                toast({
                                  title: "تم الحذف",
                                  description: "تم حذف القياس بنجاح"
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs font-medium mb-2">
                            {formatDate(measurement.date)}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(measurementLabels).map(([key, label]) => {
                              const value = measurement[key as keyof typeof measurement];
                              if (!value) return null;
                              
                              return (
                                <div key={key} className="flex justify-between">
                                  <span className="text-xs">{label}</span>
                                  <span className="text-xs font-medium">{value} سم</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => window.print()}>
                    طباعة السجل
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BodyMeasurementsPage;
