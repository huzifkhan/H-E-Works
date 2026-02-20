require('dotenv').config();
const { pool } = require('./db');

const runAllMigrations = async () => {
  console.log('🚀 Running all database migrations...\n');
  
  const client = await pool.connect();
  
  try {
    // 1. Run initDB (base tables)
    console.log('📦 Step 1/4: Running base initialization...');
    const createTables = require('./initDB');
    await createTables();
    console.log('✅ Base tables created\n');
    
    // 2. Add last_login to admins
    console.log('📦 Step 2/4: Adding last_login column...');
    const adminCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'admins' AND column_name = 'last_login'
    `);
    if (adminCheck.rows.length === 0) {
      await client.query('ALTER TABLE admins ADD COLUMN last_login TIMESTAMP WITH TIME ZONE');
      console.log('✅ Added last_login to admins');
    } else {
      console.log('ℹ️  last_login already exists');
    }
    
    // 3. Add replied_at to contact_submissions
    console.log('\n📦 Step 3/4: Adding replied_at column...');
    const repliedAtCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'contact_submissions' AND column_name = 'replied_at'
    `);
    if (repliedAtCheck.rows.length === 0) {
      await client.query('ALTER TABLE contact_submissions ADD COLUMN replied_at TIMESTAMP WITH TIME ZONE');
      console.log('✅ Added replied_at to contact_submissions');
    } else {
      console.log('ℹ️  replied_at already exists');
    }
    
    // 4. Run Phase 3 migration
    console.log('\n📦 Step 4/4: Running Phase 3 migration...');
    const phase3Migrate = require('./phase3-migrate');
    await phase3Migrate();
    
    console.log('\n✅ All migrations completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - admins table: ✅ (with last_login)');
    console.log('   - contact_submissions table: ✅ (with replied_at)');
    console.log('   - services table: ✅');
    console.log('   - projects table: ✅');
    console.log('   - project_images table: ✅');
    console.log('   - testimonials table: ✅');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runAllMigrations()
    .then(() => {
      console.log('\n✨ Database is ready!\n');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runAllMigrations;
