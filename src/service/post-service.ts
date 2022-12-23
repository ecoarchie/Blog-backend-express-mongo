import { BlogPostInputModel, PostInputModel, PostViewModel } from '../models/postModel';
import { ReqQueryModel } from '../models/reqQueryModel';
import { postsRepository } from '../repositories/posts-repository';

export const postsService = {
  async findPosts(options: ReqQueryModel & { skip: number }): Promise<PostViewModel[]> {
    return postsRepository.findPosts(options);
  },

  async deleteAllPosts() {
    return postsRepository.deleteAllPosts();
  },

  async createPost(data: PostInputModel): Promise<PostViewModel> {
    return postsRepository.createPost(data);
  },

  async createBlogPost(blogId: string, postData: BlogPostInputModel): Promise<PostViewModel> {
    const blogPost = await this.createPost({ blogId, ...postData });
    return blogPost;
  },

  async findPostById(id: string): Promise<PostViewModel | null> {
    return postsRepository.findPostById(id);
  },

  async updatePostById(id: string, newDatajson: PostInputModel): Promise<boolean> {
    return postsRepository.updatePostById(id, newDatajson);
  },

  async deletePostById(id: string): Promise<boolean> {
    return postsRepository.deletePostById(id);
  },

  async findPostsByBlogId(
    blogId: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc'
  ) {
    return postsRepository.findPostsByBlogId(blogId, skip, limit, sortBy, sortDirection);
  },

  async countPostsByBlogId(blogId: string): Promise<number> {
    return postsRepository.countPostsByBlogId(blogId);
  },

  async countAllPosts(): Promise<number> {
    return postsRepository.countAllPosts();
  },
};
