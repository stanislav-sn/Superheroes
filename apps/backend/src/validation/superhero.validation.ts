import { z } from 'zod';

export const createSuperheroSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  nickname: z.string().min(1, 'Nickname is required').max(100, 'Nickname too long'),
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
  limit: z.coerce.number().min(1).max(100).default(5).optional(),
});
