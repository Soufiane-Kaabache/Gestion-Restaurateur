import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReservationCard from './ReservationCard';

const mockReservation = {
  id: 'r1',
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com',
  customerPhone: '0612345678',
  date: new Date('2025-11-01T19:00:00'),
  partySize: 4,
  status: 'confirmed',
};

describe('ReservationCard', () => {
  it('renders reservation details and status', () => {
    render(<ReservationCard reservation={mockReservation} />);

    expect(screen.getByTestId('reservation-card')).toBeInTheDocument();
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
    expect(screen.getByTestId('reservation-datetime')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<ReservationCard reservation={mockReservation} onCancel={onCancel} />);
    const btn = screen.getByTestId('cancel-btn');
    fireEvent.click(btn);
    expect(onCancel).toHaveBeenCalledWith('r1');
  });

  it('calls onSeat when seat button clicked', () => {
    const onSeat = vi.fn();
    render(<ReservationCard reservation={mockReservation} onSeat={onSeat} />);
    const btn = screen.getByTestId('seat-btn');
    fireEvent.click(btn);
    expect(onSeat).toHaveBeenCalledWith('r1');
  });
});
