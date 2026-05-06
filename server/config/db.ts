import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('🔗 Connected to external MongoDB');
    } else {
      console.log('🔄 No MONGODB_URI found. Starting in-memory MongoDB for zero-config setup...');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`🔗 Connected to in-memory MongoDB at ${mongoUri}`);
    }
    
    // Seed default users if database is empty
    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit process if we're in dev mode to allow UI to show errors
  }
};

const seedDatabase = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        leaveBalance: 0
      });
      console.log('✅ Seeded default admin (Email: admin@example.com | Pass: admin123)');
    }

    const empCount = await User.countDocuments({ role: 'employee' });
    if (empCount === 0) {
      const hashedPassword = await bcrypt.hash('emp123', 10);
      await User.create({
        name: 'Demo Employee',
        email: 'employee@example.com',
        password: hashedPassword,
        role: 'employee',
        leaveBalance: 20
      });
      console.log('✅ Seeded default employee (Email: employee@example.com | Pass: emp123)');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
