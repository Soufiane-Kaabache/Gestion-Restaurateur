'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { TableData } from '@/components/tables/TableCard'

export interface ReservationData {
  id?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  tableId: string
  table: TableData
  date: Date
  time: string
  guests: number
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'TERMINEE' | 'NO_SHOW'
  notes?: string
}

interface ReservationFormProps {
  reservation?: ReservationData | null
  tables: TableData[]
  onSubmit: (reservation: ReservationData) => void
  onCancel: () => void
}

export function ReservationForm({ 
  reservation, 
  tables, 
  onSubmit, 
  onCancel 
}: ReservationFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    tableId: '',
    date: new Date(),
    time: '',
    guests: '',
    notes: '',
    status: 'EN_ATTENTE' as ReservationData['status']
  })

  const availableTables = tables.filter(table => table.capacity >= parseInt(formData.guests || '1'))

  const timeSlots = [
    '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ]

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail || '',
        tableId: reservation.tableId,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests.toString(),
        notes: reservation.notes || '',
        status: reservation.status
      })
    }
  }, [reservation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const reservationData: ReservationData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      tableId: formData.tableId,
      table: tables.find(t => t.id === formData.tableId)!,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      status: formData.status,
      notes: formData.notes || undefined
    }

    if (reservation) {
      onSubmit({ ...reservationData, id: reservation.id })
    } else {
      onSubmit(reservationData)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nom du client *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Téléphone *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                placeholder="06 12 34 56 78"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              placeholder="jean.dupont@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests">Nombre de personnes *</Label>
              <Input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={(e) => handleChange('guests', e.target.value)}
                placeholder="4"
                required
                min="1"
                max="20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tableId">Table *</Label>
              <Select value={formData.tableId} onValueChange={(value) => handleChange('tableId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      Table {table.number} ({table.capacity} personnes) - {table.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && handleChange('date', date)}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {reservation && (
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="CONFIRMEE">Confirmée</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                  <SelectItem value="TERMINEE">Terminée</SelectItem>
                  <SelectItem value="NO_SHOW">No-show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Allergies, occasions spéciales, demandes particulières..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              {reservation ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}