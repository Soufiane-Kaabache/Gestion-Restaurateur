'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Utensils,
  Users,
  Timer,
  Bell,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { OrderData } from '@/components/orders/OrderForm';

interface KitchenDisplayProps {
  orders: OrderData[];
  onOrderStatusUpdate?: (orderId: string, status: string) => void;
  onOrderItemComplete?: (orderId: string, itemId: string) => void;
}

interface OrderTimer {
  orderId: string;
  startTime: number;
  elapsedTime: number;
  isRunning: boolean;
}

export function KitchenDisplay({
  orders,
  onOrderStatusUpdate,
  onOrderItemComplete,
}: KitchenDisplayProps) {
  const [timers, setTimers] = useState<Record<string, OrderTimer>>({});
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filter orders for kitchen (only those that need preparation)
  const kitchenOrders = orders.filter((order) =>
    ['EN_ATTENTE', 'EN_PREPARATION'].includes(order.status || ''),
  );

  // Initialize timers for new orders
  useEffect(() => {
    const newTimers = { ...timers };

    kitchenOrders.forEach((order) => {
      if (!newTimers[order.id!]) {
        newTimers[order.id!] = {
          orderId: order.id!,
          startTime: Date.now(),
          elapsedTime: 0,
          isRunning: order.status === 'EN_PREPARATION',
        };
      }
    });

    setTimers(newTimers);
  }, [orders]);

  // Update timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((orderId) => {
          if (updated[orderId].isRunning) {
            updated[orderId].elapsedTime = Date.now() - updated[orderId].startTime;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Play sound for new orders
  useEffect(() => {
    if (soundEnabled) {
      const newOrders = kitchenOrders.filter(
        (order) =>
          order.status === 'EN_ATTENTE' &&
          (!timers[order.id!] || timers[order.id!].elapsedTime < 5000),
      );

      if (newOrders.length > 0) {
        // Play notification sound (in real app, would use actual audio)
        console.log('🔔 New order notification!');
      }
    }
  }, [kitchenOrders, soundEnabled, timers]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (elapsedTime: number) => {
    const minutes = elapsedTime / 60000;
    if (minutes > 20) return 'text-red-600 bg-red-50';
    if (minutes > 15) return 'text-orange-600 bg-orange-50';
    if (minutes > 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPreparationTime = (order: OrderData) => {
    return order.items.reduce((max, item) => {
      return Math.max(max, item.product.preparationTime || 15);
    }, 15);
  };

  const handleStartPreparation = (orderId: string) => {
    setTimers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        startTime: Date.now(),
        elapsedTime: 0,
        isRunning: true,
      },
    }));
    onOrderStatusUpdate?.(orderId, 'EN_PREPARATION');
  };

  const handlePausePreparation = (orderId: string) => {
    setTimers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        isRunning: false,
      },
    }));
  };

  const handleCompleteOrder = (orderId: string) => {
    onOrderStatusUpdate?.(orderId, 'PRETE');
    setTimers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        isRunning: false,
      },
    }));
  };

  const handleResetTimer = (orderId: string) => {
    setTimers((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        startTime: Date.now(),
        elapsedTime: 0,
        isRunning: false,
      },
    }));
  };

  const getStationOrders = () => {
    if (selectedStation === 'all') return kitchenOrders;

    return kitchenOrders.filter((order) => {
      // In a real app, items would have station assignments
      return order.items.some((item) => {
        const category = item.product.categoryName?.toLowerCase();
        return category?.includes(selectedStation.toLowerCase());
      });
    });
  };

  const stationOrders = getStationOrders();
  const stats = {
    total: kitchenOrders.length,
    waiting: kitchenOrders.filter((o) => o.status === 'EN_ATTENTE').length,
    preparing: kitchenOrders.filter((o) => o.status === 'EN_PREPARATION').length,
    overdue: Object.values(timers).filter((t) => t.elapsedTime > 20 * 60000).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="h-8 w-8" />
            Cuisine - KDS
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Son {soundEnabled ? 'activé' : 'désactivé'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total commandes</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Utensils className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En préparation</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
                </div>
                <Timer className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En retard</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Station Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          {['all', 'chaud', 'froid', 'bar', 'dessert'].map((station) => (
            <Button
              key={station}
              variant={selectedStation === station ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStation(station)}
            >
              {station === 'all' ? 'Tous' : station.charAt(0).toUpperCase() + station.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {stationOrders.map((order) => {
          const timer = timers[order.id!];
          const preparationTime = getPreparationTime(order);
          const progress = timer
            ? Math.min((timer.elapsedTime / (preparationTime * 60000)) * 100, 100)
            : 0;

          return (
            <Card
              key={order.id}
              className={`${
                order.status === 'EN_ATTENTE'
                  ? 'border-yellow-200 bg-yellow-50'
                  : order.status === 'EN_PREPARATION'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-green-200 bg-green-50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <Badge variant={order.status === 'EN_ATTENTE' ? 'secondary' : 'default'}>
                      {order.status === 'EN_ATTENTE' ? 'En attente' : 'En préparation'}
                    </Badge>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(timer?.elapsedTime || 0)}`}
                  >
                    {timer ? formatTime(timer.elapsedTime) : '00:00'}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Table {order.table.number}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {preparationTime} min
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Progress Bar */}
                {order.status === 'EN_PREPARATION' && (
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-600">{Math.round(progress)}% complété</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-white rounded border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}x</span>
                          <span>{item.product.name}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-600 mt-1 italic">Note: {item.notes}</p>
                        )}
                        {item.product.preparationTime && (
                          <p className="text-xs text-gray-500">
                            Temps: {item.product.preparationTime} min
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOrderItemComplete?.(order.id!, item.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div className="p-2 bg-yellow-100 rounded">
                      <p className="text-sm font-medium text-yellow-800">Notes client:</p>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {order.status === 'EN_ATTENTE' ? (
                    <Button onClick={() => handleStartPreparation(order.id!)} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Commencer
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handlePausePreparation(order.id!)}
                        className="flex-1"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={() => handleCompleteOrder(order.id!)} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Prêt
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleResetTimer(order.id!)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {stationOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Utensils className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune commande en cours</h3>
            <p className="text-gray-500">
              Les nouvelles commandes apparaîtront ici automatiquement
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
