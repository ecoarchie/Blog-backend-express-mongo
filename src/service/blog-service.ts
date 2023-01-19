import { BlogViewModel, BlogInputModel, BlogDBModel } from '../models/blogModel';
import { BlogReqQueryModel } from '../models/reqQueryModel';
import { blogsRepository } from '../repositories/blogs-repository';

class BlogService {
  async findBlogs(options: BlogReqQueryModel): Promise<BlogViewModel[]> {
    return blogsRepository.findBlogs(options);
  }

  async deleteAllBlogs() {
    return blogsRepository.deleteAllBlogs();
  }

  async createBlog(bodyJson: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = bodyJson;
    const blogToInsert: BlogDBModel = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const createdBlog = await blogsRepository.createBlog(blogToInsert);
    return createdBlog;
  }

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    return blogsRepository.findBlogById(id);
  }

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    return blogsRepository.updateBlogById(id, newDatajson);
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return blogsRepository.deleteBlogById(id);
  }

  async countAllBlogs(): Promise<number> {
    return blogsRepository.countAllBlogs();
  }
}

export const blogsService = new BlogService();
