import { Request, Response, Router } from 'express';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { isValidBlogId } from '../middlewares/blog-id-custom-validator';
import {
  inputValidatiomMiddleware,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../middlewares/input-validation-middleware';
import { postsRepository } from '../repositories/posts-repository';

export const postRouter = Router();

postRouter.get('/', (req: Request, res: Response) => {
  const foundPosts = postsRepository.findPosts();
  res.send(foundPosts);
});

postRouter.post(
  '/',
  basicAuthMiddleware,
  isValidBlogId,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  inputValidatiomMiddleware,
  (req: Request, res: Response) => {
    const newPost = postsRepository.createPost(req.body);
    res.status(201).send(newPost);
  }
);
