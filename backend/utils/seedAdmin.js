require('dotenv').config();
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  const client = await pool.connect();
  
  try {
    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT id, email FROM admins WHERE email = $1',
      ['admin@business.com']
    );
    
    if (existingAdmin.rows.length > 0) {
      console.log('ℹ️  Admin already exists. Skipping seed.');
      console.log('📧 Email: admin@business.com');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin
    await client.query(
      `INSERT INTO admins (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, $4, $5)`,
      ['Admin User', 'admin@business.com', hashedPassword, 'super-admin', true]
    );

    console.log('✅ Default admin created successfully!');
    console.log('📧 Email: admin@business.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedAdmin();
