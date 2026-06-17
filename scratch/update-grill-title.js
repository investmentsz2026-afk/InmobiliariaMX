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
    console.log('Fetching grill_content setting...');
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "grill_content" },
    });

    if (!setting) {
      console.log('No grill_content setting found in DB yet. Fallbacks will apply.');
      return;
    }

    const value = setting.value;
    if (!value.heroSlides || value.heroSlides.length === 0) {
      value.heroSlides = [
        {
          id: 1,
          tag: "SOLO SERVICIO A DOMICILIO",
          title: "LA CAVA\nDEL CORTE",
          description: "Las mejores brasas merecen los mejores cortes.",
          mediaType: "IMAGE",
          mediaUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
        },
        {
          id: 2,
          tag: "SÁBADOS Y DOMINGOS",
          title: "CORTES PREMIUM",
          description: "Disfruta de la mejor carne asada con leña y carbón de mezquite 100% natural.",
          mediaType: "IMAGE",
          mediaUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1000&auto=format&fit=crop&q=80",
        },
        {
          id: 3,
          tag: "ESPECIALIDADES AL CARBÓN",
          title: "PAPAS RELLENAS",
          description: "Nuestras famosas papas con puré cremoso, queso fundido y abundante carne de tu elección.",
          mediaType: "IMAGE",
          mediaUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80",
        },
      ];
      console.log('Populating heroSlides in DB...');
    } else {
      console.log('Updating first hero slide title from:', value.heroSlides[0].title);
      value.heroSlides[0].title = "LA CAVA\nDEL CORTE";
    }

    await prisma.systemSetting.update({
      where: { key: "grill_content" },
      data: { value },
    });
    console.log('Database successfully updated!');
  } catch (err) {
    console.error('Error during database update:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
