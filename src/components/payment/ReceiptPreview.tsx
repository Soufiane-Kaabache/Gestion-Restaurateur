'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Receipt, 
  Printer, 
  Download,
  Mail,
  QrCode
} from 'lucide-react'
import { OrderData } from '@/components/orders/OrderForm'
import { PaymentData } from './PaymentForm'

interface ReceiptPreviewProps {
  order: OrderData
  payment: PaymentData
  onPrint?: () => void
  onEmail?: () => void
  onDownload?: () => void
}

export function ReceiptPreview({ 
  order, 
  payment, 
  onPrint, 
  onEmail, 
  onDownload 
}: ReceiptPreviewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleDateString('fr-FR')
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleTimeString('fr-FR')
    return new Date(dateString).toLocaleTimeString('fr-FR')
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'CARTE_BANCAIRE': return 'Carte bancaire'
      case 'ESPECES': return 'Espèces'
      case 'CHEQUE': return 'Chèque'
      case 'TICKET_RESTAURANT': return 'Ticket restaurant'
      case 'MOBILE': return 'Paiement mobile'
      default: return method
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Restaurant</h1>
          <p className="text-sm text-gray-600">123 Rue de la Gastronomie</p>
          <p className="text-sm text-gray-600">75001 Paris</p>
          <p className="text-sm text-gray-600">Tél: 01 23 45 67 89</p>
          <Separator className="my-4" />
        </div>

        {/* Order Info */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ticket:</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Heure:</span>
            <span className="font-medium">{formatTime(order.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Table:</span>
            <span className="font-medium">Table {order.table.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Serveur:</span>
            <span className="font-medium">Serveur</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Order Items */}
        <div className="space-y-2 mb-6">
          <h3 className="font-medium mb-3">Détail de la commande</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex-1">
                <span className="text-sm">{item.quantity}x {item.product.name}</span>
                {item.notes && (
                  <p className="text-xs text-gray-600 italic">• {item.notes}</p>
                )}
              </div>
              <span className="text-sm font-medium">
                {(item.unitPrice * item.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Totals */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-sm">Sous-total:</span>
            <span className="text-sm">{order.totalAmount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">TVA (10%):</span>
            <span className="text-sm">{order.taxAmount.toFixed(2)} €</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="text-sm">Remise:</span>
              <span className="text-sm">-{order.discount.toFixed(2)} €</span>
            </div>
          )}
          {payment.tip > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Pourboire:</span>
              <span className="text-sm">{payment.tip.toFixed(2)} €</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{payment.amount.toFixed(2)} €</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Payment Info */}
        <div className="space-y-2 mb-6">
          <h3 className="font-medium mb-3">Paiement</h3>
          <div className="flex justify-between">
            <span className="text-sm">Méthode:</span>
            <span className="text-sm">{getPaymentMethodLabel(payment.method)}</span>
          </div>
          {payment.cashReceived && (
            <>
              <div className="flex justify-between">
                <span className="text-sm">Espèces reçues:</span>
                <span className="text-sm">{payment.cashReceived.toFixed(2)} €</span>
              </div>
              {payment.change && payment.change > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-sm">Monnaie rendue:</span>
                  <span className="text-sm">{payment.change.toFixed(2)} €</span>
                </div>
              )}
            </>
          )}
          {payment.splitPayments && payment.splitPayments.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm">Paiements fractionnés:</span>
              {payment.splitPayments.map((split, index) => (
                <div key={index} className="flex justify-between text-sm pl-4">
                  <span>{getPaymentMethodLabel(split.method)}:</span>
                  <span>{split.amount.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* QR Code */}
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Scannez pour donner votre avis
          </p>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Merci de votre visite!</p>
          <p className="text-xs text-gray-500">
            Au plaisir de vous revoir bientôt
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onPrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" onClick={onEmail} className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}