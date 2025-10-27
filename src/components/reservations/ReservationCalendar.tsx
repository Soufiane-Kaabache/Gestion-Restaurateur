'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { ReservationData } from './ReservationForm';
import { TableData } from '@/components/tables/TableCard';

interface ReservationCalendarProps {
  reservations: ReservationData[];
  tables: TableData[];
  onReservationSelect?: (reservation: ReservationData) => void;
  onReservationEdit?: (reservation: ReservationData) => void;
  onReservationDelete?: (reservationId: string) => void;
  onReservationCreate?: () => void;
}

export function ReservationCalendar({
  reservations,
  tables,
  onReservationSelect,
  onReservationEdit,
  onReservationDelete,
  onReservationCreate,
}: ReservationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getReservationsForDate = (date: Date) => {
    return reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.date);
      return reservationDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TERMINEE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE':
        return <AlertCircle className="h-3 w-3" />;
      case 'CONFIRMEE':
        return <CheckCircle className="h-3 w-3" />;
      case 'ANNULEE':
        return <XCircle className="h-3 w-3" />;
      case 'TERMINEE':
        return <CheckCircle className="h-3 w-3" />;
      case 'NO_SHOW':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ReservationData['status']) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'CONFIRMEE':
        return 'Confirmée';
      case 'ANNULEE':
        return 'Annulée';
      case 'TERMINEE':
        return 'Terminée';
      case 'NO_SHOW':
        return 'No-show';
      default:
        return status;
    }
  };

  const getTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getReservationsForTimeSlot = (time: string) => {
    return getReservationsForDate(selectedDate).filter((reservation) => reservation.time === time);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayReservations = (date: Date) => {
    const dayReservations = getReservationsForDate(date);
    const confirmed = dayReservations.filter((r) => r.status === 'CONFIRMEE').length;
    const pending = dayReservations.filter((r) => r.status === 'EN_ATTENTE').length;

    return { confirmed, pending, total: dayReservations.length };
  };

  const timeSlots = getTimeSlots();
  const selectedDateReservations = getReservationsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendrier</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[100px] text-center">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              modifiers={{
                hasReservations: (date) => getReservationsForDate(date).length > 0,
              }}
              modifiersStyles={{
                hasReservations: {
                  backgroundColor: '#fef3c7',
                  fontWeight: 'bold',
                },
              }}
            />

            {/* Legend */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-200 rounded" />
                <span className="text-xs">Réservations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-xs">Aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Schedule */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Réservations du{' '}
                {selectedDate.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </CardTitle>
              <Button onClick={onReservationCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réservation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timeSlots.map((timeSlot) => {
                const slotReservations = getReservationsForTimeSlot(timeSlot);
                if (slotReservations.length === 0) return null;

                return (
                  <div key={timeSlot} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{timeSlot}</span>
                    </div>
                    <div className="space-y-2">
                      {slotReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{reservation.customerName}</span>
                              <Badge className={`text-xs ${getStatusColor(reservation.status)}`}>
                                {getStatusIcon(reservation.status)}
                                {getStatusText(reservation.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {reservation.guests} personnes
                              </div>
                              <div className="flex items-center gap-1">
                                <span>Table {reservation.table.number}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {reservation.customerPhone}
                              </div>
                            </div>
                            {reservation.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                {reservation.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onReservationSelect?.(reservation)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onReservationDelete?.(reservation.id!)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {selectedDateReservations.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune réservation pour cette date</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la journée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedDateReservations.length}</div>
                <p className="text-sm text-gray-600">Total réservations</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedDateReservations.filter((r) => r.status === 'CONFIRMEE').length}
                </div>
                <p className="text-sm text-gray-600">Confirmées</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedDateReservations.filter((r) => r.status === 'EN_ATTENTE').length}
                </div>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {selectedDateReservations.reduce((sum, r) => sum + r.guests, 0)}
                </div>
                <p className="text-sm text-gray-600">Couverts prévus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
