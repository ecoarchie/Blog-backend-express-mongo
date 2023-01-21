import { MongoClient } from 'mongodb';
import { BlogDBModel } from '../models/blogModel';
import { CommentDBModel, CommentLikesDBModel } from '../models/commentModel';
import { PostDBModel } from '../models/postModel';
import { TokenDBModel } from '../models/tokenModels';
import { UserDBModel } from '../models/userModels';
import { UserSessionModel } from '../models/UserSessionModel';
import { UsersLikesDBModel } from '../models/likeModel';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(mongoUri);
const db = client.db('blogposts');

export const blogsCollection = db.collection<BlogDBModel>('blogs');
export const postsCollection = db.collection<PostDBModel>('posts');
export const usersCollection = db.collection<UserDBModel>('users');
export const commentsCollection = db.collection<CommentDBModel>('comments');
export const tokensCollection = db.collection<TokenDBModel>('tokens');
export const userSessionCollection = db.collection<UserSessionModel>('sessions');
export const userLikesCollection = db.collection<UsersLikesDBModel>('usersLikes');
export const commentLikesCollection =
  db.collection<CommentLikesDBModel>('commentLikes');

export async function runDb() {
  try {
    await client.connect();
    await client.db('blogposts').command({ ping: 1 });
    console.log('Connected successfully to Mongo Server');
  } catch {
    console.log('Cannot connect to db');

    await client.close();
  }
}
