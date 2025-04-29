
import { ReactNode } from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} تتبع صحتي | تم تطويره بواسطة فريق تتبع صحتي</p>
      </footer>
    </div>
  );
};

export default MainLayout;
