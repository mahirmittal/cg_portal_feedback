import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a proper database
const feedbacks: any[] = [
  {
    id: "1",
    callId: "CG001",
    citizenMobile: "9876543210",
    citizenName: "Ramesh Kumar",
    queryType: "Birth Certificate",
    satisfaction: "satisfied",
    description:
      "Citizen was satisfied with the quick resolution. Birth certificate application was processed successfully and citizen received confirmation.",
    submittedBy: "EXE001",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "resolved",
  },
  {
    id: "2",
    callId: "CG002",
    citizenMobile: "9876543211",
    citizenName: "Sunita Devi",
    queryType: "Income Certificate",
    satisfaction: "not-satisfied",
    description:
      "Citizen was not satisfied with the processing time. Income certificate application is taking longer than expected. Requires follow-up with district office.",
    submittedBy: "EXE002",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "pending",
  },
  {
    id: "3",
    callId: "CG003",
    citizenMobile: "9876543212",
    citizenName: "Mohan Lal",
    queryType: "Caste Certificate",
    satisfaction: "satisfied",
    description:
      "Query resolved successfully. Citizen was guided through the online application process and received immediate confirmation.",
    submittedBy: "EXE001",
    submittedAt: "2024-01-13T16:45:00Z",
    status: "resolved",
  },
]

export async function GET() {
  return NextResponse.json(feedbacks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newFeedback = {
      id: Date.now().toString(),
      ...body,
    }

    feedbacks.push(newFeedback)

    return NextResponse.json({ success: true, feedback: newFeedback })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    const feedbackIndex = feedbacks.findIndex((f) => f.id === id)

    if (feedbackIndex === -1) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    feedbacks[feedbackIndex].status = status

    return NextResponse.json({ success: true, feedback: feedbacks[feedbackIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}
