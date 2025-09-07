import mongoose from 'mongoose';
import pino from 'pino';
import { app } from './app';


const logger = pino();
const PORT = process.env.PORT || 3000;

const start = async () => {
  // Check required environment variables
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // Connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');

    // Start the server
    app.listen(PORT, () => {
      console.log('Server starting...');
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err: any) {
    logger.error('Startup error:', err);
    process.exit(1);
  }
};

start();