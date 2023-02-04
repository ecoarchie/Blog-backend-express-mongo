import { Request, Response } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { PostViewModel } from '../models/postModel';
import { BlogsService } from '../service/blog-service';
import { PostsService } from '../service/post-service';
import { setBlogQueryParams } from './utils';
import { BlogsRepository } from '../repositories/blogs-repository';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../repositories/queryRepositories/blogs.queryRepository';

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(PostsService) protected postsService: PostsService,
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
  ) {}

  getAllBlogs = async (req: Request, res: Response) => {
    const options = setBlogQueryParams(req.query);

    const foundBlogs = await this.blogsQueryRepository.getAllBlogs(options);
    const totalCount: number = options.searchNameTerm
      ? foundBlogs.length
      : await this.blogsQueryRepository.countAllBlogs();
    const pagesCount: number = Math.ceil(totalCount / options.pageSize);

    res.send({
      pagesCount,
      page: options.pageNumber,
      pageSize: options.pageSize,
      totalCount,
      items: foundBlogs,
    });
  };

  createBlog = async (req: Request, res: Response) => {
    const newBlog = await this.blogsService.createBlog({
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    });
    res.status(201).send(newBlog);
  };

  createBlogPost = async (req: Request, res: Response) => {
    const blog = await this.blogsQueryRepository.getBlogById(req.params.blogId.toString());
    if (!blog) {
      res.sendStatus(404);
    } else {
      const postCreated: PostViewModel = await this.postsService.createBlogPost({
        blogId: blog.id!,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
      });
      res.status(201).send(postCreated);
    }
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
    const blog: BlogViewModel | null = await this.blogsQueryRepository.getBlogById(
      req.params.blogId.toString()
    );
    if (!blog) {
      res.sendStatus(404);
    } else {
      const { pageNumber, pageSize, sortBy, sortDirection, skip } = setBlogQueryParams(
        req.query
      );

      const posts = await this.blogsQueryRepository.getAllPostsByBlogId(
        blog.id!.toString(),
        skip,
        pageSize,
        sortBy,
        sortDirection,
        req.user?.id || ''
      );

      const totalCount: number = await this.postsService.countPostsByBlogId(
        blog.id!.toString()
      );
      const pagesCount: number = Math.ceil(totalCount / pageSize);

      res.send({
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts,
      });
    }
  };
}
