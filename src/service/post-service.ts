import { BlogPostInputModel, PostInputModel, PostViewModel } from '../models/postModel';
import { PostReqQueryModel } from '../models/reqQueryModel';
import { PostsRepository } from '../repositories/posts-repository';

export class PostsService {
  postsRepository: PostsRepository;
  constructor() {
    this.postsRepository = new PostsRepository();
  }
  async findPosts(options: PostReqQueryModel): Promise<PostViewModel[]> {
    return this.postsRepository.findPosts(options);
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

  async findPostById(id: string): Promise<PostViewModel | null> {
    return this.postsRepository.findPostById(id);
  }

  async updatePostById(id: string, newDatajson: PostInputModel): Promise<boolean> {
    return this.postsRepository.updatePostById(id, newDatajson);
  }

  async deletePostById(id: string): Promise<boolean> {
    return this.postsRepository.deletePostById(id);
  }

  async findPostsByBlogId(
    blogId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
  ) {
    return this.postsRepository.findPostsByBlogId(blogId, skip, limit, sortBy, sortDirection);
  }

  async countPostsByBlogId(blogId: string): Promise<number> {
    return this.postsRepository.countPostsByBlogId(blogId);
  }

  async countAllPosts(): Promise<number> {
    return this.postsRepository.countAllPosts();
  }
}
// export const postsService = new PostsService();
