import { prisma } from '@src/utils/prisma.js';
import { randomUUID } from 'crypto';
import type {
  CreateSuperheroRequest,
  PaginatedResponse,
  SuperheroEntity,
  UpdateSuperheroRequest,
} from 'types';

function parseSuperpowers(sp: unknown) {
  try {
    if (!sp) return { intelligence: 0, strength: 0, speed: 0, durability: 0, power: 0, combat: 0 };
    if (typeof sp === 'string') {
      const obj = JSON.parse(sp);
      return {
        intelligence: Number(obj.intelligence ?? 0),
        strength: Number(obj.strength ?? 0),
        speed: Number(obj.speed ?? 0),
        durability: Number(obj.durability ?? 0),
        power: Number(obj.power ?? 0),
        combat: Number(obj.combat ?? 0),
      };
    }
    const obj: any = sp;
    return {
      intelligence: Number(obj.intelligence ?? 0),
      strength: Number(obj.strength ?? 0),
      speed: Number(obj.speed ?? 0),
      durability: Number(obj.durability ?? 0),
      power: Number(obj.power ?? 0),
      combat: Number(obj.combat ?? 0),
    };
  } catch {
    return { intelligence: 0, strength: 0, speed: 0, durability: 0, power: 0, combat: 0 };
  }
}

function mapHero(hero: any): SuperheroEntity {
  return {
    ...hero,
    createdAt: hero.createdAt.toISOString(),
    updatedAt: hero.updatedAt.toISOString(),
    realName: hero.realName ?? '',
    originDescription: hero.originDescription ?? '',
    superpowers: parseSuperpowers(hero.superpowers),
    catchPhrase: hero.catchPhrase ?? '',
    images: (hero.images ?? []).map((img: any) => ({
      ...img,
      createdAt: img.createdAt.toISOString(),
    })),
  };
}

export const superheroService = {
  getAllSuperheroes: async (
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<SuperheroEntity>> => {
    const skip = (page - 1) * limit;

    const [rawData, total] = await Promise.all([
      prisma.superhero.findMany({
        skip,
        take: limit,
        include: {
          images: true,
        },
        orderBy: { id: 'asc' },
      }),
      prisma.superhero.count(),
    ]);

    const data = rawData.map(mapHero);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  getAllSuperheroesAll: async (): Promise<PaginatedResponse<SuperheroEntity>> => {
    const rawData = await prisma.superhero.findMany({
      include: { images: true },
      orderBy: { id: 'asc' },
    });

    const data = rawData.map(mapHero);

    const total = data.length;

    return {
      data,
      total,
      page: 1,
      limit: total,
      totalPages: 1,
    };
  },

  getSuperheroById: async (id: string) => {
    const hero = await prisma.superhero.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
    if (!hero) return null;
    return mapHero(hero);
  },

  createSuperhero: async (data: CreateSuperheroRequest): Promise<SuperheroEntity> => {
    const { images, ...superheroData } = data;

    const hero = await prisma.superhero.create({
      data: {
        id: randomUUID(),
        nickname: superheroData.nickname,
        realName: superheroData.realName,
        originDescription: superheroData.originDescription,
        superpowers: JSON.stringify(superheroData.superpowers),
        catchPhrase: superheroData.catchPhrase,
        images: images
          ? {
              create: images,
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });
    return mapHero(hero);
  },

  updateSuperhero: async (
    id: string,
    data: UpdateSuperheroRequest,
  ): Promise<SuperheroEntity | null> => {
    const { images, ...superheroData } = data;

    try {
      if (images) {
        await prisma.image.deleteMany({
          where: { heroId: id },
        });
      }

      const updateData: any = {
        nickname: superheroData.nickname,
        realName: superheroData.realName,
        originDescription: superheroData.originDescription,
        catchPhrase: superheroData.catchPhrase,
      };

      if (superheroData.superpowers !== undefined) {
        updateData.superpowers =
          typeof superheroData.superpowers === 'string'
            ? superheroData.superpowers
            : JSON.stringify(superheroData.superpowers);
      }

      if (images) {
        updateData.images = {
          create: images,
        };
      }

      const hero = await prisma.superhero.update({
        where: { id },
        data: updateData,
        include: {
          images: true,
        },
      });
      return mapHero(hero);
    } catch {
      return null;
    }
  },

  deleteSuperhero: async (id: string): Promise<boolean> => {
    try {
      await prisma.superhero.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },
};
