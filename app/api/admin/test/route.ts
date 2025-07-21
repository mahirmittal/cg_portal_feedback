import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const db = await getDb()
    const adminCollection = db.collection('adminC')

    // Check if admin user exists
    const admin = await adminCollection.findOne({ username: 'admin' })

    if (!admin) {
      return NextResponse.json({
        status: 'error',
        message: 'Admin user not found in database',
        collection: 'adminC'
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Admin user found',
      username: admin.username,
      hasPassword: !!admin.password,
      passwordLength: admin.password ? admin.password.length : 0,
      collection: 'adminC',
      dbName: db.databaseName
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
