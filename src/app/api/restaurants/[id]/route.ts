import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Next.js App Router passes params in the second argument when using dynamic segments
    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const restaurant = await (db as any).restaurant.findUnique({ where: { id } });
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ restaurant }, { status: 200 });
  } catch (error) {
    console.error('Erreur restaurant GET by id:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
