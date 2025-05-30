import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  await new Promise<void>((resolve, reject) => {
    const db = mongoose.connection;
    db.once('open', () => resolve());
    db.on('error', (err) => reject(err));
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
