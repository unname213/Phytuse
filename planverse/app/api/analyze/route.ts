import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { AnalyzeRequest, AnalyzeResponse, AIAnalysis } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { imageBase64, style, roomDimensions } = body;

    if (!imageBase64) {
      return NextResponse.json<AnalyzeResponse>(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert interior designer. Analyze this floor plan/room layout image and provide detailed feedback.

Room dimensions: ${roomDimensions.width}cm x ${roomDimensions.height}cm
Desired style: ${style}

Please analyze the layout and respond with a JSON object following this exact structure:
{
  "summary": "Brief overview of the current layout",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "styleMatch": 75,
  "spaceUtilization": "Good/Fair/Poor - brief explanation",
  "flowAssessment": "How well the space flows and allows movement",
  "colorPalette": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "improvements": [
    { "priority": "high", "description": "Most important improvement" },
    { "priority": "medium", "description": "Secondary improvement" },
    { "priority": "low", "description": "Nice to have improvement" }
  ]
}

Respond ONLY with the JSON object, no additional text.`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const analysis: AIAnalysis = JSON.parse(textBlock.text);

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
