'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { CashRegister } from '@/components/payment/CashRegister'
import { OrderData } from '@/components/orders/OrderForm'

// Mock data - dans une vraie application, cela viendrait de l'API
const mockOrders: OrderData[] = [
  {
    id: 'CMD-001',
    orderNumber: 'CMD-001',
    tableId: '2',
    table: {
      id: '2',
      number: 2,
      capacity: 2,
      status: 'OCCUPEE',
      positionX: 200,
      positionY: 100,
      section: 'terrasse',
      currentOrder: {
        id: 'CMD-001',
        amount: 45.50,
        time: '12:30',
        duration: 45
      }
    },
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Burger Classic',
          description: 'Délicieux burger avec bœuf, laitue, tomate, oignon et sauce maison',
          price: 12.90,
          imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
          isAvailable: true,
          categoryId: '1',
          categoryName: 'Plats principaux',
          allergens: 'Gluten, Lactose',
          preparationTime: 20,
          orderCount: 45,
          rating: 4.5
        },
        quantity: 2,
        unitPrice: 12.90,
        notes: 'Sans oignon'
      },
      {
        id: '2',
        productId: '7',
        product: {
          id: '7',
          name: 'Coca-Cola',
          description: 'Boisson gazeuse classique',
          price: 3.00,
          isAvailable: true,
          categoryId: '5',
          categoryName: 'Boissons',
          allergens: '',
          preparationTime: 2,
          orderCount: 65,
          rating: 4.0
        },
        quantity: 2,
        unitPrice: 3.00
      }
    ],
    notes: 'Client allergique aux oignons',
    totalAmount: 31.80,
    taxAmount: 3.18,
    discount: 0,
    tip: 2.00,
    status: 'SERVIE',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    payment: {
      id: 'PAY-001',
      orderId: 'CMD-001',
      amount: 33.80,
      method: 'CARTE_BANCAIRE',
      status: 'VALIDEE',
      transactionId: 'TXN-123456',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString()
    }
  },
  {
    id: 'CMD-002',
    orderNumber: 'CMD-002',
    tableId: '6',
    table: {
      id: '6',
      number: 6,
      capacity: 8,
      status: 'OCCUPEE',
      positionX: 300,
      positionY: 200,
      section: 'privé',
      currentOrder: {
        id: 'CMD-002',
        amount: 125.80,
        time: '13:15',
        duration: 30
      }
    },
    items: [
      {
        id: '3',
        productId: '5',
        product: {
          id: '5',
          name: 'Steak Frites',
          description: 'Steak de bœuf grillé avec frites maison et sauce au choix',
          price: 18.90,
          imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=200&fit=crop',
          isAvailable: true,
          categoryId: '1',
          categoryName: 'Plats principaux',
          allergens: 'Gluten',
          preparationTime: 25,
          orderCount: 38,
          rating: 4.6
        },
        quantity: 1,
        unitPrice: 18.90
      },
      {
        id: '4',
        productId: '2',
        product: {
          id: '2',
          name: 'Salade César',
          description: 'Salade fraîche avec poulet grillé, parmesan et croûtons',
          price: 9.50,
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          isAvailable: true,
          categoryId: '2',
          categoryName: 'Entrées',
          allergens: 'Gluten, Lactose, Œuf',
          preparationTime: 10,
          orderCount: 32,
          rating: 4.2
        },
        quantity: 1,
        unitPrice: 9.50
      },
      {
        id: '5',
        productId: '8',
        product: {
          id: '8',
          name: 'Bière artisanale',
          description: 'Bière locale brassée artisanalement',
          price: 5.50,
          isAvailable: true,
          categoryId: '5',
          categoryName: 'Boissons',
          allergens: 'Gluten',
          preparationTime: 2,
          orderCount: 18,
          rating: 4.3
        },
        quantity: 2,
        unitPrice: 5.50
      }
    ],
    notes: 'Steak saignant',
    totalAmount: 39.40,
    taxAmount: 3.94,
    discount: 0,
    tip: 5.00,
    status: 'SERVIE',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: 'CMD-003',
    orderNumber: 'CMD-003',
    tableId: '4',
    table: {
      id: '4',
      number: 4,
      capacity: 4,
      status: 'OCCUPEE',
      positionX: 100,
      positionY: 200,
      section: 'salle'
    },
    items: [
      {
        id: '6',
        productId: '3',
        product: {
          id: '3',
          name: 'Pizza Margherita',
          description: 'Pizza classique avec sauce tomate, mozzarella et basilic',
          price: 11.50,
          imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&h=200&fit=crop',
          isAvailable: true,
          categoryId: '3',
          categoryName: 'Plats principaux',
          allergens: 'Gluten, Lactose',
          preparationTime: 15,
          orderCount: 28,
          rating: 4.7
        },
        quantity: 2,
        unitPrice: 11.50,
        notes: 'Extra basilic'
      },
      {
        id: '7',
        productId: '6',
        product: {
          id: '6',
          name: 'Tiramisu',
          description: 'Dessert italien classique avec café et mascarpone',
          price: 7.50,
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
          isAvailable: true,
          categoryId: '4',
          categoryName: 'Desserts',
          allergens: 'Gluten, Lactose, Œuf',
          preparationTime: 5,
          orderCount: 22,
          rating: 4.8
        },
        quantity: 1,
        unitPrice: 7.50
      }
    ],
    notes: '',
    totalAmount: 30.50,
    taxAmount: 3.05,
    discount: 0,
    tip: 0,
    status: 'PRETE',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString()
  }
]

export default function PaymentPage() {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders)

  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData)
    // In a real app, this would update the order status and save the payment
  }

  const getCashRegisterStats = () => {
    const paidOrders = orders.filter(order => order.payment)
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const cashRevenue = paidOrders.reduce((sum, order) => 
      sum + (order.payment?.method === 'ESPECES' ? order.totalAmount : 0), 0
    )
    const cardRevenue = paidOrders.reduce((sum, order) => 
      sum + (order.payment?.method === 'CARTE_BANCAIRE' ? order.totalAmount : 0), 0
    )
    const totalOrders = paidOrders.length
    const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      cashRevenue,
      cardRevenue,
      totalOrders,
      averageOrder
    }
  }

  const stats = getCashRegisterStats()

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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Caisse
          </h1>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
              <p className="text-sm text-gray-600">Chiffre d'affaires</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.cashRevenue.toFixed(2)} €</div>
              <p className="text-sm text-gray-600">Espèces</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.cardRevenue.toFixed(2)} €</div>
              <p className="text-sm text-gray-600">Carte bancaire</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-sm text-gray-600">Transactions</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cash Register */}
      <CashRegister
        orders={orders}
        onOrderSelect={(order) => console.log('Order selected:', order)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}