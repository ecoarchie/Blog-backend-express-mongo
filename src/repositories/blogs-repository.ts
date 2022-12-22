import { ObjectId } from 'mongodb';
import { BlogViewModel, BlogInputModel, BlogDBModel } from '../models/blogModel';
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
      { $addFields: { id: '$_id' } },
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
    const blogToInsert: BlogDBModel = {
      _id: null,
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const result = await blogsCollection.insertOne(blogToInsert);
    const newBlog: BlogViewModel = {
      id: result.insertedId!.toString(),
      name: blogToInsert.name,
      description: blogToInsert.description,
      websiteUrl: blogToInsert.websiteUrl,
      createdAt: blogToInsert.createdAt,
    };

    return newBlog;
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const blogById = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    let blogToReturn: BlogViewModel | null = null;
    if (blogById) {
      const { _id, ...rest } = blogById;
      blogToReturn = { id: _id!.toString(), ...rest };
    }
    return blogToReturn;
  },

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...newDatajson } }
    );

    return result.matchedCount === 1;
  },

  async deleteBlogById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },

  async countAllBlogs(): Promise<number> {
    return blogsCollection.countDocuments();
  },
};
