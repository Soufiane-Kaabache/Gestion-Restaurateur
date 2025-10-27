'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  ChefHat,
  Martini,
  Utensils,
  Wrench,
  MapPin,
  Timer,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface ReadyOrder {
  id: string;
  tableNumber: number;
  items: ReadyItem[];
  preparationTime: number;
  readyTime: string;
  priority: 'low' | 'normal' | 'high';
  temperature: 'hot' | 'cold' | 'ambient';
  serverName: string;
  notes?: string;
}

interface ReadyItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  specialInstructions?: string;
}

interface CleaningTask {
  id: string;
  tableNumber: number;
  type: 'table' | 'floor' | 'dishes' | 'equipment';
  priority: 'low' | 'normal' | 'high';
  requestedTime: string;
  requestedBy: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

interface DeliveryTask {
  id: string;
  orderId: string;
  tableNumber: number;
  items: string[];
  pickupLocation: 'kitchen' | 'bar';
  status: 'pending' | 'picked_up' | 'delivered';
  assignedRunner?: string;
  estimatedTime: number;
}

export default function RunnerScreen() {
  const [activeTab, setActiveTab] = useState('pickup');
  const [selectedTask, setSelectedTask] = useState<ReadyOrder | CleaningTask | DeliveryTask | null>(
    null,
  );
  const [notifications, setNotifications] = useState(4);

  // Mock data for ready orders
  const readyOrders: ReadyOrder[] = [
    {
      id: 'READY-001',
      tableNumber: 5,
      items: [
        {
          id: '1',
          name: 'Burger Classic',
          category: 'Plats',
          quantity: 2,
          specialInstructions: 'Sans oignon',
        },
        {
          id: '2',
          name: 'Frites',
          category: 'Accompagnements',
          quantity: 2,
        },
      ],
      preparationTime: 15,
      readyTime: '14:35',
      priority: 'high',
      temperature: 'hot',
      serverName: 'Marie',
      notes: 'Client pressé',
    },
    {
      id: 'READY-002',
      tableNumber: 8,
      items: [
        {
          id: '3',
          name: 'Mojito',
          category: 'Cocktails',
          quantity: 1,
        },
        {
          id: '4',
          name: 'Verre de vin blanc',
          category: 'Vins',
          quantity: 2,
        },
      ],
      preparationTime: 5,
      readyTime: '14:38',
      priority: 'normal',
      temperature: 'cold',
      serverName: 'Jean',
    },
    {
      id: 'READY-003',
      tableNumber: 12,
      items: [
        {
          id: '5',
          name: 'Salade César',
          category: 'Entrées',
          quantity: 1,
        },
      ],
      preparationTime: 10,
      readyTime: '14:40',
      priority: 'normal',
      temperature: 'ambient',
      serverName: 'Sophie',
    },
  ];

  // Mock data for cleaning tasks
  const cleaningTasks: CleaningTask[] = [
    {
      id: 'CLEAN-001',
      tableNumber: 3,
      type: 'table',
      priority: 'high',
      requestedTime: '14:30',
      requestedBy: 'Marie',
      status: 'pending',
      notes: 'Table sale, besoin de nettoyage rapide',
    },
    {
      id: 'CLEAN-002',
      tableNumber: 7,
      type: 'dishes',
      priority: 'normal',
      requestedTime: '14:25',
      requestedBy: 'Jean',
      status: 'in_progress',
    },
    {
      id: 'CLEAN-003',
      tableNumber: 0,
      type: 'floor',
      priority: 'low',
      requestedTime: '14:15',
      requestedBy: 'Sophie',
      status: 'pending',
      notes: 'Petit renversement près de la table 4',
    },
  ];

  // Mock data for delivery tasks
  const deliveryTasks: DeliveryTask[] = [
    {
      id: 'DELIVERY-001',
      orderId: 'READY-001',
      tableNumber: 5,
      items: ['Burger Classic ×2', 'Frites ×2'],
      pickupLocation: 'kitchen',
      status: 'pending',
      estimatedTime: 3,
    },
    {
      id: 'DELIVERY-002',
      orderId: 'READY-002',
      tableNumber: 8,
      items: ['Mojito ×1', 'Vin blanc ×2'],
      pickupLocation: 'bar',
      status: 'picked_up',
      assignedRunner: 'Paul',
      estimatedTime: 2,
    },
  ];

  const updateTaskStatus = (taskId: string, status: string) => {
    // In a real app, this would update the backend
    console.log(`Task ${taskId} status updated to ${status}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      case 'ambient':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCleaningTypeIcon = (type: string) => {
    switch (type) {
      case 'table':
        return <Utensils className="h-4 w-4" />;
      case 'floor':
        return <MapPin className="h-4 w-4" />;
      case 'dishes':
        return <Wrench className="h-4 w-4" />;
      case 'equipment':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getPickupLocationIcon = (location: string) => {
    switch (location) {
      case 'kitchen':
        return <ChefHat className="h-4 w-4" />;
      case 'bar':
        return <Martini className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const getCleaningStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold">Runner / Plongeur</h1>
            <Badge variant="outline">Service</Badge>
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
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pickup">Prêts à récupérer</TabsTrigger>
          <TabsTrigger value="delivery">Livraisons</TabsTrigger>
          <TabsTrigger value="cleaning">Nettoyage</TabsTrigger>
        </TabsList>

        {/* Pickup Tab */}
        <TabsContent value="pickup" className="space-y-4">
          <div className="grid gap-4">
            {readyOrders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTask?.id === order.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedTask(order)}
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
                      <Badge className={getTemperatureColor(order.temperature)}>
                        {order.temperature === 'hot' && 'Chaud'}
                        {order.temperature === 'cold' && 'Froid'}
                        {order.temperature === 'ambient' && 'Ambiant'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">Prêt</div>
                      <div className="text-sm text-gray-500">{order.readyTime}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          ×{item.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {order.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-500">
                      <Users className="h-4 w-4 inline mr-1" />
                      Serveur: {order.serverName}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(order.id, 'picked_up');
                      }}
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Récupérer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <div className="grid gap-4">
            {deliveryTasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTask?.id === task.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold">{task.id}</div>
                        <div className="text-sm text-gray-500">Table {task.tableNumber}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPickupLocationIcon(task.pickupLocation)}
                        <span className="text-sm capitalize">{task.pickupLocation}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getDeliveryStatusColor(task.status)}>
                        {task.status === 'pending' && 'En attente'}
                        {task.status === 'picked_up' && 'Récupéré'}
                        {task.status === 'delivered' && 'Livré'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {task.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Timer className="h-4 w-4" />
                      <span>~{task.estimatedTime}min</span>
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, 'picked_up');
                          }}
                        >
                          Récupérer
                        </Button>
                      )}
                      {task.status === 'picked_up' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, 'delivered');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Livrer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cleaning Tab */}
        <TabsContent value="cleaning" className="space-y-4">
          <div className="grid gap-4">
            {cleaningTasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTask?.id === task.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getCleaningTypeIcon(task.type)}
                        <div>
                          <div className="font-semibold">{task.id}</div>
                          <div className="text-sm text-gray-500 capitalize">
                            {task.type === 'table' && `Table ${task.tableNumber}`}
                            {task.type === 'floor' && 'Sol'}
                            {task.type === 'dishes' && 'Vaisselle'}
                            {task.type === 'equipment' && 'Équipement'}
                          </div>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === 'high' && 'Urgent'}
                        {task.priority === 'normal' && 'Normal'}
                        {task.priority === 'low' && 'Basse'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Badge className={getCleaningStatusColor(task.status)}>
                        {task.status === 'pending' && 'En attente'}
                        {task.status === 'in_progress' && 'En cours'}
                        {task.status === 'completed' && 'Terminé'}
                      </Badge>
                      <div className="text-sm text-gray-500 mt-1">{task.requestedTime}</div>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {task.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-500">Demandé par: {task.requestedBy}</div>
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, 'in_progress');
                          }}
                        >
                          Commencer
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTaskStatus(task.id, 'completed');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terminer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
