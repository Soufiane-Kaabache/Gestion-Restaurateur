import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ restaurants }, { status: 200 });
  } catch (error) {
    console.error('Erreur restaurants GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des restaurants' },
      { status: 500 },
    );
  }
}
