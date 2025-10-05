import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://airbnbnew.cybersoft.edu.vn/api/phong-thue', {
      headers: {
        'Content-Type': 'application/json',
        'tokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjIyLzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2OTA0MDAwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY5MTkxMjAwfQ.kBKKhbMMH6Pqm5TdwA9DOp9z6srHiyc9KnYL_084PPo'
      }
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi gọi API Cybersoft' }, { status: 500 })
  }
}
