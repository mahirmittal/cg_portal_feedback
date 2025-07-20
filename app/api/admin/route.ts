import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      message: 'Admin API is working',
      timestamp: new Date().toISOString(),
      endpoints: {
        login: '/api/admin/login',
        test: '/api/admin/test'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Admin API health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
