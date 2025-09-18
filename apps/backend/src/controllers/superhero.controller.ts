import { superheroService } from '../services/superhero.service.js';
import { NextFunction, Request, Response } from 'express';
import type { CreateUpdateSuperheroDTO } from '../types/types.js';

export const superheroController = {
  getAllSuperheroes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 5 } = (req as any).validatedQuery as {
        page?: number;
        limit?: number | 'all';
      };

      if (limit === 'all') {
        const result = await superheroService.getAllSuperheroesAll();
        return res.json(result);
      }

      if (page < 1 || (typeof limit === 'number' && (limit < 1 || limit > 100))) {
        return res.status(400).json({
          error:
            'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100',
        });
      }

      const result = await superheroService.getAllSuperheroes(page, limit as number);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getSuperheroById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Superhero ID is required' });
      }

      const superhero = await superheroService.getSuperheroById(id);
      if (!superhero) {
        return res.status(404).json({ error: 'Superhero not found' });
      }
      res.json(superhero);
    } catch (error) {
      next(error);
    }
  },

  createSuperhero: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superheroData: CreateUpdateSuperheroDTO = req.body;

      if (!superheroData.nickname) {
        return res.status(400).json({
          error: 'Nickname is a required field',
        });
      }

      const newSuperhero = await superheroService.createSuperhero(superheroData);
      res.status(201).json(newSuperhero);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          error: 'Superhero with this nickname or ID already exists',
        });
      }
      next(error);
    }
  },

  updateSuperhero: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const superheroData: CreateUpdateSuperheroDTO = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Superhero ID is required' });
      }

      const updatedSuperhero = await superheroService.updateSuperhero(id, superheroData);
      if (!updatedSuperhero) {
        return res.status(404).json({ error: 'Superhero not found' });
      }
      res.json(updatedSuperhero);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          error: 'Superhero with this nickname already exists',
        });
      }
      next(error);
    }
  },

  deleteSuperhero: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Superhero ID is required' });
      }

      const deleted = await superheroService.deleteSuperhero(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Superhero not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
