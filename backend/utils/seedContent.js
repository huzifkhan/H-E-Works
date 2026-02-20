require('dotenv').config();
const { pool } = require('../config/db');

const seedContent = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('🌱 Seeding website content...\n');

    // ============================================
    // 1. Services (24 services across 6 categories)
    // ============================================
    console.log('📦 Adding Services...');
    
    const services = [
      // Engineering (4 services)
      { title: 'Structural Engineering', description: 'Complete structural design and analysis for buildings, bridges, and infrastructure projects.', icon: 'Building', category: 'Engineering', display_order: 1 },
      { title: 'Civil Engineering', description: 'Comprehensive civil engineering solutions for infrastructure development and urban planning.', icon: 'Globe', category: 'Engineering', display_order: 2 },
      { title: 'Mechanical Engineering', description: 'Expert mechanical design and analysis for industrial and commercial applications.', icon: 'Settings', category: 'Engineering', display_order: 3 },
      { title: 'Electrical Engineering', description: 'Full-service electrical system design, power distribution, and control systems.', icon: 'Zap', category: 'Engineering', display_order: 4 },
      
      // Construction (4 services)
      { title: 'Construction Management', description: 'End-to-end construction management ensuring projects are delivered on time and within budget.', icon: 'HardHat', category: 'Construction', display_order: 5 },
      { title: 'General Contracting', description: 'Professional general contracting services for commercial and residential projects.', icon: 'Building', category: 'Construction', display_order: 6 },
      { title: 'Renovation & Remodeling', description: 'Transform your space with our expert renovation and remodeling services.', icon: 'Hammer', category: 'Construction', display_order: 7 },
      { title: 'Quality Control', description: 'Rigorous quality control and assurance throughout the construction process.', icon: 'CheckCircle', category: 'Construction', display_order: 8 },
      
      // Architecture (4 services)
      { title: 'Architectural Design', description: 'Creative and functional architectural design tailored to your vision and requirements.', icon: 'PenTool', category: 'Architecture', display_order: 9 },
      { title: 'Interior Design', description: 'Beautiful and functional interior spaces designed to enhance your lifestyle or business.', icon: 'Palette', category: 'Architecture', display_order: 10 },
      { title: 'Landscape Architecture', description: 'Sustainable and aesthetically pleasing outdoor space design.', icon: 'Tree', category: 'Architecture', display_order: 11 },
      { title: '3D Visualization', description: 'Photorealistic 3D renderings and virtual tours of your project.', icon: 'Box', category: 'Architecture', display_order: 12 },
      
      // Consulting (4 services)
      { title: 'Project Consulting', description: 'Expert guidance and consultation for complex construction and engineering projects.', icon: 'ClipboardCheck', category: 'Consulting', display_order: 13 },
      { title: 'Feasibility Studies', description: 'Comprehensive feasibility analysis to ensure your project\'s viability.', icon: 'FileText', category: 'Consulting', display_order: 14 },
      { title: 'Cost Estimation', description: 'Accurate cost estimation and budget planning for your construction projects.', icon: 'DollarSign', category: 'Consulting', display_order: 15 },
      { title: 'Risk Assessment', description: 'Identify and mitigate potential risks before they become problems.', icon: 'Shield', category: 'Consulting', display_order: 16 },
      
      // Planning (4 services)
      { title: 'Urban Planning', description: 'Strategic urban planning for sustainable community development.', icon: 'Map', category: 'Planning', display_order: 17 },
      { title: 'Site Analysis', description: 'Comprehensive site evaluation and analysis for optimal project placement.', icon: 'MapPin', category: 'Planning', display_order: 18 },
      { title: 'Environmental Impact', description: 'Environmental impact assessments and sustainable development planning.', icon: 'Leaf', category: 'Planning', display_order: 19 },
      { title: 'Zoning & Permits', description: 'Navigate zoning regulations and obtain necessary permits efficiently.', icon: 'FileCheck', category: 'Planning', display_order: 20 },
      
      // Maintenance (4 services)
      { title: 'Facility Management', description: 'Comprehensive facility management services for optimal building performance.', icon: 'Home', category: 'Maintenance', display_order: 21 },
      { title: 'Preventive Maintenance', description: 'Scheduled maintenance programs to extend the life of your assets.', icon: 'Tool', category: 'Maintenance', display_order: 22 },
      { title: 'Building Inspections', description: 'Thorough building inspections to identify issues and ensure compliance.', icon: 'Search', category: 'Maintenance', display_order: 23 },
      { title: 'Emergency Repairs', description: '24/7 emergency repair services for urgent maintenance needs.', icon: 'AlertTriangle', category: 'Maintenance', display_order: 24 },
    ];

    for (const service of services) {
      await client.query(
        `INSERT INTO services (title, description, icon, category, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT DO NOTHING`,
        [service.title, service.description, service.icon, service.category, service.display_order]
      );
    }
    console.log(`   ✅ Added ${services.length} services\n`);

    // ============================================
    // 2. Projects (18 projects across categories)
    // ============================================
    console.log('📦 Adding Projects...');
    
    const projects = [
      { title: 'Downtown Office Complex', description: 'A high-rise office building with a marvelous structural allocation and modern amenities.', client_name: 'Habib & Sons', completion_date: '2025-06-15', category: 'Commercial', location: 'Karachi, Pakistan', is_featured: true },
      { title: 'Riverside Residential Tower', description: 'Luxury residential tower with 50 floors offering panoramic river views.', client_name: 'Elite Builders', completion_date: '2025-03-20', category: 'Residential', location: 'Lahore, Pakistan', is_featured: true },
      { title: 'Industrial Warehouse Complex', description: 'State-of-the-art warehousing facility with automated storage systems.', client_name: 'Logistics Corp', completion_date: '2024-11-10', category: 'Industrial', location: 'Faisalabad, Pakistan', is_featured: true },
      { title: 'City Bridge Reconstruction', description: 'Major bridge reconstruction project improving city connectivity.', client_name: 'City Development Authority', completion_date: '2024-08-25', category: 'Infrastructure', location: 'Islamabad, Pakistan', is_featured: true },
      { title: 'Green Valley Housing Society', description: 'Sustainable housing development with 500+ residential units.', client_name: 'Green Valley Developers', completion_date: '2024-05-15', category: 'Residential', location: 'Peshawar, Pakistan', is_featured: false },
      { title: 'Tech Park Office Building', description: 'Modern office complex designed for tech companies with smart building features.', client_name: 'Tech Ventures', completion_date: '2024-02-28', category: 'Commercial', location: 'Karachi, Pakistan', is_featured: true },
      { title: 'Highway Expansion Project', description: 'Major highway expansion reducing traffic congestion in the metropolitan area.', client_name: 'National Highway Authority', completion_date: '2023-12-10', category: 'Infrastructure', location: 'Lahore-Islamabad Motorway', is_featured: false },
      { title: 'Shopping Mall Renovation', description: 'Complete renovation and modernization of existing shopping complex.', client_name: 'Metro Malls', completion_date: '2023-09-05', category: 'Commercial', location: 'Rawalpindi, Pakistan', is_featured: false },
      { title: 'Solar Power Plant', description: '50MW solar power plant providing clean energy to 25,000 homes.', client_name: 'Renewable Energy Corp', completion_date: '2023-06-20', category: 'Industrial', location: 'Bahawalpur, Pakistan', is_featured: true },
      { title: 'University Science Block', description: 'State-of-the-art science and research facility for university students.', client_name: 'Punjab University', completion_date: '2023-03-15', category: 'Public Works', location: 'Lahore, Pakistan', is_featured: false },
      { title: 'Hospital Expansion', description: 'Major hospital expansion adding 200 beds and advanced medical facilities.', client_name: 'Aga Khan Hospital', completion_date: '2022-11-30', category: 'Public Works', location: 'Karachi, Pakistan', is_featured: false },
      { title: 'Water Treatment Plant', description: 'Modern water treatment facility serving 100,000 residents.', client_name: 'Water & Sewerage Board', completion_date: '2022-08-10', category: 'Infrastructure', location: 'Multan, Pakistan', is_featured: false },
      { title: 'Luxury Villa Complex', description: 'Exclusive villa development with premium amenities and security.', client_name: 'Private Developer', completion_date: '2022-05-25', category: 'Residential', location: 'Islamabad, Pakistan', is_featured: false },
      { title: 'Factory Automation Upgrade', description: 'Complete automation upgrade for manufacturing facility.', client_name: 'Pakistan Steel Mills', completion_date: '2022-02-15', category: 'Industrial', location: 'Karachi, Pakistan', is_featured: false },
      { title: 'Sports Complex', description: 'Multi-sport facility with stadium, swimming pool, and gymnasium.', client_name: 'Sports Board Punjab', completion_date: '2021-11-20', category: 'Public Works', location: 'Lahore, Pakistan', is_featured: false },
      { title: 'Metro Bus Station', description: 'Modern metro bus terminal with capacity for 10,000 daily passengers.', client_name: 'Punjab Mass Transit', completion_date: '2021-08-05', category: 'Infrastructure', location: 'Rawalpindi, Pakistan', is_featured: false },
      { title: 'Corporate Headquarters', description: 'LEED-certified corporate headquarters with sustainable design features.', client_name: 'Engro Corporation', completion_date: '2021-05-10', category: 'Commercial', location: 'Karachi, Pakistan', is_featured: true },
      { title: 'Affordable Housing Project', description: 'Government-subsidized affordable housing for 1,000 families.', client_name: 'NAYA Pakistan', completion_date: '2021-02-28', category: 'Residential', location: 'Gwadar, Pakistan', is_featured: false },
    ];

    for (const project of projects) {
      const result = await client.query(
        `INSERT INTO projects (title, description, client_name, completion_date, category, location, is_featured, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)
         RETURNING id`,
        [project.title, project.description, project.client_name, project.completion_date, project.category, project.location, project.is_featured]
      );
      
      const projectId = result.rows[0].id;
      
      // Add 2-3 placeholder images per project
      const imageCount = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < imageCount; i++) {
        await client.query(
          `INSERT INTO project_images (project_id, image_url, caption, display_order)
           VALUES ($1, $2, $3, $4)`,
          [projectId, `/placeholder-project-${projectId}-${i + 1}.jpg`, `${project.title} - View ${i + 1}`, i]
        );
      }
    }
    console.log(`   ✅ Added ${projects.length} projects with images\n`);

    // ============================================
    // 3. Testimonials (24 testimonials)
    // ============================================
    console.log('📦 Adding Testimonials...');
    
    const testimonials = [
      { client_name: 'Muhammad Ahmed', client_title: 'CEO', company: 'Habib & Sons', rating: 5, testimonial: 'Excellent work on our office complex. The team demonstrated exceptional professionalism and delivered ahead of schedule.' },
      { client_name: 'Sarah Johnson', client_title: 'Project Director', company: 'Elite Builders', rating: 5, testimonial: 'Outstanding quality and attention to detail. H&E Works transformed our vision into reality.' },
      { client_name: 'Ali Khan', client_title: 'Operations Manager', company: 'Logistics Corp', rating: 5, testimonial: 'The warehouse complex exceeded our expectations. Highly recommend their services.' },
      { client_name: 'Fatima Sheikh', client_title: 'Commissioner', company: 'City Development Authority', rating: 5, testimonial: 'Professional team with excellent project management skills. The bridge reconstruction was completed with minimal disruption.' },
      { client_name: 'Hassan Mahmood', client_title: 'Managing Director', company: 'Green Valley Developers', rating: 5, testimonial: 'Exceptional work on our housing society. The quality and finishing are top-notch.' },
      { client_name: 'Ayesha Malik', client_title: 'CTO', company: 'Tech Ventures', rating: 5, testimonial: 'Our tech park is now a landmark building. H&E Works understood our requirements perfectly.' },
      { client_name: 'Imran Qureshi', client_title: 'Chairman', company: 'National Highway Authority', rating: 4, testimonial: 'Great work on the highway expansion. Traffic flow has improved significantly.' },
      { client_name: 'Zainab Abbas', client_title: 'Property Manager', company: 'Metro Malls', rating: 5, testimonial: 'The renovation transformed our mall into a modern shopping destination. Excellent work!' },
      { client_name: 'Dr. Rashid Patel', client_title: 'Director', company: 'Renewable Energy Corp', rating: 5, testimonial: 'Impressive engineering expertise. The solar plant is operating at peak efficiency.' },
      { client_name: 'Prof. Nasreen Akhtar', client_title: 'Vice Chancellor', company: 'Punjab University', rating: 5, testimonial: 'The science block is a magnificent addition to our campus. Students love the modern facilities.' },
      { client_name: 'Dr. Omar Farooq', client_title: 'Medical Director', company: 'Aga Khan Hospital', rating: 5, testimonial: 'Professional handling of our hospital expansion. Minimal disruption to ongoing operations.' },
      { client_name: 'Engineer Khalid Raza', client_title: 'Chief Engineer', company: 'Water & Sewerage Board', rating: 5, testimonial: 'The water treatment plant has significantly improved water quality for our residents.' },
      { client_name: 'Nadia Hussain', client_title: 'Developer', company: 'Private Developer', rating: 5, testimonial: 'Luxury and quality combined. Our villa complex is selling faster than expected.' },
      { client_name: 'Shahid Afridi', client_title: 'Plant Manager', company: 'Pakistan Steel Mills', rating: 4, testimonial: 'Automation upgrade has improved our productivity by 40%. Great technical expertise.' },
      { client_name: 'Asad Rauf', client_title: 'Director', company: 'Sports Board Punjab', rating: 5, testimonial: 'World-class sports facilities. The complex has hosted several national events successfully.' },
      { client_name: 'Maria Saeed', client_title: 'Project Lead', company: 'Punjab Mass Transit', rating: 5, testimonial: 'Efficient execution of the metro station. Commuters appreciate the modern amenities.' },
      { client_name: 'Tariq Jamil', client_title: 'CFO', company: 'Engro Corporation', rating: 5, testimonial: 'Our LEED-certified headquarters is a testament to H&E Works\' commitment to excellence.' },
      { client_name: 'Bilal Ahmed', client_title: 'Director', company: 'NAYA Pakistan', rating: 5, testimonial: 'Providing quality homes to deserving families. Thank you for your dedication.' },
      { client_name: 'Rubina Ali', client_title: 'Homeowner', company: null, rating: 5, testimonial: 'Our home renovation was handled professionally. The team respected our timeline and budget.' },
      { client_name: 'Faisal Qazi', client_title: 'Business Owner', company: 'Qazi Enterprises', rating: 5, testimonial: 'H&E Works delivered our factory project on time and within budget. Exceptional service!' },
      { client_name: 'Samina Yasmeen', client_title: 'Architect', company: 'Design Studio', rating: 5, testimonial: 'Great collaboration on complex architectural designs. They brought our vision to life.' },
      { client_name: 'Junaid Akram', client_title: 'Investment Manager', company: 'Property Investors', rating: 4, testimonial: 'Solid construction quality and good project management. Would work with them again.' },
      { client_name: 'Kiran Naz', client_title: 'Facility Manager', company: 'Corporate Towers', rating: 5, testimonial: 'Ongoing maintenance services have kept our building in perfect condition.' },
      { client_name: 'Waseem Akhtar', client_title: 'Mayor', company: 'Karachi Metropolitan', rating: 5, testimonial: 'Infrastructure projects completed with excellence. Great partner for city development.' },
    ];

    for (const testimonial of testimonials) {
      await client.query(
        `INSERT INTO testimonials (client_name, client_title, company, rating, testimonial, is_approved, display_order)
         VALUES ($1, $2, $3, $4, $5, true, $6)`,
        [testimonial.client_name, testimonial.client_title, testimonial.company, testimonial.rating, testimonial.testimonial, testimonials.indexOf(testimonial) + 1]
      );
    }
    console.log(`   ✅ Added ${testimonials.length} testimonials\n`);

    await client.query('COMMIT');
    
    console.log('✅ Content seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Projects: ${projects.length} (with images)`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log('\n✨ Website content is now ready!\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error during content seeding:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run if called directly
if (require.main === module) {
  seedContent()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedContent;
