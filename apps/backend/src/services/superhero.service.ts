import { prisma } from '@src/utils/prisma.js';
import type {
  CreateSuperheroRequest,
  PaginatedResponse,
  SuperheroEntity,
  UpdateSuperheroRequest,
} from 'types';

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

    const data = rawData.map(hero => ({
      ...hero,
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
      realName: hero.realName ?? '',
      originDescription: hero.originDescription ?? '',
      superpowers: hero.superpowers ?? '',
      catchPhrase: hero.catchPhrase ?? '',
      images: hero.images.map(img => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
      })),
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
    return {
      ...hero,
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
      realName: hero.realName ?? '',
      originDescription: hero.originDescription ?? '',
      superpowers: hero.superpowers ?? '',
      catchPhrase: hero.catchPhrase ?? '',
      images: hero.images.map(img => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
      })),
    };
  },

  createSuperhero: async (data: CreateSuperheroRequest): Promise<SuperheroEntity> => {
    const { images, ...superheroData } = data;

    const hero = await prisma.superhero.create({
      data: {
        ...superheroData,
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
    return {
      ...hero,
      createdAt: hero.createdAt.toISOString(),
      updatedAt: hero.updatedAt.toISOString(),
      realName: hero.realName ?? '',
      originDescription: hero.originDescription ?? '',
      superpowers: hero.superpowers ?? '',
      catchPhrase: hero.catchPhrase ?? '',
      images: hero.images.map(img => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
      })),
    };
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

      const hero = await prisma.superhero.update({
        where: { id },
        data: {
          ...superheroData,
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
      return {
        ...hero,
        createdAt: hero.createdAt.toISOString(),
        updatedAt: hero.updatedAt.toISOString(),
        realName: hero.realName ?? '',
        originDescription: hero.originDescription ?? '',
        superpowers: hero.superpowers ?? '',
        catchPhrase: hero.catchPhrase ?? '',
        images: hero.images.map(img => ({
          ...img,
          createdAt: img.createdAt.toISOString(),
        })),
      };
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
