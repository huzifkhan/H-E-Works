require('dotenv').config();
const { pool } = require('./db');

const addLastLoginColumn = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if last_login column exists
    const columnCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'admins'
      AND column_name = 'last_login'
    `);

    if (columnCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE admins
        ADD COLUMN last_login TIMESTAMP WITH TIME ZONE
      `);
      console.log('✅ Added last_login column to admins table');
    } else {
      console.log('ℹ️  last_login column already exists');
    }

    await client.query('COMMIT');
    console.log('✅ Admin table migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during admin migration:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  addLastLoginColumn()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = addLastLoginColumn;
