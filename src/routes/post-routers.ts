import { Request, Response, Router } from 'express';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { isValidBlogId } from '../middlewares/blog-id-custom-validator';
import {
  inputValidatiomMiddleware,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
} from '../middlewares/input-validation-middleware';
import { PostViewModel } from '../models/postModel';
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

postRouter.get('/:id', (req: Request, res: Response) => {
  const postFound: PostViewModel | undefined = postsRepository.findPostById(
    req.params.id.toString()
  );
  if (postFound) {
    res.send(postFound);
  } else {
    res.sendStatus(404);
  }
});

postRouter.put(
  '/:id',
  basicAuthMiddleware,
  isValidBlogId,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  inputValidatiomMiddleware,
  (req: Request, res: Response) => {
    const isPostUpdated: boolean = postsRepository.updatePostById(
      req.params.id.toString(),
      req.body
    );
    if (isPostUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

postRouter.delete('/:id', basicAuthMiddleware, (req: Request, res: Response) => {
  const isPostDeleted: boolean = postsRepository.deletePostById(req.params.id.toString());
  if (!isPostDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
