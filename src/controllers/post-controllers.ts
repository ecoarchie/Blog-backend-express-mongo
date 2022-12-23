import { Request, Response } from 'express';
import { PostViewModel } from '../models/postModel';
import { postsRepository } from '../repositories/posts-repository';
import { setQueryParams } from '../repositories/service';

export const getAllPostsController = async (req: Request, res: Response) => {
  const options = setQueryParams(req.query);

  const foundPosts = await postsRepository.findPosts(options);
  const totalCount: number = options.searchNameTerm
    ? foundPosts.length
    : await postsRepository.countAllPosts();
  const pagesCount: number = Math.ceil(totalCount / options.pageSize);

  res.send({
    pagesCount,
    page: options.pageNumber,
    pageSize: options.pageSize,
    totalCount,
    items: foundPosts,
  });
};

export const createPostController = async (req: Request, res: Response) => {
  const newPost = await postsRepository.createPost(req.body);
  res.status(201).send(newPost);
};

export const findPostByIdController = async (req: Request, res: Response) => {
  const postFound: PostViewModel | null = await postsRepository.findPostById(
    req.params.id.toString()
  );
  if (postFound) {
    res.send(postFound);
  } else {
    res.sendStatus(404);
  }
};

export const updatePostByIdController = async (req: Request, res: Response) => {
  const isPostUpdated: boolean = await postsRepository.updatePostById(
    req.params.id.toString(),
    req.body
  );
  if (isPostUpdated) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};

export const deletePostByIdController = async (req: Request, res: Response) => {
  const isPostDeleted: boolean = await postsRepository.deletePostById(req.params.id.toString());
  if (!isPostDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
};
