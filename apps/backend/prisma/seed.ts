import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

if (!EXTERNAL_API_URL) {
  throw new Error('EXTERNAL_API_URL is not defined in .env');
}

async function fetchSuperheroes() {
  try {
    console.log(`Fetching superheroes from: ${EXTERNAL_API_URL}/all.json`);
    const response = await fetch(`${EXTERNAL_API_URL}/all.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch superheroes:', error);
    return [];
  }
}

async function seed() {
  console.log('Starting seeding...');

  const existingSuperheroesCount = await prisma.superhero.count();
  if (existingSuperheroesCount > 0) {
    console.log(`${existingSuperheroesCount} superheroes already exist. Skipping initial seeding.`);
    return;
  }

  const superheroesData = await fetchSuperheroes();

  if (superheroesData.length === 0) {
    console.log('No superheroes data to seed.');
    return;
  }

  const transformedSuperheroes = superheroesData
    .filter((hero: any) => hero.id && hero.name && hero.images && hero.images.md)
    .map((hero: any) => ({
      id: String(hero.id),
      nickname: hero.name,
      realName: hero.biography?.fullName || null,
      originDescription: hero.biography?.['placeOfBirth'] || null,
      superpowers: hero.powerstats ? JSON.stringify(hero.powerstats) : null,
      catchPhrase: hero.connections?.groupAffiliation || null,
      imageUrl: hero.images?.md,
    }));

  for (const hero of transformedSuperheroes) {
    try {
      await prisma.superhero.upsert({
        where: { id: hero.id },
        update: {
          nickname: hero.nickname,
          realName: hero.realName,
          originDescription: hero.originDescription,
          superpowers: hero.superpowers,
          catchPhrase: hero.catchPhrase,
          images: {
            create: {
              url: hero.imageUrl,
            },
          },
        },
        create: {
          id: hero.id,
          nickname: hero.nickname,
          realName: hero.realName,
          originDescription: hero.originDescription,
          superpowers: hero.superpowers,
          catchPhrase: hero.catchPhrase,
          images: {
            create: {
              url: hero.imageUrl,
            },
          },
        },
      });
      console.log(`Seeded superhero: ${hero.nickname}`);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('nickname')) {
        console.warn(`Superhero with nickname "${hero.nickname}" already exists. Skipping.`);
      } else {
        console.error(`Error seeding superhero ${hero.nickname}:`, error.message);
      }
    }
  }

  console.log('Seeding finished.');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
