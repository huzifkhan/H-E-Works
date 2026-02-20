require('dotenv').config();
const { pool } = require('./config/db');

(async () => {
  const client = await pool.connect();
  try {
    console.log('=== DATABASE STATUS ===\n');
    
    const tables = [
      { name: 'admins', label: 'Admins' },
      { name: 'admin_profiles', label: 'Admin Profiles' },
      { name: 'contact_submissions', label: 'Submissions' },
      { name: 'services', label: 'Services' },
      { name: 'projects', label: 'Projects' },
      { name: 'project_images', label: 'Project Images' },
      { name: 'testimonials', label: 'Testimonials' },
      { name: 'activity_logs', label: 'Activity Logs' },
      { name: 'password_reset_tokens', label: 'Password Tokens' },
      { name: 'notification_queue', label: 'Notification Queue' },
    ];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table.name}`);
      console.log(`✅ ${table.label}: ${result.rows[0].count} records`);
    }
    
    console.log('\n=== ADMIN ACCOUNTS ===');
    const admins = await client.query('SELECT id, name, email, role, is_active FROM admins ORDER BY id');
    admins.rows.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email}) - ${admin.role} - ${admin.is_active ? 'Active' : 'Inactive'}`);
    });
    
    console.log('\n=== RECENT ACTIVITY ===');
    const logs = await client.query(`
      SELECT action, entity_type, created_at 
      FROM activity_logs 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    logs.rows.forEach(log => {
      console.log(`   - ${log.action} (${log.entity_type}) - ${new Date(log.created_at).toLocaleString()}`);
    });
    
  } finally {
    client.release();
  }
})();
