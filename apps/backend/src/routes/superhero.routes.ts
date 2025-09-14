import { superheroController } from '@src/controllers/superhero.controller.js';
import { validateBody, validateQuery } from '@src/middlewares/validation.middleware.js';
import {
  createSuperheroSchema,
  paginationSchema,
  updateSuperheroSchema,
} from '@src/validation/superhero.validation.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/', validateQuery(paginationSchema), superheroController.getAllSuperheroes);

router.get('/:id', superheroController.getSuperheroById);

router.post('/', validateBody(createSuperheroSchema), superheroController.createSuperhero);

router.put('/:id', validateBody(updateSuperheroSchema), superheroController.updateSuperhero);

router.delete('/:id', superheroController.deleteSuperhero);

export default router;
