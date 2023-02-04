import { ObjectId } from 'mongodb';
import {
  BlogViewModel,
  BlogInputModel,
  BlogDBModel,
  BlogsPaginationView,
} from '../../models/blogModel';
import { BlogReqQueryModel } from '../../models/reqQueryModel';
import { blogsCollection, postLikesCollection, postsCollection } from '.././db';
import { usersRepository } from '.././users-repository';
import { injectable } from 'inversify';

@injectable()
export class BlogsQueryRepository {
  async getAllBlogs(blogsQueryParams: BlogReqQueryModel): Promise<BlogsPaginationView> {
    const sort: any = {};
    sort[blogsQueryParams.sortBy!] = blogsQueryParams.sortDirection === 'asc' ? 1 : -1;

    const searchTerm = !blogsQueryParams.searchNameTerm
      ? {}
      : { name: { $regex: blogsQueryParams.searchNameTerm, $options: 'i' } };

    const pipeline = [
      { $match: searchTerm },
      { $addFields: { id: '$_id' } },
      { $sort: sort },
      { $skip: blogsQueryParams.skip },
      { $limit: blogsQueryParams.pageSize },
      { $project: { _id: 0 } },
    ];

    const blogs: Array<BlogViewModel> = (
      await blogsCollection.aggregate(pipeline).toArray()
    ).map((blog) => {
      blog.id = blog.id.toString();
      return blog;
    }) as Array<BlogViewModel>;

    const totalCount: number = blogsQueryParams.searchNameTerm
      ? blogs.length
      : await this.countAllBlogs();
    const pagesCount: number = Math.ceil(totalCount / blogsQueryParams.pageSize!);
    return {
      pagesCount,
      page: blogsQueryParams.pageNumber!,
      pageSize: blogsQueryParams.pageSize!,
      totalCount,
      items: blogs,
    };
  }

  async getBlogById(id: string): Promise<BlogViewModel | null> {
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

  async getAllPostsByBlogId(
    blogId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    userId: string
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

    const postsLikesInfo = await postLikesCollection.find().toArray();
    await Promise.all(
      postsLikesInfo.map(async (p) => {
        p.myStatus = await usersRepository.checkLikeStatus(userId, {
          field: 'Posts',
          fieldId: p.postId.toString(),
        });
        return p;
      })
    );
    const posts = (await postsCollection.aggregate(pipeline).toArray()).map((post) => {
      post.id = post.id.toString();
      post.blogId = post.blogId.toString();
      let extendedLikesInfo = postsLikesInfo.find((p) => p.postId.toString() === post.id);
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

  async countAllBlogs(): Promise<number> {
    return blogsCollection.countDocuments();
  }
}
