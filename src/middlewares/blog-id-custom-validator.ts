import { body } from 'express-validator';
import { BlogsRepository } from '../repositories/blogs-repository';

const blogsRepository = new BlogsRepository();
export const isValidBlogId = body('blogId')
  .exists()
  .withMessage('Post ID is required')
  .custom(async (id) => {
    if (!(await blogsRepository.findBlogById(id))) {
      throw new Error("Blog with this ID doesn't exist");
    }
    return true;
  });
