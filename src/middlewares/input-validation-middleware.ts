import { Request, Response, NextFunction } from 'express';
import { FieldErrorModel } from '../models/fieldErrorModel';
import { validationResult, Result, ValidationError, body } from 'express-validator';

const customizeErrors = (errors: Result<ValidationError>): FieldErrorModel[] => {
  return errors.array().map((e) => ({ message: e.msg, field: e.param }));
};

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

export const inputValidatiomMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errArray: Array<FieldErrorModel> = customizeErrors(errors);
    res.status(400).send({ errorsMessages: errArray });
  } else {
    next();
  }
};
