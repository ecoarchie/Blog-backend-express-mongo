import { BlogsController } from './controllers/blog-controllers';
import { BlogsRepository } from './repositories/blogs-repository';
import { BlogsService } from './service/blog-service';

const blogsRepository = new BlogsRepository();
const blogsService = new BlogsService(blogsRepository);
export const blogsController = new BlogsController(blogsService);
