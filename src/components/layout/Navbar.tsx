
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Menu, Home, Calculator, Activity, Scale, Calendar, Backpack, Package, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const navigationItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/calorie-calculator', label: t('calorieCalculator'), icon: Calculator },
    { href: '/body-measurements', label: t('bodyMeasurements'), icon: Scale },
    { href: '/cardio-converter', label: t('cardioConverter'), icon: Activity },
    { href: '/weekly-program', label: t('weeklyProgram'), icon: Calendar },
    { href: '/my-items', label: t('myItems'), icon: Backpack },
    { href: '/products', label: 'My Products', icon: Package },
    { href: '/admin/products', label: 'Product Admin', icon: Settings },
  ];

  return (
    <nav className="header-gradient shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-white">
            {t('appName')}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Desktop and Mobile Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher - Visible on all screens */}
          <LanguageSwitcher />
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4">
                    <h2 className="text-lg font-semibold">{t('menu')}</h2>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === item.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
