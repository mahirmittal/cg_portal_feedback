// Test script to verify feedback submission and database schema
async function testFeedbackSubmission() {
  try {
    console.log('Testing Feedback Submission and Database Schema...\n');
    
    // Test 1: Valid feedback submission
    console.log('1. Testing valid feedback submission');
    const validFeedback = {
      callId: "CG12345",
      citizenMobile: "9876543210",
      citizenName: "Test Citizen",
      queryType: "Birth Certificate",
      satisfaction: "satisfied",
      description: "Issue resolved successfully, citizen is happy with the service.",
      submittedBy: "princekumar04",
      submittedAt: new Date().toISOString(),
      status: "resolved"
    };
    
    let response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validFeedback),
    });

    let data = await response.json();
    console.log('Valid feedback response:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Valid feedback submission PASSED');
      var createdFeedbackId = data.feedback.id;
    } else {
      console.log('❌ Valid feedback submission FAILED');
    }

    // Test 2: Invalid mobile number
    console.log('\n2. Testing invalid mobile number format');
    const invalidMobile = {
      ...validFeedback,
      callId: "CG12346",
      citizenMobile: "123456789" // Only 9 digits
    };
    
    response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidMobile),
    });

    data = await response.json();
    console.log('Invalid mobile response:', data);
    
    if (response.status === 400 && data.error.includes('10-digit')) {
      console.log('✅ Invalid mobile validation PASSED');
    } else {
      console.log('❌ Invalid mobile validation FAILED');
    }

    // Test 3: Invalid satisfaction value
    console.log('\n3. Testing invalid satisfaction value');
    const invalidSatisfaction = {
      ...validFeedback,
      callId: "CG12347", 
      satisfaction: "maybe" // Invalid value
    };
    
    response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidSatisfaction),
    });

    data = await response.json();
    console.log('Invalid satisfaction response:', data);
    
    if (response.status === 400 && data.error.includes('satisfied')) {
      console.log('✅ Invalid satisfaction validation PASSED');
    } else {
      console.log('❌ Invalid satisfaction validation FAILED');
    }

    // Test 4: Missing required fields
    console.log('\n4. Testing missing required fields');
    const missingFields = {
      callId: "CG12348",
      // Missing citizenMobile, citizenName, etc.
      satisfaction: "satisfied"
    };
    
    response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(missingFields),
    });

    data = await response.json();
    console.log('Missing fields response:', data);
    
    if (response.status === 400 && data.error.includes('Missing required fields')) {
      console.log('✅ Missing fields validation PASSED');
    } else {
      console.log('❌ Missing fields validation FAILED');
    }

    // Test 5: Fetch all feedbacks to verify storage
    console.log('\n5. Testing feedback retrieval from database');
    response = await fetch('http://localhost:3000/api/feedback');
    data = await response.json();
    
    console.log('Total feedbacks in database:', data.length);
    if (data.length > 0) {
      console.log('Sample feedback from database:', data[0]);
      console.log('✅ Feedback retrieval PASSED');
    } else {
      console.log('❌ Feedback retrieval FAILED - no data found');
    }

    console.log('\n🎉 Feedback submission and schema validation tests completed!');

  } catch (error) {
    console.log('❌ Feedback test failed with exception');
    console.error('Error:', error);
  }
}

// Run the test
testFeedbackSubmission();
