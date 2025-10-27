'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter,
  Plus,
  Calendar,
  Users,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { ReservationCalendar } from './ReservationCalendar'
import { ReservationForm, ReservationData } from './ReservationForm'
import { TableData } from '@/components/tables/TableCard'

interface ReservationManagerProps {
  reservations: ReservationData[]
  tables: TableData[]
  onReservationUpdate?: (reservation: ReservationData) => void
  onReservationCreate?: (reservation: Omit<ReservationData, 'id'>) => void
  onReservationDelete?: (reservationId: string) => void
}

export function ReservationManager({ 
  reservations, 
  tables,
  onReservationUpdate, 
  onReservationCreate, 
  onReservationDelete 
}: ReservationManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editingReservation, setEditingReservation] = useState<ReservationData | null>(null)

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerPhone.includes(searchTerm) ||
                         reservation.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus
    const matchesDate = !selectedDate || 
                       new Date(reservation.date).toDateString() === new Date(selectedDate).toDateString()
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleEdit = useCallback((reservation: ReservationData) => {
    setEditingReservation(reservation)
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((reservationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      onReservationDelete?.(reservationId)
    }
  }, [onReservationDelete])

  const handleCreate = useCallback((reservationData: Omit<ReservationData, 'id'>) => {
    onReservationCreate?.(reservationData)
    setShowForm(false)
    setEditingReservation(null)
  }, [onReservationCreate])

  const handleUpdate = useCallback((reservationData: ReservationData) => {
    onReservationUpdate?.(reservationData)
    setShowForm(false)
    setEditingReservation(null)
  }, [onReservationUpdate])

  const getStatusColor = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMEE': return 'bg-green-100 text-green-800'
      case 'ANNULEE': return 'bg-red-100 text-red-800'
      case 'TERMINEE': return 'bg-gray-100 text-gray-800'
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE': return <AlertCircle className="h-4 w-4" />
      case 'CONFIRMEE': return <CheckCircle className="h-4 w-4" />
      case 'ANNULEE': return <XCircle className="h-4 w-4" />
      case 'TERMINEE': return <CheckCircle className="h-4 w-4" />
      case 'NO_SHOW': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente'
      case 'CONFIRMEE': return 'Confirmée'
      case 'ANNULEE': return 'Annulée'
      case 'TERMINEE': return 'Terminée'
      case 'NO_SHOW': return 'No-show'
      default: return status
    }
  }

  const getStats = () => {
    const total = reservations.length
    const enAttente = reservations.filter(r => r.status === 'EN_ATTENTE').length
    const confirmees = reservations.filter(r => r.status === 'CONFIRMEE').length
    const annulees = reservations.filter(r => r.status === 'ANNULEE').length
    const today = reservations.filter(r => {
      const today = new Date()
      const reservationDate = new Date(r.date)
      return reservationDate.toDateString() === today.toDateString()
    }).length
    const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0)

    return { total, enAttente, confirmees, annulees, today, totalGuests }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des réservations</h2>
          <p className="text-gray-600">
            {stats.total} réservations • {stats.today} aujourd'hui • {stats.totalGuests} couverts totaux
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réservation
        </Button>
      </div>

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
            <div className="text-2xl font-bold text-green-600">{stats.confirmees}</div>
            <p className="text-sm text-gray-600">Confirmées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.annulees}</div>
            <p className="text-sm text-gray-600">Annulées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
            <p className="text-sm text-gray-600">Aujourd'hui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalGuests}</div>
            <p className="text-sm text-gray-600">Couverts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <ReservationCalendar
            reservations={reservations}
            tables={tables}
            onReservationSelect={handleEdit}
            onReservationEdit={handleEdit}
            onReservationDelete={handleDelete}
            onReservationCreate={() => setShowForm(true)}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une réservation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  />
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRMEE">Confirmée</option>
                    <option value="ANNULEE">Annulée</option>
                    <option value="TERMINEE">Terminée</option>
                    <option value="NO_SHOW">No-show</option>
                  </select>
                </div>
              </div>

              {/* Reservations Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Client</th>
                      <th className="text-left p-4">Contact</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Heure</th>
                      <th className="text-left p-4">Table</th>
                      <th className="text-left p-4">Personnes</th>
                      <th className="text-left p-4">Statut</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{reservation.customerName}</p>
                            {reservation.notes && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {reservation.notes}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{reservation.customerPhone}</span>
                            </div>
                            {reservation.customerEmail && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{reservation.customerEmail}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {new Date(reservation.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {reservation.time}
                          </div>
                        </td>
                        <td className="p-4">
                          Table {reservation.table.number}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            {reservation.guests}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`flex items-center gap-1 ${getStatusColor(reservation.status)}`}>
                            {getStatusIcon(reservation.status)}
                            {getStatusText(reservation.status)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(reservation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(reservation.id!)}
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
              {filteredReservations.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucune réservation trouvée</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une réservation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      {showForm && (
        <ReservationForm
          reservation={editingReservation}
          tables={tables}
          onSubmit={editingReservation ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditingReservation(null)
          }}
        />
      )}
    </div>
  )
}