import { ObjectId, ObjectID } from 'bson';
import { BlogViewModel } from '../models/blogModel';
import { PostDBModel, PostInputModel, PostViewModel } from '../models/postModel';
import { PostReqQueryModel } from '../models/reqQueryModel';
import { blogsRepository } from './blogs-repository';
import { postsCollection } from './db';

export class PostsRepository {
  async findPosts(options: PostReqQueryModel): Promise<PostViewModel[]> {
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

  async findPostById(id: string): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const postById = await postsCollection.findOne({ _id: new ObjectId(id) });
    let postToReturn: PostViewModel | null = null;
    if (postById) {
      const { _id, blogId, ...rest } = postById;
      postToReturn = { id: _id!.toString(), blogId: blogId.toString(), ...rest };
    }
    return postToReturn;
  }

  async updatePostById(id: string, newDatajson: PostInputModel): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const { blogId, ...rest } = newDatajson;
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id), blogId: new ObjectId(blogId) },
      { $set: { ...rest } }
    );
    return result.matchedCount === 1;
  }

  async deletePostById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
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
