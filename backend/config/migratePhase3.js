require('dotenv').config();
const { pool } = require('./db');

const createPhase3Tables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create services table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'briefcase',
        image_url VARCHAR(500),
        category VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE,
        description TEXT,
        client_name VARCHAR(200),
        completion_date DATE,
        budget DECIMAL(12,2),
        category VARCHAR(100),
        location VARCHAR(300),
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create project_images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(500),
        display_order INTEGER DEFAULT 0,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create testimonials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(200) NOT NULL,
        client_title VARCHAR(200),
        company VARCHAR(200),
        client_image VARCHAR(500),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
        testimonial TEXT NOT NULL,
        project_type VARCHAR(100),
        is_approved BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
      CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);
      CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
      CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(is_active);
      CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
      CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
      CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
    `);

    // Insert sample services
    await client.query(`
      INSERT INTO services (title, description, icon, category, display_order, is_active) VALUES
      ('Engineering Consultation', 'Expert engineering advice and consultation for complex projects', 'settings', 'Engineering', 1, true),
      ('Project Management', 'End-to-end project management ensuring timely delivery', 'clipboard', 'Management', 2, true),
      ('Quality Assurance', 'Comprehensive QA testing and quality control processes', 'check-circle', 'Quality', 3, true),
      ('Technical Support', '24/7 technical support and maintenance services', 'headphones', 'Support', 4, true),
      ('Research & Development', 'Innovative R&D solutions for future-ready businesses', 'lightbulb', 'Research', 5, true),
      ('Risk Assessment', 'Thorough risk analysis and mitigation strategies', 'shield', 'Consulting', 6, true)
    `);

    // Insert sample testimonial
    await client.query(`
      INSERT INTO testimonials (client_name, client_title, company, rating, testimonial, project_type, is_approved, is_featured, display_order)
      VALUES (
        'Muhammad Ahmed',
        'CEO',
        'Tech Solutions Pvt Ltd',
        5,
        'H&E Works delivered exceptional results for our infrastructure project. Their team''s expertise and professionalism exceeded our expectations. Highly recommended!',
        'Infrastructure',
        true,
        true,
        1
      )
    `);

    await client.query('COMMIT');
    console.log('✅ Phase 3 tables created successfully!');
    console.log('📊 Created: services, projects, project_images, testimonials');
    console.log('📝 Sample data inserted');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating Phase 3 tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if called directly
if (require.main === module) {
  createPhase3Tables()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = createPhase3Tables;
