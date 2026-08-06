import { NextResponse } from "next/server";
import destinationsData from "@/data/mock/destinations.json";

export async function GET() {
  return NextResponse.json(destinationsData);
}
