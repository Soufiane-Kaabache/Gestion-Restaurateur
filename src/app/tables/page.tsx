'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TableGrid } from '@/components/tables/TableGrid'
import { FloorPlan } from '@/components/tables/FloorPlan'
import { TableData } from '@/components/tables/TableCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

// Mock data - dans une vraie application, cela viendrait de l'API
const mockTables: TableData[] = [
  {
    id: '1',
    number: 1,
    capacity: 4,
    status: 'LIBRE',
    positionX: 100,
    positionY: 100,
    section: 'terrasse'
  },
  {
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
  {
    id: '3',
    number: 3,
    capacity: 6,
    status: 'RESERVEE',
    positionX: 300,
    positionY: 100,
    section: 'salle',
    reservation: {
      customerName: 'Dupont Jean',
      time: '20:00',
      guests: 6
    }
  },
  {
    id: '4',
    number: 4,
    capacity: 4,
    status: 'LIBRE',
    positionX: 100,
    positionY: 200,
    section: 'salle'
  },
  {
    id: '5',
    number: 5,
    capacity: 2,
    status: 'A_NETTOYER',
    positionX: 200,
    positionY: 200,
    section: 'salle'
  },
  {
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
  {
    id: '7',
    number: 7,
    capacity: 4,
    status: 'LIBRE',
    positionX: 100,
    positionY: 300,
    section: 'bar'
  },
  {
    id: '8',
    number: 8,
    capacity: 4,
    status: 'OCCUPEE',
    positionX: 200,
    positionY: 300,
    section: 'bar',
    currentOrder: {
      id: 'CMD-003',
      amount: 67.90,
      time: '14:00',
      duration: 15
    }
  }
]

export default function TablesPage() {
  const [tables, setTables] = useState<TableData[]>(mockTables)
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [editMode, setEditMode] = useState(false)

  const handleTableUpdate = (updatedTable: TableData) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ))
  }

  const handleTableCreate = (newTableData: Omit<TableData, 'id'>) => {
    const newTable: TableData = {
      ...newTableData,
      id: Date.now().toString(),
    }
    setTables(prev => [...prev, newTable])
  }

  const handleTableDelete = (tableId: string) => {
    setTables(prev => prev.filter(table => table.id !== tableId))
  }

  const handleTableMove = (tableId: string, x: number, y: number) => {
    setTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, positionX: x, positionY: y } : table
    ))
  }

  const handleTableSelect = (table: TableData) => {
    setSelectedTable(table)
  }

  const getStats = () => {
    const total = tables.length
    const libres = tables.filter(t => t.status === 'LIBRE').length
    const occupées = tables.filter(t => t.status === 'OCCUPEE').length
    const réservées = tables.filter(t => t.status === 'RESERVEE').length
    const àNettoyer = tables.filter(t => t.status === 'A_NETTOYER').length
    
    return { total, libres, occupées, réservées, àNettoyer }
  }

  const stats = getStats()

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
          <h1 className="text-3xl font-bold">Gestion des tables</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">Total tables</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.libres}</div>
              <p className="text-sm text-gray-600">Libres</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.occupées}</div>
              <p className="text-sm text-gray-600">Occupées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.réservées}</div>
              <p className="text-sm text-gray-600">Réservées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.àNettoyer}</div>
              <p className="text-sm text-gray-600">À nettoyer</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="floorplan" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="floorplan" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Plan de salle
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Liste des tables
            </TabsTrigger>
          </TabsList>
          
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Mode vue" : "Mode édition"}
          </Button>
        </div>

        <TabsContent value="floorplan" className="space-y-6">
          <FloorPlan
            tables={tables}
            onTableClick={handleTableSelect}
            onTableMove={editMode ? handleTableMove : undefined}
            editable={editMode}
          />
          
          {selectedTable && (
            <Card>
              <CardHeader>
                <CardTitle>Détails de la table {selectedTable.number}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Capacité</p>
                    <p className="font-medium">{selectedTable.capacity} personnes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Section</p>
                    <p className="font-medium">{selectedTable.section || 'Non définie'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className="font-medium">{selectedTable.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium">
                      X: {selectedTable.positionX.toFixed(0)}, Y: {selectedTable.positionY.toFixed(0)}
                    </p>
                  </div>
                </div>
                
                {selectedTable.currentOrder && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">Commande en cours</p>
                    <p className="text-sm text-blue-700">
                      {selectedTable.currentOrder.id} • {selectedTable.currentOrder.amount.toFixed(2)} € • {selectedTable.currentOrder.duration} min
                    </p>
                  </div>
                )}
                
                {selectedTable.reservation && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="font-medium text-yellow-900">Réservation</p>
                    <p className="text-sm text-yellow-700">
                      {selectedTable.reservation.customerName} • {selectedTable.reservation.time} • {selectedTable.reservation.guests} personnes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list">
          <TableGrid
            tables={tables}
            onTableUpdate={handleTableUpdate}
            onTableCreate={handleTableCreate}
            onTableDelete={handleTableDelete}
            onTableSelect={handleTableSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}