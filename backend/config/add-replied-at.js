require('dotenv').config();
const { pool } = require('./db');

const addRepliedAtColumn = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if replied_at column exists
    const columnCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'contact_submissions'
      AND column_name = 'replied_at'
    `);

    if (columnCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE contact_submissions
        ADD COLUMN replied_at TIMESTAMP WITH TIME ZONE
      `);
      console.log('✅ Added replied_at column to contact_submissions');
    } else {
      console.log('ℹ️  replied_at column already exists');
    }

    await client.query('COMMIT');
    console.log('✅ Contact submissions table migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  addRepliedAtColumn()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = addRepliedAtColumn;
