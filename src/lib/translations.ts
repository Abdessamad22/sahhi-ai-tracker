export const translations = {
  ar: {
    // Navigation
    appName: "صحتي",
    home: "الرئيسية",
    calorieCalculator: "حساب السعرات",
    bodyMeasurements: "قياسات الجسم",
    cardioConverter: "تحويل السعرات",
    weeklyProgram: "البرنامج الأسبوعي",
    myItems: "أغراضي",
    menu: "القائمة",
    
    // Home Page
    heroTitle: "تتبع صحتي",
    heroDescription: "دليلك الشامل لحساب السعرات الحرارية وتتبع قياسات الجسم وتحويل السعرات لدقائق التمارين",
    startNow: "ابدأ الآن",
    trackMeasurements: "تتبع قياساتك",
    explore: "استكشف",
    
    // Features
    calorieCalculatorTitle: "حساب السعرات الحرارية",
    calorieCalculatorDesc: "احسب احتياجاتك اليومية من السعرات الحرارية بناءً على عمرك وجنسك ووزنك وطولك ومستوى نشاطك",
    bodyMeasurementsTitle: "تتبع قياسات الجسم",
    bodyMeasurementsDesc: "سجل وتتبع قياسات جسمك في جميع المناطق الرئيسية ولاحظ تقدمك مع مرور الوقت",
    cardioConverterTitle: "تحويل السعرات إلى دقائق كارديو",
    cardioConverterDesc: "حوّل قيم السعرات الحرارية إلى وقت للتمارين الرياضية بناءً على نوع التمرين",
    weeklyProgramTitle: "البرنامج الأسبوعي",
    weeklyProgramDesc: "أنشئ برنامجك التدريبي الأسبوعي المخصص وتابع تقدمك يومياً",
    myItemsTitle: "أغراضي",
    myItemsDesc: "تأكد من أغراضك قبل الذهاب وبعد الرجوع من التمرين مع تذكيرات ذكية",
    
    // Stats
    healthOverview: "نظرة عامة على صحتك",
    bmr: "معدل الأيض الأساسي (BMR)",
    bmrDesc: "عدد السعرات الحرارية التي يحتاجها جسمك للحفاظ على وظائفه الأساسية",
    tdee: "إجمالي الطاقة اليومية (TDEE)",
    tdeeDesc: "إجمالي السعرات الحرارية التي يحرقها جسمك يوميًا شاملًا النشاط",
    calories: "سعرة حرارية",
    
    // Footer
    footerText: "© {year} تتبع صحتي | تم تطويره بواسطة فريق تتبع صحتي",
    
    // 404 Page
    notFoundTitle: "عذراً، الصفحة غير موجودة",
    backToHome: "العودة للصفحة الرئيسية",
    
    // Common
    language: "اللغة",
    switchToEnglish: "English",
    switchToArabic: "العربية"
  },
  
  en: {
    // Navigation
    appName: "My Health",
    home: "Home",
    calorieCalculator: "Calorie Calculator",
    bodyMeasurements: "Body Measurements",
    cardioConverter: "Cardio Converter",
    weeklyProgram: "Weekly Program",
    myItems: "My Items",
    menu: "Menu",
    
    // Home Page
    heroTitle: "Track My Health",
    heroDescription: "Your comprehensive guide to calculating calories, tracking body measurements, and converting calories to exercise minutes",
    startNow: "Start Now",
    trackMeasurements: "Track Your Measurements",
    explore: "Explore",
    
    // Features
    calorieCalculatorTitle: "Calorie Calculator",
    calorieCalculatorDesc: "Calculate your daily calorie needs based on your age, gender, weight, height, and activity level",
    bodyMeasurementsTitle: "Body Measurements Tracking",
    bodyMeasurementsDesc: "Record and track your body measurements in all key areas and monitor your progress over time",
    cardioConverterTitle: "Calories to Cardio Minutes Converter",
    cardioConverterDesc: "Convert calorie values to exercise time based on the type of workout",
    weeklyProgramTitle: "Weekly Program",
    weeklyProgramDesc: "Create your personalized weekly workout program and track your daily progress",
    myItemsTitle: "My Items",
    myItemsDesc: "Check your items before going to and after returning from workouts with smart reminders",
    
    // Stats
    healthOverview: "Your Health Overview",
    bmr: "Basal Metabolic Rate (BMR)",
    bmrDesc: "The number of calories your body needs to maintain its basic functions",
    tdee: "Total Daily Energy Expenditure (TDEE)",
    tdeeDesc: "Total calories your body burns daily including activity",
    calories: "calories",
    
    // Footer
    footerText: "© {year} Track My Health | Developed by Track My Health Team",
    
    // 404 Page
    notFoundTitle: "Sorry, page not found",
    backToHome: "Back to Home",
    
    // Common
    language: "Language",
    switchToEnglish: "English",
    switchToArabic: "العربية"
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.ar;