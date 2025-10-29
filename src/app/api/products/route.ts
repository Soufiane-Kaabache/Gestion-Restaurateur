import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const restaurantId = url.searchParams.get('restaurantId');
    const categoryId = url.searchParams.get('categoryId');

    const where: any = {};
    if (restaurantId) where.restaurantId = restaurantId;
    if (categoryId) where.categoryId = categoryId;

    const total = await prisma.product.count({ where });
    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products, page, limit, total }, { status: 200 });
  } catch (error) {
    console.error('Erreur products GET:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 },
    );
  }
}
