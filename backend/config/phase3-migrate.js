require('dotenv').config();
const { pool } = require('./db');

const phase3Migration = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ============================================
    // 1. Services Table
    // ============================================
    const createServicesTable = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        image_url VARCHAR(500),
        category VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ============================================
    // 2. Projects Table
    // ============================================
    const createProjectsTable = `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        client_name VARCHAR(200),
        completion_date DATE,
        budget DECIMAL(10,2),
        category VARCHAR(100),
        location VARCHAR(200),
        duration VARCHAR(100),
        is_featured BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ============================================
    // 3. Project Images Table
    // ============================================
    const createProjectImagesTable = `
      CREATE TABLE IF NOT EXISTS project_images (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(500),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ============================================
    // 4. Testimonials Table
    // ============================================
    const createTestimonialsTable = `
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(200) NOT NULL,
        client_title VARCHAR(200),
        company VARCHAR(200),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
        testimonial TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // ============================================
    // 5. Create indexes for better performance
    // ============================================
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
      CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
      CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
      
      CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
      CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
      CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
      CREATE INDEX IF NOT EXISTS idx_projects_completion_date ON projects(completion_date);
      
      CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
      CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(display_order);
      
      CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
      CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
      CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);
    `;

    // ============================================
    // 6. Create function to update updated_at timestamp
    // ============================================
    const createUpdatedAtFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    // ============================================
    // 7. Create triggers for updated_at
    // ============================================
    const createTriggers = `
      DROP TRIGGER IF EXISTS update_services_updated_at ON services;
      CREATE TRIGGER update_services_updated_at
        BEFORE UPDATE ON services
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
      CREATE TRIGGER update_projects_updated_at
        BEFORE UPDATE ON projects
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
      CREATE TRIGGER update_testimonials_updated_at
        BEFORE UPDATE ON testimonials
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    // ============================================
    // 8. Insert sample data (optional - for testing)
    // ============================================
    const insertSampleData = `
      -- Sample Services
      INSERT INTO services (title, description, icon, category, display_order, is_active)
      VALUES 
        ('Construction Management', 'Professional construction management services for commercial and residential projects.', 'Building', 'Construction', 1, true),
        ('Interior Design', 'Creative interior design solutions tailored to your style and budget.', 'Palette', 'Design', 2, true),
        ('Renovation', 'Complete renovation services to transform your space.', 'Hammer', 'Construction', 3, true),
        ('Consulting', 'Expert consulting services for your building projects.', 'ClipboardCheck', 'Consulting', 4, true)
      ON CONFLICT DO NOTHING;

      -- Sample Testimonials
      INSERT INTO testimonials (client_name, client_title, company, rating, testimonial, is_approved, display_order)
      VALUES 
        ('John Smith', 'CEO', 'Tech Corp', 5, 'Excellent work on our office renovation. The team was professional and delivered on time.', true, 1),
        ('Sarah Johnson', 'Homeowner', null, 5, 'Transformed our home beyond our expectations. Highly recommended!', true, 2),
        ('Michael Brown', 'Project Manager', 'BuildCo', 4, 'Great construction management skills. Very detail-oriented.', true, 3)
      ON CONFLICT DO NOTHING;
    `;

    // Execute all migrations
    console.log('🔧 Running Phase 3 migration...');

    await client.query(createServicesTable);
    console.log('✅ Created services table');

    await client.query(createProjectsTable);
    console.log('✅ Created projects table');

    await client.query(createProjectImagesTable);
    console.log('✅ Created project_images table');

    await client.query(createTestimonialsTable);
    console.log('✅ Created testimonials table');

    await client.query(createIndexes);
    console.log('✅ Created indexes');

    await client.query(createUpdatedAtFunction);
    console.log('✅ Created update_updated_at_column function');

    await client.query(createTriggers);
    console.log('✅ Created triggers');

    await client.query(insertSampleData);
    console.log('✅ Inserted sample data');

    await client.query('COMMIT');
    console.log('✅ Phase 3 migration completed successfully!');
    console.log('\n📊 Tables created:');
    console.log('   - services');
    console.log('   - projects');
    console.log('   - project_images');
    console.log('   - testimonials');

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
  phase3Migration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = phase3Migration;
