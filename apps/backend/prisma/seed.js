import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../src/utils/prisma.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
if (!EXTERNAL_API_URL) {
    throw new Error('EXTERNAL_API_URL is not defined in .env');
}
async function fetchSuperheroes() {
    try {
        const response = await fetch(`${EXTERNAL_API_URL}/all.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error('Failed to fetch superheroes:', error);
        return [];
    }
}
async function seed() {
    console.log('Starting seeding...');
    const superheroesData = await fetchSuperheroes();
    if (superheroesData.length === 0) {
        console.log('No superheroes data to seed.');
        return;
    }
    const transformedSuperheroes = superheroesData
        .filter((hero) => hero.id && hero.name && hero.images && hero.images.md)
        .map((hero) => ({
        id: String(hero.id),
        nickname: hero.name,
        realName: hero.biography?.fullName || null,
        originDescription: hero.biography?.['placeOfBirth'] || null,
        superpowers: hero.powerstats ? JSON.stringify(hero.powerstats) : null,
        catchPhrase: hero.connections?.groupAffiliation || null,
        images: Object.values(hero.images),
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
                        deleteMany: {},
                        create: hero.images.map((url) => ({ url })),
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
                        create: hero.images.map((url) => ({ url })),
                    },
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                console.warn(`Superhero with nickname "${hero.nickname}" already exists. Skipping.`);
            }
            else {
                console.error(`Error seeding superhero ${hero.nickname}:`, error);
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
