import { z } from 'zod';

export const createSuperheroSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(50, 'Nickname must be 50 characters or less'),
  realName: z
    .string()
    .min(1, 'Real name is required')
    .max(100, 'Real name must be 100 characters or less')
    .optional()
    .nullable(),
  originDescription: z
    .string()
    .min(1, 'Origin description must be at least 10 characters')
    .max(1000, 'Origin description must be 1000 characters or less')
    .optional()
    .nullable(),
  superpowers: z
    .union([
      z.string().max(500, 'Superpowers description too long'),
      z.object({
        intelligence: z.number().min(0).max(100),
        strength: z.number().min(0).max(100),
        speed: z.number().min(0).max(100),
        durability: z.number().min(0).max(100),
        power: z.number().min(0).max(100),
        combat: z.number().min(0).max(100),
      }),
    ])
    .optional()
    .nullable(),
  catchPhrase: z.string().max(200, 'Catch phrase too long').optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
      }),
    )
    .optional(),
});

export const updateSuperheroSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(100, 'Nickname too long').optional(),
  realName: z.string().max(100, 'Real name too long').optional().nullable(),
  originDescription: z.string().max(1000, 'Origin description too long').optional().nullable(),
  superpowers: z.string().max(500, 'Superpowers description too long').optional().nullable(),
  catchPhrase: z.string().max(200, 'Catch phrase too long').optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
      }),
    )
    .optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.union([z.literal('all'), z.coerce.number().min(1).max(100)]).optional(),
});
