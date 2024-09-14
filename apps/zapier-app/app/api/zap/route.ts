import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { createZapSchema } from "@repo/common/types/zodTypes";
import prisma from "../../db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });

  const body = await req.json();
  const parsedData = createZapSchema.safeParse(body);
  if (!parsedData.success)
    return NextResponse.json(
      { msg: "Input data is not valid" },
      { status: 400 }
    );

  const zapId = await prisma.zap.create({
    data: {
      userId: session.user.id as string,
      trigger: {
        create: {
          availableTriggerId: parsedData.data.availableTriggerId,
          metaData: parsedData.data.triggerMetadata,
        },
      },
      actions: {
        createMany: {
          data: parsedData.data.actions.map((a) => ({
            availableActionId: a.availableActionId,
            order: a.order,
            metaData: a.actionMetadata,
          })),
        },
      },
    },
    select: {
      id: true,
    },
  });
  return NextResponse.json({
    zapId: zapId.id,
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });

  const zaps = await prisma.zap.findMany({
    where: {
      userId: session.user.id as string,
    },
    include: {
      trigger: {
        select: {
          type: true,
        },
      },
      actions: {
        select: {
          type: true,
        },
      },
    },
  });

  return NextResponse.json(zaps);
}
