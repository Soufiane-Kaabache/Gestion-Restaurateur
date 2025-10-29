'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  Utensils,
  Calendar,
  Clock,
} from 'lucide-react';
import { TableCard, TableData } from './TableCard';
import { alert } from '@/lib/sweetalert';
import { TableForm } from './TableForm';

interface TableGridProps {
  tables: TableData[];
  onTableUpdate?: (table: TableData) => void;
  onTableCreate?: (table: Omit<TableData, 'id'>) => void;
  onTableDelete?: (tableId: string) => void;
  onTableSelect?: (table: TableData) => void;
}

export function TableGrid({
  tables,
  onTableUpdate,
  onTableCreate,
  onTableDelete,
  onTableSelect,
}: TableGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.number.toString().includes(searchTerm) ||
      table.section?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || table.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = useCallback(
    (tableId: string, newStatus: TableData['status']) => {
      const table = tables.find((t) => t.id === tableId);
      if (table) {
        onTableUpdate?.({ ...table, status: newStatus });
      }
    },
    [tables, onTableUpdate],
  );

  const handleEdit = useCallback((table: TableData) => {
    setEditingTable(table);
    setShowCreateForm(true);
  }, []);

  const handleDelete = useCallback(
    async (tableId: string) => {
      const result = await alert.confirm(
        'Confirmer la suppression',
        'Êtes-vous sûr de vouloir supprimer cette table ?',
      );
      if (result.isConfirmed) {
        onTableDelete?.(tableId);
      }
    },
    [onTableDelete],
  );

  const handleCreateTable = useCallback(
    (tableData: Omit<TableData, 'id'>) => {
      onTableCreate?.(tableData);
      setShowCreateForm(false);
    },
    [onTableCreate],
  );

  const handleUpdateTable = useCallback(
    (tableData: TableData) => {
      onTableUpdate?.(tableData);
      setEditingTable(null);
      setShowCreateForm(false);
    },
    [onTableUpdate],
  );

  const getStatusStats = () => {
    const stats = tables.reduce(
      (acc, table) => {
        acc[table.status] = (acc[table.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return [
      { status: 'all', label: 'Toutes', count: tables.length, icon: Grid3X3 },
      { status: 'LIBRE', label: 'Libres', count: stats.LIBRE || 0, icon: Users },
      { status: 'OCCUPEE', label: 'Occupées', count: stats.OCCUPEE || 0, icon: Utensils },
      { status: 'RESERVEE', label: 'Réservées', count: stats.RESERVEE || 0, icon: Calendar },
      { status: 'A_NETTOYER', label: 'À nettoyer', count: stats.A_NETTOYER || 0, icon: Clock },
    ];
  };

  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des tables</h2>
          <p className="text-gray-600">
            {tables.length} tables au total •{' '}
            {statusStats.find((s) => s.status === 'LIBRE')?.count || 0} disponibles
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle table
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusStats.map(({ status, label, count, icon: Icon }) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all ${
              selectedStatus === status ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
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
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tables Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onClick={() => onTableSelect?.(table)}
              onStatusChange={(status) => handleStatusChange(table.id, status)}
              onEdit={() => handleEdit(table)}
              onDelete={() => handleDelete(table.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Table</th>
                    <th className="text-left p-4">Capacité</th>
                    <th className="text-left p-4">Section</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4">Commande</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTables.map((table) => (
                    <tr key={table.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">Table {table.number}</p>
                        </div>
                      </td>
                      <td className="p-4">{table.capacity} personnes</td>
                      <td className="p-4">{table.section || '-'}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{table.status}</Badge>
                      </td>
                      <td className="p-4">
                        {table.currentOrder ? (
                          <div>
                            <p className="text-sm">{table.currentOrder.id}</p>
                            <p className="text-xs text-gray-600">
                              {table.currentOrder.amount.toFixed(2)} €
                            </p>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onTableSelect?.(table)}
                          >
                            Sélectionner
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 mb-4">Aucune table trouvée</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une table
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <TableForm
          table={editingTable}
          onSubmit={editingTable ? handleUpdateTable : handleCreateTable}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingTable(null);
          }}
        />
      )}
    </div>
  );
}
