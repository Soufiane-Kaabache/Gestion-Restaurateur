'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MenuManager } from '@/components/menu/MenuManager'
import { ProductData } from '@/components/menu/ProductCard'
import { CategoryData, CategoryForm } from '@/components/menu/CategoryForm'

// Mock data - dans une vraie application, cela viendrait de l'API
const mockProducts: ProductData[] = [
  {
    id: '1',
    name: 'Burger Classic',
    description: 'Délicieux burger avec bœuf, laitue, tomate, oignon et sauce maison',
    price: 12.90,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '1',
    categoryName: 'Plats principaux',
    allergens: 'Gluten, Lactose',
    preparationTime: 20,
    orderCount: 45,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Salade César',
    description: 'Salade fraîche avec poulet grillé, parmesan et croûtons',
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '2',
    categoryName: 'Entrées',
    allergens: 'Gluten, Lactose, Œuf',
    preparationTime: 10,
    orderCount: 32,
    rating: 4.2
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    description: 'Pizza classique avec sauce tomate, mozzarella et basilic',
    price: 11.50,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '3',
    categoryName: 'Plats principaux',
    allergens: 'Gluten, Lactose',
    preparationTime: 15,
    orderCount: 28,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Soupe du jour',
    description: 'Soupe maison de saison avec légumes frais',
    price: 6.50,
    isAvailable: false,
    categoryId: '2',
    categoryName: 'Entrées',
    allergens: '',
    preparationTime: 5,
    orderCount: 15,
    rating: 3.8
  },
  {
    id: '5',
    name: 'Steak Frites',
    description: 'Steak de bœuf grillé avec frites maison et sauce au choix',
    price: 18.90,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '1',
    categoryName: 'Plats principaux',
    allergens: 'Gluten',
    preparationTime: 25,
    orderCount: 38,
    rating: 4.6
  },
  {
    id: '6',
    name: 'Tiramisu',
    description: 'Dessert italien classique avec café et mascarpone',
    price: 7.50,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
    isAvailable: true,
    categoryId: '4',
    categoryName: 'Desserts',
    allergens: 'Gluten, Lactose, Œuf',
    preparationTime: 5,
    orderCount: 22,
    rating: 4.8
  },
  {
    id: '7',
    name: 'Coca-Cola',
    description: 'Boisson gazeuse classique',
    price: 3.00,
    isAvailable: true,
    categoryId: '5',
    categoryName: 'Boissons',
    allergens: '',
    preparationTime: 2,
    orderCount: 65,
    rating: 4.0
  },
  {
    id: '8',
    name: 'Bière artisanale',
    description: 'Bière locale brassée artisanalement',
    price: 5.50,
    isAvailable: true,
    categoryId: '5',
    categoryName: 'Boissons',
    allergens: 'Gluten',
    preparationTime: 2,
    orderCount: 18,
    rating: 4.3
  }
]

const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Plats principaux',
    description: 'Nos plats principaux faits maison',
    order: 1,
    isActive: true
  },
  {
    id: '2',
    name: 'Entrées',
    description: 'Délicieuses entrées pour commencer',
    order: 0,
    isActive: true
  },
  {
    id: '3',
    name: 'Plats principaux',
    description: 'Spécialités italiennes',
    order: 2,
    isActive: true
  },
  {
    id: '4',
    name: 'Desserts',
    description: 'Desserts faits maison',
    order: 3,
    isActive: true
  },
  {
    id: '5',
    name: 'Boissons',
    description: 'Boissons fraîches et variées',
    order: 4,
    isActive: true
  }
]

export default function MenuPage() {
  const [products, setProducts] = useState<ProductData[]>(mockProducts)
  const [categories, setCategories] = useState<CategoryData[]>(mockCategories)

  const handleProductUpdate = (updatedProduct: ProductData) => {
    setProducts(prev => prev.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ))
  }

  const handleProductCreate = (newProductData: Omit<ProductData, 'id'>) => {
    const newProduct: ProductData = {
      ...newProductData,
      id: Date.now().toString(),
      categoryName: categories.find(c => c.id === newProductData.categoryId)?.name,
      orderCount: 0,
      rating: 0
    }
    setProducts(prev => [...prev, newProduct])
  }

  const handleProductDelete = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const handleCategoryUpdate = (updatedCategory: CategoryData) => {
    setCategories(prev => prev.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ))
  }

  const handleCategoryCreate = (newCategoryData: Omit<CategoryData, 'id'>) => {
    const newCategory: CategoryData = {
      ...newCategoryData,
      id: Date.now().toString()
    }
    setCategories(prev => [...prev, newCategory])
  }

  const handleCategoryDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId))
  }

  const getMenuStats = () => {
    const totalProducts = products.length
    const availableProducts = products.filter(p => p.isAvailable).length
    const totalCategories = categories.length
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length
    const totalOrders = products.reduce((sum, p) => sum + (p.orderCount || 0), 0)

    return {
      totalProducts,
      availableProducts,
      totalCategories,
      averagePrice,
      totalOrders
    }
  }

  const stats = getMenuStats()

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
          <h1 className="text-3xl font-bold">Gestion du menu</h1>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-sm text-gray-600">Total produits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.availableProducts}</div>
              <p className="text-sm text-gray-600">Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-sm text-gray-600">Catégories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.averagePrice.toFixed(2)} €</div>
              <p className="text-sm text-gray-600">Prix moyen</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-sm text-gray-600">Commandes totales</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Manager */}
      <MenuManager
        products={products}
        categories={categories}
        onProductUpdate={handleProductUpdate}
        onProductCreate={handleProductCreate}
        onProductDelete={handleProductDelete}
        onCategoryUpdate={handleCategoryUpdate}
        onCategoryCreate={handleCategoryCreate}
        onCategoryDelete={handleCategoryDelete}
      />
    </div>
  )
}