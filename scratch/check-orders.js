const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const orders = await prisma.order.findMany();
    console.log(`Total orders found: ${orders.length}`);
    console.log('Orders:', JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error querying orders:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
