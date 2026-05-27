import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting to database and checking user email...");
  
  // 1. Try to update admin@carnicero.com to admin@inmobiliaria.com
  const updateResult = await prisma.user.updateMany({
    where: { email: "admin@carnicero.com" },
    data: { email: "admin@inmobiliaria.com" }
  });

  if (updateResult.count > 0) {
    console.log(`Successfully updated ${updateResult.count} admin user(s) to admin@inmobiliaria.com`);
  } else {
    // 2. Check if admin@inmobiliaria.com already exists
    const existing = await prisma.user.findUnique({
      where: { email: "admin@inmobiliaria.com" }
    });

    if (existing) {
      console.log("Admin user admin@inmobiliaria.com already exists in database.");
    } else {
      console.log("No existing admin found. Creating a new admin user admin@inmobiliaria.com...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = bcrypt.hashSync("admin123", 10);
      await prisma.user.create({
        data: {
          email: "admin@inmobiliaria.com",
          password: hashedPassword,
          name: "Administrador Carnicero",
          role: "ADMIN",
        }
      });
      console.log("Created admin@inmobiliaria.com successfully with password admin123");
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
