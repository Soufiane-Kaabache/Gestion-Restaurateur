'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  Star,
  Award
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    today: number
    week: number
    month: number
    year: number
    lastWeek: number
    lastMonth: number
    lastYear: number
  }
  orders: {
    today: number
    week: number
    month: number
    year: number
    averageOrderValue: number
  }
  customers: {
    total: number
    new: number
    returning: number
    averageFrequency: number
  }
  products: {
    topSelling: Array<{
      name: string
      quantity: number
      revenue: number
    }>
    lowPerforming: Array<{
      name: string
      quantity: number
      revenue: number
    }>
  }
  tables: {
    occupancy: number
    turnover: number
    peakHours: Array<{
      hour: string
      orders: number
    }>
  }
  staff: {
    performance: Array<{
      name: string
      orders: number
      revenue: number
      averageOrderValue: number
    }>
  }
}

interface AnalyticsDashboardProps {
  data?: AnalyticsData
  period?: 'day' | 'week' | 'month' | 'year'
  onPeriodChange?: (period: string) => void
}

export function AnalyticsDashboard({ 
  data, 
  period = 'week', 
  onPeriodChange 
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period)

  // Mock data - dans une vraie application, cela viendrait de l'API
  const mockData: AnalyticsData = {
    revenue: {
      today: 2847.50,
      week: 15234.80,
      month: 65432.10,
      year: 785184.60,
      lastWeek: 13567.90,
      lastMonth: 58901.20,
      lastYear: 723456.30
    },
    orders: {
      today: 67,
      week: 356,
      month: 1523,
      year: 18276,
      averageOrderValue: 42.50
    },
    customers: {
      total: 2456,
      new: 156,
      returning: 2300,
      averageFrequency: 3.2
    },
    products: {
      topSelling: [
        { name: 'Burger Classic', quantity: 234, revenue: 3018.60 },
        { name: 'Pizza Margherita', quantity: 189, revenue: 2173.50 },
        { name: 'Steak Frites', quantity: 156, revenue: 2948.40 },
        { name: 'Salade César', quantity: 145, revenue: 1377.50 },
        { name: 'Coca-Cola', quantity: 423, revenue: 1269.00 }
      ],
      lowPerforming: [
        { name: 'Soupe du jour', quantity: 12, revenue: 78.00 },
        { name: 'Thé glacé', quantity: 8, revenue: 24.00 },
        { name: 'Eau minérale', quantity: 45, revenue: 67.50 }
      ]
    },
    tables: {
      occupancy: 78.5,
      turnover: 3.2,
      peakHours: [
        { hour: '12:00', orders: 45 },
        { hour: '13:00', orders: 67 },
        { hour: '19:00', orders: 34 },
        { hour: '20:00', orders: 56 },
        { hour: '21:00', orders: 43 }
      ]
    },
    staff: {
      performance: [
        { name: 'Marie Dupont', orders: 89, revenue: 3456.70, averageOrderValue: 38.84 },
        { name: 'Pierre Martin', orders: 76, revenue: 2890.45, averageOrderValue: 38.03 },
        { name: 'Sophie Bernard', orders: 82, revenue: 3234.80, averageOrderValue: 39.45 },
        { name: 'Thomas Petit', orders: 68, revenue: 2543.20, averageOrderValue: 37.40 }
      ]
    }
  }

  const analyticsData = data || mockData

  const getRevenueGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth >= 0
    }
  }

  const weekGrowth = getRevenueGrowth(analyticsData.revenue.week, analyticsData.revenue.lastWeek)
  const monthGrowth = getRevenueGrowth(analyticsData.revenue.month, analyticsData.revenue.lastMonth)
  const yearGrowth = getRevenueGrowth(analyticsData.revenue.year, analyticsData.revenue.lastYear)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value as any)
    onPeriodChange?.(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Rapports</h2>
          <p className="text-gray-600">
            Vue d'ensemble des performances de votre restaurant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.week)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {weekGrowth.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={weekGrowth.isPositive ? 'text-green-600' : 'text-red-600'}>
                {weekGrowth.isPositive ? '+' : '-'}{weekGrowth.value}% vs semaine dernière
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.week}</div>
            <p className="text-xs text-muted-foreground">
              Panier moyen: {formatCurrency(analyticsData.orders.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.customers.new} nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.tables.occupancy}%</div>
            <Progress value={analyticsData.tables.occupancy} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="staff">Personnel</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Revenus par période
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Aujourd'hui:</span>
                  <span className="font-bold">{formatCurrency(analyticsData.revenue.today)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cette semaine:</span>
                  <span className="font-bold">{formatCurrency(analyticsData.revenue.week)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ce mois:</span>
                  <span className="font-bold">{formatCurrency(analyticsData.revenue.month)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cette année:</span>
                  <span className="font-bold">{formatCurrency(analyticsData.revenue.year)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs mensuels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CA mensuel</span>
                    <span>{formatCurrency(analyticsData.revenue.month)} / 80000€</span>
                  </div>
                  <Progress value={(analyticsData.revenue.month / 80000) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Nombre de commandes</span>
                    <span>{analyticsData.orders.month} / 2000</span>
                  </div>
                  <Progress value={(analyticsData.orders.month / 2000) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Nouveaux clients</span>
                    <span>{analyticsData.customers.new} / 200</span>
                  </div>
                  <Progress value={(analyticsData.customers.new / 200) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Croissance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Vs semaine dernière:</span>
                  <div className="flex items-center gap-1">
                    {weekGrowth.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={weekGrowth.isPositive ? 'text-green-600' : 'text-red-600'}>
                      {weekGrowth.isPositive ? '+' : '-'}{weekGrowth.value}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vs mois dernier:</span>
                  <div className="flex items-center gap-1">
                    {monthGrowth.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={monthGrowth.isPositive ? 'text-green-600' : 'text-red-600'}>
                      {monthGrowth.isPositive ? '+' : '-'}{monthGrowth.value}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vs année dernière:</span>
                  <div className="flex items-center gap-1">
                    {yearGrowth.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={yearGrowth.isPositive ? 'text-green-600' : 'text-red-600'}>
                      {yearGrowth.isPositive ? '+' : '-'}{yearGrowth.value}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Produits les plus vendus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.products.topSelling.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.quantity} unités</p>
                        <p className="text-sm text-gray-600">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Produits sous-performants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.products.lowPerforming.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.quantity} unités</p>
                        <p className="text-sm text-gray-600">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clientèle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.customers.total}</div>
                  <p className="text-sm text-gray-600">Clients totaux</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{analyticsData.customers.new}</div>
                    <p className="text-xs text-gray-600">Nouveaux</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{analyticsData.customers.returning}</div>
                    <p className="text-xs text-gray-600">Fidèles</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{analyticsData.customers.averageFrequency}</div>
                  <p className="text-sm text-gray-600">Visites moyennes/mois</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Satisfaction client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-medium">4.8/5</span>
                    <span className="text-sm text-gray-600">(234 avis)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Qualité service:</span>
                      <span>4.9/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Qualité nourriture:</span>
                      <span>4.7/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Propreté:</span>
                      <span>4.8/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rapport qualité/prix:</span>
                      <span>4.6/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance des tables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.tables.occupancy}%</div>
                  <p className="text-sm text-gray-600">Taux d'occupation</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.tables.turnover}</div>
                  <p className="text-sm text-gray-600">Rotation moyenne</p>
                </div>
                <Progress value={analyticsData.tables.occupancy} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Heures de pointe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.tables.peakHours.map((peak) => (
                    <div key={peak.hour} className="flex items-center justify-between">
                      <span className="font-medium">{peak.hour}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(peak.orders / 67) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{peak.orders} commandes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance du personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Employé</th>
                      <th className="text-left p-4">Commandes</th>
                      <th className="text-left p-4">CA généré</th>
                      <th className="text-left p-4">Panier moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.staff.performance.map((staff) => (
                      <tr key={staff.name} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{staff.name}</td>
                        <td className="p-4">{staff.orders}</td>
                        <td className="p-4">{formatCurrency(staff.revenue)}</td>
                        <td className="p-4">{formatCurrency(staff.averageOrderValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}