import { PostInputModel, PostViewModel } from '../models/postModel';
import { PostsRepository } from '../repositories/posts-repository';

export class PostsService {
  postsRepository: PostsRepository;
  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async deleteAllPosts() {
    return this.postsRepository.deleteAllPosts();
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
}
