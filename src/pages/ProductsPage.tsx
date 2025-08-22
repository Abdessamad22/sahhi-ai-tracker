import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Package, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const ProductsPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
    loadFavorites();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب المنتجات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('product-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('product-favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(productId) ? "تم الحذف من المفضلة" : "تم الإضافة للمفضلة",
      description: favorites.includes(productId) ? "تم حذف المنتج من مفضلتك" : "تم إضافة المنتج لمفضلتك"
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const newProducts = filteredProducts.filter(product => product.is_new);
  const allProducts = filteredProducts;

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => 
        prev < selectedProduct.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProduct.images.length - 1
      );
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openProductDialog(product)}>
      <CardHeader className="pb-3">
        <div className="relative">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-3"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>
          {product.is_new && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              جديد
            </Badge>
          )}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {product.images.length} صور
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {product.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          {product.price && (
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          )}
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ProductGrid = ({ products }: { products: Product[] }) => {
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'جرب تعديل مصطلحات البحث' : 'لا توجد منتجات متاحة حالياً'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
          <Package className="h-10 w-10" />
          منتجاتي
        </h1>
        <p className="text-muted-foreground text-lg">
          اكتشف مجموعتنا الرائعة من المنتجات
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="البحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            جميع المنتجات ({allProducts.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            المنتجات الجديدة ({newProducts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ProductGrid products={allProducts} />
        </TabsContent>
        
        <TabsContent value="new">
          <ProductGrid products={newProducts} />
        </TabsContent>
      </Tabs>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedProduct.name}
                  {selectedProduct.is_new && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      جديد
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Image Gallery */}
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={selectedProduct.images[currentImageIndex] || selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      {selectedProduct.images.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {currentImageIndex + 1} / {selectedProduct.images.length}
                          </div>
                        </>
                      )}
                    </div>
                  ) : selectedProduct.image_url && (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  )}
                  
                  {/* Thumbnail Gallery */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedProduct.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                            index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {selectedProduct.price && (
                      <span className="text-2xl font-bold text-primary">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart 
                        className={`h-4 w-4 ${favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                      {favorites.includes(selectedProduct.id) ? 'حذف من المفضلة' : 'إضافة للمفضلة'}
                    </Button>
                  </div>
                  
                  {selectedProduct.category && (
                    <Badge variant="secondary">
                      {selectedProduct.category}
                    </Badge>
                  )}
                  
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold mb-2">الوصف</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;