import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
    return NextResponse.json({ tables }, { status: 200 });
  } catch (error) {
    console.error('Erreur tables GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tables' },
      { status: 500 },
    );
  }
}
