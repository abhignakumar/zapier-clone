import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../db";
import { updateZapSchema } from "@repo/common/types/zodTypes";

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });

  const body = await req.json();
  const parsedData = updateZapSchema.safeParse(body);

  if (!parsedData.success)
    return NextResponse.json({ msg: "Inputs are not valid" }, { status: 400 });

  const zapId = parsedData.data.zapId;

  const userIdOfZap = await prisma.zap.findUnique({
    where: {
      id: zapId,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (userIdOfZap?.user.id !== session?.user.id)
    return NextResponse.json(
      { msg: "Zap owner(user) did not sent the request" },
      { status: 401 }
    );

  await prisma.trigger.delete({
    where: {
      zapId: zapId,
    },
  });
  await prisma.action.deleteMany({
    where: {
      zapId: zapId,
    },
  });
  await prisma.trigger.create({
    data: {
      availableTriggerId: parsedData.data.availableTriggerId,
      zapId: zapId,
      metaData: parsedData.data.triggerMetadata,
    },
  });
  await prisma.action.createMany({
    data: parsedData.data.actions.map((a) => ({
      availableActionId: a.availableActionId,
      zapId: zapId,
      order: a.order,
      metaData: a.actionMetadata,
    })),
  });

  return NextResponse.json({ msg: "Zap updated" });
}
