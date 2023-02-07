import { ObjectId, ObjectID } from 'bson';
import { inject, injectable } from 'inversify';
import { BlogViewModel } from '../../models/blogModel';
import {
  NewestLikesModel,
  PostDBModel,
  PostInputModel,
  PostViewModel,
  PostsPaginationView,
} from '../../models/postModel';
import { PostReqQueryModel } from '../../models/reqQueryModel';
import { BlogsRepository } from '../blogs-repository';
import { postLikesCollection, postsCollection, userLikesCollection } from '../db';
import { BlogsQueryRepository } from '../queryRepositories/blogs.queryRepository';
import { usersRepository } from '../users-repository';

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
  ) {}

  async getAllPosts(options: PostReqQueryModel, userId: string): Promise<PostsPaginationView> {
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
      posts.map(async (post) => {
        let extendedLikesInfo = postsLikesInfo.find(
          (p) => p.postId.toString() === post.id!.toString()
        );
        post.extendedLikesInfo = {
          likesCount: extendedLikesInfo!.likesCount,
          dislikesCount: extendedLikesInfo!.dislikesCount,
          myStatus: await usersRepository.checkLikeStatus(userId, {
            field: 'Posts',
            fieldId: post.id!.toString(),
          }),
          newestLikes: extendedLikesInfo!.newestLikes.slice(0, 3),
        };
        return post;
      })
    );
    const totalCount: number = options.searchNameTerm
      ? posts.length
      : await this.countAllPosts();
    const pagesCount: number = Math.ceil(totalCount / options.pageSize!);
    return {
      pagesCount,
      page: options.pageNumber!,
      pageSize: options.pageSize!,
      totalCount,
      items: posts,
    };
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

  async countAllPosts(): Promise<number> {
    return postsCollection.countDocuments();
  }

  async isPostExist(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) return false;
    return (await postsCollection.countDocuments({ _id: new ObjectId(postId) })) > 0;
  }
}
