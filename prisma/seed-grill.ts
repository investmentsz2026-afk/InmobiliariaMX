import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  "Parrilladas",
  "Pizzas",
  "Papas Rellenas",
  "Queso Cava",
  "Quesos",
  "Chorizos"
];

const initialGrillProducts = [
  // PARRILLADAS
  { name: "Reserva Individual", price: 305, description: "Parrillada individual con cortes premium selectos, complementos calientes y salsas caseras de la casa.", category: "Parrilladas" },
  { name: "Reserva del Mar", price: 305, description: "300g de camarón salseado y cocinado al carbón, elote amarillo, papa cambray asada y salsas.", category: "Parrilladas" },
  { name: "Reserva Doble", price: 590, description: "Parrillada para dos personas con cortes selectos, complementos calientes, cebollitas asadas y salsas.", category: "Parrilladas" },
  { name: "La Gran Reserva", price: 1160, description: "Parrillada familiar para cuatro personas con abundante carne, complementos calientes y salsas de la casa.", category: "Parrilladas" },
  
  // PIZZAS
  { name: "Pizza Mar y Tierra", price: 289, description: "Pizza artesanal cocida a la parrilla, con camarones seleccionados, arrachera premium y queso fundido.", category: "Pizzas" },
  { name: "Pizza de Carnes Frías", price: 249, description: "Pizza artesanal cocida a la parrilla con chorizo argentino, chistorra, sirloin y abundante queso gouda.", category: "Pizzas" },
  { name: "Pizza Hawaiana al Carbón", price: 199, description: "Pizza artesanal con jamón selecto, piña asada al carbón y queso fundido a las brasas.", category: "Pizzas" },

  // PAPAS RELLENAS
  { name: "Papa Rellena Sirloin", price: 220, description: "Papa gigante asada al carbón, rellena de puré cremoso, queso gouda fundido y abundante Sirloin.", category: "Papas Rellenas" },
  { name: "Papa Rellena Mixta", price: 220, description: "Papa gigante asada al carbón con puré cremoso, queso gouda fundido, Sirloin y chorizo argentino.", category: "Papas Rellenas" },
  { name: "Papa Rellena Chorizo / Chistorra", price: 220, description: "Papa gigante asada al carbón con puré cremoso, queso gouda fundido y chorizo de cerdo o chistorra.", category: "Papas Rellenas" },
  { name: "Papa Rellena Camarón", price: 285, description: "Papa gigante asada al carbón con puré cremoso, queso gouda fundido y jugosos camarones salseados.", category: "Papas Rellenas" },
  { name: "Papa Rellena Champiñón y Guacamole", price: 220, description: "Papa gigante asada al carbón con puré cremoso, queso gouda fundido, champiñones frescos y guacamole.", category: "Papas Rellenas" },

  // QUESO CAVA
  { name: "Quesa Cava Sirloin", price: 245, description: "Quesadilla gigante de tortilla artesanal dorada al carbón, rellena de queso asadero y Sirloin premium.", category: "Queso Cava" },
  { name: "Quesa Cava Mixta", price: 245, description: "Quesadilla artesanal dorada al carbón, rellena de queso asadero, Sirloin y chorizo argentino.", category: "Queso Cava" },
  { name: "Quesa Cava Champiñón y Guacamole", price: 245, description: "Quesadilla artesanal dorada al carbón, con queso asadero, champiñones frescos y guacamole.", category: "Queso Cava" },
  { name: "Quesa Cava Camarón", price: 285, description: "Quesadilla artesanal dorada al carbón, con queso asadero y camarones salseados a la parrilla.", category: "Queso Cava" },

  // QUESOS
  { name: "Queso Fundido Natural", price: 110, description: "Delicioso queso gouda fundido en cazuela al carbón de mezquite.", category: "Quesos" },
  { name: "Queso Fundido con Chistorra", price: 155, description: "Delicioso queso gouda fundido al carbón con abundante chistorra dorada.", category: "Quesos" },
  { name: "Queso Fundido con Chorizo Argentino", price: 155, description: "Queso gouda fundido al carbón con chorizo argentino artesanal.", category: "Quesos" },
  { name: "Guacamole de la Casa", price: 95, description: "Porción generosa de guacamole fresco preparado al momento con totopos.", category: "Quesos" },
  
  // CHORIZOS
  { name: "Chorizo de Cerdo (150g)", price: 70, description: "Elaborado con receta tradicional de la casa.", category: "Chorizos" },
  { name: "Chorizo Argentino (150g)", price: 85, description: "Especiado al estilo tradicional, jugoso al grill.", category: "Chorizos" },
  { name: "Chistorra Navarra (150g)", price: 90, description: "Delgada y crujiente, perfecta para picar antes de los platos principales.", category: "Chorizos" },
];

async function main() {
  console.log("Seeding Custom Categories for Grill...");
  
  // Clear existing Grill categories & products
  await prisma.grillProduct.deleteMany();
  await prisma.customCategory.deleteMany({
    where: { target: "GRILL" }
  });

  // Create custom categories
  for (const catName of categories) {
    await prisma.customCategory.create({
      data: {
        name: catName,
        target: "GRILL"
      }
    });
  }

  console.log("Seeding Grill Products...");

  for (const product of initialGrillProducts) {
    await prisma.grillProduct.create({
      data: product,
    });
  }

  console.log("Grill Products and categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
