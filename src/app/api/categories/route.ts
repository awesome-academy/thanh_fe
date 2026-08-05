import { NextResponse } from "next/server";
import categoriesData from "@/data/mock/categories.json";

export async function GET() {
  return NextResponse.json(categoriesData);
}
