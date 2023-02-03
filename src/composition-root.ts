import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogsController } from './controllers/blog-controllers';
import { BlogsRepository } from './repositories/blogs-repository';
import { BlogsService } from './service/blog-service';
import { PostsService } from './service/post-service';
import { PostsRepository } from './repositories/posts-repository';
import { PostsController } from './controllers/post-controllers';

// const blogsRepository = new BlogsRepository();
// const blogsService = new BlogsService(blogsRepository);
// export const blogsController = new BlogsController(blogsService);

export const container = new Container();

container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);
container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
