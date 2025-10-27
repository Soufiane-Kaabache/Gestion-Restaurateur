'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Clock, 
  Utensils, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface TableData {
  id: string
  number: number
  capacity: number
  status: 'LIBRE' | 'OCCUPEE' | 'RESERVEE' | 'A_NETTOYER'
  positionX: number
  positionY: number
  section?: string
  currentOrder?: {
    id: string
    amount: number
    time: string
    duration: number
  }
  reservation?: {
    customerName: string
    time: string
    guests: number
  }
}

interface TableCardProps {
  table: TableData
  onClick?: () => void
  onStatusChange?: (status: TableData['status']) => void
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
}

export function TableCard({ 
  table, 
  onClick, 
  onStatusChange, 
  onEdit, 
  onDelete,
  showActions = true 
}: TableCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: TableData['status']) => {
    switch (status) {
      case 'LIBRE': return 'bg-green-100 text-green-800 border-green-200'
      case 'OCCUPEE': return 'bg-red-100 text-red-800 border-red-200'
      case 'RESERVEE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'A_NETTOYER': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: TableData['status']) => {
    switch (status) {
      case 'LIBRE': return <Users className="h-3 w-3" />
      case 'OCCUPEE': return <Utensils className="h-3 w-3" />
      case 'RESERVEE': return <Calendar className="h-3 w-3" />
      case 'A_NETTOYER': return <Clock className="h-3 w-3" />
      default: return null
    }
  }

  const getStatusText = (status: TableData['status']) => {
    switch (status) {
      case 'LIBRE': return 'Libre'
      case 'OCCUPEE': return 'Occupée'
      case 'RESERVEE': return 'Réservée'
      case 'A_NETTOYER': return 'À nettoyer'
      default: return status
    }
  }

  const handleStatusChange = (newStatus: TableData['status']) => {
    onStatusChange?.(newStatus)
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isHovered ? 'scale-105' : ''
      } ${getStatusColor(table.status)}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">Table {table.number}</h3>
            <p className="text-sm opacity-75">{table.capacity} personnes</p>
            {table.section && (
              <p className="text-xs opacity-60">{table.section}</p>
            )}
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('LIBRE')
                }}>
                  <Users className="h-4 w-4 mr-2" />
                  Marquer libre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('OCCUPEE')
                }}>
                  <Utensils className="h-4 w-4 mr-2" />
                  Marquer occupée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleStatusChange('A_NETTOYER')
                }}>
                  <Clock className="h-4 w-4 mr-2" />
                  Marquer à nettoyer
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.()
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getStatusIcon(table.status)}
            {getStatusText(table.status)}
          </Badge>
        </div>

        {table.currentOrder && (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Commande:</span>
              <span className="font-medium">{table.currentOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant:</span>
              <span className="font-medium">{table.currentOrder.amount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Temps:</span>
              <span className="font-medium">{table.currentOrder.duration} min</span>
            </div>
          </div>
        )}

        {table.reservation && (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Réservation:</span>
              <span className="font-medium">{table.reservation.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Heure:</span>
              <span className="font-medium">{table.reservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Personnes:</span>
              <span className="font-medium">{table.reservation.guests}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}