import "dotenv/config";
import { GrillCategory } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

const initialGrillProducts = [
  // CORTES
  { name: "Sirloin al Grill", price: 220, description: "Corte jugoso de 300g preparado al carbón con sazón especial de la casa.", category: GrillCategory.CORTE },
  { name: "Ribeye de Sonora", price: 280, description: "350g con excelente marmoleado que garantiza suavidad y sabor superior.", category: GrillCategory.CORTE },
  { name: "Ribs Especiales", price: 200, description: "Costillar de cerdo horneado y terminado a la parrilla con costra crujiente.", category: GrillCategory.CORTE },
  { name: "T-Bone Grill", price: 300, description: "400g de doble textura: filete tierno y jugoso New York con hueso.", category: GrillCategory.CORTE },
  { name: "Prime Rib del Asador", price: 390, description: "500g de corte de gala con hueso corto, cocido despacio sobre carbón.", category: GrillCategory.CORTE },
  
  // PARRILLADAS
  { name: "Reserva Individual", price: 180, description: "150g de carne, chorizo artesanal, cebollita asada, nopal, chile toreado, tortillas y salsas.", category: GrillCategory.PARRILLADA },
  { name: "Reserva Doble", price: 340, description: "300g de carne, chorizo doble, cebollitas, nopales, chiles, tortillas y salsas. Ideal para dos personas.", category: GrillCategory.PARRILLADA },
  { name: "La Gran Reserva", price: 650, description: "600g de carne, chorizo familiar, cebollitas, nopales, chiles, tortillas, salsas y guacamole grande.", category: GrillCategory.PARRILLADA },
  
  // PAPAS
  { name: "Papa Rellena Clásica", price: 85, description: "Horneada a las brasas, rellena de mezcla de quesos y tocino crujiente.", category: GrillCategory.PAPA },
  { name: "Papa Rellena con Chorizo", price: 95, description: "Rellena de quesos gratinados y chorizo de cerdo artesanal dorado al grill.", category: GrillCategory.PAPA },
  { name: "Papa Rellena con Carne Asada", price: 125, description: "Nuestra clásica papa gratinada coronada con abundante Sirloin asado al carbón.", category: GrillCategory.PAPA },
  { name: "Papa Especial Tres Carnes", price: 145, description: "Rellena de queso gouda fundido, carne asada de Sonora, chorizo artesanal y chistorra.", category: GrillCategory.PAPA },

  // EMBUTIDOS
  { name: "Chorizo de Cerdo", price: 70, description: "150g elaborado con receta tradicional de la casa.", category: GrillCategory.EMBUTIDO },
  { name: "Chorizo Argentino", price: 85, description: "150g especiado al estilo tradicional, jugoso al grill.", category: GrillCategory.EMBUTIDO },
  { name: "Chistorra Navarra", price: 90, description: "150g delgada y crujiente, perfecta para picar antes del corte.", category: GrillCategory.EMBUTIDO },
  
  // BBQ
  { name: "Medio Costillar BBQ", price: 180, description: "Ahumado a fuego muy lento con salsa dulce de la casa.", category: GrillCategory.BBQ },
  { name: "Rib BBQ Individual", price: 95, description: "Porción individual jugosa, glaseada constantemente al carbón.", category: GrillCategory.BBQ },
  
  // COMPLEMENTOS
  { name: "Queso Fundido sencillo", price: 65, description: "Queso gouda fundido en cazuela al carbón.", category: GrillCategory.COMPLEMENTO },
  { name: "Queso Fundido con Chorizo", price: 85, description: "Fundido con chorizo artesanal premium.", category: GrillCategory.COMPLEMENTO },
  { name: "Guacamole con Totopos", price: 75, description: "Porción generosa de guacamole fresco con totopos.", category: GrillCategory.COMPLEMENTO },
  { name: "Elote Asado al Carbón", price: 45, description: "Con aderezo y mantequilla fina.", category: GrillCategory.COMPLEMENTO },
];

async function main() {
  console.log("Seeding Grill Products...");

  // Opcional: Limpiar antes de insertar para evitar duplicados si se corre varias veces
  await prisma.grillProduct.deleteMany();

  for (const product of initialGrillProducts) {
    await prisma.grillProduct.create({
      data: product,
    });
  }

  console.log("Grill Products seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
