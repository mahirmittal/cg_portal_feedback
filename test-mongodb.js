// MongoDB Connection Test Script  
const { getDb } = require('./lib/mongodb.ts')

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    
    const db = await getDb()
    console.log('✅ Connected to MongoDB successfully!')
    
    // Test database operations
    const collections = await db.listCollections().toArray()
    console.log('📊 Available collections:', collections.map(c => c.name))
    
    // Test feedback collection
    const feedbacksCount = await db.collection('feedbacks').countDocuments()
    console.log(`📝 Number of feedbacks in database: ${feedbacksCount}`)
    
    // Fetch and display sample feedback
    const sampleFeedback = await db.collection('feedbacks').findOne()
    console.log('📋 Sample feedback:', {
      callId: sampleFeedback?.callId,
      citizenName: sampleFeedback?.citizenName,
      status: sampleFeedback?.status
    })
    
    console.log('🎉 MongoDB connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

testConnection()
