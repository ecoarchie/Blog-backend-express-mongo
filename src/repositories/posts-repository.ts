import { ObjectId, ObjectID } from 'bson';
import { BlogViewModel } from '../models/blogModel';
import {
  NewestLikesModel,
  PostDBModel,
  PostInputModel,
  PostViewModel,
} from '../models/postModel';
import { PostReqQueryModel } from '../models/reqQueryModel';
import { BlogsRepository } from './blogs-repository';
import { postLikesCollection, postsCollection, userLikesCollection } from './db';
import { usersRepository } from './users-repository';

const blogsRepository = new BlogsRepository();
export class PostsRepository {
  async getAllPosts(options: PostReqQueryModel, userId: string): Promise<PostViewModel[]> {
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
    const postsLikesInfo = await postLikesCollection.find().toArray();
    await Promise.all(
      postsLikesInfo.map(async (p) => {
        p.myStatus = await usersRepository.checkLikeStatus(userId, {
          field: 'Posts',
          fieldId: p.postId.toString(),
        });
        console.log(p.myStatus);
        return p;
      })
    );
    posts.map((post) => {
      let extendedLikesInfo = postsLikesInfo.find(
        (p) => p.postId.toString() === post.id!.toString()
      );
      post.extendedLikesInfo = {
        likesCount: extendedLikesInfo!.likesCount,
        dislikesCount: extendedLikesInfo!.dislikesCount,
        myStatus: extendedLikesInfo!.myStatus!,
        newestLikes: extendedLikesInfo!.newestLikes.slice(0, 3),
      };
      return post;
    });
    return posts;
  }

  async deleteAllPosts() {
    return await postsCollection.deleteMany({});
  }

  async deleteAllPostsLikes() {
    return await postLikesCollection.deleteMany({});
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
    if (result.insertedId) {
      postLikesCollection.insertOne({
        postId: result.insertedId,
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      });
    }

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

  async getPostById(postId: string, userId: string): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(postId)) return null;
    const postById = await postsCollection.findOne({ _id: new ObjectId(postId) });
    let postToReturn: PostViewModel | null = null;
    if (postById) {
      const { _id, title, shortDescription, content, blogId, blogName, createdAt } = postById;
      const postLikesInfo = await postLikesCollection.findOne(
        { postId: new ObjectId(postId) },
        { projection: { _id: 0 } }
      );

      const myStatus = await usersRepository.checkLikeStatus(userId, {
        field: 'Posts',
        fieldId: postId,
      });
      postToReturn = {
        id: _id!.toString(),
        title,
        shortDescription,
        content,
        blogId: blogId.toString(),
        blogName,
        createdAt,
        extendedLikesInfo: {
          likesCount: postLikesInfo!.likesCount,
          dislikesCount: postLikesInfo!.dislikesCount,
          newestLikes: postLikesInfo!.newestLikes.slice(0, 3),
          myStatus,
        },
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

  async _addToUsersLikeList(userId: string, postId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { likedPosts: postId } }
    );
  }

  async _removeFromUsersLikeList(userId: string, postId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { likedPosts: postId } }
    );
  }

  async _addToUsersDislikeList(userId: string, postId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: { dislikedPosts: postId } }
    );
  }

  async _removeFromUsersDislikeList(userId: string, postId: string) {
    await userLikesCollection.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { dislikedPosts: postId } }
    );
  }

  async _addUserToNewestLikes(userId: string, postId: string) {
    const foundUser = await usersRepository.findUserById(userId);
    const newestLiked: NewestLikesModel = {
      addedAt: new Date().toISOString(),
      userId,
      login: foundUser!.login,
    };
    const newestLikesToUpdate = await postLikesCollection.findOne({
      postId: new ObjectId(postId),
    });
    const newestLikesArray = newestLikesToUpdate!.newestLikes;
    const alreadyLiked = newestLikesArray.find((p) => p.userId === userId);
    if (!alreadyLiked) newestLikesArray.unshift(newestLiked);
    const result = await postLikesCollection.updateOne(
      { postId: new ObjectId(postId) },
      { $set: { newestLikes: newestLikesArray } }
    );
  }

  async _removeFromNewestLikes(userId: string, postId: string) {
    await postLikesCollection.updateOne(
      { postId: new ObjectId(postId) },
      { $pull: { newestLikes: { userId } } }
    );
  }

  async likePost(userId: string, postId: string, likeStatus: string): Promise<void> {
    const likedStatusBefore = await usersRepository.checkLikeStatus(userId, {
      field: 'Posts',
      fieldId: postId,
    });

    if (likedStatusBefore === likeStatus) return;

    if (likeStatus === 'None') {
      if (likedStatusBefore === 'Like') {
        await postLikesCollection.updateOne(
          { postId: new ObjectId(postId) },
          { $inc: { likesCount: -1 } }
        );
        await this._removeFromUsersLikeList(userId, postId);
      } else if (likedStatusBefore === 'Dislike') {
        await postLikesCollection.updateOne(
          { postId: new ObjectId(postId) },
          { $inc: { dislikesCount: -1 } }
        );
        await this._removeFromUsersDislikeList(userId, postId);
      }
      return;
    }

    const likedField = likeStatus === 'Like' ? 'likesCount' : 'dislikesCount';
    if (likedStatusBefore === 'None') {
      const likedUserField = likeStatus === 'Like' ? 'likedPosts' : 'dislikedPosts';
      await postLikesCollection.updateOne(
        { postId: new ObjectId(postId) },
        { $inc: { [likedField]: 1 } }
      );
      await userLikesCollection.updateOne(
        { userId: new ObjectId(userId) },
        { $push: { [likedUserField]: postId } }
      );
      if (likeStatus === 'Like') {
        await this._addUserToNewestLikes(userId, postId);
      } else {
        await this._removeFromNewestLikes(userId, postId);
      }
    } else if (likedStatusBefore === 'Like') {
      // so likeStatus === 'Dislike'
      await postLikesCollection.updateOne(
        { postId: new ObjectId(postId) },
        { $inc: { likesCount: -1, dislikesCount: 1 } }
      );
      await this._removeFromUsersLikeList(userId, postId);
      await this._addToUsersDislikeList(userId, postId);
      await this._removeFromNewestLikes(userId, postId);
    } else if (likedStatusBefore === 'Dislike') {
      // so likeStatus === 'Like'
      await postLikesCollection.updateOne(
        { postId: new ObjectId(postId) },
        { $inc: { likesCount: 1, dislikesCount: -1 } }
      );
      await this._addToUsersLikeList(userId, postId);
      await this._removeFromUsersDislikeList(userId, postId);
      await this._addUserToNewestLikes(userId, postId);
    }
  }
}
export const postsRepository = new PostsRepository();
