import { PrismaClient, PropertyStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Store Seeding started...");

  // Clear existing data
  await prisma.visit.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();
  await prisma.customCategory.deleteMany({ where: { target: "STORE" } });

  // 1. Seed Store categories
  const storeCategories = [
    { name: "Cortes de Res", target: "STORE" },
    { name: "Paquetes y Parrilladas", target: "STORE" },
    { name: "Embutidos", target: "STORE" },
    { name: "Especialidades Grill", target: "STORE" },
  ];

  for (const cat of storeCategories) {
    await prisma.customCategory.create({
      data: cat,
    });
  }
  console.log("Store categories created.");

  // 2. Create Admin User
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@inmobiliaria.com",
      password: hashedPassword,
      name: "Administrador Carnicero",
      role: "ADMIN",
    },
  });
  console.log("Admin user created:", admin.email);

  // 3. Create Meat Products
  const propertiesData = [
    {
      title: "Ribeye Sonora Premium",
      slug: "ribeye-sonora-premium",
      description: "Ribeye de res originaria de Sonora, seleccionada minuciosamente por su excelente grado de marmoleo y jugosidad. Cada corte es empacado individualmente al alto vacío en origen y congelado de inmediato para preservar intactas la frescura, ternura y sabor del producto hasta llegar a tu asador. Espesor ideal de 1.5 pulgadas para un término medio perfecto.",
      price: 420,
      location: "Sonora / Importación",
      city: "Hermosillo",
      state: "Sonora",
      m2Total: 450, // 450g
      m2Covered: 0,
      bedrooms: 1.5, // 1.5 pulgadas
      bathrooms: 4, // Sonora Premium
      parkingSpaces: 2, // 2 personas
      type: "Cortes de Res",
      status: PropertyStatus.DISPONIBLE,
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=80", isMain: true }
      ]
    },
    {
      title: "Tomahawk Sonora Select",
      slug: "tomahawk-sonora-select",
      description: "Imponente corte Tomahawk de res sonorense con hueso largo expuesto. Su gran espesor y su abundante marmoleo infiltrado garantizan una experiencia culinaria insuperable en textura y sabor. Empacado individualmente al alto vacío. Ideal para cocción indirecta inicial y sellado a fuego directo al carbón de mezquite.",
      price: 890,
      location: "Sonora / Importación",
      city: "Hermosillo",
      state: "Sonora",
      m2Total: 1200, // 1.2kg
      m2Covered: 0,
      bedrooms: 2.0, // 2 pulgadas
      bathrooms: 4, // Sonora Premium
      parkingSpaces: 4, // 4 personas
      type: "Cortes de Res",
      status: PropertyStatus.DISPONIBLE,
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=800&auto=format&fit=crop&q=80", isMain: true }
      ]
    },
    {
      title: "Paquete Parrillada Amigos",
      slug: "paquete-parrillada-amigos",
      description: "El paquete definitivo para compartir en familia o con amigos. Incluye 1kg de Sirloin de Sonora premium, 500g de chorizo argentino artesanal, 1 porción grande de guacamole fresco con totopos, 4 papas asadas rellenas de queso y crema, y un paquete de tortillas de harina sonorenses. Listo para calentar o asar.",
      price: 1250,
      location: "Fórmula de la Casa",
      city: "Santiago",
      state: "Nuevo León",
      m2Total: 2500, // 2.5kg total
      m2Covered: 0,
      bedrooms: 0,
      bathrooms: 3, // Wagyu/Premium grade
      parkingSpaces: 6, // 6 personas
      type: "Paquetes y Parrilladas",
      status: PropertyStatus.DISPONIBLE,
      featured: true,
      images: [
        { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80", isMain: true }
      ]
    },
    {
      title: "Chorizo Argentino Artesanal",
      slug: "chorizo-argentino-artesanal",
      description: "Chorizo artesanal estilo argentino elaborado en nuestra boutique con carne de cerdo selecta y magra, vino blanco, ajo y una mezcla balanceada de especias tradicionales. Sin conservadores artificiales. Perfecto como entrada para iniciar cualquier asado en familia.",
      price: 180,
      location: "Elaboración Propia",
      city: "Santiago",
      state: "Nuevo León",
      m2Total: 500, // 500g
      m2Covered: 0,
      bedrooms: 0,
      bathrooms: 2, // Prime Quality
      parkingSpaces: 3, // 3 personas
      type: "Embutidos",
      status: PropertyStatus.DISPONIBLE,
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?w=800&auto=format&fit=crop&q=80", isMain: true }
      ]
    },
    {
      title: "Papa Rellena Tres Carnes Especial",
      slug: "papa-rellena-tres-carnes-especial",
      description: "Nuestra famosa especialidad de la Zona Grill los fines de semana: deliciosa papa gigante asada a las brasas de mezquite, rellena de mantequilla fina, crema de ajo artesanal, queso gouda fundido y coronada con una generosa mezcla de carne asada de Sonora, chorizo artesanal y tocino premium crujiente.",
      price: 130,
      location: "Zona Grill",
      city: "Santiago",
      state: "Nuevo León",
      m2Total: 600, // 600g
      m2Covered: 0,
      bedrooms: 0,
      bathrooms: 4, // Sonora Premium
      parkingSpaces: 1, // 1 persona
      type: "Especialidades Grill",
      status: PropertyStatus.DISPONIBLE,
      featured: false,
      images: [
        { url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80", isMain: true }
      ]
    }
  ];

  for (const prop of propertiesData) {
    const { images, ...propDetails } = prop;
    const createdProperty = await prisma.property.create({
      data: {
        ...propDetails,
        images: {
          create: images
        }
      }
    });
    console.log(`Product '${createdProperty.title}' created.`);
  }

  console.log("Store Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
