import { Request, Response } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { PostViewModel } from '../models/postModel';
import { BlogsService } from '../service/blog-service';
import { PostsService } from '../service/post-service';
import { BlogsRepository } from '../repositories/blogs-repository';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../repositories/queryRepositories/blogs.queryRepository';
import { BlogReqQueryModel, PostReqQueryModel } from '../models/reqQueryModel';
import { PostsRepository } from '../repositories/posts-repository';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(PostsService) protected postsService: PostsService,
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository
  ) {}

  getAllBlogs = async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const blogsQueryParams = {
      searchNameTerm: req.query.searchNameTerm || null,
      pageNumber,
      pageSize,
      sortBy: req.query.sortBy?.toString() || 'createdAt',
      sortDirection: req.query.sortDirection || 'desc',
      skip,
    } as BlogReqQueryModel;

    const foundBlogs = await this.blogsQueryRepository.getAllBlogs(blogsQueryParams);
    res.send(foundBlogs);
  };

  createBlog = async (req: Request, res: Response) => {
    const newBlogId = await this.blogsService.createBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    });
    const newBlog = await this.blogsQueryRepository.getBlogById(newBlogId!);
    res.status(201).send(newBlog);
  };

  createBlogPost = async (req: Request, res: Response) => {
    const blog = await this.blogsQueryRepository.getBlogById(req.params.blogId.toString());
    if (!blog) {
      res.sendStatus(404);
      return;
    }
    const postCreatedId = await this.postsService.createBlogPost({
      blogId: blog.id!,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
    });
    const newPost = await this.postsRepository.getPostById(postCreatedId!, req.user?.id || '');
    res.status(201).send(newPost);
  };

  getBlogById = async (req: Request, res: Response) => {
    const blogFound: BlogViewModel | null = await this.blogsQueryRepository.getBlogById(
      req.params.id.toString()
    );

    if (blogFound) {
      res.status(200).send(blogFound);
    } else {
      res.sendStatus(404);
    }
  };

  updateBlogById = async (req: Request, res: Response) => {
    const isBlogUpdated: boolean = await this.blogsService.updateBlogById(
      req.params.id.toString(),
      {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
      }
    );
    if (isBlogUpdated) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  };

  deleteBlogById = async (req: Request, res: Response) => {
    const isBlogDeleted: boolean = await this.blogsService.deleteBlogById(
      req.params.id.toString()
    );
    if (!isBlogDeleted) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  };

  getPostsByBlogId = async (req: Request, res: Response) => {
    const blogId = req.params.blogId.toString();
    const userId = req.user?.id || '';

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

    const posts = await this.blogsQueryRepository.getAllPostsByBlogId(
      blogId,
      userId,
      postsQueryParams
    );

    if (!posts) return res.sendStatus(404);
    res.send(posts);
  };
}
