import { NextResponse } from "next/server";
import { seedIfEmpty } from "@/lib/storage";

export async function GET() {
  try {
    await seedIfEmpty();
    return NextResponse.json({ success: true, message: "Database seeded successfully." });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed." }, { status: 500 });
  }
}
