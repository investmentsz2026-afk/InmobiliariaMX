import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.grillProduct.count();
  console.log("Total products:", count);
  const products = await prisma.grillProduct.findMany();
  console.log("Products:", JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => pool.end());
