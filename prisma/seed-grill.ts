import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  "Cortes al Carbón",
  "Parrilladas Premium",
  "Quesa Cavas",
  "Papas Rellenas",
  "Complementos y Especialidades",
  "Embutidos"
];

const initialGrillProducts = [
  // CORTES AL CARBÓN
  { name: "Sirloin al Grill", price: 220, description: "Corte jugoso de 300g preparado al carbón con sazón especial de la casa.", category: "Cortes al Carbón" },
  { name: "Ribeye de Sonora", price: 280, description: "350g con excelente marmoleado que garantiza suavidad y sabor superior.", category: "Cortes al Carbón" },
  { name: "Ribs Especiales", price: 200, description: "Costillar de cerdo horneado y terminado a la parrilla con costra crujiente.", category: "Cortes al Carbón" },
  { name: "T-Bone Grill", price: 300, description: "400g de doble textura: filete tierno y jugoso New York con hueso.", category: "Cortes al Carbón" },
  { name: "Prime Rib del Asador", price: 390, description: "500g de corte de gala con hueso corto, cocido despacio sobre carbón.", category: "Cortes al Carbón" },
  
  // PARRILLADAS PREMIUM
  { name: "Reserva Individual", price: 305, description: "1 corte a elegir (Sirloin, T-Bone, Prime Rib), 2 complementos y salsas de la casa.", category: "Parrilladas Premium" },
  { name: "Reserva del Mar", price: 305, description: "300g de camarón salseado y llevado a las brasas, 1 elote amarillo, papa cambray asada y salsas de la casa.", category: "Parrilladas Premium" },
  { name: "Reserva Doble", price: 590, description: "2 cortes a elegir, 3 complementos y salsas de la casa.", category: "Parrilladas Premium" },
  { name: "La Gran Reserva", price: 1160, description: "4 cortes a elegir, 4 complementos y salsas de la casa.", category: "Parrilladas Premium" },
  
  // PAPAS RELLENAS
  { name: "Papa Rellena Sirloin", price: 220, description: "Delicioso puré elaborado a base de papa, mantequilla y receta secreta, gratinado con queso fundido y Sirloin.", category: "Papas Rellenas" },
  { name: "Papa Rellena Corte a Elegir", price: 240, description: "Delicioso puré gratinado con queso fundido y corte a elegir (Sirloin, T-Bone, Prime Rib).", category: "Papas Rellenas" },
  { name: "Papa Rellena Champiñón y Guacamole", price: 220, description: "Delicioso puré gratinado con queso fundido, champiñón y guacamole de la casa.", category: "Papas Rellenas" },
  { name: "Papa Rellena Chorizo / Chistorra", price: 220, description: "Delicioso puré gratinado con queso fundido y chorizo de cerdo o chistorra.", category: "Papas Rellenas" },
  { name: "Papa Rellena Mixta", price: 220, description: "Delicioso puré gratinado con queso fundido, Sirloin y chorizo argentino.", category: "Papas Rellenas" },
  { name: "Papa Rellena Camarón", price: 285, description: "Delicioso puré gratinado con queso fundido y jugosos camarones salseados.", category: "Papas Rellenas" },

  // QUESA CAVAS
  { name: "Quesa Cava Sirloin", price: 245, description: "Quesadilla de tortilla artesanal dorada al carbón, rellena de queso fundido, Sirloin y los mejores ingredientes.", category: "Quesa Cavas" },
  { name: "Quesa Cava Mixta", price: 245, description: "Quesadilla de tortilla artesanal dorada al carbón, rellena de queso fundido, Sirloin y chorizo argentino.", category: "Quesa Cavas" },
  { name: "Quesa Cava Champiñón y Guacamole", price: 245, description: "Quesadilla de tortilla artesanal dorada al carbón, rellena de queso fundido, champiñones frescos y guacamole.", category: "Quesa Cavas" },
  { name: "Quesa Cava Camarón", price: 285, description: "Quesadilla de tortilla artesanal dorada al carbón, rellena de queso fundido y camarones salseados a la parrilla.", category: "Quesa Cavas" },

  // COMPLEMENTOS Y ESPECIALIDADES
  { name: "Queso Fundido Natural", price: 110, description: "Delicioso queso gouda fundido en cazuela al carbón.", category: "Complementos y Especialidades" },
  { name: "Queso Fundido con Chistorra", price: 155, description: "Delicioso queso gouda fundido al carbón con abundante chistorra dorada.", category: "Complementos y Especialidades" },
  { name: "Queso Fundido con Chorizo Argentino", price: 155, description: "Queso gouda fundido al carbón con chorizo argentino artesanal.", category: "Complementos y Especialidades" },
  { name: "Guacamole de la Casa", price: 95, description: "Porción generosa de guacamole fresco preparado al momento con totopos.", category: "Complementos y Especialidades" },
  { name: "Elote Amarillo (pieza)", price: 60, description: "Elote amarillo entero asado a las brasas con mantequilla fina y sazón.", category: "Complementos y Especialidades" },
  
  // EMBUTIDOS
  { name: "Chorizo de Cerdo", price: 70, description: "150g elaborado con receta tradicional de la casa.", category: "Embutidos" },
  { name: "Chorizo Argentino", price: 85, description: "150g especiado al estilo tradicional, jugoso al grill.", category: "Embutidos" },
  { name: "Chistorra Navarra", price: 90, description: "150g delgada y crujiente, perfecta para picar antes del corte.", category: "Embutidos" },
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
