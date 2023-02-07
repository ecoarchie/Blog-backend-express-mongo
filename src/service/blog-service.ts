import { inject, injectable } from 'inversify';
import { BlogViewModel, BlogInputModel } from '../models/blogModel';
import { BlogsRepository } from '../repositories/blogs-repository';

@injectable()
export class BlogsService {
  constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {}

  async deleteAllBlogs() {
    return this.blogsRepository.deleteAllBlogs();
  }

  async createBlog(blogInputData: BlogInputModel): Promise<BlogViewModel['id']> {
    const { name, description, websiteUrl } = blogInputData;
    const blogToInsert = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const createdBlogId = await this.blogsRepository.createBlog(blogToInsert);
    return createdBlogId;
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
