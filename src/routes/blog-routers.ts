import { Request, Response, Router } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { blogsRepository } from '../repositories/blogs-repository';
import { body, param, validationResult } from 'express-validator';
import { FieldErrorModel } from '../models/fieldErrorModel';

export const blogRouter = Router();

blogRouter.get('/', (req: Request, res: Response) => {
  const foundBlogs = blogsRepository.findBlogs();
  res.send(foundBlogs);
});

const blogNameValidation = body('name')
  .exists()
  .withMessage('Name is required')
  .isLength({ max: 15 })
  .withMessage('Name should be less than 15 symbols');

const blogDescriptionValidation = body('description')
  .exists()
  .withMessage('Description is required')
  .isLength({ max: 500 })
  .withMessage('Description should be less than 500 symbols');

const blogWebsiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('Website URL is required')
  .isLength({ max: 100 })
  .withMessage('URL should be less than 100 symbols')
  .isURL()
  .withMessage('Not valid URL');

blogRouter.post(
  '/',
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errArray: Array<FieldErrorModel> = errors
        .array()
        .map((e) => ({ message: e.msg, field: e.param }));
      return res.status(400).send({ errorsMessages: errArray });
    }
    const newBlog = blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
  }
);

blogRouter.get('/:id', (req: Request, res: Response) => {
  const blogFound: BlogViewModel | undefined = blogsRepository.findBlogById(
    req.params.id.toString()
  );
  if (blogFound) {
    res.send(blogFound);
  } else {
    res.sendStatus(404);
  }
});

blogRouter.put('/:id', (req: Request, res: Response) => {
  const isBlogUpdated: boolean = blogsRepository.updateBlogById(req.params.id.toString(), req.body);
  if (isBlogUpdated) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

blogRouter.delete('/:id', (req: Request, res: Response) => {
  const isBlogDeleted: boolean = blogsRepository.deleteBlogById(req.params.id.toString());
  if (!isBlogDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
