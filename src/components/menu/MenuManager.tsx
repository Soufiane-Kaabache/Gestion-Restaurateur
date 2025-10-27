'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Grid3X3, List, Star, TrendingUp, Eye, Edit } from 'lucide-react';
import { ProductCard, ProductData } from './ProductCard';
import { ProductForm } from './ProductForm';
import { CategoryForm, CategoryData } from './CategoryForm';

interface MenuManagerProps {
  products: ProductData[];
  categories: CategoryData[];
  onProductUpdate?: (product: ProductData) => void;
  onProductCreate?: (product: Omit<ProductData, 'id'>) => void;
  onProductDelete?: (productId: string) => void;
  onCategoryUpdate?: (category: CategoryData) => void;
  onCategoryCreate?: (category: Omit<CategoryData, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onProductSelect?: (product: ProductData) => void;
  selectable?: boolean;
  selectedProducts?: string[];
  onSelectionChange?: (selectedProducts: string[]) => void;
}

export function MenuManager({
  products,
  categories,
  onProductUpdate,
  onProductCreate,
  onProductDelete,
  onCategoryUpdate,
  onCategoryCreate,
  onCategoryDelete,
  onProductSelect,
  selectable = false,
  selectedProducts = [],
  onSelectionChange,
}: MenuManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchesAvailability =
        selectedAvailability === 'all' ||
        (selectedAvailability === 'available' && product.isAvailable) ||
        (selectedAvailability === 'unavailable' && !product.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return (b.orderCount || 0) - (a.orderCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const handleProductEdit = useCallback((product: ProductData) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleProductDelete = useCallback(
    (productId: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        onProductDelete?.(productId);
      }
    },
    [onProductDelete],
  );

  const handleProductCreate = useCallback(
    (productData: Omit<ProductData, 'id'>) => {
      onProductCreate?.(productData);
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [onProductCreate],
  );

  const handleProductUpdate = useCallback(
    (productData: ProductData) => {
      onProductUpdate?.(productData);
      setShowProductForm(false);
      setEditingProduct(null);
    },
    [onProductUpdate],
  );

  const handleCategoryEdit = useCallback((category: CategoryData) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  }, []);

  const handleCategoryDelete = useCallback(
    (categoryId: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
        onCategoryDelete?.(categoryId);
      }
    },
    [onCategoryDelete],
  );

  const handleCategoryCreate = useCallback(
    (categoryData: Omit<CategoryData, 'id'>) => {
      onCategoryCreate?.(categoryData);
      setShowCategoryForm(false);
      setEditingCategory(null);
    },
    [onCategoryCreate],
  );

  const handleCategoryUpdate = useCallback(
    (categoryData: CategoryData) => {
      onCategoryUpdate?.(categoryData);
      setShowCategoryForm(false);
      setEditingCategory(null);
    },
    [onCategoryUpdate],
  );

  const handleQuantityChange = useCallback(
    (productId: string, quantity: number) => {
      setQuantities((prev) => ({ ...prev, [productId]: quantity }));

      if (selectable && onSelectionChange) {
        if (quantity > 0 && !selectedProducts.includes(productId)) {
          onSelectionChange([...selectedProducts, productId]);
        } else if (quantity === 0 && selectedProducts.includes(productId)) {
          onSelectionChange(selectedProducts.filter((id) => id !== productId));
        }
      }
    },
    [selectable, selectedProducts, onSelectionChange],
  );

  const getStats = () => {
    const total = products.length;
    const available = products.filter((p) => p.isAvailable).length;
    const unavailable = products.filter((p) => !p.isAvailable).length;
    const categoriesCount = categories.length;

    return { total, available, unavailable, categories: categoriesCount };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion du menu</h2>
          <p className="text-gray-600">
            {stats.total} produits • {stats.categories} catégories • {stats.available} disponibles
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCategoryForm(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Catégorie
          </Button>
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Produit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total produits</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Grid3X3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Indisponibles</p>
                <p className="text-2xl font-bold text-red-600">{stats.unavailable}</p>
              </div>
              <Edit className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Catégories</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
              <Star className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Toutes catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Tous</option>
                <option value="available">Disponibles</option>
                <option value="unavailable">Indisponibles</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="name">Nom</option>
                <option value="price">Prix</option>
                <option value="popularity">Popularité</option>
                <option value="rating">Note</option>
              </select>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleProductEdit}
                  onDelete={handleProductDelete}
                  onSelect={onProductSelect}
                  selectable={selectable}
                  selected={selectedProducts.includes(product.id)}
                  quantity={quantities[product.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Produit</th>
                        <th className="text-left p-4">Catégorie</th>
                        <th className="text-left p-4">Prix</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Popularité</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.imageUrl && (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{product.name}</p>
                                {product.description && (
                                  <p className="text-sm text-gray-600 line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{product.categoryName}</td>
                          <td className="p-4">{product.price.toFixed(2)} €</td>
                          <td className="p-4">
                            <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                              {product.isAvailable ? 'Disponible' : 'Indisponible'}
                            </Badge>
                          </td>
                          <td className="p-4">{product.orderCount || 0} commandes</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProductEdit(product)}
                              >
                                Modifier
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4">Aucun produit trouvé</p>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un produit
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCategoryEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCategoryDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {products.filter((p) => p.categoryId === category.id).length} produits
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {categories.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4">Aucune catégorie trouvée</p>
                <Button onClick={() => setShowCategoryForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une catégorie
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Forms */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={editingProduct ? handleProductUpdate : handleProductCreate}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleCategoryUpdate : handleCategoryCreate}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}
