import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tables = await (db as any).table.findMany({ orderBy: { number: 'asc' } });
    return NextResponse.json({ tables }, { status: 200 });
  } catch (error) {
    console.error('Erreur tables GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tables' },
      { status: 500 },
    );
  }
}
