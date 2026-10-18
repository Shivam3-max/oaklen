import { NextResponse } from "next/server";
import { listProjects } from "@/lib/store";

// Public read-only list, for any client component that needs projects.
export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}
