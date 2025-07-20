// Test script to verify admin login credentials
async function testAdminLogin() {
  try {
    console.log('Testing admin login with credentials: admin / admin1234');
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'admin', 
        password: 'admin1234' 
      }),
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Admin login test PASSED');
      console.log('Admin can login with username: admin, password: admin1234');
    } else {
      console.log('❌ Admin login test FAILED');
      console.log('Error:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Admin login test FAILED with exception');
    console.error('Error:', error);
  }
}

// Test with wrong credentials
async function testAdminLoginWrong() {
  try {
    console.log('\nTesting admin login with wrong credentials: admin / wrongpassword');
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'admin', 
        password: 'wrongpassword' 
      }),
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok && data.error) {
      console.log('✅ Wrong credentials test PASSED (correctly rejected)');
    } else {
      console.log('❌ Wrong credentials test FAILED (should have been rejected)');
    }
  } catch (error) {
    console.log('❌ Wrong credentials test FAILED with exception');
    console.error('Error:', error);
  }
}

// Run tests
testAdminLogin();
testAdminLoginWrong();
