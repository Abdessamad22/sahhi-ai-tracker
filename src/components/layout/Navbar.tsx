
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { Menu, Home, Calculator, Activity, Scale, Calendar } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/calorie-calculator', label: 'حساب السعرات', icon: Calculator },
    { href: '/body-measurements', label: 'قياسات الجسم', icon: Scale },
    { href: '/cardio-converter', label: 'تحويل السعرات', icon: Activity },
    { href: '/weekly-program', label: 'البرنامج الأسبوعي', icon: Calendar },
  ];

  return (
    <nav className="header-gradient shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-white">
            صحتي
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
        
        {/* PWA Install Button & Mobile Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>
          
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
                    <h2 className="text-lg font-semibold">القائمة</h2>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="block sm:hidden mb-4">
                      <PWAInstallButton />
                    </div>
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
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
