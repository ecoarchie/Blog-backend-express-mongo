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
import { setQueryParams } from '../repositories/service';

export const postRouter = Router();

postRouter.get('/', async (req: Request, res: Response) => {
  const options = setQueryParams(req.query);
  // console.log(options);

  const foundPosts = await postsRepository.findPosts(options);
  const totalCount: number = await postsRepository.countAllPosts();
  const pagesCount: number = Math.ceil(totalCount / options.pageSize);

  res.send({
    pagesCount,
    page: options.pageNumber,
    pageSize: options.pageSize,
    totalCount,
    items: foundPosts,
  });
});

postRouter.post(
  '/',
  basicAuthMiddleware,
  isValidBlogId,
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  inputValidatiomMiddleware,
  async (req: Request, res: Response) => {
    const newPost = await postsRepository.createPost(req.body);
    res.status(201).send(newPost);
  }
);

postRouter.get('/:id', async (req: Request, res: Response) => {
  const postFound: PostViewModel | null = await postsRepository.findPostById(
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
  async (req: Request, res: Response) => {
    const isPostUpdated: boolean = await postsRepository.updatePostById(
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

postRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
  const isPostDeleted: boolean = await postsRepository.deletePostById(req.params.id.toString());
  if (!isPostDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
});
