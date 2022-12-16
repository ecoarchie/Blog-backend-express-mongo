import { MongoClient } from 'mongodb';
import { BlogViewModel } from '../models/blogModel';
import { PostViewModel } from '../models/postModel';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(mongoUri);
const db = client.db();

export const blogsCollection = db.collection<BlogViewModel>('blogs');
export const postsCollection = db.collection<PostViewModel>('posts');

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
