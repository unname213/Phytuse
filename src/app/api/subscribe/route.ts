import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.CONVERTKIT_API_KEY,
            email,
          }),
        }
      );
      if (!res.ok) {
        const detail = await res.text();
        console.error("[subscribe] ConvertKit error:", detail);
        throw new Error("Provider error");
      }
    } else if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_AUDIENCE_ID
    ) {
      const res = await fetch(
        `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) {
        const detail = await res.text();
        console.error("[subscribe] Resend error:", detail);
        throw new Error("Provider error");
      }
    } else {
      // No provider configured — log for dev; won't fail the request
      console.log(`[subscribe] no provider configured; received: ${email}`);
    }

    return NextResponse.json({
      message: "You're subscribed. Thanks for reading Reflect.",
    });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { error: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}
