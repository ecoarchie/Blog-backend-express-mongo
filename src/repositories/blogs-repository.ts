import { ObjectId } from 'mongodb';
import { BlogViewModel, BlogInputModel, BlogDBModel } from '../models/blogModel';
import { BlogReqQueryModel } from '../models/reqQueryModel';
import { blogsCollection, postLikesCollection, postsCollection } from './db';
import { usersRepository } from './users-repository';
import { injectable } from 'inversify';

@injectable()
export class BlogsRepository {
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

  async updateBlogById(id: string, newDatajson: BlogInputModel): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...newDatajson } }
    );
    await updatePostsForUpdatedBlog();

    return result.matchedCount === 1;

    async function updatePostsForUpdatedBlog() {
      const { name } = newDatajson;
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
