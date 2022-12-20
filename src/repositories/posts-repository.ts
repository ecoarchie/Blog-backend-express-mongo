import { stringify } from 'querystring';
import { BlogViewModel } from '../models/blogModel';
import { PostInputModel, PostViewModel } from '../models/postModel';
import { blogsRepository } from './blogs-repository';
import { postsCollection } from './db';

export const postsRepository = {
  async findPosts(): Promise<PostViewModel[]> {
    return await postsCollection.find({}, { projection: { _id: 0 } }).toArray();
  },

  async deleteAllPosts() {
    return await postsCollection.deleteMany({});
  },

  async createPost(data: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = data;
    const blog = (await blogsRepository.findBlogById(blogId)) as BlogViewModel;
    const blogName = blog.name;
    const newPost: PostViewModel = {
      id: (+new Date()).toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    };
    const result = await postsCollection.insertOne({ ...newPost });
    return newPost;
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    const post = await postsCollection.findOne({ id }, { projection: { _id: 0 } });
    return post;
  },

  async updatePostById(id: string, newDatajson: PostInputModel): Promise<boolean> {
    const result = await postsCollection.updateOne({ id }, { $set: { ...newDatajson } });
    return result.matchedCount === 1;
  },

  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async findPostsByBlogId(
    blogId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
  ) {
    const sort: any = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    const pipeline = [
      { $match: { blogId } },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 0 } },
    ];

    const posts: Array<BlogViewModel> = (await postsCollection
      .aggregate(pipeline)
      .toArray()) as Array<BlogViewModel>;
    return posts;
  },

  async countPostsByBlogId(blogId: string): Promise<number> {
    return postsCollection.count({ blogId });
  },
};
