import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a demo restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'restaurant-demo' },
    update: {},
    create: {
      name: 'Restaurant Demo',
      slug: 'restaurant-demo',
      address: '123 Rue de Test',
      city: 'Paris',
      country: 'FR',
    },
  });
  console.log('✅ Restaurant created:', restaurant.id);

  // Create an admin user (password is placeholder)
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@restaurant.test' },
      update: {},
      create: {
        email: 'admin@restaurant.test',
        firstName: 'Admin',
        lastName: 'Test',
        passwordHash: '$2a$10$DEMO_HASH',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } catch (e) {
    console.warn('⚠️ Could not create admin user (field mismatch?):', (e as Error).message);
  }

  // Create categories (if model exists)
  const categories: any[] = [];
  try {
    const c1 = await prisma.category.create({
      data: { name: 'Entrées', description: "Plats d'entrée", restaurantId: restaurant.id },
    });
    const c2 = await prisma.category.create({
      data: { name: 'Plats', description: 'Plats principaux', restaurantId: restaurant.id },
    });
    const c3 = await prisma.category.create({
      data: { name: 'Desserts', description: 'Desserts', restaurantId: restaurant.id },
    });
    categories.push(c1, c2, c3);
    console.log('✅ Categories created');
  } catch (e) {
    console.warn('⚠️ Could not create categories (field mismatch?):', (e as Error).message);
  }

  // Create products (mapped from previous 'dishes')
  try {
    if (categories.length > 0) {
      await prisma.product.createMany({
        data: [
          {
            name: 'Salade César',
            description: 'Salade fraîche avec poulet grillé',
            price: 12.5,
            categoryId: categories[0].id,
            restaurantId: restaurant.id,
            isAvailable: true,
          },
          {
            name: 'Burger Maison',
            description: 'Pain artisanal, steak 180g',
            price: 16.0,
            categoryId: categories[1].id,
            restaurantId: restaurant.id,
            isAvailable: true,
          },
          {
            name: 'Tiramisu',
            description: 'Dessert italien',
            price: 7.5,
            categoryId: categories[2].id,
            restaurantId: restaurant.id,
            isAvailable: true,
          },
        ],
      });
      console.log('✅ Products created');
    }
  } catch (e) {
    console.warn('⚠️ Could not create products (field mismatch?):', (e as Error).message);
  }

  // Create tables
  try {
    await prisma.table.createMany({
      data: [
        { number: 1, capacity: 4, restaurantId: restaurant.id, status: 'LIBRE' },
        { number: 2, capacity: 2, restaurantId: restaurant.id, status: 'LIBRE' },
      ],
    });
    console.log('✅ Tables created');
  } catch (e) {
    console.warn('⚠️ Could not create tables (field mismatch?):', (e as Error).message);
  }

  // Create a reservation
  try {
    const tables = await prisma.table.findMany({ where: { restaurantId: restaurant.id } });
    if (tables.length > 0) {
      await prisma.reservation.create({
        data: {
          customerName: 'Jean Dupont',
          customerEmail: 'jean@example.com',
          customerPhone: '+33612345678',
          date: new Date(),
          time: '19:00',
          guests: 2,
          status: 'CONFIRMEE',
          tableId: tables[0].id,
        },
      });
      console.log('✅ Reservation created');
    }
  } catch (e) {
    console.warn('⚠️ Could not create reservation (field mismatch?):', (e as Error).message);
  }

  console.log('🎉 Seeding finished');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
