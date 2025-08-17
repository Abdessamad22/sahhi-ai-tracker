
import { Activity, BarChart3, Scale, Timer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '@/context/HealthContext';
import { formatNumber } from '@/lib/utils';
import { formatNumberWestern } from '@/lib/number-utils';

const HomePage = () => {
  const navigate = useNavigate();
  const { bmr, tdee } = useHealth();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-lg header-gradient p-6 sm:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">تتبع صحتي</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          دليلك الشامل لحساب السعرات الحرارية وتتبع قياسات الجسم وتحويل السعرات لدقائق التمارين
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/calorie-calculator')}>
            ابدأ الآن
          </Button>
          <Button size="lg" variant="outline" className="bg-white/20" onClick={() => navigate('/body-measurements')}>
            تتبع قياساتك
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard 
          icon={<Activity className="h-10 w-10 text-health-600" />}
          title="حساب السعرات الحرارية"
          description="احسب احتياجاتك اليومية من السعرات الحرارية بناءً على عمرك وجنسك ووزنك وطولك ومستوى نشاطك"
          onClick={() => navigate('/calorie-calculator')}
        />
        <FeatureCard 
          icon={<Scale className="h-10 w-10 text-health-600" />}
          title="تتبع قياسات الجسم"
          description="سجل وتتبع قياسات جسمك في جميع المناطق الرئيسية ولاحظ تقدمك مع مرور الوقت"
          onClick={() => navigate('/body-measurements')}
        />
        <FeatureCard 
          icon={<Timer className="h-10 w-10 text-health-600" />}
          title="تحويل السعرات إلى دقائق كارديو"
          description="حوّل قيم السعرات الحرارية إلى وقت للتمارين الرياضية بناءً على نوع التمرين"
          onClick={() => navigate('/cardio-converter')}
        />
      </section>

      {/* Stats Overview */}
      {(bmr > 0 || tdee > 0) && (
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">نظرة عامة على صحتك</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <StatCard 
              icon={<BarChart3 className="h-8 w-8 text-health-600" />}
              title="معدل الأيض الأساسي (BMR)"
              value={`${formatNumberWestern(Math.round(bmr))} سعرة حرارية`}
              description="عدد السعرات الحرارية التي يحتاجها جسمك للحفاظ على وظائفه الأساسية"
            />
            <StatCard 
              icon={<Activity className="h-8 w-8 text-health-600" />}
              title="إجمالي الطاقة اليومية (TDEE)"
              value={`${formatNumberWestern(Math.round(tdee))} سعرة حرارية`}
              description="إجمالي السعرات الحرارية التي يحرقها جسمك يوميًا شاملًا النشاط"
            />
          </div>
        </section>
      )}
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  onClick: () => void;
}) => (
  <Card className="card-hover">
    <CardHeader>
      <div className="mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="mb-4 text-base">{description}</CardDescription>
      <Button variant="outline" onClick={onClick}>
        استكشف
      </Button>
    </CardContent>
  </Card>
);

const StatCard = ({ 
  icon, 
  title, 
  value, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string;
  description: string;
}) => (
  <div className="flex gap-4 p-4 rounded-md bg-muted/50">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-2xl font-bold text-health-700 my-1 western-numbers">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default HomePage;
