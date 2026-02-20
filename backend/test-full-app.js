const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5174';

async function runAllTests() {
  console.log('=== COMPREHENSIVE APPLICATION TEST ===\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Backend Health
  console.log('1. Testing Backend Health...');
  try {
    const res = await axios.get(`${API_URL}/health`);
    if (res.data.status === 'OK') {
      console.log('   ✅ Backend is running\n');
      passed++;
    } else {
      console.log('   ❌ Backend health check failed\n');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Backend not reachable:', error.message, '\n');
    failed++;
  }
  
  // Test 2: Frontend Health
  console.log('2. Testing Frontend Health...');
  try {
    const res = await axios.get(FRONTEND_URL);
    if (res.status === 200) {
      console.log('   ✅ Frontend is running\n');
      passed++;
    } else {
      console.log('   ❌ Frontend health check failed\n');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Frontend not reachable:', error.message, '\n');
    failed++;
  }
  
  // Test 3: Public APIs
  console.log('3. Testing Public APIs...');
  const publicEndpoints = [
    { name: 'Services', url: '/services' },
    { name: 'Projects', url: '/projects' },
    { name: 'Testimonials', url: '/testimonials' },
    { name: 'Project Categories', url: '/projects/categories' },
  ];
  
  for (const endpoint of publicEndpoints) {
    try {
      const res = await axios.get(`${API_URL}${endpoint.url}`);
      if (res.data.success) {
        console.log(`   ✅ ${endpoint.name}: ${res.data.data?.length || 'N/A'} items`);
        passed++;
      } else {
        console.log(`   ❌ ${endpoint.name}: Failed`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error.message}`);
      failed++;
    }
  }
  console.log('');
  
  // Test 4: Admin Login
  console.log('4. Testing Admin Login...');
  let token = null;
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@business.com',
      password: 'admin123'
    });
    
    if (res.data.success && res.data.data?.token) {
      console.log('   ✅ Login successful');
      console.log(`   Role: ${res.data.data.role}`);
      token = res.data.data.token;
      passed++;
    } else {
      console.log('   ❌ Login failed: No token received');
      failed++;
    }
  } catch (error) {
    console.log('   ❌ Login error:', error.response?.data?.message || error.message);
    failed++;
  }
  console.log('');
  
  if (!token) {
    console.log('⚠️  Skipping authenticated tests (no token)\n');
  } else {
    // Test 5: Protected Endpoints
    console.log('5. Testing Protected Endpoints...');
    const headers = { Authorization: `Bearer ${token}` };
    
    const protectedEndpoints = [
      { name: 'Analytics Dashboard', url: '/analytics/dashboard' },
      { name: 'Analytics Overview', url: '/analytics/overview?period=30days' },
      { name: 'Analytics Conversion', url: '/analytics/conversion?period=30days' },
      { name: 'Submissions Stats', url: '/submissions/stats' },
      { name: 'Admin Services', url: '/services/admin/all' },
      { name: 'Admin Projects', url: '/projects/admin/all' },
      { name: 'Admin Testimonials', url: '/testimonials/admin/all' },
      { name: 'Profile', url: '/profile' },
    ];
    
    for (const endpoint of protectedEndpoints) {
      try {
        const res = await axios.get(`${API_URL}${endpoint.url}`, { headers });
        if (res.data.success) {
          console.log(`   ✅ ${endpoint.name}: OK`);
          passed++;
        } else {
          console.log(`   ❌ ${endpoint.name}: Failed`);
          failed++;
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint.name}: ${error.response?.status || error.message}`);
        failed++;
      }
    }
    console.log('');
    
    // Test 6: Password Reset Flow
    console.log('6. Testing Password Reset Flow...');
    try {
      // Request reset
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: 'admin@business.com'
      });
      if (res.data.success) {
        console.log('   ✅ Password reset request: OK');
        passed++;
      } else {
        console.log('   ❌ Password reset request: Failed');
        failed++;
      }
    } catch (error) {
      console.log('   ❌ Password reset error:', error.response?.data?.message || error.message);
      failed++;
    }
    console.log('');
  }
  
  // Test 7: Frontend Pages
  console.log('7. Testing Frontend Pages...');
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Projects', url: '/projects' },
    { name: 'Contact', url: '/contact' },
    { name: 'Admin Login', url: '/admin/login' },
  ];
  
  for (const page of pages) {
    try {
      const res = await axios.get(`${FRONTEND_URL}${page.url}`);
      if (res.status === 200) {
        console.log(`   ✅ ${page.name}: OK`);
        passed++;
      } else {
        console.log(`   ❌ ${page.name}: Status ${res.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ${page.name}: ${error.message}`);
      failed++;
    }
  }
  console.log('');
  
  // Summary
  console.log('=== TEST SUMMARY ===');
  console.log(`Total Tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('');
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Application is running perfectly!\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Check the errors above.\n`);
  }
}

runAllTests().catch(console.error);
