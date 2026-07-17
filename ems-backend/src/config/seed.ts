import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Employee from '../models/Employee';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');

    const existingAdmin = await Employee.findOne({ role: 'Super Admin' });
    if (existingAdmin) {
      console.log('Super Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const superAdmin = new Employee({
      employeeId: 'EMP001',
      name: 'System Admin',
      email: 'admin@ems.com',
      passwordHash,
      phone: '1234567890',
      department: 'IT',
      designation: 'Super Administrator',
      salary: 150000,
      joiningDate: new Date(),
      status: 'Active',
      role: 'Super Admin',
      reportingManager: null
    });

    await superAdmin.save();
    console.log('Super Admin seeded successfully! Email: admin@ems.com, Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedSuperAdmin();