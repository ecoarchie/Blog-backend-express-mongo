import { BlogViewModel, BlogInputModel } from '../models/blogModel';
import { blogsCollection } from './db';

export const blogsRepository = {
  async findBlogs(): Promise<BlogViewModel[]> {
    return await blogsCollection.find({}).toArray();
  },

  async deleteAllBlogs() {
    return await blogsCollection.deleteMany({});
  },

  async createBlog(bodyJson: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = bodyJson;
    const newBlog: BlogViewModel = {
      id: (+new Date()).toString(),
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const result = await blogsCollection.insertOne(newBlog);
    return newBlog;
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blogById = await blogsCollection.findOne({ id });

    return blogById;
  },

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    const result = await blogsCollection.updateOne({ id }, { $set: { ...newDatajson } });

    return result.matchedCount === 1;
  },

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
};
