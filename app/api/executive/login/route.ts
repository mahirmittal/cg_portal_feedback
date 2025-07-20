import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const db = await getDb()
    const usersCollection = db.collection('users')

    // Find user by username from the users collection (created by admin)
    const user = await usersCollection.findOne({ username })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.active) {
      return NextResponse.json(
        { error: 'Account is inactive. Please contact administrator.' },
        { status: 401 }
      )
    }

    // Check password (plain text comparison as stored in MongoDB)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user type is allowed for executive login (executive, manager, operator)
    const allowedTypes = ['executive', 'manager', 'operator']
    if (!allowedTypes.includes(user.type)) {
      return NextResponse.json(
        { error: 'Access denied. Admin users cannot login here.' },
        { status: 403 }
      )
    }

    // Authentication successful
    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          username: user.username,
          type: user.type,
          id: user._id,
          active: user.active
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Executive login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
