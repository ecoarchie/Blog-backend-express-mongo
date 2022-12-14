import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError, body } from 'express-validator';

export const blogNameValidation = body('name')
  .exists()
  .withMessage('Name is required')
  .isLength({ max: 15 })
  .withMessage('Name should be less than 15 symbols');

export const blogDescriptionValidation = body('description')
  .exists()
  .withMessage('Description is required')
  .isLength({ max: 500 })
  .withMessage('Description should be less than 500 symbols');

export const blogWebsiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('Website URL is required')
  .isLength({ max: 100 })
  .withMessage('URL should be less than 100 symbols')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Not valid URL');

export const postTitleValidation = body('title')
  .exists()
  .withMessage('Post title is requires')
  .isLength({ max: 30 })
  .withMessage('Post title length should be less than 30 symbols');

export const postDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('Short description is required')
  .isLength({ max: 100 })
  .withMessage('Description must be less than 100 symbols');

export const postContentValidation = body('content')
  .exists()
  .withMessage('Post content is required')
  .isLength({ max: 1000 })
  .withMessage('Content must be less than 1000 symbols');

export const inputValidatiomMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errorFormatter = ({ msg, param }: ValidationError) => {
    return { message: msg, field: param };
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).send({ errorsMessages: errors.array() });
  } else {
    next();
  }
};
