import { Request, Response } from 'express';
import { BlogViewModel } from '../models/blogModel';
import { PostViewModel } from '../models/postModel';
import { blogsService } from '../service/blog-service';
import { postsService } from '../service/post-service';
import { setQueryParams } from './utils';

export const getAllBlogsController = async (req: Request, res: Response) => {
  const options = setQueryParams(req.query);

  const foundBlogs = await blogsService.findBlogs(options);
  const totalCount: number = options.searchNameTerm
    ? foundBlogs.length
    : await blogsService.countAllBlogs();
  const pagesCount: number = Math.ceil(totalCount / options.pageSize);

  res.send({
    pagesCount,
    page: options.pageNumber,
    pageSize: options.pageSize,
    totalCount,
    items: foundBlogs,
  });
};

export const createBlogController = async (req: Request, res: Response) => {
  const newBlog = await blogsService.createBlog(req.body);
  res.status(201).send(newBlog);
};

export const createBlogPostController = async (req: Request, res: Response) => {
  const blog = await blogsService.findBlogById(req.params.blogId.toString());
  if (!blog) {
    res.sendStatus(404);
  } else {
    const postCreated: PostViewModel = await postsService.createBlogPost(blog.id!, req.body);
    res.status(201).send(postCreated);
  }
};

export const getBlogByIdcontroller = async (req: Request, res: Response) => {
  const blogFound: BlogViewModel | null = await blogsService.findBlogById(req.params.id.toString());

  if (blogFound) {
    res.status(200).send(blogFound);
  } else {
    res.sendStatus(404);
  }
};

export const updateBlogByIdController = async (req: Request, res: Response) => {
  const isBlogUpdated: boolean = await blogsService.updateBlogById(
    req.params.id.toString(),
    req.body
  );
  if (isBlogUpdated) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};

export const deleteBlogByIdController = async (req: Request, res: Response) => {
  const isBlogDeleted: boolean = await blogsService.deleteBlogById(req.params.id.toString());
  if (!isBlogDeleted) {
    res.sendStatus(404);
  } else {
    res.sendStatus(204);
  }
};

export const getPostsByBlogIdController = async (req: Request, res: Response) => {
  const blog: BlogViewModel | null = await blogsService.findBlogById(req.params.blogId.toString());

  if (blog) {
    const { pageNumber, pageSize, sortBy, sortDirection, skip } = setQueryParams(req.query);

    const posts: Array<BlogViewModel> = await postsService.findPostsByBlogId(
      blog.id!.toString(),
      skip,
      pageSize,
      sortBy,
      sortDirection
    );

    const totalCount: number = await postsService.countPostsByBlogId(blog.id!.toString());
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
