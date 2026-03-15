import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mediaType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `วิเคราะห์แปลนห้องนี้และให้ข้อมูลในรูปแบบ JSON ดังนี้:
{
  "roomType": "ประเภทห้อง (เช่น ห้องนั่งเล่น ห้องนอน ฯลฯ)",
  "estimatedSize": "ขนาดโดยประมาณ",
  "shape": "รูปทรงห้อง (สี่เหลี่ยมผืนผ้า, L-shape ฯลฯ)",
  "features": ["คุณสมบัติเด่นของห้อง"],
  "suggestions": ["คำแนะนำการจัดวางเฟอร์นิเจอร์ 3-5 ข้อ"],
  "furnitureRecommendations": ["เฟอร์นิเจอร์ที่เหมาะสม"],
  "styleAdvice": "คำแนะนำสไตล์การตกแต่ง",
  "summary": "สรุปภาพรวมของห้อง"
}
ตอบเป็นภาษาไทย เฉพาะ JSON เท่านั้น ไม่ต้องมีข้อความอื่น`,
            },
          ],
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse analysis', raw: content.text }, { status: 500 })
    }

    const analysis = JSON.parse(jsonMatch[0])
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze floor plan' },
      { status: 500 }
    )
  }
}
