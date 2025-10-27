'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search
} from 'lucide-react'
import { PaymentForm, PaymentData } from './PaymentForm'
import { ReceiptPreview } from './ReceiptPreview'
import { OrderData } from '@/components/orders/OrderForm'

interface CashRegisterProps {
  orders: OrderData[]
  onOrderSelect?: (order: OrderData) => void
  onPaymentComplete?: (paymentData: PaymentData) => void
}

interface CashRegisterStats {
  totalRevenue: number
  cashRevenue: number
  cardRevenue: number
  totalOrders: number
  averageOrder: number
  cashInRegister: number
  cashOut: number
  expectedCash: number
  actualCash: number
  difference: number
}

export function CashRegister({ orders, onOrderSelect, onPaymentComplete }: CashRegisterProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null)
  const [completedPayment, setCompletedPayment] = useState<PaymentData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [cashInRegister, setCashInRegister] = useState(500) // Starting cash
  const [actualCash, setActualCash] = useState<string>('')

  // Filter orders that need payment
  const unpaidOrders = orders.filter(order => !order.payment)
  const paidOrders = orders.filter(order => order.payment)

  const filteredOrders = unpaidOrders.filter(order => 
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.table.number.toString().includes(searchTerm)
  )

  const calculateStats = (): CashRegisterStats => {
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const cashRevenue = paidOrders.reduce((sum, order) => 
      sum + (order.payment?.method === 'ESPECES' ? order.totalAmount : 0), 0
    )
    const cardRevenue = paidOrders.reduce((sum, order) => 
      sum + (order.payment?.method === 'CARTE_BANCAIRE' ? order.totalAmount : 0), 0
    )
    const totalOrders = paidOrders.length
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const expectedCash = cashInRegister + cashRevenue
    const actual = parseFloat(actualCash) || 0
    const difference = actual - expectedCash

    return {
      totalRevenue,
      cashRevenue,
      cardRevenue,
      totalOrders,
      averageOrder,
      cashInRegister,
      cashOut: 0, // Would track cash withdrawals
      expectedCash,
      actualCash: actual,
      difference
    }
  }

  const stats = calculateStats()

  const handlePaymentComplete = (paymentData: PaymentData) => {
    setCompletedPayment(paymentData)
    onPaymentComplete?.(paymentData)
    
    // Update cash in register for cash payments
    if (paymentData.method === 'ESPECES') {
      setCashInRegister(prev => prev + paymentData.amount)
    }
  }

  const handleNewPayment = (order: OrderData) => {
    setSelectedOrder(order)
    setCompletedPayment(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CA total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% vs hier
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Espèces</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.cashRevenue)}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalOrders > 0 ? Math.round((stats.cashRevenue / stats.totalRevenue) * 100) : 0}% du CA
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Carte</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.cardRevenue)}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalOrders > 0 ? Math.round((stats.cardRevenue / stats.totalRevenue) * 100) : 0}% du CA
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Panier moyen</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.averageOrder)}</p>
                <p className="text-xs text-gray-500">{stats.totalOrders} commandes</p>
              </div>
              <Receipt className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Encaissements</TabsTrigger>
          <TabsTrigger value="cash">Caisse</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          {selectedOrder ? (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedOrder(null)}
              >
                ← Retour à la liste
              </Button>
              
              {!completedPayment ? (
                <PaymentForm
                  order={selectedOrder}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={() => setSelectedOrder(null)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                      Paiement effectué avec succès!
                    </h2>
                    <p className="text-gray-600">
                      Le paiement de {formatCurrency(completedPayment.amount)} a été enregistré
                    </p>
                  </div>
                  
                  <ReceiptPreview
                    order={selectedOrder}
                    payment={completedPayment}
                    onPrint={() => console.log('Print receipt')}
                    onEmail={() => console.log('Email receipt')}
                    onDownload={() => console.log('Download receipt')}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1"
                    >
                      Nouveau paiement
                    </Button>
                    <Button 
                      onClick={() => window.print()}
                      className="flex-1"
                    >
                      Imprimer le ticket
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Commandes à encaisser</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une commande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredOrders.length > 0 ? (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{order.orderNumber}</span>
                            <Badge variant="outline">Table {order.table.number}</Badge>
                            <span className="text-sm text-gray-600">
                              {order.items.length} articles
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Total: {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleNewPayment(order)}
                          size="sm"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Encaisser
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucune commande à encaisser
                    </h3>
                    <p className="text-gray-500">
                      Toutes les commandes ont été payées
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cash" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>État de la caisse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Fond de caisse initial:</span>
                    <span className="font-medium">{formatCurrency(stats.cashInRegister)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recettes espèces:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(stats.cashRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dépenses:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(stats.cashOut)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total attendu:</span>
                      <span>{formatCurrency(stats.expectedCash)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="actualCash" className="text-sm font-medium">
                    Comptage réel:
                  </label>
                  <Input
                    id="actualCash"
                    type="number"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Écart:</span>
                    <span className={stats.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {stats.difference >= 0 ? '+' : ''}{formatCurrency(stats.difference)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé des paiements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Espèces:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.cashRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Carte bancaire:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(stats.cardRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-gray-600" />
                      <span>Autres:</span>
                    </div>
                    <span className="font-medium">{formatCurrency(0)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="text-xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Panier moyen</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.averageOrder)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des encaissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paidOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge variant="outline">Table {order.table.number}</Badge>
                        <Badge 
                          variant={order.payment?.method === 'ESPECES' ? 'default' : 'secondary'}
                        >
                          {order.payment?.method === 'ESPECES' ? 'Espèces' : 'Carte'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {order.createdAt && new Date(order.createdAt).toLocaleString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(order.totalAmount)}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('View receipt:', order.id)}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Ticket
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}