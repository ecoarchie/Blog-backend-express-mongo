import { PostInputModel, PostViewModel } from '../models/postModel';
import { PostsRepository } from '../repositories/posts-repository';

export class PostsService {
  static deleteAllPostsLikes() {
    throw new Error('Method not implemented.');
  }
  postsRepository: PostsRepository;
  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async deleteAllPosts() {
    return this.postsRepository.deleteAllPosts();
  }

  async deleteAllPostsLikes() {
    return this.postsRepository.deleteAllPostsLikes();
  }

  async createPost(data: PostInputModel): Promise<PostViewModel> {
    return this.postsRepository.createPost(data);
  }

  async createBlogPost(postData: PostInputModel): Promise<PostViewModel> {
    const blogPost = await this.createPost({ ...postData });
    return blogPost;
  }

  async updatePostById(postId: string, updateParams: PostInputModel): Promise<boolean> {
    return this.postsRepository.updatePostById(postId, updateParams);
  }

  async deletePostById(postId: string): Promise<boolean> {
    return this.postsRepository.deletePostById(postId);
  }

  async countPostsByBlogId(blogId: string): Promise<number> {
    return this.postsRepository.countPostsByBlogId(blogId);
  }

  async countAllPosts(): Promise<number> {
    return this.postsRepository.countAllPosts();
  }

  async likePostService(userId: string, postId: string, likeStatus: string): Promise<number> {
    const foundPost = await this.postsRepository.getPostById(postId, userId);
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
