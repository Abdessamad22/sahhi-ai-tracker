import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/usePWA';
import { Download, Smartphone, Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const PWAInstallButton = () => {
  const { isInstallable, isInstalled, isOnline, installApp, updateAvailable, updateApp } = usePWA();
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    const success = await installApp();
    setInstalling(false);
    
    if (success) {
      setShowInstallDialog(false);
    }
  };

  if (isInstalled && !updateAvailable) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" />
          تطبيق مثبت
        </Badge>
        <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "متصل" : "غير متصل"}
        </Badge>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <Button 
        onClick={updateApp}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        تحديث متوفر
      </Button>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={() => setShowInstallDialog(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        تثبيت التطبيق
      </Button>

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              تثبيت تطبيق صحتي
            </DialogTitle>
            <DialogDescription className="text-right">
              ثبت التطبيق على جهازك للحصول على تجربة أفضل:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 my-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm">وصول سريع من الشاشة الرئيسية</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <WifiOff className="h-4 w-4 text-primary" />
              <span className="text-sm">يعمل بدون انترنت</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-sm">تجربة تطبيق كاملة</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInstallDialog(false)}
              className="w-full sm:w-auto"
            >
              لاحقاً
            </Button>
            <Button
              onClick={handleInstall}
              disabled={installing}
              className="w-full sm:w-auto"
            >
              {installing ? "جاري التثبيت..." : "تثبيت الآن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};