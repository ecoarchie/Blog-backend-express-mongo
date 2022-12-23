import { ObjectId, ObjectID } from 'bson';
import { BlogViewModel } from '../models/blogModel';
import {
  BlogPostInputModel,
  PostDBModel,
  PostInputModel,
  PostViewModel,
} from '../models/postModel';
import { ReqQueryModel } from '../models/reqQueryModel';
import { blogsRepository } from './blogs-repository';
import { postsCollection } from './db';

export const postsRepository = {
  async findPosts(options: ReqQueryModel & { skip: number }): Promise<PostViewModel[]> {
    const sort: any = {};
    sort[options.sortBy!] = options.sortDirection === 'asc' ? 1 : -1;
    const searchTerm = !options.searchNameTerm ? {} : { name: { $regex: options.searchNameTerm } };

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
  },

  async deleteAllPosts() {
    return await postsCollection.deleteMany({});
  },

  async createPost(data: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = data;
    const blog = (await blogsRepository.findBlogById(blogId)) as BlogViewModel;
    const blogName = blog.name;
    const postToInsert: PostDBModel = {
      _id: null,
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
  },

  async createBlogPost(blogId: string, postData: BlogPostInputModel): Promise<PostViewModel> {
    const blogPost = await this.createPost({ blogId, ...postData });
    return blogPost;
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const postById = await postsCollection.findOne({ _id: new ObjectId(id) });
    let postToReturn: PostViewModel | null = null;
    if (postById) {
      const { _id, blogId, ...rest } = postById;
      postToReturn = { id: _id!.toString(), blogId: blogId.toString(), ...rest };
    }
    return postToReturn;
  },

  async updatePostById(id: string, newDatajson: PostInputModel): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const { blogId, ...rest } = newDatajson;
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id), blogId: new ObjectId(blogId) },
      { $set: { ...rest } }
    );
    return result.matchedCount === 1;
  },

  async deletePostById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
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
      { $match: { blogId: new ObjectId(blogId) } },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 0 } },
    ];

    const posts: Array<BlogViewModel> = (await postsCollection.aggregate(pipeline).toArray()).map(
      (post) => {
        post.id = post.id.toString();
        post.blogId = post.blogId.toString();
        return post;
      }
    ) as Array<BlogViewModel>;
    return posts;
  },

  async countPostsByBlogId(blogId: string): Promise<number> {
    return postsCollection.count({ blogId: new ObjectId(blogId) });
  },

  async countAllPosts(): Promise<number> {
    return postsCollection.countDocuments();
  },
};
