import React from 'react';
import { cn, formatDateTime, getStatusColor, getStatusLabel, getStatusIcon } from '@/lib/utils';

export type Reservation = {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string | Date;
  partySize: number;
  status: string;
};

type Props = {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onSeat?: (id: string) => void;
};

export const ReservationCard: React.FC<Props> = ({ reservation, onCancel, onSeat }) => {
  const statusColor = getStatusColor(reservation.status);
  const statusLabel = getStatusLabel(reservation.status);
  const statusIcon = getStatusIcon(reservation.status);

  return (
    <div
      className={cn('p-4 rounded-md shadow-sm bg-white flex items-start gap-4')}
      data-testid="reservation-card"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
          <div
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full border',
              statusColor,
            )}
            data-testid="status-badge"
          >
            <span aria-hidden>{statusIcon}</span>
            <span>{statusLabel}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-1" data-testid="reservation-datetime">
          {formatDateTime(reservation.date)}
        </p>
        <p className="text-sm text-muted-foreground">{reservation.partySize} personnes</p>
        {reservation.customerPhone && <p className="text-sm">📞 {reservation.customerPhone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        {onSeat && (
          <button
            className="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white text-sm"
            onClick={() => onSeat(reservation.id)}
            data-testid="seat-btn"
          >
            Installer
          </button>
        )}

        {onCancel && (
          <button
            className="inline-flex items-center px-3 py-1 rounded border text-sm"
            onClick={() => onCancel(reservation.id)}
            data-testid="cancel-btn"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
