
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Award, CalendarClock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <Activity className="h-8 w-8 text-health-600" />
            <span className="text-xl font-bold text-health-700">تتبع صحتي</span>
          </Link>
          
          <div className="hidden md:flex space-x-6 space-x-reverse">
            <NavLink to="/" icon={<Award className="ml-1" size={18} />}>الرئيسية</NavLink>
            <NavLink to="/calorie-calculator" icon={<Activity className="ml-1" size={18} />}>حساب السعرات</NavLink>
            <NavLink to="/body-measurements" icon={<Award className="ml-1" size={18} />}>قياسات الجسم</NavLink>
            <NavLink to="/cardio-converter" icon={<CalendarClock className="ml-1" size={18} />}>تحويل السعرات</NavLink>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-2 px-4 space-y-2 bg-white border-t">
          <MobileNavLink to="/" onClick={toggleMenu}>الرئيسية</MobileNavLink>
          <MobileNavLink to="/calorie-calculator" onClick={toggleMenu}>حساب السعرات</MobileNavLink>
          <MobileNavLink to="/body-measurements" onClick={toggleMenu}>قياسات الجسم</MobileNavLink>
          <MobileNavLink to="/cardio-converter" onClick={toggleMenu}>تحويل السعرات</MobileNavLink>
        </div>
      )}
    </nav>
  );
};

// Helper components
const NavLink = ({ to, children, icon }: { to: string, children: React.ReactNode, icon: React.ReactNode }) => (
  <Link to={to} className="flex items-center text-gray-700 hover:text-health-600 font-medium">
    {icon}
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
  <Link 
    to={to} 
    className="block py-2 px-4 text-gray-700 hover:bg-secondary rounded-md"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
