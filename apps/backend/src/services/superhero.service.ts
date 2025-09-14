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

    const [data, total] = await Promise.all([
      prisma.superhero.findMany({
        skip,
        take: limit,
        include: {
          images: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.superhero.count(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  },

  getSuperheroById: async (id: string) => {
    return prisma.superhero.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
  },

  createSuperhero: async (data: CreateSuperheroRequest): Promise<SuperheroEntity> => {
    const { images, ...superheroData } = data;

    return await prisma.superhero.create({
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

      return await prisma.superhero.update({
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
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  deleteSuperhero: async (id: string): Promise<boolean> => {
    try {
      await prisma.superhero.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};
