import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const restaurants = await (db as any).restaurant.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ restaurants }, { status: 200 });
  } catch (error) {
    console.error('Erreur restaurants GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des restaurants' },
      { status: 500 },
    );
  }
}
