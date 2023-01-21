import { Request, Response } from 'express';
import { PostViewModel } from '../models/postModel';
import { commentRepository } from '../repositories/comments-repository';
import { commentService } from '../service/comments-service';
import { PostsService } from '../service/post-service';
import { setCommentsQueryParams, setPostQueryParams } from './utils';
import { jwtService } from '../application/jwt-service';
import { userLikesCollection } from '../repositories/db';
import { ObjectId, WithId } from 'mongodb';
import { UsersLikesDBModel } from '../models/likeModel';

export class PostsController {
  postsService: PostsService;
  constructor() {
    this.postsService = new PostsService();
  }
  getAllPostsController = async (req: Request, res: Response) => {
    const options = setPostQueryParams(req.query);

    const foundPosts = await this.postsService.findPosts(options);
    const totalCount: number = options.searchNameTerm
      ? foundPosts.length
      : await this.postsService.countAllPosts();
    const pagesCount: number = Math.ceil(totalCount / options.pageSize);

    res.send({
      pagesCount,
      page: options.pageNumber,
      pageSize: options.pageSize,
      totalCount,
      items: foundPosts,
    });
  };

  createPostController = async (req: Request, res: Response) => {
    const newPost = await this.postsService.createPost(req.body);
    res.status(201).send(newPost);
  };

  findPostByIdController = async (req: Request, res: Response) => {
    const postFound: PostViewModel | null = await this.postsService.findPostById(
      req.params.id.toString()
    );
    if (postFound) {
      res.send(postFound);
    } else {
      res.sendStatus(404);
    }
  };

  updatePostByIdController = async (req: Request, res: Response) => {
    const isPostUpdated: boolean = await this.postsService.updatePostById(
      req.params.id.toString(),
      req.body
    );
    if (isPostUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  };

  deletePostByIdController = async (req: Request, res: Response) => {
    const isPostDeleted: boolean = await this.postsService.deletePostById(
      req.params.id.toString()
    );
    if (!isPostDeleted) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  };

  getCommentsForPostController = async (req: Request, res: Response) => {
    const isValidPost = await this.postsService.postsRepository.isPostExist(req.params.postId);
    if (!isValidPost) {
      res.sendStatus(404);
    } else {
      const options = setCommentsQueryParams(req.query);
      let comments = await commentRepository.getCommentsByPostId(req.params.postId, options);

      const refreshToken = req.cookies?.refreshToken;
      const cookie = req.cookies;
      console.log(
        '🚀 ~ file: post-controllers.ts:83 ~ PostsController ~ getCommentsForPostController= ~ cookie',
        cookie
      );
      let validUserSession;
      let currentUserId;
      let userLikesDislikes: WithId<UsersLikesDBModel> | null;
      if (refreshToken) {
        validUserSession = await jwtService.verifyToken(refreshToken);
        currentUserId = validUserSession?.userId;
        userLikesDislikes = await userLikesCollection.findOne({ userId: currentUserId });
      } else {
        userLikesDislikes = null;
      }
      comments = comments.map((comment) => {
        if (!userLikesDislikes) {
          comment.likesInfo.myStatus = 'None';
        } else if (userLikesDislikes!.likedComments.includes(comment.id)) {
          comment.likesInfo.myStatus = 'Like';
        } else if (userLikesDislikes!.dislikedComments.includes(comment.id)) {
          comment.likesInfo.myStatus = 'Disike';
        } else {
          comment.likesInfo.myStatus = 'None';
        }
        return comment;
      });
      const totalCount: number = await commentRepository.countAllCommentsByPostId(
        req.params.postId
      );
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

  createCommentForPostController = async (req: Request, res: Response) => {
    if (!(await this.postsService.postsRepository.isPostExist(req.params.postId.toString()))) {
      res.sendStatus(404);
      return;
    }

    const newComment = await commentService.createCommentService(
      req.params.postId,
      req.user!.id,
      req.user!.login,
      req.body.content
    );
    res.status(201).send(newComment);
  };
}

export const postsController = new PostsController();
