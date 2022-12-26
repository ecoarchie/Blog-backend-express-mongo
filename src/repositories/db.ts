import { MongoClient } from 'mongodb';
import { BlogDBModel } from '../models/blogModel';
import { CommentDBModel } from '../models/commentModel';
import { PostDBModel } from '../models/postModel';
import { UserDBModel } from '../models/userModels';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(mongoUri);
const db = client.db('blogposts');

export const blogsCollection = db.collection<BlogDBModel>('blogs');
export const postsCollection = db.collection<PostDBModel>('posts');
export const usersCollection = db.collection<UserDBModel>('users');
export const commentsCollection = db.collection<CommentDBModel>('comments');

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
