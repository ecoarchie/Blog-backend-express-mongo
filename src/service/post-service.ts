import { inject, injectable } from 'inversify';
import { PostInputModel, PostViewModel } from '../models/postModel';
import { PostsRepository } from '../repositories/posts-repository';
import { PostsQueryRepository } from '../repositories/queryRepositories/posts.queryRepository';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
  ) {}

  async deleteAllPosts() {
    return this.postsRepository.deleteAllPosts();
  }

  async deleteAllPostsLikes() {
    return this.postsRepository.deleteAllPostsLikes();
  }

  async createPost(data: PostInputModel): Promise<PostViewModel['id']> {
    return this.postsRepository.createPost(data);
  }

  async createBlogPost(postData: PostInputModel): Promise<PostViewModel['id']> {
    const blogPost = await this.createPost({ ...postData });
    return blogPost;
  }

  async updatePostById(postId: string, updateParams: PostInputModel): Promise<boolean> {
    return this.postsRepository.updatePostById(postId, updateParams);
  }

  async deletePostById(postId: string): Promise<boolean> {
    return this.postsRepository.deletePostById(postId);
  }

  // async countAllPosts(): Promise<number> {
  //   return this.postsQueryRepository.countAllPosts();
  // }

  async likePostService(userId: string, postId: string, likeStatus: string): Promise<number> {
    const foundPost = await this.postsQueryRepository.getPostById(postId, userId);
    if (!foundPost) return 404;
    try {
      const likePost = await this.postsRepository.likePost(userId, postId, likeStatus);
      return 204;
    } catch (error) {
      console.error(error);
      return 404;
    }
  }
}
