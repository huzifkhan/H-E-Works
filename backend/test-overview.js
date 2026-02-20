const axios = require('axios');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000/api';
const token = jwt.sign({ id: 1 }, 'your-super-secret-jwt-key-change-this-in-production', { expiresIn: '7d' });

async function testOverview() {
  console.log('Testing Analytics Overview...\n');
  
  try {
    const res = await axios.get(`${API_URL}/analytics/overview?period=30days`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Success:', res.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.status);
    console.log('Response:', JSON.stringify(error.response?.data, null, 2));
    console.log('Error details:', error.message);
  }
}

testOverview();
