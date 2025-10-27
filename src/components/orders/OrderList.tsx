'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  DollarSign,
} from 'lucide-react';
import { OrderData } from './OrderForm';

interface OrderListProps {
  orders: OrderData[];
  onOrderSelect?: (order: OrderData) => void;
  onOrderEdit?: (order: OrderData) => void;
  onOrderDelete?: (orderId: string) => void;
  onOrderStatusUpdate?: (orderId: string, status: string) => void;
}

export function OrderList({
  orders,
  onOrderSelect,
  onOrderEdit,
  onOrderDelete,
  onOrderStatusUpdate,
}: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTable, setSelectedTable] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');

  // Get unique tables from orders
  const tables = Array.from(new Set(orders.map((o) => o.table.number)));

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.number.toString().includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesTable =
        selectedTable === 'all' || order.table.number.toString() === selectedTable;

      return matchesSearch && matchesStatus && matchesTable;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return (
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0)
          );
        case 'totalAmount':
          return b.totalAmount - a.totalAmount;
        case 'table':
          return a.table.number - b.table.number;
        default:
          return 0;
      }
    });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_PREPARATION':
        return 'bg-blue-100 text-blue-800';
      case 'PRETE':
        return 'bg-green-100 text-green-800';
      case 'SERVIE':
        return 'bg-gray-100 text-gray-800';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return <Clock className="h-4 w-4" />;
      case 'EN_PREPARATION':
        return <Utensils className="h-4 w-4" />;
      case 'PRETE':
        return <CheckCircle className="h-4 w-4" />;
      case 'SERVIE':
        return <CheckCircle className="h-4 w-4" />;
      case 'ANNULEE':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_PREPARATION':
        return 'En préparation';
      case 'PRETE':
        return 'Prête';
      case 'SERVIE':
        return 'Servie';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStats = () => {
    const total = orders.length;
    const enAttente = orders.filter((o) => o.status === 'EN_ATTENTE').length;
    const enPreparation = orders.filter((o) => o.status === 'EN_PREPARATION').length;
    const pretes = orders.filter((o) => o.status === 'PRETE').length;
    const servies = orders.filter((o) => o.status === 'SERVIE').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, enAttente, enPreparation, pretes, servies, totalRevenue };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total</p>
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="EN_PREPARATION">En préparation</SelectItem>
                  <SelectItem value="PRETE">Prête</SelectItem>
                  <SelectItem value="SERVIE">Servie</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {tables.map((table) => (
                    <SelectItem key={table} value={table.toString()}>
                      Table {table}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="totalAmount">Montant</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Commande</th>
                  <th className="text-left p-4">Table</th>
                  <th className="text-left p-4">Heure</th>
                  <th className="text-left p-4">Articles</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Statut</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Table {order.table.number}</span>
                        <span className="text-sm text-gray-600">({order.table.capacity}p)</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatTime(order.createdAt)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.items.length} articles</p>
                        <p className="text-sm text-gray-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} unités
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold">{order.totalAmount.toFixed(2)} €</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onOrderSelect?.(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onOrderEdit?.(order)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOrderDelete?.(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Aucune commande trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
