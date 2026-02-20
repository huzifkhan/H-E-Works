require('dotenv').config();
const { pool } = require('./db');

const addAttachmentsColumn = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if column exists, if not add it
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_submissions' 
      AND column_name = 'attachments'
    `);

    if (columnCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE contact_submissions 
        ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb
      `);
      console.log('✅ Added attachments column to contact_submissions');
    } else {
      console.log('ℹ️  attachments column already exists');
    }

    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully!');

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
  addAttachmentsColumn()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = addAttachmentsColumn;
