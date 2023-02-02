import { BlogViewModel, BlogInputModel } from '../models/blogModel';
import { BlogsRepository } from '../repositories/blogs-repository';

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

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
