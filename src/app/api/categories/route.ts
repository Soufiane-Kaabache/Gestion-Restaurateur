import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const restaurantId = url.searchParams.get('restaurantId');

    const where: any = {};
    if (restaurantId) where.restaurantId = restaurantId;

    const categories = await (db as any).category.findMany({ where, orderBy: { order: 'asc' } });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Erreur categories GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 },
    );
  }
}
