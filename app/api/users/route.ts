import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch all users
export async function GET() {
  try {
    const db = await getDb()
    const usersCollection = db.collection('users')
    
    const users = await usersCollection.find({}).sort({ createdAt: -1 }).toArray()
    
    // Convert ObjectId to string for JSON serialization
    const serializedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString(),
      id: user._id.toString()
    }))
    
    return NextResponse.json(serializedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const { username, password, type, active } = await request.json()

    if (!username || !password || !type) {
      return NextResponse.json(
        { error: 'Username, password, and type are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const usersCollection = db.collection('users')

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const newUser = {
      username,
      password, // Storing as plain text as requested
      type,
      active: active !== undefined ? active : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await usersCollection.insertOne(newUser)
    
    const insertedUser = {
      ...newUser,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString()
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: insertedUser 
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
