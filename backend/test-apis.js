const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('=== Testing Admin Login ===\n');
  
  try {
    // Test login
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@business.com',
      password: 'admin123'
    });
    
    console.log('Login Response:', loginRes.data.success ? '✅ Success' : '❌ Failed');
    const token = loginRes.data.data?.token;
    
    if (!token) {
      console.log('❌ No token received. Full response:', JSON.stringify(loginRes.data, null, 2));
      return;
    }
    
    console.log('Token received: ✅\n');
    
    const headers = { Authorization: `Bearer ${token}` };
    
    // Test protected endpoints
    const tests = [
      { name: 'Analytics Dashboard', url: '/analytics/dashboard' },
      { name: 'Analytics Overview', url: '/analytics/overview?period=30days' },
      { name: 'Analytics Conversion', url: '/analytics/conversion?period=30days' },
      { name: 'Admin Services', url: '/services/admin/all' },
      { name: 'Admin Projects', url: '/projects/admin/all' },
      { name: 'Admin Testimonials', url: '/testimonials/admin/all' },
      { name: 'Submissions Stats', url: '/submissions/stats' },
    ];
    
    console.log('=== Testing Protected Endpoints ===\n');
    
    for (const test of tests) {
      try {
        const res = await axios.get(`${API_URL}${test.url}`, { headers });
        console.log(`✅ ${test.name}: ${res.data.success ? 'Success' : 'Failed'}`);
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n=== Testing Public Endpoints ===\n');
    
    const publicTests = [
      { name: 'Services', url: '/services' },
      { name: 'Projects', url: '/projects' },
      { name: 'Testimonials', url: '/testimonials' },
      { name: 'Services Categories', url: '/projects/categories' },
    ];
    
    for (const test of publicTests) {
      try {
        const res = await axios.get(`${API_URL}${test.url}`);
        console.log(`✅ ${test.name}: ${res.data.success ? 'Success' : 'Failed'}`);
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n=== All Tests Complete ===\n');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAPIs();
