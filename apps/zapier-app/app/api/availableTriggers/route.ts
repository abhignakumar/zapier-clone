import { NextResponse } from "next/server";
import prisma from "../../db";

export async function GET() {
  const availableTriggers = await prisma.availableTrigger.findMany();
  return NextResponse.json({ availableTriggers });
}
