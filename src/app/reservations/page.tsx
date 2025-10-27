'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { ReservationManager } from '@/components/reservations/ReservationManager'
import { ReservationData } from '@/components/reservations/ReservationForm'
import { TableData } from '@/components/tables/TableCard'

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
    status: 'LIBRE',
    positionX: 200,
    positionY: 100,
    section: 'terrasse'
  },
  {
    id: '3',
    number: 3,
    capacity: 6,
    status: 'LIBRE',
    positionX: 300,
    positionY: 100,
    section: 'salle'
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
    status: 'LIBRE',
    positionX: 200,
    positionY: 200,
    section: 'salle'
  },
  {
    id: '6',
    number: 6,
    capacity: 8,
    status: 'LIBRE',
    positionX: 300,
    positionY: 200,
    section: 'privé'
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
    status: 'LIBRE',
    positionX: 200,
    positionY: 300,
    section: 'bar'
  }
]

const mockReservations: ReservationData[] = [
  {
    id: 'RES-001',
    customerName: 'Jean Dupont',
    customerPhone: '06 12 34 56 78',
    customerEmail: 'jean.dupont@email.com',
    tableId: '3',
    table: mockTables[2],
    date: new Date(),
    time: '20:00',
    guests: 6,
    status: 'CONFIRMEE',
    notes: 'Anniversaire - gâteau prévu'
  },
  {
    id: 'RES-002',
    customerName: 'Marie Martin',
    customerPhone: '06 23 45 67 89',
    tableId: '1',
    table: mockTables[0],
    date: new Date(),
    time: '19:30',
    guests: 4,
    status: 'EN_ATTENTE',
    notes: 'Allergie aux fruits à coque'
  },
  {
    id: 'RES-003',
    customerName: 'Pierre Bernard',
    customerPhone: '06 34 56 78 90',
    tableId: '4',
    table: mockTables[3],
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
    time: '12:30',
    guests: 4,
    status: 'CONFIRMEE',
    notes: 'Table près de la fenêtre'
  },
  {
    id: 'RES-004',
    customerName: 'Sophie Petit',
    customerPhone: '06 45 67 89 01',
    tableId: '2',
    table: mockTables[1],
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain
    time: '13:00',
    guests: 2,
    status: 'EN_ATTENTE',
    notes: ''
  },
  {
    id: 'RES-005',
    customerName: 'Thomas Dubois',
    customerPhone: '06 56 78 90 12',
    tableId: '6',
    table: mockTables[5],
    date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Après-demain
    time: '20:30',
    guests: 8,
    status: 'CONFIRMEE',
    notes: 'Salle privée pour événement professionnel'
  },
  {
    id: 'RES-006',
    customerName: 'Claire Leroy',
    customerPhone: '06 67 89 01 23',
    tableId: '5',
    table: mockTables[4],
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hier
    time: '19:00',
    guests: 2,
    status: 'ANNULEE',
    notes: 'Annulé dernière minute'
  }
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationData[]>(mockReservations)
  const [tables] = useState<TableData[]>(mockTables)

  const handleReservationUpdate = (updatedReservation: ReservationData) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === updatedReservation.id ? updatedReservation : reservation
    ))
  }

  const handleReservationCreate = (newReservationData: Omit<ReservationData, 'id'>) => {
    const newReservation: ReservationData = {
      ...newReservationData,
      id: `RES-${Date.now()}`
    }
    setReservations(prev => [...prev, newReservation])
  }

  const handleReservationDelete = (reservationId: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== reservationId))
  }

  const getReservationStats = () => {
    const total = reservations.length
    const enAttente = reservations.filter(r => r.status === 'EN_ATTENTE').length
    const confirmees = reservations.filter(r => r.status === 'CONFIRMEE').length
    const annulees = reservations.filter(r => r.status === 'ANNULEE').length
    const today = reservations.filter(r => {
      const today = new Date()
      const reservationDate = new Date(r.date)
      return reservationDate.toDateString() === today.toDateString()
    }).length
    const thisWeek = reservations.filter(r => {
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const reservationDate = new Date(r.date)
      return reservationDate >= now && reservationDate <= weekFromNow
    }).length
    const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0)

    return { total, enAttente, confirmees, annulees, today, thisWeek, totalGuests }
  }

  const stats = getReservationStats()

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
            <Calendar className="h-8 w-8" />
            Réservations
          </h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-purple-600">{stats.thisWeek}</div>
              <p className="text-sm text-gray-600">Cette semaine</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
              <p className="text-sm text-gray-600">Couverts totaux</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reservation Manager */}
      <ReservationManager
        reservations={reservations}
        tables={tables}
        onReservationUpdate={handleReservationUpdate}
        onReservationCreate={handleReservationCreate}
        onReservationDelete={handleReservationDelete}
      />
    </div>
  )
}