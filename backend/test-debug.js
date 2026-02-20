const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5175';

async function runComprehensiveTests() {
  console.log('=== COMPREHENSIVE APPLICATION TEST & DEBUG ===\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  // Test 1: Backend Health
  console.log('1. Backend Health Check...');
  try {
    const res = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    if (res.data.status === 'OK') {
      console.log('   ✅ Backend is running\n');
      results.passed++;
    } else {
      console.log('   ❌ Backend health check failed\n');
      results.failed++;
      results.errors.push('Backend health check failed');
    }
  } catch (error) {
    console.log('   ❌ Backend not reachable:', error.message, '\n');
    results.failed++;
    results.errors.push(`Backend unreachable: ${error.message}`);
  }
  
  // Test 2: Frontend Health
  console.log('2. Frontend Health Check...');
  try {
    const res = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (res.status === 200) {
      console.log('   ✅ Frontend is running\n');
      results.passed++;
    } else {
      console.log('   ❌ Frontend returned status:', res.status, '\n');
      results.failed++;
      results.errors.push(`Frontend status: ${res.status}`);
    }
  } catch (error) {
    console.log('   ❌ Frontend not reachable:', error.message, '\n');
    results.failed++;
    results.errors.push(`Frontend unreachable: ${error.message}`);
  }
  
  // Test 3: Database Connection (via API)
  console.log('3. Database Connection...');
  try {
    const res = await axios.get(`${API_URL}/services`, { timeout: 5000 });
    if (res.data.success) {
      console.log(`   ✅ Database connected (${res.data.data.length} services)\n`);
      results.passed++;
    } else {
      console.log('   ❌ Database query failed\n');
      results.failed++;
      results.errors.push('Database query failed');
    }
  } catch (error) {
    console.log('   ❌ Database error:', error.message, '\n');
    results.failed++;
    results.errors.push(`Database error: ${error.message}`);
  }
  
  // Test 4: Public APIs
  console.log('4. Public API Endpoints...');
  const publicEndpoints = [
    { name: 'Services', url: '/services' },
    { name: 'Projects', url: '/projects' },
    { name: 'Testimonials', url: '/testimonials' },
    { name: 'Categories', url: '/projects/categories' },
  ];
  
  for (const endpoint of publicEndpoints) {
    try {
      const res = await axios.get(`${API_URL}${endpoint.url}`, { timeout: 5000 });
      if (res.data.success) {
        console.log(`   ✅ ${endpoint.name}: OK`);
        results.passed++;
      } else {
        console.log(`   ❌ ${endpoint.name}: Failed`);
        results.failed++;
        results.errors.push(`${endpoint.name} API failed`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error.response?.status || error.message}`);
      results.failed++;
      results.errors.push(`${endpoint.name}: ${error.message}`);
    }
  }
  console.log('');
  
  // Test 5: Admin Login
  console.log('5. Admin Authentication...');
  let token = null;
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@business.com',
      password: 'admin123'
    }, { timeout: 5000 });
    
    if (res.data.success && res.data.data?.token) {
      console.log('   ✅ Login successful');
      console.log(`   Role: ${res.data.data.role}`);
      token = res.data.data.token;
      results.passed++;
    } else {
      console.log('   ❌ Login failed: No token');
      results.failed++;
      results.errors.push('Login failed: No token');
    }
  } catch (error) {
    console.log('   ❌ Login error:', error.response?.data?.message || error.message);
    results.failed++;
    results.errors.push(`Login: ${error.response?.data?.message || error.message}`);
  }
  console.log('');
  
  if (!token) {
    console.log('⚠️  Skipping authenticated tests (no token)\n');
  } else {
    // Test 6: Protected Endpoints
    console.log('6. Protected Endpoints...');
    const headers = { Authorization: `Bearer ${token}` };
    
    const protectedEndpoints = [
      { name: 'Analytics Dashboard', url: '/analytics/dashboard' },
      { name: 'Analytics Overview', url: '/analytics/overview?period=30days' },
      { name: 'Submissions Stats', url: '/submissions/stats' },
      { name: 'Admin Services', url: '/services/admin/all' },
      { name: 'Admin Projects', url: '/projects/admin/all' },
      { name: 'Profile', url: '/profile' },
    ];
    
    for (const endpoint of protectedEndpoints) {
      try {
        const res = await axios.get(`${API_URL}${endpoint.url}`, { headers, timeout: 5000 });
        if (res.data.success) {
          console.log(`   ✅ ${endpoint.name}: OK`);
          results.passed++;
        } else {
          console.log(`   ❌ ${endpoint.name}: Failed`);
          results.failed++;
          results.errors.push(`${endpoint.name} failed`);
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint.name}: ${error.response?.status || error.message}`);
        results.failed++;
        results.errors.push(`${endpoint.name}: ${error.message}`);
      }
    }
    console.log('');
    
    // Test 7: Admin Management (Super Admin only)
    console.log('7. Admin Management...');
    try {
      const res = await axios.get(`${API_URL}/admins`, { headers, timeout: 5000 });
      if (res.data.success) {
        console.log(`   ✅ Admin Management: OK (${res.data.data.length} admins)`);
        results.passed++;
      } else {
        console.log('   ❌ Admin Management: Failed');
        results.failed++;
        results.errors.push('Admin Management failed');
      }
    } catch (error) {
      console.log('   ❌ Admin Management:', error.response?.status || error.message);
      results.failed++;
      results.errors.push(`Admin Management: ${error.message}`);
    }
    console.log('');
    
    // Test 8: Password Reset Flow
    console.log('8. Password Reset Flow...');
    try {
      // Request reset
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: 'admin@business.com'
      }, { timeout: 5000 });
      
      if (res.data.success) {
        console.log('   ✅ Password Reset Request: OK');
        results.passed++;
      } else {
        console.log('   ❌ Password Reset Request: Failed');
        results.failed++;
        results.errors.push('Password reset request failed');
      }
    } catch (error) {
      console.log('   ❌ Password Reset:', error.response?.data?.message || error.message);
      results.failed++;
      results.errors.push(`Password Reset: ${error.message}`);
    }
    console.log('');
  }
  
  // Test 9: Frontend Pages
  console.log('9. Frontend Pages...');
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Services', url: '/services' },
    { name: 'Projects', url: '/projects' },
    { name: 'Contact', url: '/contact' },
    { name: 'Admin Login', url: '/admin/login' },
    { name: 'Forgot Password', url: '/admin/forgot-password' },
  ];
  
  for (const page of pages) {
    try {
      const res = await axios.get(`${FRONTEND_URL}${page.url}`, { timeout: 5000 });
      if (res.status === 200) {
        console.log(`   ✅ ${page.name}: OK`);
        results.passed++;
      } else {
        console.log(`   ❌ ${page.name}: Status ${res.status}`);
        results.failed++;
        results.errors.push(`${page.name}: Status ${res.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${page.name}: ${error.message}`);
      results.failed++;
      results.errors.push(`${page.name}: ${error.message}`);
    }
  }
  console.log('');
  
  // Test 10: Email System
  console.log('10. Email System...');
  try {
    const email = require('./config/email');
    if (email.sendEmail) {
      console.log('   ✅ Email Service: Loaded');
      results.passed++;
    } else {
      console.log('   ❌ Email Service: Not available');
      results.failed++;
      results.errors.push('Email service not available');
    }
  } catch (error) {
    console.log('   ❌ Email System:', error.message);
    results.failed++;
    results.errors.push(`Email System: ${error.message}`);
  }
  console.log('');
  
  // Summary
  console.log('=== TEST SUMMARY ===');
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n=== ERRORS FOUND ===');
    results.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  }
  
  console.log('');
  
  if (results.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Application is running perfectly!\n');
    return { success: true, ...results };
  } else {
    console.log(`⚠️  ${results.failed} test(s) failed. See errors above.\n`);
    return { success: false, ...results };
  }
}

runComprehensiveTests().catch(console.error);
