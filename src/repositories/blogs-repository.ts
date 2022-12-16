import { BlogViewModel, BlogInputModel } from '../models/blogModel';
import { blogsCollection } from './db';

let blogsDB: Array<BlogViewModel> = [
  {
    id: '1',
    name: 'blog1',
    description: 'desc1',
    websiteUrl: 'https://mail.ru',
  },
  {
    id: '2',
    name: 'blog2',
    description: 'desc2',
    websiteUrl: 'https://ya.ru',
  },
  {
    id: '3',
    name: 'blog3',
    description: 'desc3',
    websiteUrl: 'https://yahoo.com',
  },
];

export const blogsRepository = {
  async findBlogs(): Promise<BlogViewModel[]> {
    return await blogsCollection.find({}).toArray();
    // const blogs = blogsDB;
    // return blogs;
  },

  async deleteAllBlogs(): Promise<BlogViewModel[]> {
    blogsDB = [];
    return blogsDB;
  },

  async createBlog(bodyJson: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = bodyJson;
    const newBlog: BlogViewModel = {
      id: (+new Date()).toString(),
      name,
      description,
      websiteUrl,
    };
    const result = await blogsCollection.insertOne(newBlog);
    return newBlog;
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blogById = blogsCollection.findOne({ id });

    return blogById;
  },

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    const result = await blogsCollection.updateOne({ id }, { $set: { ...newDatajson } });

    return result.matchedCount === 1;
  },

  async deleteBlogById(id: string): Promise<boolean> {
    const blogToDelete: BlogViewModel | undefined = blogsDB.find((b) => b.id === id);
    if (!blogToDelete) {
      return false;
    } else {
      blogsDB = blogsDB.filter((b) => b.id !== id);
      return true;
    }
  },
};
