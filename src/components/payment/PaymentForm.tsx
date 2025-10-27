'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Smartphone,
  Calculator,
  Printer,
  CheckCircle
} from 'lucide-react'
import { OrderData } from '@/components/orders/OrderForm'

interface PaymentFormProps {
  order: OrderData
  onPaymentComplete?: (paymentData: PaymentData) => void
  onCancel?: () => void
}

export interface PaymentData {
  orderId: string
  amount: number
  method: 'ESPECES' | 'CARTE_BANCAIRE' | 'CHEQUE' | 'TICKET_RESTAURANT' | 'MOBILE'
  cashReceived?: number
  change?: number
  splitPayments?: SplitPayment[]
  tip: number
  receiptUrl?: string
}

export interface SplitPayment {
  method: string
  amount: number
}

export function PaymentForm({ order, onPaymentComplete, onCancel }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentData['method']>('CARTE_BANCAIRE')
  const [cashReceived, setCashReceived] = useState<string>('')
  const [tip, setTip] = useState<string>(order.tip?.toString() || '0')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSplitPayment, setShowSplitPayment] = useState(false)
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([])

  const totalAmount = order.totalAmount + parseFloat(tip || '0')
  const change = cashReceived ? parseFloat(cashReceived) - totalAmount : 0

  const paymentMethods = [
    { value: 'CARTE_BANCAIRE', label: 'Carte bancaire', icon: CreditCard },
    { value: 'ESPECES', label: 'Espèces', icon: DollarSign },
    { value: 'CHEQUE', label: 'Chèque', icon: Receipt },
    { value: 'TICKET_RESTAURANT', label: 'Ticket restaurant', icon: Receipt },
    { value: 'MOBILE', label: 'Paiement mobile', icon: Smartphone },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const paymentData: PaymentData = {
        orderId: order.id!,
        amount: totalAmount,
        method: paymentMethod,
        tip: parseFloat(tip || '0'),
        cashReceived: paymentMethod === 'ESPECES' ? parseFloat(cashReceived || '0') : undefined,
        change: paymentMethod === 'ESPECES' ? change : undefined,
        splitPayments: showSplitPayment ? splitPayments : undefined,
        receiptUrl: `/receipts/${order.id}.pdf`
      }
      
      onPaymentComplete?.(paymentData)
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const addSplitPayment = () => {
    setSplitPayments(prev => [...prev, { method: 'CARTE_BANCAIRE', amount: 0 }])
  }

  const updateSplitPayment = (index: number, field: keyof SplitPayment, value: string | number) => {
    setSplitPayments(prev => prev.map((payment, i) => 
      i === index ? { ...payment, [field]: value } : payment
    ))
  }

  const removeSplitPayment = (index: number) => {
    setSplitPayments(prev => prev.filter((_, i) => i !== index))
  }

  const getSplitTotal = () => {
    return splitPayments.reduce((sum, payment) => sum + payment.amount, 0)
  }

  const isValidPayment = () => {
    if (showSplitPayment) {
      return Math.abs(getSplitTotal() - totalAmount) < 0.01
    }
    
    if (paymentMethod === 'ESPECES') {
      return parseFloat(cashReceived || '0') >= totalAmount
    }
    
    return true
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Paiement - {order.orderNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Table {order.table.number}</span>
              <span>{order.items.length} articles</span>
            </div>
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{order.totalAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>TVA:</span>
              <span>{order.taxAmount.toFixed(2)} €</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Remise:</span>
                <span>-{order.discount.toFixed(2)} €</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{order.totalAmount.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Méthode de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={method.value} id={method.value} />
                  <Label htmlFor={method.value} className="flex items-center gap-2 cursor-pointer">
                    <Icon className="h-4 w-4" />
                    {method.label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="split"
              checked={showSplitPayment}
              onChange={(e) => setShowSplitPayment(e.target.checked)}
            />
            <Label htmlFor="split">Paiement fractionné</Label>
          </div>
        </CardContent>
      </Card>

      {/* Split Payment */}
      {showSplitPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Paiement fractionné</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {splitPayments.map((payment, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={payment.method}
                  onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                  className="px-3 py-2 border rounded-md flex-1"
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  value={payment.amount}
                  onChange={(e) => updateSplitPayment(index, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSplitPayment(index)}
                >
                  ×
                </Button>
              </div>
            ))}
            
            <div className="flex justify-between items-center">
              <span>Total fractionné:</span>
              <span className="font-bold">{getSplitTotal().toFixed(2)} €</span>
            </div>
            
            {Math.abs(getSplitTotal() - totalAmount) > 0.01 && (
              <div className="text-red-600 text-sm">
                Écart: {Math.abs(getSplitTotal() - totalAmount).toFixed(2)} €
              </div>
            )}
            
            <Button onClick={addSplitPayment} variant="outline" className="w-full">
              Ajouter un paiement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cash Payment */}
      {paymentMethod === 'ESPECES' && !showSplitPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Espèces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cashReceived">Montant reçu:</Label>
              <Input
                id="cashReceived"
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            {change > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Monnaie à rendre:</span>
                  <span className="font-bold text-green-800">{change.toFixed(2)} €</span>
                </div>
              </div>
            )}
            
            {change < 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-red-800">
                  Manque: {Math.abs(change).toFixed(2)} €
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tip */}
      <Card>
        <CardHeader>
          <CardTitle>Pourboire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="tip">Montant:</Label>
            <Input
              id="tip"
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
            <div className="flex gap-2">
              {[1, 2, 5, 10].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setTip(amount.toString())}
                >
                  +{amount}€
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total à payer:</span>
              <span>{totalAmount.toFixed(2)} €</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
              <Button 
                onClick={handlePayment} 
                className="flex-1"
                disabled={!isValidPayment() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Calculator className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payer {totalAmount.toFixed(2)} €
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}