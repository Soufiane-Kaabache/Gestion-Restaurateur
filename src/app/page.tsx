'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigation } from '@/components/layout/Navigation'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Utensils,
  Calendar,
  Package,
  ChefHat,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [stats, setStats] = useState({
    todayRevenue: 2847.50,
    ordersCount: 67,
    averageOrder: 42.50,
    occupiedTables: 12,
    totalTables: 20,
    pendingOrders: 3,
    readyOrders: 2,
    lowStockItems: 5,
    reservationsToday: 15
  })

  const [recentOrders, setRecentOrders] = useState([
    { id: 'CMD-001', table: 'Table 5', amount: 67.80, status: 'ready', time: '12:45' },
    { id: 'CMD-002', table: 'Table 8', amount: 45.20, status: 'preparing', time: '12:52' },
    { id: 'CMD-003', table: 'Table 3', amount: 89.90, status: 'served', time: '13:05' },
    { id: 'CMD-004', table: 'Table 12', amount: 34.50, status: 'preparing', time: '13:12' },
  ])

  const [topProducts, setTopProducts] = useState([
    { name: 'Burger Classic', quantity: 24, revenue: 576 },
    { name: 'Salade César', quantity: 18, revenue: 324 },
    { name: 'Pizza Margherita', quantity: 15, revenue: 375 },
    { name: 'Steak Frites', quantity: 12, revenue: 420 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500'
      case 'preparing': return 'bg-yellow-500'
      case 'served': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt'
      case 'preparing': return 'En préparation'
      case 'served': return 'Servi'
      default: return 'Inconnu'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation notifications={stats.pendingOrders + stats.readyOrders} />
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Restaurant</h1>
          <p className="text-gray-600">Vue d'ensemble en temps réel de votre activité</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayRevenue.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport à hier
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ordersCount}</div>
              <p className="text-xs text-muted-foreground">
                Panier moyen: {stats.averageOrder.toFixed(2)} €
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tables occupées</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupiedTables}/{stats.totalTables}</div>
              <Progress value={(stats.occupiedTables / stats.totalTables) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reservationsToday}</div>
              <p className="text-xs text-muted-foreground">
                Aujourd'hui
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/tables">
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Tables
            </Button>
          </Link>
          <Link href="/orders">
            <Button className="w-full justify-start" variant="outline">
              <Utensils className="h-4 w-4 mr-2" />
              Commandes
            </Button>
          </Link>
          <Link href="/kitchen">
            <Button className="w-full justify-start" variant="outline">
              <ChefHat className="h-4 w-4 mr-2" />
              Cuisine
            </Button>
          </Link>
          <Link href="/payment">
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Caisse
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Commandes récentes
              </CardTitle>
              <CardDescription>
                Dernières commandes du service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.table} • {order.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{order.amount.toFixed(2)} €</span>
                      <Badge variant="outline">{getStatusText(order.status)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Accès rapide aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/orders">
                <Button className="w-full justify-start" variant="outline">
                  <Utensils className="h-4 w-4 mr-2" />
                  Nouvelle commande
                </Button>
              </Link>
              <Link href="/reservations">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </Link>
              <Link href="/payment">
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Encaisser
                </Button>
              </Link>
              <Link href="/menu">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Gérer le stock
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top Products */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Produits les plus vendus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.quantity} unités</p>
                      <p className="text-sm text-gray-600">{product.revenue.toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Package className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Stock bas</p>
                    <p className="text-xs text-gray-600">{stats.lowStockItems} produits nécessitent un réapprovisionnement</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Clock className="h-4 w-4 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Commandes en attente</p>
                    <p className="text-xs text-gray-600">{stats.pendingOrders} commandes en préparation</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Commandes prêtes</p>
                    <p className="text-xs text-gray-600">{stats.readyOrders} commandes à servir</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}