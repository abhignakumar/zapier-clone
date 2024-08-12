import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../db";

export async function GET(
  req: NextRequest,
  { params }: { params: { zapId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });

  const zap = await prisma.zap.findUnique({
    where: {
      id: params.zapId,
      userId: session.user.id as string,
    },
    include: {
      trigger: {
        include: {
          type: true,
        },
      },
      actions: {
        include: {
          type: true,
        },
      },
    },
  });

  return NextResponse.json(zap);
}
