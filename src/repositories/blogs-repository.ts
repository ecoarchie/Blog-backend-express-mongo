import { ObjectId } from 'mongodb';
import { BlogViewModel, BlogInputModel, BlogDBModel } from '../models/blogModel';
import { BlogReqQueryModel } from '../models/reqQueryModel';
import { blogsCollection, postsCollection } from './db';

export class BlogsRepository {
  async findBlogs(options: BlogReqQueryModel): Promise<BlogViewModel[]> {
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

    const blogs: Array<BlogViewModel> = (
      await blogsCollection.aggregate(pipeline).toArray()
    ).map((blog) => {
      blog.id = blog.id.toString();
      return blog;
    }) as Array<BlogViewModel>;
    return blogs;
  }

  async deleteAllBlogs() {
    return await blogsCollection.deleteMany({});
  }

  async createBlog(blogToInsert: BlogDBModel): Promise<BlogViewModel> {
    const result = await blogsCollection.insertOne(blogToInsert);
    const newBlog: BlogViewModel = {
      id: result.insertedId!.toString(),
      name: blogToInsert.name,
      description: blogToInsert.description,
      websiteUrl: blogToInsert.websiteUrl,
      createdAt: blogToInsert.createdAt,
    };

    return newBlog;
  }

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const blogById = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    let blogToReturn: BlogViewModel | null = null;
    if (blogById) {
      const { _id, name, description, websiteUrl, createdAt } = blogById;
      blogToReturn = { id: _id!.toString(), name, description, websiteUrl, createdAt };
    }
    return blogToReturn;
  }

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...newDatajson } }
    );
    const { name } = newDatajson;
    await updatePostsForUpdatedBlog();

    return result.matchedCount === 1;

    async function updatePostsForUpdatedBlog() {
      if (name) {
        await postsCollection.updateMany(
          { blogId: new ObjectId(id) },
          { $set: { blogName: name } }
        );
      }
    }
  }

  async deleteBlogById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async countAllBlogs(): Promise<number> {
    return blogsCollection.countDocuments();
  }
}

export const blogsRepository = new BlogsRepository();
