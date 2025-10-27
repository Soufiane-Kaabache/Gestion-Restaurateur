'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Martini,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Bell,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  IceCream,
} from 'lucide-react';
import { OrderData } from '@/components/orders/OrderForm';
import { ProductData } from '@/components/menu/ProductCard';

interface BarViewProps {
  orders: OrderData[];
  products: ProductData[];
  onOrderUpdate?: (order: OrderData) => void;
  onOrderComplete?: (order: OrderData) => void;
  onStockUpdate?: (productId: string, quantity: number) => void;
}

export function BarView({
  orders,
  products,
  onOrderUpdate,
  onOrderComplete,
  onStockUpdate,
}: BarViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});

  // Filter products for bar (drinks, cocktails, etc.)
  const barProducts = products.filter((product) => {
    const category = product.categoryName?.toLowerCase();
    return (
      category?.includes('boisson') ||
      category?.includes('cocktail') ||
      category?.includes('bar') ||
      product.name.toLowerCase().includes('bière') ||
      product.name.toLowerCase().includes('vin') ||
      product.name.toLowerCase().includes('cocktail')
    );
  });

  // Get orders that contain bar items
  const barOrders = orders.filter((order) =>
    order.items.some((item) => {
      const category = item.product.categoryName?.toLowerCase();
      return (
        category?.includes('boisson') ||
        category?.includes('cocktail') ||
        category?.includes('bar') ||
        item.product.name.toLowerCase().includes('bière') ||
        item.product.name.toLowerCase().includes('vin') ||
        item.product.name.toLowerCase().includes('cocktail')
      );
    }),
  );

  // Get pending bar orders
  const pendingOrders = barOrders.filter((order) =>
    ['EN_ATTENTE', 'EN_PREPARATION'].includes(order.status || ''),
  );

  // Get ready bar orders
  const readyOrders = barOrders.filter((order) => order.status === 'PRETE');

  // Filter products
  const filteredProducts = barProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(barProducts.map((p) => p.categoryId))).map((categoryId) => {
    const category = barProducts.find((p) => p.categoryId === categoryId);
    return {
      id: categoryId,
      name: category?.categoryName || 'Non catégorisé',
    };
  });

  // Initialize stock levels
  useEffect(() => {
    const initialStock: Record<string, number> = {};
    barProducts.forEach((product) => {
      initialStock[product.id] = Math.floor(Math.random() * 100) + 20; // Mock stock
    });

    setStockLevels(initialStock);
  }, [barProducts]);

  // Add notifications for new orders
  useEffect(() => {
    const newOrders = pendingOrders.filter(
      (order) =>
        order.status === 'EN_ATTENTE' &&
        new Date(order.createdAt || '').getTime() > Date.now() - 30000, // Last 30 seconds
    );

    if (newOrders.length > 0) {
      setNotifications((prev) => [...prev, `${newOrders.length} nouvelle(s) commande(s) bar`]);
    }
  }, [pendingOrders]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_PREPARATION':
        return 'bg-blue-100 text-blue-800';
      case 'PRETE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_PREPARATION':
        return 'En préparation';
      case 'PRETE':
        return 'Prêt';
      default:
        return status;
    }
  };

  const getStockColor = (stock: number) => {
    if (stock <= 10) return 'text-red-600 bg-red-50';
    if (stock <= 25) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getElapsedTime = (dateString?: string) => {
    if (!dateString) return '';
    const now = new Date();
    const orderTime = new Date(dateString);
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 60000);
    return `${diff} min`;
  };

  const handleStartPreparation = (order: OrderData) => {
    onOrderUpdate?.({ ...order, status: 'EN_PREPARATION' });
  };

  const handleCompleteOrder = (order: OrderData) => {
    onOrderComplete?.({ ...order, status: 'PRETE' });
  };

  const handleStockUpdate = (productId: string, delta: number) => {
    const newStock = Math.max(0, (stockLevels[productId] || 0) + delta);
    setStockLevels((prev) => ({ ...prev, [productId]: newStock }));
    onStockUpdate?.(productId, newStock);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getTopSellingProducts = () => {
    const productSales: Record<string, number> = {};

    barOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (barProducts.some((p) => p.id === item.productId)) {
          productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        }
      });
    });

    return Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const product = barProducts.find((p) => p.id === productId);
        return { product, quantity };
      });
  };

  const topSelling = getTopSellingProducts().filter(({ product }) => product);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Martini className="h-8 w-8" />
              Bar
            </h1>
            <p className="text-gray-600">Gestion des commandes et stocks du bar</p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearNotifications} className="relative">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{barProducts.length}</div>
              <p className="text-sm text-gray-600">Produits bar</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
              <p className="text-sm text-gray-600">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {barOrders.filter((o) => o.status === 'EN_PREPARATION').length}
              </div>
              <p className="text-sm text-gray-600">En préparation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
              <p className="text-sm text-gray-600">Prêtes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(stockLevels).filter((stock) => stock <= 10).length}
              </div>
              <p className="text-sm text-gray-600">Stock bas</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="stock">Stocks</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Commandes en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{order.orderNumber}</span>
                          <Badge variant="outline">Table {order.table.number}</Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{getElapsedTime(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items
                          .filter((item) => barProducts.some((p) => p.id === item.productId))
                          .map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.product.name}
                              </span>
                              <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                            </div>
                          ))}
                      </div>

                      {order.notes && (
                        <div className="text-sm text-gray-600 italic mb-3">
                          Notes: {order.notes}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {order.status === 'EN_ATTENTE' && (
                          <Button
                            size="sm"
                            onClick={() => handleStartPreparation(order)}
                            className="flex-1"
                          >
                            Commencer
                          </Button>
                        )}
                        {order.status === 'EN_PREPARATION' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteOrder(order)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {pendingOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Martini className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Aucune commande en attente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ready Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Commandes prêtes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {readyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-green-200 bg-green-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{order.orderNumber}</span>
                          <Badge variant="outline">Table {order.table.number}</Badge>
                          <Badge className="bg-green-100 text-green-800">Prêt</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{getElapsedTime(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items
                          .filter((item) => barProducts.some((p) => p.id === item.productId))
                          .map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x {item.product.name}
                              </span>
                              <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                            </div>
                          ))}
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-green-700 font-medium">Prêt à être servi</p>
                      </div>
                    </div>
                  ))}

                  {readyOrders.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Aucune commande prête</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits du bar</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          {product.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <span className="font-bold">{product.price.toFixed(2)} €</span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline">{product.categoryName}</Badge>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(stockLevels[product.id] || 0)}`}
                        >
                          Stock: {stockLevels[product.id] || 0}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockUpdate(product.id, -1)}
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockUpdate(product.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <Martini className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun produit trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestion des stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {barProducts
                  .filter((product) => (stockLevels[product.id] || 0) <= 25)
                  .sort((a, b) => (stockLevels[a.id] || 0) - (stockLevels[b.id] || 0))
                  .map((product) => {
                    const stock = stockLevels[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.categoryName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStockColor(stock)}`}
                          >
                            {stock} unités
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, -5)}
                            >
                              -5
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, 5)}
                            >
                              +5
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {barProducts.filter((product) => (stockLevels[product.id] || 0) <= 25).length ===
                  0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Tous les stocks sont suffisants</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Produits les plus vendus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSelling.map(({ product, quantity }, index) => (
                    <div key={product!.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{product!.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{quantity} ventes</p>
                        <p className="text-sm text-gray-600">
                          {(quantity * product!.price).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Performance du bar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {barOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)} €
                    </div>
                    <p className="text-sm text-gray-600">CA total bar</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{barOrders.length}</div>
                      <p className="text-sm text-gray-600">Commandes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {barOrders.length > 0
                          ? (
                              barOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
                              barOrders.length
                            ).toFixed(2)
                          : '0.00'}{' '}
                        €
                      </div>
                      <p className="text-sm text-gray-600">Panier moyen</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>{notification}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
