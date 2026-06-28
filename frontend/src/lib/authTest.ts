/**
 * Test script to verify SPA authentication flow
 * Run this in browser console after importing: import('/src/lib/authTest.ts').then(m => m.testAuthFlow())
 */

import { authApi } from './api/auth';
import axios from 'axios';

export async function testAuthFlow() {
  console.log('🧪 Testing SPA Authentication Flow...');
  console.log('=====================================');

  try {
    // Test 1: CSRF Cookie Request
    console.log('\n1️⃣ Testing CSRF Cookie Request...');
    const csrfResponse = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log('✅ CSRF cookie status:', csrfResponse.status);
    console.log('🍪 Cookies set:', document.cookie);

    // Test 2: Login Request
    console.log('\n2️⃣ Testing Login Request...');
    const loginResponse = await authApi.login({
      email: 'test@example.com',
      password: 'password'
    });
    console.log('✅ Login successful:', loginResponse);
    console.log('👤 User data:', loginResponse.user);

    // Test 3: Authenticated Request
    console.log('\n3️⃣ Testing Authenticated Request...');
    const meResponse = await authApi.me();
    console.log('✅ Authenticated request successful:', meResponse);

    // Test 4: Check localStorage
    console.log('\n4️⃣ Checking localStorage...');
    console.log('📝 User data in localStorage:', localStorage.getItem('user'));
    console.log('🔑 Token (should be null):', localStorage.getItem('auth_token'));

    // Test 5: Logout Request
    console.log('\n5️⃣ Testing Logout Request...');
    await authApi.logout();
    console.log('✅ Logout successful');

    console.log('\n✨ All tests passed! SPA authentication is working correctly.');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error.response?.data);

    if (error.response?.status === 419) {
      console.error('\n⚠️ CSRF Token Mismatch!');
      console.error('Possible causes:');
      console.error('1. CSRF cookie not set properly');
      console.error('2. SANCTUM_STATEFUL_DOMAINS misconfigured');
      console.error('3. CORS configuration incorrect');
      console.error('4. Session domain mismatch');
    }
  }
}

console.log('💡 Auth test loaded! Run: testAuthFlow()');