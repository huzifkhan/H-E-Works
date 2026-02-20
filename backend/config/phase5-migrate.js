require('dotenv').config();
const { pool } = require('./db');

const phase5Migration = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🔧 Running Phase 5 migration...\n');

    // ============================================
    // 1. Enhance password_reset_tokens table
    // ============================================
    console.log('📦 Step 1: Enhancing password_reset_tokens table...');
    
    const usedAtCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'password_reset_tokens' AND column_name = 'used_at'
    `);
    
    if (usedAtCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE password_reset_tokens 
        ADD COLUMN used_at TIMESTAMP WITH TIME ZONE,
        ADD COLUMN ip_address VARCHAR(50)
      `);
      console.log('   ✅ Added used_at and ip_address columns');
    } else {
      console.log('   ℹ️  Columns already exist');
    }

    // ============================================
    // 2. Create admin_profiles table
    // ============================================
    console.log('\n📦 Step 2: Creating admin_profiles table...');
    
    const profilesCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'admin_profiles'
    `);
    
    if (profilesCheck.rows.length === 0) {
      await client.query(`
        CREATE TABLE admin_profiles (
          id SERIAL PRIMARY KEY,
          admin_id INTEGER UNIQUE REFERENCES admins(id) ON DELETE CASCADE,
          avatar_url VARCHAR(500),
          phone VARCHAR(50),
          department VARCHAR(100),
          bio TEXT,
          notification_preferences JSONB DEFAULT '{"email": true, "weekly_digest": true, "new_submission": true}',
          timezone VARCHAR(50) DEFAULT 'UTC',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ Created admin_profiles table');
      
      // Create index
      await client.query(`
        CREATE INDEX idx_admin_profiles_admin_id ON admin_profiles(admin_id)
      `);
      console.log('   ✅ Created index on admin_id');
    } else {
      console.log('   ℹ️  Table already exists');
    }

    // ============================================
    // 3. Create notification_queue table
    // ============================================
    console.log('\n📦 Step 3: Creating notification_queue table...');
    
    const queueCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name = 'notification_queue'
    `);
    
    if (queueCheck.rows.length === 0) {
      await client.query(`
        CREATE TABLE notification_queue (
          id SERIAL PRIMARY KEY,
          admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL,
          subject VARCHAR(200),
          body TEXT,
          metadata JSONB DEFAULT '{}'::jsonb,
          is_sent BOOLEAN DEFAULT false,
          sent_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ Created notification_queue table');
      
      // Create indexes
      await client.query(`
        CREATE INDEX idx_notification_queue_admin_id ON notification_queue(admin_id);
        CREATE INDEX idx_notification_queue_is_sent ON notification_queue(is_sent);
        CREATE INDEX idx_notification_queue_created_at ON notification_queue(created_at DESC)
      `);
      console.log('   ✅ Created indexes');
    } else {
      console.log('   ℹ️  Table already exists');
    }

    // ============================================
    // 4. Enhance activity_logs table
    // ============================================
    console.log('\n📦 Step 4: Enhancing activity_logs table...');
    
    const sessionCheck = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'activity_logs' AND column_name = 'session_id'
    `);
    
    if (sessionCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE activity_logs 
        ADD COLUMN session_id VARCHAR(100),
        ADD COLUMN entity_name VARCHAR(100)
      `);
      console.log('   ✅ Added session_id and entity_name columns');
    } else {
      console.log('   ℹ️  Columns already exist');
    }

    // ============================================
    // 5. Create function to update updated_at
    // ============================================
    console.log('\n📦 Step 5: Creating trigger for admin_profiles...');
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON admin_profiles;
      CREATE TRIGGER update_admin_profiles_updated_at
        BEFORE UPDATE ON admin_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log('   ✅ Created updated_at trigger');

    // ============================================
    // 6. Insert sample admin profiles for existing admins
    // ============================================
    console.log('\n📦 Step 6: Creating profiles for existing admins...');
    
    await client.query(`
      INSERT INTO admin_profiles (admin_id, avatar_url, phone, department, bio)
      SELECT id, NULL, NULL, 'Administration', 'Admin account'
      FROM admins
      WHERE id NOT IN (SELECT admin_id FROM admin_profiles)
    `);
    console.log('   ✅ Created profiles for existing admins');

    // ============================================
    // 7. Update role constraint to include new roles
    // ============================================
    console.log('\n📦 Step 7: Updating role constraint...');
    
    // Drop old constraint if exists
    await client.query(`
      ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_role_check
    `);
    
    // Add new constraint with all roles
    await client.query(`
      ALTER TABLE admins 
      ADD CONSTRAINT admins_role_check 
      CHECK (role IN ('super-admin', 'admin', 'viewer', 'manager'))
    `);
    console.log('   ✅ Updated role constraint');

    await client.query('COMMIT');
    
    console.log('\n✅ Phase 5 migration completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - password_reset_tokens: Enhanced with used_at, ip_address');
    console.log('   - admin_profiles: Created');
    console.log('   - notification_queue: Created');
    console.log('   - activity_logs: Enhanced');
    console.log('   - Role system: Updated (super-admin, admin, manager, viewer)');
    console.log('\n✨ Database is ready for Phase 5 features!\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error during Phase 5 migration:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  phase5Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = phase5Migration;
