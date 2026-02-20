const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testPublicAPIs() {
  console.log('=== Testing Public APIs for Website ===\n');
  
  try {
    // Test Services
    console.log('1. Services API:');
    const servicesRes = await axios.get(`${API_URL}/services`);
    console.log('   Success:', servicesRes.data.success);
    console.log('   Count:', servicesRes.data.data?.length);
    if (servicesRes.data.data?.length > 0) {
      console.log('   First service:', servicesRes.data.data[0].title);
      console.log('   Sample:', JSON.stringify(servicesRes.data.data[0], null, 2));
    }
    
    // Test Projects
    console.log('\n2. Projects API:');
    const projectsRes = await axios.get(`${API_URL}/projects`);
    console.log('   Success:', projectsRes.data.success);
    console.log('   Count:', projectsRes.data.data?.length);
    if (projectsRes.data.data?.length > 0) {
      console.log('   First project:', projectsRes.data.data[0].title);
      console.log('   Has images:', projectsRes.data.data[0].images?.length > 0);
    }
    
    // Test Testimonials
    console.log('\n3. Testimonials API:');
    const testimonialsRes = await axios.get(`${API_URL}/testimonials`);
    console.log('   Success:', testimonialsRes.data.success);
    console.log('   Count:', testimonialsRes.data.data?.length);
    if (testimonialsRes.data.data?.length > 0) {
      console.log('   First testimonial:', testimonialsRes.data.data[0].client_name);
    }
    
    console.log('\n✅ All APIs are working correctly!\n');
    console.log('If data is not showing on the website, check:');
    console.log('1. Browser console for JavaScript errors');
    console.log('2. Network tab to see if API calls are being made');
    console.log('3. React component state (use React DevTools)');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

testPublicAPIs();
