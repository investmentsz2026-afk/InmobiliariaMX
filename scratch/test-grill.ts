import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length || 0);
    console.log("Listing products...");
    const products = await prisma.grillProduct.findMany();
    console.log(`Found ${products.length} products.`);

    console.log("Testing insert of dummy grill product...");
    const p = await prisma.grillProduct.create({
      data: {
        name: "Test Grill Product",
        description: "Test Description",
        price: 150,
        category: "CORTE",
        isActive: true,
        imageUrl: "https://example.com/test.jpg",
      },
    });
    console.log("Created successfully:", p);
    
    console.log("Testing update...");
    const updated = await prisma.grillProduct.update({
      where: { id: p.id },
      data: {
        name: "Test Grill Product Updated",
        imageUrl: null
      }
    });
    console.log("Updated successfully:", updated);

    // Clean up
    await prisma.grillProduct.delete({
      where: { id: p.id }
    });
    console.log("Cleaned up successfully.");
  } catch (error) {
    console.error("CRITICAL ERROR:", error);
  } finally {
    await prisma.$disconnect();
    // End any active pool in process to prevent hang
    if ((global as any).pgPool) {
      await (global as any).pgPool.end();
    }
    // Also process exit in case pool end wasn't enough
    process.exit(0);
  }
}

main();
