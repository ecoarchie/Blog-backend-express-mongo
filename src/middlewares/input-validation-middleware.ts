import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError, body, check } from 'express-validator';

export const blogBodyValidation = () => {
  return [
    body('name')
      .exists()
      .withMessage('Name is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ max: 15 })
      .withMessage('Name should be less than 15 symbols'),

    body('description')
      .exists()
      .withMessage('Description is required')
      .isLength({ max: 500 })
      .withMessage('Description should be less than 500 symbols'),

    body('websiteUrl')
      .exists()
      .withMessage('Website URL is required')
      .isLength({ max: 100 })
      .withMessage('URL should be less than 100 symbols')
      .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
      .withMessage('Not valid URL'),
  ];
};

export const postBodyValidation = () => {
  return [
    body('title')
      .exists()
      .withMessage('Post title is requires')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 30 })
      .withMessage('Post title length should be less than 30 symbols'),

    body('shortDescription')
      .exists()
      .withMessage('Short description is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Description cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Description must be less than 100 symbols'),

    body('content')
      .exists()
      .withMessage('Post content is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Content cannot be empty')
      .isLength({ max: 1000 })
      .withMessage('Content must be less than 1000 symbols'),
  ];
};

export const userBodyValidation = () => {
  return [
    body('login')
      .exists()
      .withMessage('User login is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Login cannot be empty')
      .isLength({ max: 10, min: 3 })
      .withMessage('Login length should be between 3 and 10 characters')
      .matches(/^[a-zA-Z0-9_-]*$/)
      .withMessage('Incorrect symbols in login'),

    body('password')
      .exists()
      .withMessage('Password is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ max: 20, min: 6 })
      .withMessage('Password should be between 6 and 20 symbols'),

    body('email')
      .exists()
      .withMessage('Email is required')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .withMessage('Email contains incorrect symbols'),
  ];
};

export const commentBodyValidation = () => {
  return [
    body('content')
      .exists()
      .withMessage('Content is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Content cannot be empty')
      .isLength({ max: 300, min: 20 })
      .withMessage('Content must be between 20 and 300 characters'),
  ];
};

export const emailValidation = () => {
  return [
    body('email')
      .exists()
      .withMessage('Email is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .withMessage('Email contains incorrect symbols'),
  ];
};

export const newPasswordValidation = () => {
  return [
    body('newPassword')
      .exists()
      .withMessage('Password is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ max: 20, min: 6 })
      .withMessage('Password should be between 6 and 20 symbols'),
  ];
};

export const LikeBodyValidation = () => {
  return [
    check('likeStatus')
      .exists()
      .withMessage('Like status is required')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Like status cannot be empty')
      .isIn(['None', 'Like', 'Dislike'])
      .withMessage('Like must be None, Like or Dislike string'),
  ];
};

export const inputValidatiomMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorFormatter = ({ msg, param }: ValidationError) => {
    return { message: msg, field: param };
  };
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    res.status(400).send({ errorsMessages: errors.array({ onlyFirstError: true }) });
  } else {
    next();
  }
};
