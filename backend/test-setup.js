// Test script to verify backend setup without database
console.log('🔍 Testing Backend Configuration...\n');

// Test 1: Environment variables
console.log('1. Testing Environment Variables...');
require('dotenv').config();
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('xxx')) {
  console.log('   ⚠️  WARNING: DATABASE_URL not configured properly');
  console.log('   Please update .env with your Neon database URL');
} else {
  console.log('   ✅ DATABASE_URL is set');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('your-super-secret')) {
  console.log('   ⚠️  WARNING: JWT_SECRET should be changed in production');
} else {
  console.log('   ✅ JWT_SECRET is set');
}
console.log('   ✅ PORT:', process.env.PORT || '5000');
console.log('   ✅ CLIENT_URL:', process.env.CLIENT_URL || 'http://localhost:5173');

// Test 2: Required modules
console.log('\n2. Testing Required Modules...');
try {
  require('express');
  console.log('   ✅ express loaded');
} catch (e) { console.log('   ❌ express failed:', e.message); }

try {
  require('pg');
  console.log('   ✅ pg (node-postgres) loaded');
} catch (e) { console.log('   ❌ pg failed:', e.message); }

try {
  require('bcryptjs');
  console.log('   ✅ bcryptjs loaded');
} catch (e) { console.log('   ❌ bcryptjs failed:', e.message); }

try {
  require('jsonwebtoken');
  console.log('   ✅ jsonwebtoken loaded');
} catch (e) { console.log('   ❌ jsonwebtoken failed:', e.message); }

// Test 3: Models
console.log('\n3. Testing Models...');
try {
  const Admin = require('./models/Admin');
  console.log('   ✅ Admin model loaded');
} catch (e) { console.log('   ❌ Admin model failed:', e.message); }

try {
  const ContactSubmission = require('./models/ContactSubmission');
  console.log('   ✅ ContactSubmission model loaded');
} catch (e) { console.log('   ❌ ContactSubmission model failed:', e.message); }

// Test 4: Controllers
console.log('\n4. Testing Controllers...');
try {
  require('./controllers/authController');
  console.log('   ✅ authController loaded');
} catch (e) { console.log('   ❌ authController failed:', e.message); }

try {
  require('./controllers/contactController');
  console.log('   ✅ contactController loaded');
} catch (e) { console.log('   ❌ contactController failed:', e.message); }

try {
  require('./controllers/submissionController');
  console.log('   ✅ submissionController loaded');
} catch (e) { console.log('   ❌ submissionController failed:', e.message); }

// Test 5: Routes
console.log('\n5. Testing Routes...');
try {
  require('./routes/authRoutes');
  console.log('   ✅ authRoutes loaded');
} catch (e) { console.log('   ❌ authRoutes failed:', e.message); }

try {
  require('./routes/contactRoutes');
  console.log('   ✅ contactRoutes loaded');
} catch (e) { console.log('   ❌ contactRoutes failed:', e.message); }

try {
  require('./routes/submissionRoutes');
  console.log('   ✅ submissionRoutes loaded');
} catch (e) { console.log('   ❌ submissionRoutes failed:', e.message); }

// Test 6: Middleware
console.log('\n6. Testing Middleware...');
try {
  require('./middleware/authMiddleware');
  console.log('   ✅ authMiddleware loaded');
} catch (e) { console.log('   ❌ authMiddleware failed:', e.message); }

console.log('\n✅ Backend configuration test complete!\n');
console.log('📋 Next Steps:');
console.log('   1. Update .env with your Neon DATABASE_URL');
console.log('   2. Run: npm run dev');
console.log('   3. Run: npm run seed (to create admin user)');
