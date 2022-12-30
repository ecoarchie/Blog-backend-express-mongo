import { Request, Response } from 'express';
import { PostViewModel } from '../models/postModel';
import { commentRepository } from '../repositories/comments-repository';
import { postsRepository } from '../repositories/posts-repository';
import { commentService } from '../service/comments-service';
import { postsService } from '../service/post-service';
import { setCommentsQueryParams, setPostQueryParams } from './utils';

export const getAllPostsController = async (req: Request, res: Response) => {
  const options = setPostQueryParams(req.query);

  const foundPosts = await postsService.findPosts(options);
  const totalCount: number = options.searchNameTerm
    ? foundPosts.length
    : await postsService.countAllPosts();
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
  const newPost = await postsService.createPost(req.body);
  res.status(201).send(newPost);
};

export const findPostByIdController = async (req: Request, res: Response) => {
  const postFound: PostViewModel | null = await postsService.findPostById(req.params.id.toString());
  if (postFound) {
    res.send(postFound);
  } else {
    res.sendStatus(404);
  }
};

export const updatePostByIdController = async (req: Request, res: Response) => {
  const isPostUpdated: boolean = await postsService.updatePostById(
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
  const isPostDeleted: boolean = await postsService.deletePostById(req.params.id.toString());
  if (!isPostDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
};

export const getCommentsForPostController = async (req: Request, res: Response) => {
  const isValidPost = await postsRepository.isPostExist(req.params.postId);
  if (!isValidPost) {
    res.sendStatus(404);
  } else {
    const options = setCommentsQueryParams(req.query);
    const comments = await commentRepository.getCommentsByPostId(req.params.postId, options);

    const totalCount: number =
      Object.keys(req.query).length !== 0
        ? comments.length
        : await commentRepository.countAllCommentsByPostId(req.params.postId);
    const pagesCount: number = Math.ceil(totalCount / options.pageSize);

    res.send({
      pagesCount,
      page: options.pageNumber,
      pageSize: options.pageSize,
      totalCount,
      items: comments,
    });
  }
};

export const createCommentForPostController = async (req: Request, res: Response) => {
  if (!(await postsRepository.isPostExist(req.params.postId.toString()))) {
    console.log('post not exist');
    res.sendStatus(404);
    return;
  }
  console.log('here');

  const newComment = await commentService.createCommentService(
    req.params.postId,
    req.user!.id,
    req.user!.login,
    req.body.content
  );
  res.status(201).send(newComment);
};
