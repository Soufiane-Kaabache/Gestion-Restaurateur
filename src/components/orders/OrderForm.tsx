'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, Search, Clock, Users, DollarSign } from 'lucide-react';
import { ProductData } from '@/components/menu/ProductCard';
import { TableData } from '@/components/tables/TableCard';

export interface OrderItem {
  id: string;
  productId: string;
  product: ProductData;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface OrderData {
  id: string;
  tableId: string;
  table: TableData;
  items: OrderItem[];
  notes?: string;
  totalAmount: number;
  taxAmount: number;
  discount: number;
  tip: number;
  status?: 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRETE' | 'SERVIE' | 'ANNULEE';
  // Payment can have various fields depending on the provider; keep flexible
  payment?: Record<string, any>;
  servedAt?: string;
  createdAt?: string;
  orderNumber?: string;
}

interface OrderFormProps {
  table: TableData;
  products: ProductData[];
  initialOrder?: OrderData | null;
  onSubmit: (order: OrderData) => void;
  onCancel: () => void;
}

export function OrderForm({ table, products, initialOrder, onSubmit, onCancel }: OrderFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.categoryId))).map((categoryId) => {
    const category = products.find((p) => p.categoryId === categoryId);
    return {
      id: categoryId,
      name: category?.categoryName || 'Non catégorisé',
    };
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesAvailability = product.isAvailable;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Initialize with initial order data
  useEffect(() => {
    if (initialOrder) {
      setOrderItems(initialOrder.items);
      setOrderNotes(initialOrder.notes || '');
      setDiscount(initialOrder.discount);
      setTip(initialOrder.tip);
    }
  }, [initialOrder]);

  const addToOrder = (product: ProductData) => {
    const existingItem = orderItems.find((item) => item.productId === product.id);

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      const newItem: OrderItem = {
        id: Date.now().toString(),
        productId: product.id,
        product,
        quantity: 1,
        unitPrice: product.price,
      };
      setOrderItems((prev) => [...prev, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
    } else {
      setOrderItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
      );
    }
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItemNotes = (itemId: string, notes: string) => {
    setOrderItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, notes } : item)));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.1; // 10% TVA
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax - discount + tip;
  };

  const handleSubmit = () => {
    if (orderItems.length === 0) {
      alert('Veuillez ajouter au moins un produit à la commande');
      return;
    }

    const orderData: OrderData = {
      id: initialOrder?.id ?? Date.now().toString(),
      tableId: table.id,
      table,
      items: orderItems,
      notes: orderNotes,
      totalAmount: calculateTotal(),
      taxAmount: calculateTax(),
      discount,
      tip,
    };

    onSubmit(orderData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Table {table.number} - {table.capacity} personnes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
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

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addToOrder(product)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        {product.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-sm">{product.price.toFixed(2)} €</span>
                          {product.preparationTime && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {product.preparationTime}min
                            </div>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Récapitulatif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.product.name}</span>
                      <span className="font-bold text-sm">
                        {(item.unitPrice * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromOrder(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {item.notes && (
                      <p className="text-xs text-gray-600 mt-1 italic">Note: {item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {orderItems.length === 0 && (
              <p className="text-center text-gray-500 py-4">Aucun produit ajouté</p>
            )}

            <Separator />

            {/* Order Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes de commande</Label>
              <Textarea
                id="notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes spéciales pour la commande..."
                rows={2}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total:</span>
                <span>{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (10%):</span>
                <span>{calculateTax().toFixed(2)} €</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="discount" className="text-sm">
                  Remise:
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 h-8"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm">€</span>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="tip" className="text-sm">
                  Pourboire:
                </Label>
                <Input
                  id="tip"
                  type="number"
                  value={tip}
                  onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                  className="w-20 h-8"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm">€</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={orderItems.length === 0}>
                {initialOrder ? 'Modifier' : 'Créer'} la commande
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
