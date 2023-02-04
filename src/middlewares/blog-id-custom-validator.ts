import { body } from 'express-validator';
import { BlogsQueryRepository } from '../repositories/queryRepositories/blogs.queryRepository';

const blogsQueryRepository = new BlogsQueryRepository();
export const isValidBlogId = body('blogId')
  .exists()
  .withMessage('Post ID is required')
  .custom(async (id) => {
    if (!(await blogsQueryRepository.getBlogById(id))) {
      throw new Error("Blog with this ID doesn't exist");
    }
    return true;
  });
