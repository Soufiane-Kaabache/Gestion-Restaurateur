'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Cocktail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Wine,
  Beer,
  Coffee,
  IceCream,
  Package,
  TrendingUp,
  Bell,
  Users
} from 'lucide-react'

interface DrinkOrder {
  id: string
  tableNumber: number
  items: DrinkItem[]
  status: 'pending' | 'preparing' | 'ready' | 'served'
  priority: 'low' | 'normal' | 'high'
  orderTime: string
  serverName: string
  notes?: string
}

interface DrinkItem {
  id: string
  name: string
  category: string
  quantity: number
  preparationTime: number
  ingredients: Ingredient[]
  instructions?: string
}

interface Ingredient {
  id: string
  name: string
  stockLevel: number
  unit: string
  minStock: number
  price: number
}

interface StockAlert {
  ingredientId: string
  ingredientName: string
  currentStock: number
  minStock: number
  unit: string
}

export default function BarScreen() {
  const [selectedOrder, setSelectedOrder] = useState<DrinkOrder | null>(null)
  const [activeTab, setActiveTab] = useState('orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState(2)

  // Mock data for orders
  const drinkOrders: DrinkOrder[] = [
    {
      id: 'BAR-001',
      tableNumber: 5,
      items: [
        {
          id: '1',
          name: 'Mojito',
          category: 'Cocktails',
          quantity: 2,
          preparationTime: 5,
          ingredients: [
            { id: '1', name: 'Rhum blanc', stockLevel: 80, unit: 'cl', minStock: 20, price: 0.50 },
            { id: '2', name: 'Menthe', stockLevel: 15, unit: 'unités', minStock: 10, price: 0.20 },
            { id: '3', name: 'Citron vert', stockLevel: 8, unit: 'unités', minStock: 5, price: 0.30 }
          ],
          instructions: 'Bien remuer, servir avec beaucoup de glace'
        },
        {
          id: '2',
          name: 'Café crème',
          category: 'Chaud',
          quantity: 1,
          preparationTime: 3,
          ingredients: [
            { id: '4', name: 'Café', stockLevel: 90, unit: 'unités', minStock: 20, price: 0.40 },
            { id: '5', name: 'Lait', stockLevel: 60, unit: 'cl', minStock: 30, price: 0.20 }
          ]
        }
      ],
      status: 'pending',
      priority: 'normal',
      orderTime: '14:30',
      serverName: 'Marie',
      notes: 'Client allergique à la noix de coco'
    },
    {
      id: 'BAR-002',
      tableNumber: 8,
      items: [
        {
          id: '3',
          name: 'Verre de vin rouge',
          category: 'Vins',
          quantity: 1,
          preparationTime: 2,
          ingredients: [
            { id: '6', name: 'Vin rouge', stockLevel: 75, unit: 'cl', minStock: 50, price: 0.80 }
          ]
        }
      ],
      status: 'preparing',
      priority: 'high',
      orderTime: '14:25',
      serverName: 'Jean'
    },
    {
      id: 'BAR-003',
      tableNumber: 12,
      items: [
        {
          id: '4',
          name: 'Bière pression',
          category: 'Bières',
          quantity: 3,
          preparationTime: 2,
          ingredients: [
            { id: '7', name: 'Bière blonde', stockLevel: 40, unit: 'cl', minStock: 100, price: 0.60 }
          ]
        }
      ],
      status: 'ready',
      priority: 'normal',
      orderTime: '14:20',
      serverName: 'Sophie'
    }
  ]

  // Stock alerts
  const stockAlerts: StockAlert[] = [
    { ingredientId: '2', ingredientName: 'Menthe', currentStock: 15, minStock: 10, unit: 'unités' },
    { ingredientId: '3', ingredientName: 'Citron vert', currentStock: 8, minStock: 5, unit: 'unités' },
    { ingredientId: '7', ingredientName: 'Bière blonde', currentStock: 40, minStock: 100, unit: 'cl' }
  ]

  const updateOrderStatus = (orderId: string, status: DrinkOrder['status']) => {
    // In a real app, this would update the backend
    console.log(`Order ${orderId} status updated to ${status}`)
  }

  const getStatusColor = (status: DrinkOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'served': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: DrinkOrder['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cocktails': return <Cocktail className="h-4 w-4" />
      case 'Vins': return <Wine className="h-4 w-4" />
      case 'Bières': return <Beer className="h-4 w-4" />
      case 'Chaud': return <Coffee className="h-4 w-4" />
      case 'Desserts': return <IceCream className="h-4 w-4" />
      default: return <Cocktail className="h-4 w-4" />
    }
  }

  const getStockColor = (current: number, min: number) => {
    const percentage = (current / min) * 100
    if (percentage <= 50) return 'text-red-600'
    if (percentage <= 100) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStockProgress = (current: number, min: number) => {
    const percentage = Math.min((current / min) * 100, 100)
    return percentage
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cocktail className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Bar</h1>
            <Badge variant="outline">Barman</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="recipes">Recettes</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4">
            {drinkOrders.map((order) => (
              <Card 
                key={order.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-500">Table {order.tableNumber}</div>
                      </div>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority === 'high' && 'Urgent'}
                        {order.priority === 'normal' && 'Normal'}
                        {order.priority === 'low' && 'Basse'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status === 'pending' && 'En attente'}
                        {order.status === 'preparing' && 'Préparation'}
                        {order.status === 'ready' && 'Prêt'}
                        {order.status === 'served' && 'Servi'}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">{order.orderTime}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          <span>{item.name}</span>
                          <Badge variant="outline" className="text-xs">
                            ×{item.quantity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{item.preparationTime}min</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {order.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-500">
                      Serveur: {order.serverName}
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, 'preparing')
                          }}
                        >
                          Commencer
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, 'ready')
                          }}
                        >
                          Terminer
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            updateOrderStatus(order.id, 'served')
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Servi
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Stock Tab */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Alertes de Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockAlerts.map((alert) => (
                  <div key={alert.ingredientId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{alert.ingredientName}</div>
                      <div className="text-sm text-gray-500">
                        Stock actuel: {alert.currentStock} {alert.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getStockColor(alert.currentStock, alert.minStock)}`}>
                        {alert.currentStock} {alert.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {alert.minStock} {alert.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                État du Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drinkOrders.flatMap(order => order.items).flatMap(item => item.ingredients).map((ingredient) => (
                  <div key={ingredient.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className={`text-sm ${getStockColor(ingredient.stockLevel, ingredient.minStock)}`}>
                        {ingredient.stockLevel} {ingredient.unit}
                      </span>
                    </div>
                    <Progress 
                      value={getStockProgress(ingredient.stockLevel, ingredient.minStock)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4">
            {['Cocktails', 'Vins', 'Bières', 'Chaud'].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {drinkOrders
                      .flatMap(order => order.items)
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div key={item.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{item.name}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{item.preparationTime}min</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-700">Ingrédients:</div>
                            <div className="grid gap-1">
                              {item.ingredients.map((ingredient) => (
                                <div key={ingredient.id} className="flex items-center justify-between text-sm">
                                  <span>{ingredient.name}</span>
                                  <span className="text-gray-500">{ingredient.price.toFixed(2)}€</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {item.instructions && (
                            <div className="mt-2 pt-2 border-t">
                              <div className="text-sm font-medium text-gray-700">Instructions:</div>
                              <div className="text-sm text-gray-600">{item.instructions}</div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}