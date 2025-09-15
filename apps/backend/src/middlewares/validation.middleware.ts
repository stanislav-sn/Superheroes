import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const createValidator = <T extends z.ZodTypeAny>(
  schema: T,
  source: 'body' | 'query' | 'params',
  validationKey: 'validatedBody' | 'validatedQuery' | 'validatedParams',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data =
        source === 'body' ? req.body : source === 'query' ? { ...req.query } : req.params;

      const result = schema.safeParse(data);

      if (!result.success) {
        return res.status(400).json({
          error: `${source.charAt(0).toUpperCase() + source.slice(1)} validation failed`,
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }

      req[validationKey] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = <T extends z.ZodTypeAny>(schema: T) =>
  createValidator(schema, 'body', 'validatedBody');

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) =>
  createValidator(schema, 'query', 'validatedQuery');

export const validateParams = <T extends z.ZodTypeAny>(schema: T) =>
  createValidator(schema, 'params', 'validatedParams');
