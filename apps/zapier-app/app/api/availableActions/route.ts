import { NextResponse } from "next/server";
import prisma from "../../db";

export async function GET() {
  const availableActions = await prisma.availableAction.findMany();
  return NextResponse.json({ availableActions });
}
