import { BlogViewModel } from '../models/blogModel';
import { PostInputModel, PostViewModel } from '../models/postModel';
import { blogsRepository } from './blogs-repository';

let postsDB: Array<PostViewModel> = [
  {
    id: '1',
    title: 'Post 1',
    shortDescription: 'Description 1',
    content: 'Content of post 1',
    blogId: '1',
    blogName: 'Blog 1',
  },
  {
    id: '2',
    title: 'Post 2',
    shortDescription: 'Description 2',
    content: 'Content of post 2',
    blogId: '2',
    blogName: 'Blog 2',
  },
  {
    id: '3',
    title: 'Post 3',
    shortDescription: 'Description 3',
    content: 'Content of post 3',
    blogId: '1',
    blogName: 'Blog 1',
  },
];

export const postsRepository = {
  findPosts() {
    return postsDB;
  },

  createPost(data: PostInputModel): PostViewModel {
    const { title, shortDescription, content, blogId } = data;
    const blog = blogsRepository.findBlogById(blogId);
    //@ts-ignore: blog id is validated by middleware, so it is not undefined
    const blogName = blog.name;
    const newPost: PostViewModel = {
      id: (+new Date()).toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    };
    postsDB.push(newPost);
    return newPost;
  },

  findPostById(id: string): PostViewModel | undefined {
    const post: PostViewModel | undefined = postsDB.find((p) => p.id === id);
    return post;
  },

  updatePostById(id: string, newDatajson: PostInputModel): boolean {
    const postToUpdate: PostViewModel | undefined = postsDB.find((p) => p.id === id);
    if (!postToUpdate) return false;

    const postIndexToChange: number = postsDB.findIndex((p) => p.id === id);
    postsDB[postIndexToChange] = {
      ...postToUpdate,
      ...newDatajson,
    };
    return true;
  },

  deletePostById(id: string) {
    const postToDelete: PostViewModel | undefined = postsDB.find((p) => p.id === id);
    if (!postToDelete) {
      return false;
    } else {
      postsDB = postsDB.filter((p) => p.id !== id);
      return true;
    }
  },
};
