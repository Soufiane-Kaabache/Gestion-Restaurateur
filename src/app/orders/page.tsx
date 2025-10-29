'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Utensils } from 'lucide-react';
import Link from 'next/link';
import { OrderList } from '@/components/orders/OrderList';
import { OrderForm, OrderData } from '@/components/orders/OrderForm';
import { ProductData } from '@/components/menu/ProductCard';
import { TableData } from '@/components/tables/TableCard';

// Mock data - dans une vraie application, cela viendrait de l'API
const mockProducts: ProductData[] = [
  {
    id: '1',
    name: 'Burger Classic',
    description: 'Délicieux burger avec bœuf, laitue, tomate, oignon et sauce maison',
    price: 12.9,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '1',
    categoryName: 'Plats principaux',
    allergens: 'Gluten, Lactose',
    preparationTime: 20,
    orderCount: 45,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Salade César',
    description: 'Salade fraîche avec poulet grillé, parmesan et croûtons',
    price: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '2',
    categoryName: 'Entrées',
    allergens: 'Gluten, Lactose, Œuf',
    preparationTime: 10,
    orderCount: 32,
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    description: 'Pizza classique avec sauce tomate, mozzarella et basilic',
    price: 11.5,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '3',
    categoryName: 'Plats principaux',
    allergens: 'Gluten, Lactose',
    preparationTime: 15,
    orderCount: 28,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Soupe du jour',
    description: 'Soupe maison de saison avec légumes frais',
    price: 6.5,
    isAvailable: false,
    categoryId: '2',
    categoryName: 'Entrées',
    allergens: '',
    preparationTime: 5,
    orderCount: 15,
    rating: 3.8,
  },
  {
    id: '5',
    name: 'Steak Frites',
    description: 'Steak de bœuf grillé avec frites maison et sauce au choix',
    price: 18.9,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '1',
    categoryName: 'Plats principaux',
    allergens: 'Gluten',
    preparationTime: 25,
    orderCount: 38,
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Tiramisu',
    description: 'Dessert italien classique avec café et mascarpone',
    price: 7.5,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '4',
    categoryName: 'Desserts',
    allergens: 'Gluten, Lactose, Œuf',
    preparationTime: 5,
    orderCount: 22,
    rating: 4.8,
  },
  {
    id: '7',
    name: 'Coca-Cola',
    description: 'Boisson gazeuse classique',
    price: 3.0,
    isAvailable: true,
    categoryId: '5',
    categoryName: 'Boissons',
    allergens: '',
    preparationTime: 2,
    orderCount: 65,
    rating: 4.0,
  },
  {
    id: '8',
    name: 'Bière artisanale',
    description: 'Bière locale brassée artisanalement',
    price: 5.5,
    isAvailable: true,
    categoryId: '5',
    categoryName: 'Boissons',
    allergens: 'Gluten',
    preparationTime: 2,
    orderCount: 18,
    rating: 4.3,
  },
];

const mockTables: TableData[] = [
  {
    id: '1',
    number: 1,
    capacity: 4,
    status: 'LIBRE',
    positionX: 100,
    positionY: 100,
    section: 'terrasse',
  },
  {
    id: '2',
    number: 2,
    capacity: 2,
    status: 'OCCUPEE',
    positionX: 200,
    positionY: 100,
    section: 'terrasse',
    currentOrder: {
      id: 'CMD-001',
      amount: 45.5,
      time: '12:30',
      duration: 45,
    },
  },
  {
    id: '3',
    number: 3,
    capacity: 6,
    status: 'RESERVEE',
    positionX: 300,
    positionY: 100,
    section: 'salle',
    reservation: {
      customerName: 'Dupont Jean',
      time: '20:00',
      guests: 6,
    },
  },
  {
    id: '4',
    number: 4,
    capacity: 4,
    status: 'LIBRE',
    positionX: 100,
    positionY: 200,
    section: 'salle',
  },
  {
    id: '5',
    number: 5,
    capacity: 2,
    status: 'A_NETTOYER',
    positionX: 200,
    positionY: 200,
    section: 'salle',
  },
  {
    id: '6',
    number: 6,
    capacity: 8,
    status: 'OCCUPEE',
    positionX: 300,
    positionY: 200,
    section: 'privé',
    currentOrder: {
      id: 'CMD-002',
      amount: 125.8,
      time: '13:15',
      duration: 30,
    },
  },
];

