
import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, Scale, Timer, Package, Star } from 'lucide-react';
import { Calendar, Backpack } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useHealth } from '@/context/HealthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { formatNumber } from '@/lib/utils';
import { formatNumberWestern } from '@/lib/number-utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  is_new: boolean;
  created_at: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { bmr, tdee } = useHealth();
  const { t } = useLanguage();
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewProducts(data || []);
    } catch (error) {
      console.error('Error fetching new products:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-lg header-gradient p-6 sm:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('heroTitle')}</h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          {t('heroDescription')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/calorie-calculator')}>
            {t('startNow')}
          </Button>
          <Button size="lg" variant="outline" className="bg-white/20" onClick={() => navigate('/body-measurements')}>
            {t('trackMeasurements')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard 
          icon={<Activity className="h-10 w-10 text-health-600" />}
          title={t('calorieCalculatorTitle')}
          description={t('calorieCalculatorDesc')}
          onClick={() => navigate('/calorie-calculator')}
        />
        <FeatureCard 
          icon={<Scale className="h-10 w-10 text-health-600" />}
          title={t('bodyMeasurementsTitle')}
          description={t('bodyMeasurementsDesc')}
          onClick={() => navigate('/body-measurements')}
        />
        <FeatureCard 
          icon={<Timer className="h-10 w-10 text-health-600" />}
          title={t('cardioConverterTitle')}
          description={t('cardioConverterDesc')}
          onClick={() => navigate('/cardio-converter')}
        />
        <FeatureCard 
          icon={<Calendar className="h-10 w-10 text-health-600" />}
          title={t('weeklyProgramTitle')}
          description={t('weeklyProgramDesc')}
          onClick={() => navigate('/weekly-program')}
        />
        <FeatureCard 
          icon={<Backpack className="h-10 w-10 text-health-600" />}
          title={t('myItemsTitle')}
          description={t('myItemsDesc')}
          onClick={() => navigate('/my-items')}
        />
      </section>

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              المنتجات الجديدة
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              عرض جميع المنتجات
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <CardHeader className="pb-2">
                  <div className="relative">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    )}
                    <Badge className="absolute top-1 right-1 bg-yellow-500 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      جديد
                    </Badge>
                  </div>
                  <CardTitle className="text-sm">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {product.price && (
                    <p className="text-lg font-bold text-primary mb-1">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                  {product.category && (
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Stats Overview */}
      {(bmr > 0 || tdee > 0) && (
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{t('healthOverview')}</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <StatCard 
              icon={<BarChart3 className="h-8 w-8 text-health-600" />}
              title={t('bmr')}
              value={`${formatNumberWestern(Math.round(bmr))} ${t('calories')}`}
              description={t('bmrDesc')}
            />
            <StatCard 
              icon={<Activity className="h-8 w-8 text-health-600" />}
              title={t('tdee')}
              value={`${formatNumberWestern(Math.round(tdee))} ${t('calories')}`}
              description={t('tdeeDesc')}
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
        {useLanguage().t('explore')}
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
