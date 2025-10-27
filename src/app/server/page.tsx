'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Utensils,
  Coffee,
  Wine,
  ChefHat,
  DollarSign,
  MessageSquare,
  Bell
} from 'lucide-react'

interface Table {
  id: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning'
  currentOrder?: {
    id: string
    items: number
    total: number
    time: string
    status: 'active' | 'ready' | 'payment'
  }
  assignedServer?: string
}

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  allergens?: string[]
  image?: string
  preparationTime: number
}

interface OrderItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
  modifications?: string[]
}

export default function ServerScreen() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('tables')
  const [notifications, setNotifications] = useState(3)

  // Tables mock data
  const tables: Table[] = [
    {
      id: '1',
      number: 1,
      capacity: 4,
      status: 'occupied',
      currentOrder: {
        id: 'ORD-001',
        items: 3,
        total: 45.50,
        time: '12:30',
        status: 'active'
      },
      assignedServer: 'Marie'
    },
    {
      id: '2',
      number: 2,
      capacity: 2,
      status: 'available',
      assignedServer: 'Marie'
    },
    {
      id: '3',
      number: 3,
      capacity: 6,
      status: 'occupied',
      currentOrder: {
        id: 'ORD-002',
        items: 5,
        total: 78.25,
        time: '13:15',
        status: 'ready'
      },
      assignedServer: 'Jean'
    },
    {
      id: '4',
      number: 4,
      capacity: 4,
      status: 'reserved',
      assignedServer: 'Marie'
    }
  ]

  // Menu items mock data
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Burger Classic',
      category: 'Plats',
      price: 12.50,
      description: 'Boeuf, laitue, tomate, oignon',
      allergens: ['gluten'],
      preparationTime: 15
    },
    {
      id: '2',
      name: 'Salade César',
      category: 'Entrées',
      price: 8.50,
      description: 'Poulet grillé, parmesan, croûtons',
      allergens: ['gluten'],
      preparationTime: 10
    },
    {
      id: '3',
      name: 'Café',
      category: 'Boissons',
      price: 2.50,
      description: 'Café noir ou au lait',
      preparationTime: 3
    },
    {
      id: '4',
      name: 'Vin Rouge',
      category: 'Boissons',
      price: 6.00,
      description: 'Verre de vin rouge de la maison',
      preparationTime: 2
    }
  ]

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id)
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setOrderItems([...orderItems, { menuItem, quantity: 1 }])
    }
  }

  const removeFromOrder = (menuItemId: string) => {
    setOrderItems(orderItems.filter(item => item.menuItem.id !== menuItemId))
  }

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromOrder(menuItemId)
    } else {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0)
  }

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'needs_cleaning': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Entrées': return <Utensils className="h-4 w-4" />
      case 'Plats': return <ChefHat className="h-4 w-4" />
      case 'Boissons': return <Coffee className="h-4 w-4" />
      case 'Desserts': return <Wine className="h-4 w-4" />
      default: return <Utensils className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Service Salle</h1>
            <Badge variant="outline">Marie</Badge>
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
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="order">Commande</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>

        {/* Tables Tab */}
        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Card 
                key={table.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTable?.id === table.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTable(table)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">Table {table.number}</span>
                    </div>
                    <Badge className={getStatusColor(table.status)}>
                      {table.status === 'available' && 'Libre'}
                      {table.status === 'occupied' && 'Occupée'}
                      {table.status === 'reserved' && 'Réservée'}
                      {table.status === 'needs_cleaning' && 'Nettoyage'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    {table.capacity} personnes
                  </div>

                  {table.currentOrder && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Commande {table.currentOrder.id}</span>
                        <span>{table.currentOrder.time}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>{table.currentOrder.items} articles</span>
                        <span>{table.currentOrder.total.toFixed(2)}€</span>
                      </div>
                      <Badge className={`text-xs ${getOrderStatusColor(table.currentOrder.status)}`}>
                        {table.currentOrder.status === 'active' && 'En cours'}
                        {table.currentOrder.status === 'ready' && 'Prête'}
                        {table.currentOrder.status === 'payment' && 'Paiement'}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Order Tab */}
        <TabsContent value="order" className="space-y-4">
          {selectedTable ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Commande - Table {selectedTable.number}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedTable(null)
                        setOrderItems([])
                      }}
                    >
                      Changer de table
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun article dans la commande</p>
                      <p className="text-sm">Allez dans l'onglet Menu pour ajouter des articles</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {orderItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{item.menuItem.name}</div>
                                <div className="text-sm text-gray-500">{item.menuItem.description}</div>
                                <div className="text-sm font-medium">{item.menuItem.price.toFixed(2)}€</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeFromOrder(item.menuItem.id)}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{calculateTotal().toFixed(2)}€</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setActiveTab('menu')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter des articles
                        </Button>
                        <Button className="flex-1" variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Envoyer en cuisine
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500">Sélectionnez une table pour commencer</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Menu Tab */}
        <TabsContent value="menu" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un plat ou une boisson..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {!selectedTable && (
            <Card className="mb-4">
              <CardContent className="text-center py-4">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-gray-600">Sélectionnez une table pour prendre une commande</p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {['Entrées', 'Plats', 'Boissons', 'Desserts'].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {filteredMenuItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div 
                          key={item.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            selectedTable ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => selectedTable && addToOrder(item)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {item.allergens.map((allergen, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {allergen}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{item.price.toFixed(2)}€</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.preparationTime}min
                            </div>
                          </div>
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