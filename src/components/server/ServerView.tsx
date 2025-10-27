'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Utensils,
  DollarSign,
  Phone,
  Search,
  Filter,
  Bell,
  RefreshCw
} from 'lucide-react'
import { TableData } from '@/components/tables/TableCard'
import { OrderData } from '@/components/orders/OrderForm'
import { ProductData } from '@/components/menu/ProductCard'

interface ServerViewProps {
  tables: TableData[]
  orders: OrderData[]
  products: ProductData[]
  onTableSelect?: (table: TableData) => void
  onOrderCreate?: (table: TableData) => void
  onOrderUpdate?: (order: OrderData) => void
  onPaymentRequest?: (order: OrderData) => void
}

export function ServerView({ 
  tables, 
  orders, 
  products,
  onTableSelect, 
  onOrderCreate,
  onOrderUpdate,
  onPaymentRequest
}: ServerViewProps) {
  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState<string[]>([])

  // Get orders by table
  const getTableOrder = (tableId: string) => {
    return orders.find(order => order.tableId === tableId && order.status !== 'SERVIE')
  }

  // Filter tables by section
  const filteredTables = tables.filter(table => {
    const matchesSection = selectedSection === 'all' || table.section === selectedSection
    const matchesSearch = table.number.toString().includes(searchTerm)
    return matchesSection && matchesSearch
  })

  // Get sections from tables
  const sections = Array.from(new Set(tables.map(t => t.section).filter(Boolean)))

  // Get active orders (not served)
  const activeOrders = orders.filter(order => 
    ['EN_ATTENTE', 'EN_PREPARATION', 'PRETE'].includes(order.status || '')
  )

  // Get orders ready to serve
  const readyOrders = orders.filter(order => order.status === 'PRETE')

  // Get orders that need payment
  const paymentOrders = orders.filter(order => 
    order.status === 'SERVIE' && !order.payment
  )

  // Add notification for ready orders
  useEffect(() => {
    if (readyOrders.length > 0) {
      setNotifications(prev => [
        ...prev,
        `${readyOrders.length} commande(s) prête(s) à servir`
      ])
    }
  }, [readyOrders.length])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIBRE': return 'bg-green-100 text-green-800 border-green-200'
      case 'OCCUPEE': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'RESERVEE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'A_NETTOYER': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800'
      case 'EN_PREPARATION': return 'bg-blue-100 text-blue-800'
      case 'PRETE': return 'bg-green-100 text-green-800'
      case 'SERVIE': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente'
      case 'EN_PREPARATION': return 'En préparation'
      case 'PRETE': return 'Prêt'
      case 'SERVIE': return 'Servi'
      default: return status
    }
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getElapsedTime = (dateString?: string) => {
    if (!dateString) return ''
    const now = new Date()
    const orderTime = new Date(dateString)
    const diff = Math.floor((now.getTime() - orderTime.getTime()) / 60000)
    return `${diff} min`
  }

  const handleMarkAsServed = (order: OrderData) => {
    onOrderUpdate?.({ ...order, status: 'SERVIE' })
  }

  const handleRequestPayment = (order: OrderData) => {
    onPaymentRequest?.(order)
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Service en Salle
            </h1>
            <p className="text-gray-600">
              Gestion des tables et commandes en temps réel
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearNotifications}
                className="relative"
              >
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
              <div className="text-2xl font-bold">{tables.length}</div>
              <p className="text-sm text-gray-600">Total tables</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {tables.filter(t => t.status === 'OCCUPEE').length}
              </div>
              <p className="text-sm text-gray-600">Occupées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {tables.filter(t => t.status === 'RESERVEE').length}
              </div>
              <p className="text-sm text-gray-600">Réservées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {readyOrders.length}
              </div>
              <p className="text-sm text-gray-600">Prêtes à servir</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {paymentOrders.length}
              </div>
              <p className="text-sm text-gray-600">À encaisser</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="ready">Prêtes</TabsTrigger>
          <TabsTrigger value="payment">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          {/* Section Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedSection === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSection('all')}
              >
                Toutes
              </Button>
              {sections.map((section) => (
                <Button
                  key={section}
                  variant={selectedSection === section ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSection(section)}
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map((table) => {
              const order = getTableOrder(table.id)
              return (
                <Card 
                  key={table.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    getStatusColor(table.status)
                  }`}
                  onClick={() => onTableSelect?.(table)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-1">Table {table.number}</h3>
                      <p className="text-sm mb-2">{table.capacity} personnes</p>
                      {table.section && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {table.section}
                        </Badge>
                      )}
                      
                      {order && (
                        <div className="mt-3 space-y-2">
                          <Badge className={`w-full ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusText(order.status)}
                          </Badge>
                          <div className="text-xs text-gray-600">
                            <p>Commande: {order.orderNumber}</p>
                            <p>Temps: {getElapsedTime(order.createdAt)}</p>
                            <p>Total: {order.totalAmount.toFixed(2)} €</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            onOrderCreate?.(table)
                          }}
                          className="flex-1"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {order && order.status === 'PRETE' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsServed(order)
                            }}
                            className="flex-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commandes en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{order.orderNumber}</span>
                        <Badge variant="outline">Table {order.table.number}</Badge>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {getOrderStatusText(order.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{getElapsedTime(order.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.notes && (
                      <div className="text-sm text-gray-600 italic mb-3">
                        Notes: {order.notes}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total: {order.totalAmount.toFixed(2)} €</span>
                      <div className="flex gap-2">
                        {order.status === 'PRETE' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsServed(order)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marquer servi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {activeOrders.length === 0 && (
                  <div className="text-center py-8">
                    <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune commande en cours</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Commandes prêtes à servir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readyOrders.map((order) => (
                  <div key={order.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{order.orderNumber}</span>
                        <Badge variant="outline">Table {order.table.number}</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          Prêt
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{getElapsedTime(order.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total: {order.totalAmount.toFixed(2)} €</span>
                      <Button
                        onClick={() => handleMarkAsServed(order)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme servi
                      </Button>
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
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Demandes de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{order.orderNumber}</span>
                        <Badge variant="outline">Table {order.table.number}</Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          Servi
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(order.servedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total: {order.totalAmount.toFixed(2)} €</span>
                      <Button
                        onClick={() => handleRequestPayment(order)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Demander paiement
                      </Button>
                    </div>
                  </div>
                ))}
                
                {paymentOrders.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune demande de paiement</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>{notification}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}