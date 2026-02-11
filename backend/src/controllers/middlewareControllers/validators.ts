import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    id: Joi.string().email().required(),
    name: Joi.string().min(2).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin', 'owner').optional()
  });

  const { error } = schema.validate(req.body) as any;
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};