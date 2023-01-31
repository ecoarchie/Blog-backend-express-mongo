import { BlogViewModel, BlogInputModel, BlogDBModel } from '../models/blogModel';
import { BlogReqQueryModel } from '../models/reqQueryModel';
import { BlogsRepository } from '../repositories/blogs-repository';

export class BlogsService {
  blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }

  // async findBlogs(options: BlogReqQueryModel): Promise<BlogViewModel[]> {
  //   return this.blogsRepository.findBlogs(options);
  // }

  async deleteAllBlogs() {
    return this.blogsRepository.deleteAllBlogs();
  }

  async createBlog(bodyJson: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = bodyJson;
    const blogToInsert = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const createdBlog = await this.blogsRepository.createBlog(blogToInsert);
    return createdBlog;
  }

  // async findBlogById(id: string): Promise<BlogViewModel | null> {
  //   return this.blogsRepository.findBlogById(id);
  // }

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    return this.blogsRepository.updateBlogById(id, newDatajson);
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlogById(id);
  }

  async countAllBlogs(): Promise<number> {
    return this.blogsRepository.countAllBlogs();
  }
}

// export const blogsService = new BlogsService();
