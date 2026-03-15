import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { AnalyzeRequest, AnalyzeResponse, AIAnalysis } from "@/types";

// Supported Anthropic Vision media types
type AnthropicMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const ALLOWED_MEDIA_TYPES: AnthropicMediaType[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const STYLE_NAME_TH: Record<string, string> = {
  modern: "โมเดิร์น",
  scandinavian: "สแกนดิเนเวียน",
  industrial: "อินดัสเทรียล",
  bohemian: "โบฮีเมียน",
  minimalist: "มินิมอล",
  japandi: "จาปันดิ (Japandi)",
};

/** Parse full dataUrl or raw base64 → { base64, mediaType } */
function parseImage(imageBase64: string): {
  base64: string;
  mediaType: AnthropicMediaType;
} {
  const dataUrlMatch = imageBase64.match(
    /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/
  );
  if (dataUrlMatch) {
    return {
      mediaType: dataUrlMatch[1] as AnthropicMediaType,
      base64: dataUrlMatch[2],
    };
  }
  // Raw base64 — default to png
  return { mediaType: "image/png", base64: imageBase64 };
}

/** Strip optional ```json ``` fences Claude sometimes adds */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { imageBase64, style, roomDimensions } = body;

    if (!imageBase64) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: "ต้องระบุรูปภาพ" },
        { status: 400 }
      );
    }

    const { base64, mediaType } = parseImage(imageBase64);

    if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: `ไม่รองรับประเภทไฟล์ ${mediaType}` },
        { status: 400 }
      );
    }

    const styleTh = STYLE_NAME_TH[style] ?? style;

    const prompt = `คุณคือผู้เชี่ยวชาญด้านการออกแบบตกแต่งภายใน วิเคราะห์รูปแปลนห้องหรือการจัดวางเฟอร์นิเจอร์ในภาพนี้อย่างละเอียด

ข้อมูลห้อง:
- ขนาดห้อง: ${roomDimensions.width} × ${roomDimensions.height} ซม.
- สไตล์ที่ต้องการ: ${styleTh}

ตอบเป็น JSON เท่านั้น โดยค่าข้อความทุกฟิลด์ให้เขียนเป็นภาษาไทย:
{
  "summary": "สรุปภาพรวมของการจัดวางปัจจุบัน 2-3 ประโยค",
  "suggestions": [
    "คำแนะนำที่ 1",
    "คำแนะนำที่ 2",
    "คำแนะนำที่ 3"
  ],
  "styleMatch": 75,
  "spaceUtilization": "ดี/พอใช้/ต้องปรับปรุง — อธิบายสั้นๆ",
  "flowAssessment": "ประเมินการเดินทางและการไหลเวียนของพื้นที่",
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "improvements": [
    { "priority": "high", "description": "สิ่งที่ควรปรับปรุงเร่งด่วน" },
    { "priority": "medium", "description": "สิ่งที่ควรปรับปรุงในลำดับถัดไป" },
    { "priority": "low", "description": "สิ่งที่ปรับปรุงได้เพิ่มเติม" }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("ไม่ได้รับผลลัพธ์จาก Claude");
    }

    const analysis: AIAnalysis = JSON.parse(extractJson(textBlock.text));

    return NextResponse.json<AnalyzeResponse>({ success: true, analysis });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "การวิเคราะห์ล้มเหลว",
      },
      { status: 500 }
    );
  }
}
