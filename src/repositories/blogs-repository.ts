import { BlogViewModel, BlogInputModel } from '../models/blogModel';
import { ReqQueryModel } from '../models/reqQueryModel';
import { blogsCollection, postsCollection } from './db';

export const blogsRepository = {
  async findBlogs(options: ReqQueryModel & { skip: number }): Promise<BlogViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;
    const searchTerm = !options.searchNameTerm
      ? {}
      : { name: { $regex: options.searchNameTerm, $options: 'i' } };

    const pipeline = [
      { $match: searchTerm },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.pageSize },
      { $project: { _id: 0 } },
    ];

    const blogs: Array<BlogViewModel> = (await blogsCollection
      .aggregate(pipeline)
      .toArray()) as Array<BlogViewModel>;
    return blogs;
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
    const result = await blogsCollection.insertOne({ ...newBlog });

    return newBlog;
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const blogById = await blogsCollection.findOne({ id }, { projection: { _id: 0 } });
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

  async countAllBlogs(): Promise<number> {
    return blogsCollection.countDocuments();
  },
};
