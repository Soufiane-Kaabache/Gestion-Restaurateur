'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Edit, 
  Trash2, 
  Plus, 
  Minus,
  Eye,
  EyeOff,
  Star,
  Clock
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ProductData {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  categoryId: string
  categoryName?: string
  allergens?: string
  preparationTime?: number
  orderCount?: number
  rating?: number
}

interface ProductCardProps {
  product: ProductData
  onEdit?: (product: ProductData) => void
  onDelete?: (productId: string) => void
  onToggleAvailability?: (productId: string, available: boolean) => void
  onSelect?: (product: ProductData) => void
  showActions?: boolean
  selectable?: boolean
  selected?: boolean
  quantity?: number
  onQuantityChange?: (productId: string, quantity: number) => void
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  onSelect,
  showActions = true,
  selectable = false,
  selected = false,
  quantity = 0,
  onQuantityChange
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta)
    onQuantityChange?.(product.id, newQuantity)
  }

  const handleToggleAvailability = () => {
    onToggleAvailability?.(product.id, !product.isAvailable)
  }

  const handleSelect = () => {
    onSelect?.(product)
  }

  return (
    <>
      <Card 
        className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
          isHovered ? 'scale-105' : ''
        } ${
          !product.isAvailable ? 'opacity-60' : ''
        } ${
          selected ? 'ring-2 ring-blue-500' : ''
        } ${
          selectable ? 'hover:ring-2 hover:ring-blue-300' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={selectable ? handleSelect : undefined}
      >
        {/* Product Image */}
        {product.imageUrl && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onClick={() => setShowImageModal(true)}
            />
            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium">Indisponible</span>
              </div>
            )}
            {product.rating && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              {product.categoryName && (
                <Badge variant="secondary" className="text-xs">
                  {product.categoryName}
                </Badge>
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
                    <Edit className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(product)
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation()
                    handleToggleAvailability()
                  }}>
                    {product.isAvailable ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {product.isAvailable ? 'Masquer' : 'Afficher'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(product.id)
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

          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{product.price.toFixed(2)} €</span>
              {product.preparationTime && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {product.preparationTime}min
                </div>
              )}
            </div>
            
            {product.orderCount && (
              <span className="text-xs text-gray-500">
                {product.orderCount} commandes
              </span>
            )}
          </div>

          {product.allergens && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Allergènes:</p>
              <div className="flex flex-wrap gap-1">
                {product.allergens.split(',').map((allergen, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {allergen.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Quantity Selector */}
        {onQuantityChange && (
          <CardFooter className="pt-0">
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuantityChange(-1)
                }}
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  e.stopPropagation()
                  const newQuantity = parseInt(e.target.value) || 0
                  onQuantityChange(product.id, newQuantity)
                }}
                className="w-16 text-center"
                min="0"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuantityChange(1)
                }}
                disabled={!product.isAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}