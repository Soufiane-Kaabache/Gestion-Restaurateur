import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReservationConfirmation, notifyNewReservation } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      partySize,
      specialRequests,
      tableId,
      time,
    } = body;

    // Ensure required fields
    if (!customerName || !date || !partySize) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If tableId not provided, try to pick any existing table
    let finalTableId = tableId;
    if (!finalTableId) {
      const anyTable = await prisma.table.findFirst();
      if (!anyTable) {
        return NextResponse.json(
          { error: 'No table available, please create a table first' },
          { status: 400 },
        );
      }
      finalTableId = anyTable.id;
    }

    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || '',
        tableId: finalTableId,
        date: new Date(date),
        time: time || new Date(date).toTimeString().slice(0, 5),
        guests: Number(partySize),
        status: 'EN_ATTENTE',
        notes: specialRequests || undefined,
      },
    });

    // Send confirmation asynchronously (don't block response)
    if (customerEmail) {
      sendReservationConfirmation({
        customerName,
        customerEmail,
        date: new Date(date),
        partySize: Number(partySize),
        specialRequests,
      }).catch((err) => console.error('Erreur envoi email:', err));
      // Also notify staff (manager + waiter) about new reservation
      notifyNewReservation({
        customerName,
        customerEmail,
        customerPhone,
        date: new Date(date),
        partySize: Number(partySize),
      }).catch((err) => console.error('Erreur notification personnel:', err));
    }

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error) {
    console.error('Erreur création réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    // basic listing with recent first
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: 'desc' },
      take: 100,
    });
    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error('Erreur listing reservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 },
    );
  }
}
