import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        user_id: user?.id || null,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Error saving contact submission:", dbError);
      return NextResponse.json(
        {
          error: "Failed to save submission",
          details: dbError.message,
          code: dbError.code,
          hint: dbError.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error: unknown) {
    console.error("Error in contact API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process contact form", details: errorMessage },
      { status: 500 }
    );
  }
}
