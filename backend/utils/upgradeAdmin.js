require('dotenv').config();
const { pool } = require('../config/db');

const upgradeAdmin = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update the first admin to super-admin
    const result = await client.query(`
      UPDATE admins 
      SET role = 'super-admin' 
      WHERE id = 1
      RETURNING id, name, email, role
    `);

    if (result.rows.length > 0) {
      console.log('✅ Admin upgraded successfully!');
      console.log('   Admin:', result.rows[0]);
    } else {
      console.log('ℹ️  No admin found with ID 1');
    }

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  upgradeAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = upgradeAdmin;
