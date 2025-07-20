import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { username, password, type, active } = await request.json()
    const { id } = params

    if (!username || !password || !type) {
      return NextResponse.json(
        { error: 'Username, password, and type are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const usersCollection = db.collection('users')

    // Check if username already exists for other users
    const existingUser = await usersCollection.findOne({ 
      username, 
      _id: { $ne: new ObjectId(id) } 
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    const updatedUser = {
      username,
      password,
      type,
      active: active !== undefined ? active : true,
      updatedAt: new Date()
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User updated successfully' 
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const db = await getDb()
    const usersCollection = db.collection('users')

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
