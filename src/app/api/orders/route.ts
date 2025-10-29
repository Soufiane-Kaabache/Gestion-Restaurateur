import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await (db as any).order.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Erreur orders GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 },
    );
  }
}
