import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Backpack, 
  ArrowRight, 
  ArrowLeft,
  Bell,
  Clock,
  Settings
} from 'lucide-react';

interface Item {
  id: string;
  name: string;
  icon: string;
  category: 'going' | 'returning' | 'both';
  isChecked: boolean;
  createdAt: string;
}

interface NotificationSettings {
  enabled: boolean;
  goingTime: string; // HH:MM format
  returningTime: string; // HH:MM format
  goingMinutesBefore: number;
  returningMinutesAfter: number;
}

const MyItemsPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<'going' | 'returning'>('going');
  
  const [newItem, setNewItem] = useState({
    name: '',
    icon: '🎒',
    category: 'both' as 'going' | 'returning' | 'both'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    enabled: false,
    goingTime: '18:00',
    returningTime: '20:00',
    goingMinutesBefore: 30,
    returningMinutesAfter: 15
  });

  // Common gym items with icons
  const commonItems = [
    { name: 'منشفة', icon: '🏃‍♂️' },
    { name: 'زجاجة ماء', icon: '💧' },
    { name: 'سماعات', icon: '🎧' },
    { name: 'حذاء رياضي', icon: '👟' },
    { name: 'بطاقة النادي', icon: '🏷️' },
    { name: 'هاتف محمول', icon: '📱' },
    { name: 'مفاتيح', icon: '🔑' },
    { name: 'محفظة', icon: '💳' },
    { name: 'قفازات تمرين', icon: '🧤' },
    { name: 'حزام رفع الأثقال', icon: '⚡' },
    { name: 'مكملات غذائية', icon: '💊' },
    { name: 'ملابس إضافية', icon: '👕' }
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('myGymItems');
    const savedNotifications = localStorage.getItem('itemNotifications');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Save items to localStorage
  const saveItems = (updatedItems: Item[]) => {
    setItems(updatedItems);
    localStorage.setItem('myGymItems', JSON.stringify(updatedItems));
  };

  // Save notification settings
  const saveNotifications = (settings: NotificationSettings) => {
    setNotifications(settings);
    localStorage.setItem('itemNotifications', JSON.stringify(settings));
  };

  // Add new item
  const addItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الغرض",
        variant: "destructive"
      });
      return;
    }

    const item: Item = {
      id: Date.now().toString(),
      name: newItem.name,
      icon: newItem.icon,
      category: newItem.category,
      isChecked: false,
      createdAt: new Date().toISOString()
    };

    saveItems([...items, item]);
    setNewItem({ name: '', icon: '🎒', category: 'both' });
    setIsAddDialogOpen(false);

    toast({
      title: "تم الإضافة",
      description: `تم إضافة "${item.name}" إلى قائمة أغراضك`
    });
  };

  // Edit item
  const editItem = () => {
    if (!editingItem || !editingItem.name.trim()) return;

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? editingItem : item
    );

    saveItems(updatedItems);
    setEditingItem(null);
    setIsEditDialogOpen(false);

    toast({
      title: "تم التحديث",
      description: "تم تحديث الغرض بنجاح"
    });
  };

  // Delete item
  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);

    toast({
      title: "تم الحذف",
      description: "تم حذف الغرض من القائمة"
    });
  };

  // Toggle item check
  const toggleItemCheck = (id: string) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    saveItems(updatedItems);
  };

  // Check all items
  const checkAllItems = (category: 'going' | 'returning') => {
    const updatedItems = items.map(item => {
      if (item.category === category || item.category === 'both') {
        return { ...item, isChecked: true };
      }
      return item;
    });
    saveItems(updatedItems);

    toast({
      title: "تم التحقق من الكل",
      description: `تم تأشير جميع أغراض ${category === 'going' ? 'الذهاب' : 'الرجوع'}`
    });
  };

  // Uncheck all items
  const uncheckAllItems = (category: 'going' | 'returning') => {
    const updatedItems = items.map(item => {
      if (item.category === category || item.category === 'both') {
        return { ...item, isChecked: false };
      }
      return item;
    });
    saveItems(updatedItems);
  };

  // Get filtered items for current tab
  const getFilteredItems = (category: 'going' | 'returning') => {
    return items.filter(item => item.category === category || item.category === 'both');
  };

  // Get completion stats
  const getStats = (category: 'going' | 'returning') => {
    const filteredItems = getFilteredItems(category);
    const checkedItems = filteredItems.filter(item => item.isChecked);
    return {
      total: filteredItems.length,
      checked: checkedItems.length,
      percentage: filteredItems.length > 0 ? Math.round((checkedItems.length / filteredItems.length) * 100) : 0
    };
  };

  // Schedule notifications
  const scheduleNotifications = () => {
    if (!notifications.enabled || !('serviceWorker' in navigator)) return;

    // This is a simplified version - in a real app you'd use service workers
    const now = new Date();
    const [goingHour, goingMinute] = notifications.goingTime.split(':').map(Number);
    const [returningHour, returningMinute] = notifications.returningTime.split(':').map(Number);

    // Schedule going notification
    const goingTime = new Date();
    goingTime.setHours(goingHour, goingMinute - notifications.goingMinutesBefore, 0, 0);

    // Schedule returning notification  
    const returningTime = new Date();
    returningTime.setHours(returningHour, returningMinute + notifications.returningMinutesAfter, 0, 0);

    toast({
      title: "تم تفعيل التذكيرات",
      description: "سيتم تذكيرك بمراجعة أغراضك في الأوقات المحددة"
    });
  };

  const goingStats = getStats('going');
  const returningStats = getStats('returning');

  return (
    <div className="space-y-6">
      <div className="header-gradient rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
              <Backpack className="h-8 w-8" />
              أغراضي
            </h1>
            <p className="text-white/90">تأكد من أغراضك قبل الذهاب وبعد الرجوع من التمرين</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                الذهاب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {goingStats.checked}/{goingStats.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  {goingStats.percentage}% مكتمل
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goingStats.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-green-600" />
                الرجوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {returningStats.checked}/{returningStats.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  {returningStats.percentage}% مكتمل
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${returningStats.percentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة غرض جديد
          </Button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>قائمة الأغراض</CardTitle>
              <CardDescription>تأكد من أغراضك قبل وبعد التمرين</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'going' | 'returning')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="going" className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    قبل الذهاب
                  </TabsTrigger>
                  <TabsTrigger value="returning" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    بعد الرجوع
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="going" className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      onClick={() => checkAllItems('going')}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تحقق من الكل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => uncheckAllItems('going')}
                      className="flex items-center gap-1"
                    >
                      <Circle className="h-4 w-4" />
                      إلغاء الكل
                    </Button>
                  </div>

                  {getFilteredItems('going').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Backpack className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد أغراض للذهاب</p>
                      <p className="text-sm">أضف أغراضك الأساسية للتمرين</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredItems('going').map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            item.isChecked 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={item.isChecked}
                                onCheckedChange={() => toggleItemCheck(item.id)}
                              />
                              <span className="text-2xl">{item.icon}</span>
                              <span className={`font-medium ${item.isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="returning" className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm" 
                      onClick={() => checkAllItems('returning')}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تحقق من الكل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => uncheckAllItems('returning')}
                      className="flex items-center gap-1"
                    >
                      <Circle className="h-4 w-4" />
                      إلغاء الكل
                    </Button>
                  </div>

                  {getFilteredItems('returning').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Backpack className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد أغراض للرجوع</p>
                      <p className="text-sm">أضف الأغراض التي تحتاج للتأكد منها عند الرجوع</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredItems('returning').map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            item.isChecked 
                              ? 'bg-green-50 border-green-200 shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={item.isChecked}
                                onCheckedChange={() => toggleItemCheck(item.id)}
                              />
                              <span className="text-2xl">{item.icon}</span>
                              <span className={`font-medium ${item.isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                {item.name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة غرض جديد</DialogTitle>
            <DialogDescription>
              أضف غرضاً جديداً إلى قائمة أغراضك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">اسم الغرض</Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثال: منشفة"
              />
            </div>
            <div>
              <Label htmlFor="item-icon">الأيقونة</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {['🎒', '💧', '🎧', '👟', '🏷️', '📱', '🔑', '💳', '🧤', '⚡', '💊', '👕'].map((icon) => (
                  <Button
                    key={icon}
                    variant={newItem.icon === icon ? "default" : "outline"}
                    className="h-10 w-10 p-0 text-lg"
                    onClick={() => setNewItem(prev => ({ ...prev, icon }))}
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>متى تحتاج هذا الغرض؟</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={newItem.category === 'going' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewItem(prev => ({ ...prev, category: 'going' }))}
                >
                  الذهاب
                </Button>
                <Button
                  variant={newItem.category === 'returning' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewItem(prev => ({ ...prev, category: 'returning' }))}
                >
                  الرجوع
                </Button>
                <Button
                  variant={newItem.category === 'both' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewItem(prev => ({ ...prev, category: 'both' }))}
                >
                  كلاهما
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">أو اختر من الأغراض الشائعة:</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                {commonItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    size="sm"
                    className="justify-start h-8 text-xs"
                    onClick={() => setNewItem(prev => ({ ...prev, name: item.name, icon: item.icon }))}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={addItem}>إضافة الغرض</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل الغرض</DialogTitle>
            <DialogDescription>
              قم بتعديل تفاصيل الغرض
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-item-name">اسم الغرض</Label>
                <Input
                  id="edit-item-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-item-icon">الأيقونة</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['🎒', '💧', '🎧', '👟', '🏷️', '📱', '🔑', '💳', '🧤', '⚡', '💊', '👕'].map((icon) => (
                    <Button
                      key={icon}
                      variant={editingItem.icon === icon ? "default" : "outline"}
                      className="h-10 w-10 p-0 text-lg"
                      onClick={() => setEditingItem(prev => prev ? ({ ...prev, icon }) : null)}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>متى تحتاج هذا الغرض؟</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={editingItem.category === 'going' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingItem(prev => prev ? ({ ...prev, category: 'going' }) : null)}
                  >
                    الذهاب
                  </Button>
                  <Button
                    variant={editingItem.category === 'returning' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingItem(prev => prev ? ({ ...prev, category: 'returning' }) : null)}
                  >
                    الرجوع
                  </Button>
                  <Button
                    variant={editingItem.category === 'both' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingItem(prev => prev ? ({ ...prev, category: 'both' }) : null)}
                  >
                    كلاهما
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={editItem}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات التذكيرات
            </DialogTitle>
            <DialogDescription>
              قم بتخصيص تذكيرات مراجعة الأغراض
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-enabled">تفعيل التذكيرات</Label>
              <Switch
                id="notifications-enabled"
                checked={notifications.enabled}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            
            {notifications.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="going-time">وقت التمرين</Label>
                  <Input
                    id="going-time"
                    type="time"
                    value={notifications.goingTime}
                    onChange={(e) => 
                      setNotifications(prev => ({ ...prev, goingTime: e.target.value }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="going-minutes">التذكير قبل التمرين بـ (دقيقة)</Label>
                  <Input
                    id="going-minutes"
                    type="number"
                    min="5"
                    max="120"
                    value={notifications.goingMinutesBefore}
                    onChange={(e) => 
                      setNotifications(prev => ({ ...prev, goingMinutesBefore: parseInt(e.target.value) || 30 }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="returning-minutes">التذكير بعد التمرين بـ (دقيقة)</Label>
                  <Input
                    id="returning-minutes"
                    type="number"
                    min="5"
                    max="60"
                    value={notifications.returningMinutesAfter}
                    onChange={(e) => 
                      setNotifications(prev => ({ ...prev, returningMinutesAfter: parseInt(e.target.value) || 15 }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => {
              saveNotifications(notifications);
              scheduleNotifications();
              setIsSettingsOpen(false);
            }}>
              حفظ الإعدادات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyItemsPage;