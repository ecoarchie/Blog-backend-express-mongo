import { Request, Response } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { PostViewModel } from '../models/postModel';
import { BlogsService } from '../service/blog-service';
import { postsService } from '../service/post-service';
import { setBlogQueryParams } from './utils';

class BlogsController {
  private blogsService: BlogsService;
  constructor() {
    this.blogsService = new BlogsService();
  }

  getAllBlogs = async (req: Request, res: Response) => {
    const options = setBlogQueryParams(req.query);

    const foundBlogs = await this.blogsService.findBlogs(options);
    const totalCount: number = options.searchNameTerm
      ? foundBlogs.length
      : await this.blogsService.countAllBlogs();
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
    const newBlog = await this.blogsService.createBlog(req.body);
    res.status(201).send(newBlog);
  };

  createBlogPost = async (req: Request, res: Response) => {
    const blog = await this.blogsService.findBlogById(req.params.blogId.toString());
    if (!blog) {
      res.sendStatus(404);
    } else {
      const postCreated: PostViewModel = await postsService.createBlogPost(
        blog.id!,
        req.body
      );
      res.status(201).send(postCreated);
    }
  };

  getBlogById = async (req: Request, res: Response) => {
    const blogFound: BlogViewModel | null = await this.blogsService.findBlogById(
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
      req.body
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
    const blog: BlogViewModel | null = await this.blogsService.findBlogById(
      req.params.blogId.toString()
    );

    if (blog) {
      const { pageNumber, pageSize, sortBy, sortDirection, skip } =
        setBlogQueryParams(req.query);

      const posts: Array<BlogViewModel> = await postsService.findPostsByBlogId(
        blog.id!.toString(),
        skip,
        pageSize,
        sortBy,
        sortDirection
      );

      const totalCount: number = await postsService.countPostsByBlogId(
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
    } else {
      res.sendStatus(404);
    }
  };
}

export const blogsController = new BlogsController();
