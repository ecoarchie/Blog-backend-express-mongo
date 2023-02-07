import { Request, Response } from 'express';
import { PostInputModel, PostViewModel } from '../models/postModel';
import { CommentRepository } from '../repositories/comments-repository';
import { CommentService } from '../service/comments-service';
import { PostsService } from '../service/post-service';
import { setCommentsQueryParams, setPostQueryParams } from './utils';
import { userLikesCollection } from '../repositories/db';
import { ObjectId, WithId } from 'mongodb';
import { UsersLikesDBModel } from '../models/likeModel';
import { PostsRepository } from '../repositories/posts-repository';
import { inject, injectable } from 'inversify';
import { PostReqQueryModel } from '../models/reqQueryModel';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(CommentRepository) protected commentRepository: CommentRepository,
    @inject(CommentService) protected commentService: CommentService
  ) {}
  getAllPostsController = async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const postsQueryParams = {
      searchNameTerm: req.query.searchNameTerm || null,
      pageNumber,
      pageSize,
      sortBy: req.query.sortBy?.toString() || 'createdAt',
      sortDirection: req.query.sortDirection || 'desc',
      skip,
    } as PostReqQueryModel;

    const foundPosts = await this.postsRepository.getAllPosts(
      postsQueryParams,
      req.user?.id || ''
    );
    res.send(foundPosts);
  };

  createPostController = async (req: Request, res: Response) => {
    const newPostId = await this.postsService.createPost({
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    });
    const newPost = await this.postsRepository.getPostById(newPostId!, req.user?.id || '');
    res.status(201).send(newPost);
  };

  getPostByIdController = async (req: Request, res: Response) => {
    const postFound: PostViewModel | null = await this.postsRepository.getPostById(
      req.params.id.toString(),
      req.user?.id || ''
    );
    if (postFound) {
      res.send(postFound);
    } else {
      res.sendStatus(404);
    }
  };

  updatePostByIdController = async (req: Request, res: Response) => {
    const updateParams: PostInputModel = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };
    const isPostUpdated: boolean = await this.postsService.updatePostById(
      req.params.id.toString(),
      updateParams
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

  //TODO refactor this
  getCommentsForPostController = async (req: Request, res: Response) => {
    const isValidPost = await this.postsRepository.isPostExist(req.params.postId);
    if (!isValidPost) {
      res.sendStatus(404);
    } else {
      const options = setCommentsQueryParams(req.query);
      let comments = await this.commentRepository.getCommentsByPostId(
        req.params.postId,
        options
      );

      let currentUserId = req.user?.id;
      let userLikesDislikes: WithId<UsersLikesDBModel> | null = null;
      if (currentUserId) {
        userLikesDislikes = await userLikesCollection.findOne({
          userId: new ObjectId(currentUserId),
        });
      }
      comments = comments.map((comment) => {
        if (
          !userLikesDislikes?.likedComments.includes(comment.id) &&
          !userLikesDislikes?.dislikedComments.includes(comment.id)
        ) {
          comment.likesInfo.myStatus = 'None';
        } else if (userLikesDislikes!.likedComments.includes(comment.id)) {
          comment.likesInfo.myStatus = 'Like';
        } else if (userLikesDislikes!.dislikedComments.includes(comment.id)) {
          comment.likesInfo.myStatus = 'Dislike';
        } else {
          comment.likesInfo.myStatus = 'None';
        }
        return comment;
      });
      const totalCount: number = await this.commentRepository.countAllCommentsByPostId(
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
    if (!(await this.postsRepository.isPostExist(req.params.postId.toString()))) {
      res.sendStatus(404);
      return;
    }

    const newComment = await this.commentService.createCommentService(
      req.params.postId,
      req.user!.id,
      req.user!.login,
      req.body.content
    );
    res.status(201).send(newComment);
  };

  likePostController = async (req: Request, res: Response) => {
    const userId = req.user ? req.user.id : '';
    const postId = req.params.postId;
    const likeStatus = req.body.likeStatus;

    const resStatus = await this.postsService.likePostService(userId, postId, likeStatus);
    res.sendStatus(resStatus);
  };
}
