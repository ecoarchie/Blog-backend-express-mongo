import 'reflect-metadata';
import { Container } from 'inversify';
import { BlogsController } from './controllers/blog-controllers';
import { BlogsRepository } from './repositories/blogs-repository';
import { BlogsService } from './service/blog-service';
import { PostsService } from './service/post-service';
import { PostsRepository } from './repositories/posts-repository';
import { PostsController } from './controllers/post-controllers';
import { CommentController } from './controllers/comments-controllers';
import { CommentService } from './service/comments-service';
import { CommentRepository } from './repositories/comments-repository';
import { BlogsQueryRepository } from './repositories/queryRepositories/blogs.queryRepository';
import { PostsQueryRepository } from './repositories/queryRepositories/posts.queryRepository';

export const container = new Container();

container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository);
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository);

container.bind<CommentController>(CommentController).to(CommentController);
container.bind<CommentService>(CommentService).to(CommentService);
container.bind<CommentRepository>(CommentRepository).to(CommentRepository);
