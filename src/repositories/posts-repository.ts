import { ObjectId, ObjectID } from 'bson';
import { BlogViewModel } from '../models/blogModel';
import { PostDBModel, PostInputModel, PostViewModel } from '../models/postModel';
import { PostReqQueryModel } from '../models/reqQueryModel';
import { BlogsRepository } from './blogs-repository';
import { postsCollection } from './db';

const blogsRepository = new BlogsRepository();
export class PostsRepository {
  async getAllPosts(options: PostReqQueryModel): Promise<PostViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;
    const searchTerm = !options.searchNameTerm
      ? {}
      : { name: { $regex: options.searchNameTerm } };

    const pipeline = [
      { $match: searchTerm },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: options.skip },
      { $limit: options.pageSize },
      { $project: { _id: 0 } },
    ];

    const posts: Array<PostViewModel> = (await postsCollection
      .aggregate(pipeline)
      .toArray()) as Array<PostViewModel>;
    return posts;
  }

  async deleteAllPosts() {
    return await postsCollection.deleteMany({});
  }

  async createPost(data: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = data;
    const blog = (await blogsRepository.findBlogById(blogId)) as BlogViewModel;
    const blogName = blog.name;
    const postToInsert: PostDBModel = {
      title,
      shortDescription,
      content,
      blogId: new ObjectID(blogId),
      blogName,
      createdAt: new Date().toISOString(),
    };
    const result = await postsCollection.insertOne(postToInsert);

    const newPost: PostViewModel = {
      id: result.insertedId!.toString(),
      title: postToInsert.title,
      shortDescription: postToInsert.shortDescription,
      content: postToInsert.content,
      blogId: blogId,
      blogName: postToInsert.blogName,
      createdAt: postToInsert.createdAt,
    };
    return newPost;
  }

  async getPostById(id: string): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const postById = await postsCollection.findOne({ _id: new ObjectId(id) });
    let postToReturn: PostViewModel | null = null;
    if (postById) {
      const { _id, title, shortDescription, content, blogId, blogName, createdAt } = postById;
      postToReturn = {
        id: _id!.toString(),
        title,
        shortDescription,
        content,
        blogId: blogId.toString(),
        blogName,
        createdAt,
      };
    }
    return postToReturn;
  }

  async updatePostById(postId: string, updateParams: PostInputModel): Promise<boolean> {
    if (!ObjectId.isValid(postId)) return false;
    const { blogId, ...rest } = updateParams;
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId), blogId: new ObjectId(blogId) },
      { $set: { ...rest } }
    );
    return result.matchedCount === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) return false;
    const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    return result.deletedCount === 1;
  }

  async countPostsByBlogId(blogId: string): Promise<number> {
    return postsCollection.count({ blogId: new ObjectId(blogId) });
  }

  async countAllPosts(): Promise<number> {
    return postsCollection.countDocuments();
  }

  async isPostExist(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) return false;
    return (await postsCollection.countDocuments({ _id: new ObjectId(postId) })) > 0;
  }
}
export const postsRepository = new PostsRepository();
