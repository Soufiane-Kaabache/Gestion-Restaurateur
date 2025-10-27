'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2,
  Grid3X3,
  Users,
  Utensils,
  Calendar,
  Clock
} from 'lucide-react'
import { TableData } from './TableCard'

interface FloorPlanProps {
  tables: TableData[]
  onTableClick?: (table: TableData) => void
  onTableMove?: (tableId: string, x: number, y: number) => void
  editable?: boolean
}

export function FloorPlan({ 
  tables, 
  onTableClick, 
  onTableMove, 
  editable = false 
}: FloorPlanProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5))
  }, [])

  const handleResetView = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault()
      setIsPanning(true)
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isPanning, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleTableMouseDown = useCallback((e: React.MouseEvent, tableId: string) => {
    if (editable && e.button === 0) {
      e.stopPropagation()
      setSelectedTable(tableId)
      setIsDragging(true)
    }
  }, [editable])

  const handleTableDrag = useCallback((e: React.MouseEvent) => {
    if (isDragging && selectedTable && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - offset.x) / scale
      const y = (e.clientY - rect.top - offset.y) / scale
      
      onTableMove?.(selectedTable, x, y)
    }
  }, [isDragging, selectedTable, offset, scale, onTableMove])

  const handleTableMouseUp = useCallback(() => {
    setIsDragging(false)
    setSelectedTable(null)
  }, [])

  const getStatusColor = (status: TableData['status']) => {
    switch (status) {
      case 'LIBRE': return 'bg-green-500 hover:bg-green-600'
      case 'OCCUPEE': return 'bg-red-500 hover:bg-red-600'
      case 'RESERVEE': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'A_NETTOYER': return 'bg-orange-500 hover:bg-orange-600'
      default: return 'bg-gray-500 hover:bg-gray-600'
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Plan de salle</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-gray-50 border-t">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${20 * scale}px ${20 * scale}px`,
              transform: `translate(${offset.x % (20 * scale)}px, ${offset.y % (20 * scale)}px)`
            }}
          />
          
          {/* Tables Container */}
          <div
            ref={containerRef}
            className="relative h-[600px] cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={(e) => {
              handleMouseMove(e)
              handleTableDrag(e)
            }}
            onMouseUp={handleTableMouseUp}
            onMouseLeave={handleTableMouseUp}
            style={{
              cursor: isPanning ? 'grabbing' : 'grab'
            }}
          >
            <div
              className="relative w-full h-full"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: 'top left'
              }}
            >
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`absolute flex flex-col items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    getStatusColor(table.status)
                  } ${
                    selectedTable === table.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  } ${
                    editable ? 'cursor-move' : 'cursor-pointer'
                  }`}
                  style={{
                    left: `${table.positionX}px`,
                    top: `${table.positionY}px`,
                    width: '80px',
                    height: '80px',
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseDown={(e) => handleTableMouseDown(e, table.id)}
                  onClick={() => !editable && onTableClick?.(table)}
                >
                  <div className="text-white text-center">
                    <div className="font-bold text-sm">T{table.number}</div>
                    <div className="text-xs">{table.capacity}p</div>
                    <div className="flex items-center justify-center mt-1">
                      {getStatusIcon(table.status)}
                    </div>
                  </div>
                  
                  {table.currentOrder && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {table.currentOrder.amount.toFixed(0)}
                    </div>
                  )}
                  
                  {table.reservation && (
                    <div className="absolute -top-2 -left-2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      R
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
            <h4 className="font-medium text-sm mb-2">Légende</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs">Libre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-xs">Occupée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span className="text-xs">Réservée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded" />
                <span className="text-xs">À nettoyer</span>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          {editable && (
            <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg">
              <h4 className="font-medium text-sm mb-2">Instructions</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Glisser les tables pour les déplacer</p>
                <p>• Shift + Glisser pour déplacer la vue</p>
                <p>• Molette pour zoomer</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}