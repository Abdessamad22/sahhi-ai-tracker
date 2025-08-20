# موقع الياقة البدنية والصحة - Prompt للإنشاء

## الوصف العام
أنشئ موقع ويب للياقة البدنية والصحة يساعد المستخدمين على تتبع أهدافهم الصحية وحساب احتياجاتهم من السعرات الحرارية. الموقع يجب أن يكون responsive وداعم للـ PWA مع دعم اللغتين العربية والإنجليزية.

## التقنيات المطلوبة
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts للرسوم البيانية
- **State Management**: React Context API
- **Storage**: localStorage للبيانات المحلية
- **PWA**: دعم التثبيت كتطبيق

## نظام الألوان والتصميم
```css
/* الألوان الأساسية - استخدم HSL */
:root {
  --primary: 142 69% 58%; /* أخضر صحي */
  --primary-foreground: 0 0% 98%;
  --secondary: 210 40% 98%;
  --background: 0 0% 100%;
  --muted: 210 40% 96%;
  --border: 214 32% 91%;
  --health-600: 142 69% 48%; /* للأيقونات الصحية */
  --health-700: 142 69% 38%;
}

/* تدرج الرأس */
.header-gradient {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--health-700)));
}

/* تأثير hover للكروت */
.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

## الصفحات والوظائف الرئيسية

### 1. الصفحة الرئيسية (HomePage)
- **Hero Section**: عنوان جذاب مع أزرار "ابدأ الآن" و"تتبع القياسات"
- **Feature Cards**: 5 كروت للوظائف الرئيسية:
  - حاسبة السعرات الحرارية
  - قياسات الجسم  
  - محول الكارديو
  - البرنامج الأسبوعي
  - أغراضي
- **Health Overview**: عرض BMR و TDEE إذا توفرت البيانات

### 2. حاسبة السعرات الحرارية (CalorieCalculatorPage)
- **نموذج الإدخال**: العمر، الجنس، الوزن، الطول، مستوى النشاط
- **الحسابات**: 
  - BMR باستخدام معادلة Mifflin-St Jeor
  - TDEE = BMR × معامل النشاط
- **النتائج**: عرض في tabs (فقدان، حفاظ، زيادة الوزن)
- **نصائح صحية**: معلومات مفيدة حول التغذية

### 3. قياسات الجسم (BodyMeasurementsPage)
- **إضافة قياسات**: الوزن، الطول، الخصر، الصدر، الذراع، الفخذ
- **الرسم البياني**: عرض تطور القياسات بمرور الوقت
- **التاريخ**: جدول بجميع القياسات السابقة مع إمكانية الحذف
- **الحساب**: عرض الاختلاف بين آخر قياسين

### 4. محول الكارديو (CardioConverterPage)
- **الحاسبة**: حساب الوقت المطلوب لحرق سعرات معينة
- **الأنشطة**: المشي، الجري، السباحة، ركوب الدراجة، إلخ
- **النتائج الحديثة**: حفظ وعرض آخر الحسابات
- **معلومات**: نصائح حول الكارديو وحرق السعرات

### 5. البرنامج الأسبوعي (WeeklyProgramPage)
- **إدارة البرامج**: إنشاء وحذف برامج التمرين
- **جدولة التمارين**: تخصيص تمارين لكل يوم من الأسبوع
- **تفاصيل التمارين**: اسم التمرين، المجموعات، التكرارات، الوزن
- **أيام الراحة**: تحديد أيام الراحة

### 6. أغراضي (MyItemsPage)
- **قائمة الأغراض**: أغراض الذهاب والعودة من الجيم
- **التصنيفات**: going، returning، both
- **الإحصائيات**: عدد الأغراض المكتملة/المتبقية
- **الإشعارات**: تذكير بالأغراض (إعداد الأوقات)

## الميزات التقنية

### دعم اللغات (i18n)
```typescript
// LanguageContext
interface LanguageContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// الترجمات
const translations = {
  ar: {
    appName: 'دليل الصحة',
    heroTitle: 'دليلك الشامل للصحة واللياقة',
    // ... باقي الترجمات
  },
  en: {
    appName: 'Health Guide',
    heroTitle: 'Your Complete Guide to Health and Fitness',
    // ... rest of translations
  }
};
```

### إدارة البيانات الصحية
```typescript
// HealthContext
interface UserInfo {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;  
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  height?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
}
```

### PWA Configuration
```json
// manifest.json
{
  "name": "دليل الصحة - Health Guide",
  "short_name": "Health Guide",
  "description": "دليلك الشامل للصحة واللياقة البدنية",
  "theme_color": "#22c55e",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## تخطيط المكونات

### التخطيط الرئيسي (MainLayout)
- **Navbar**: شعار + قائمة التنقل + مبدل اللغة
- **Main Content**: محتوى الصفحة
- **Footer**: حقوق النشر

### مكونات الواجهة
- استخدم shadcn/ui components: Card, Button, Input, Select, Dialog, Tabs
- Lucide React للأيقونات
- Recharts للرسوم البيانية

## متطلبات الاستجابة (Responsive)
- **Mobile First**: تصميم يبدأ من الموبايل
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: قائمة منسدلة في الموبايل، أفقية في الديسكتوب

## حفظ البيانات
- استخدم localStorage لحفظ:
  - معلومات المستخدم
  - قياسات الجسم
  - البرامج التدريبية
  - أغراض الجيم
  - إعدادات اللغة

## التنقل والتوجيه
```typescript
// App.tsx routes
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/calorie-calculator', element: <CalorieCalculatorPage /> },
  { path: '/body-measurements', element: <BodyMeasurementsPage /> },
  { path: '/cardio-converter', element: <CardioConverterPage /> },
  { path: '/weekly-program', element: <WeeklyProgramPage /> },
  { path: '/my-items', element: <MyItemsPage /> },
  { path: '*', element: <NotFound /> }
];
```

## معادلات الحساب

### BMR (Basal Metabolic Rate)
```typescript
// معادلة Mifflin-St Jeor
const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
};
```

### TDEE (Total Daily Energy Expenditure)
```typescript
const activityMultipliers = {
  sedentary: 1.2,      // قليل الحركة
  light: 1.375,        // نشاط خفيف
  moderate: 1.55,      // نشاط متوسط
  active: 1.725,       // نشاط عالي
  very_active: 1.9     // نشاط عالي جداً
};
```

## تصميم الألوان
- **Primary**: أخضر صحي للعناصر الرئيسية
- **Secondary**: رمادي فاتح للخلفيات
- **Accent**: ألوان مكملة للتأكيدات
- **Text**: تباين عالي للقراءة
- **Health**: درجات الأخضر للعناصر الصحية

## اختبار الوظائف
تأكد من أن:
- جميع الحسابات تعمل بدقة
- التنقل بين الصفحات سلس
- حفظ واسترجاع البيانات يعمل
- دعم اللغتين كامل
- التصميم responsive على جميع الأجهزة
- PWA يمكن تثبيته

## ملاحظات إضافية
- استخدم TypeScript للتحقق من الأنواع
- اتبع أفضل الممارسات في React
- اجعل الكود قابل للقراءة والصيانة
- أضف تعليقات للأجزاء المعقدة
- تأكد من إمكانية الوصول (a11y)