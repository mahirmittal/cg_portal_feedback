import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const feedbacks = await db.collection('feedbacks').find({}).sort({ submittedAt: -1 }).toArray()
    
    // Convert ObjectId to string for JSON serialization
    const serializedFeedbacks = feedbacks.map(feedback => ({
      ...feedback,
      _id: feedback._id.toString(),
      id: feedback._id.toString()
    }))
    
    return NextResponse.json(serializedFeedbacks)
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await getDb()

    // Validate required fields
    const { callId, citizenMobile, citizenName, queryType, satisfaction, description, submittedBy, status } = body

    if (!callId || !citizenMobile || !citizenName || !satisfaction || !description || !submittedBy) {
      return NextResponse.json({ 
        error: "Missing required fields: callId, citizenMobile, citizenName, satisfaction, description, submittedBy" 
      }, { status: 400 })
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(citizenMobile)) {
      return NextResponse.json({ 
        error: "citizenMobile must be a 10-digit number" 
      }, { status: 400 })
    }

    // Validate satisfaction value
    if (!["satisfied", "not-satisfied"].includes(satisfaction)) {
      return NextResponse.json({ 
        error: "satisfaction must be either 'satisfied' or 'not-satisfied'" 
      }, { status: 400 })
    }

    // Create properly structured feedback document
    const newFeedback = {
      callId: String(callId),
      citizenMobile: String(citizenMobile),
      citizenName: String(citizenName),
      queryType: queryType ? String(queryType) : "",
      satisfaction: String(satisfaction),
      description: String(description),
      submittedBy: String(submittedBy),
      submittedAt: new Date(body.submittedAt || new Date()),
      status: status || (satisfaction === "satisfied" ? "resolved" : "pending"),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('feedbacks').insertOne(newFeedback)
    
    const insertedFeedback = {
      ...newFeedback,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString()
    }

    return NextResponse.json({ success: true, feedback: insertedFeedback })
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body
    const db = await getDb()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 })
    }

    const result = await db.collection('feedbacks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    const updatedFeedback = {
      ...result,
      _id: result._id.toString(),
      id: result._id.toString()
    }

    return NextResponse.json({ success: true, feedback: updatedFeedback })
  } catch (error) {
    console.error('Error updating feedback:', error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}