const mockOrders: OrderData[] = [
  {
    id: 'CMD-001',
    orderNumber: 'CMD-001',
    tableId: '2',
    table: mockTables[1],
    items: [
      {
        id: '1',
        productId: '1',
        product: mockProducts[0],
        quantity: 2,
        unitPrice: 12.9,
        notes: 'Sans oignon',
      },
      {
        id: '2',
        productId: '7',
        product: mockProducts[6],
        quantity: 2,
        unitPrice: 3.0,
      },
    ],
    notes: 'Client allergique aux oignons',
    totalAmount: 31.8,
    taxAmount: 3.18,
    discount: 0,
    tip: 2.0,
    status: 'EN_PREPARATION',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'CMD-002',
    orderNumber: 'CMD-002',
    tableId: '6',
    table: mockTables[5],
    items: [
      {
        id: '3',
        productId: '5',
        product: mockProducts[4],
        quantity: 1,
        unitPrice: 18.9,
      },
      {
        id: '4',
        productId: '2',
        product: mockProducts[1],
        quantity: 1,
        unitPrice: 9.5,
      },
      {
        id: '5',
        productId: '8',
        product: mockProducts[7],
        quantity: 2,
        unitPrice: 5.5,
      },
    ],
    notes: 'Steak saignant',
    totalAmount: 39.4,
    taxAmount: 3.94,
    discount: 0,
    tip: 5.0,
    status: 'PRETE',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'CMD-003',
    orderNumber: 'CMD-003',
    tableId: '4',
    table: mockTables[3],
    items: [
      {
        id: '6',
        productId: '3',
        product: mockProducts[2],
        quantity: 1,
        unitPrice: 11.5,
      },
      {
        id: '7',
        productId: '6',
        product: mockProducts[5],
        quantity: 1,
        unitPrice: 7.5,
      },
    ],
    notes: '',
    totalAmount: 19.0,
    taxAmount: 1.9,
    discount: 0,
    tip: 0,
    status: 'SERVIE',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders);
  const [products] = useState<ProductData[]>(mockProducts);
  const [tables] = useState<TableData[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const availableTables = tables.filter((table) => table.status === 'LIBRE');

  const handleCreateOrder = (table: TableData) => {
    setSelectedTable(table);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = (orderData: OrderData) => {
    const newOrder: OrderData = {
      ...orderData,
      id: `CMD-${Date.now()}`,
      orderNumber: `CMD-${Date.now()}`,
      status: 'EN_ATTENTE',
      createdAt: new Date().toISOString(),
    };

    if (editingOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : order,
        ),
      );
    } else {
      setOrders((prev) => [...prev, newOrder]);
    }

    setShowOrderForm(false);
    setSelectedTable(null);
    setEditingOrder(null);
  };

  const handleOrderEdit = (order: OrderData) => {
    setEditingOrder(order);
    setSelectedTable(order.table);
    setShowOrderForm(true);
  };

  const handleOrderDelete = async (orderId: string) => {
    const { alert } = await import('@/lib/sweetalert');
    const result = await alert.confirm(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette commande ?',
    );
    if (result.isConfirmed) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const handleOrderStatusUpdate = (orderId: string, status: string) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: status as any } : order)),
    );
  };

  const getOrderStats = () => {
    const total = orders.length;
    const enAttente = orders.filter((o) => o.status === 'EN_ATTENTE').length;
    const enPreparation = orders.filter((o) => o.status === 'EN_PREPARATION').length;
    const pretes = orders.filter((o) => o.status === 'PRETE').length;
    const servies = orders.filter((o) => o.status === 'SERVIE').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, enAttente, enPreparation, pretes, servies, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestion des commandes</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">Total commandes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.enAttente}</div>
              <p className="text-sm text-gray-600">En attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.enPreparation}</div>
              <p className="text-sm text-gray-600">En préparation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.pretes}</div>
              <p className="text-sm text-gray-600">Prêtes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.servies}</div>
              <p className="text-sm text-gray-600">Servies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
              <p className="text-sm text-gray-600">CA total</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      {showOrderForm && selectedTable ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowOrderForm(false);
                setSelectedTable(null);
                setEditingOrder(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux commandes
            </Button>
            <h2 className="text-2xl font-bold">
              {editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
            </h2>
          </div>
          <OrderForm
            table={selectedTable}
            products={products}
            initialOrder={editingOrder}
            onSubmit={handleOrderSubmit}
            onCancel={() => {
              setShowOrderForm(false);
              setSelectedTable(null);
              setEditingOrder(null);
            }}
          />
        </div>
      ) : (
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">Liste des commandes</TabsTrigger>
            <TabsTrigger value="new">Nouvelle commande</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <OrderList
              orders={orders}
              onOrderSelect={(order) => console.log('Order selected:', order)}
              onOrderEdit={handleOrderEdit}
              onOrderDelete={handleOrderDelete}
              onOrderStatusUpdate={handleOrderStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Sélectionner une table</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTables.map((table) => (
                  <Card key={table.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Table {table.number}</h3>
                        <p className="text-gray-600 mb-4">{table.capacity} personnes</p>
                        {table.section && (
                          <p className="text-sm text-gray-500 mb-4">{table.section}</p>
                        )}
                        <Button onClick={() => handleCreateOrder(table)} className="w-full">
                          <Utensils className="h-4 w-4 mr-2" />
                          Créer une commande
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {availableTables.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-gray-600 mb-4">Aucune table disponible</p>
                    <Link href="/tables">
                      <Button variant="outline">Voir les tables</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
