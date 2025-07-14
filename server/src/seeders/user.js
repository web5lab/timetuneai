import mongoose from 'mongoose';
import { Admin } from '../../schemas/index.js';
import connectDB from '../config/db.js';

const defaultAdmin = {
  username: 'admin',
  email: 'admin@xxxgaminghub.com',
  password: 'admin123456', // Will be hashed automatically
  firstName: 'Admin',
  lastName: 'User',
  role: 'super_admin',
  permissions: [
    {
      module: 'users',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'rewards',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'pricing',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'airdrops',
      actions: ['read', 'create', 'update', 'delete', 'execute']
    },
    {
      module: 'referrals',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'social_tasks',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'spin_board',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'transactions',
      actions: ['read', 'create', 'update', 'delete']
    },
    {
      module: 'analytics',
      actions: ['read']
    },
    {
      module: 'settings',
      actions: ['read', 'update']
    },
    {
      module: 'admin_management',
      actions: ['read', 'create', 'update', 'delete']
    }
  ],
  isActive: true,
  isVerified: true
};

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(defaultAdmin.email);
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create default admin
    const admin = new Admin(defaultAdmin);
    await admin.save();
    
    console.log('✅ Default admin user created successfully');
    console.log('📧 Email:', defaultAdmin.email);
    console.log('🔑 Password:', 'admin123456');
    console.log('⚠️  Please change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();