import { userSignUpSchema } from "@repo/common/types/zodTypes";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = userSignUpSchema.safeParse(body);
  if (!parsedData.success)
    return NextResponse.json(
      { msg: "Inputs are not valid" },
      {
        status: 400,
      }
    );
  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });
  if (user)
    return NextResponse.json(
      { msg: "User already exists" },
      {
        status: 400,
      }
    );
  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
  await prisma.user.create({
    data: {
      email: parsedData.data.email,
      password: hashedPassword,
      name: parsedData.data.name,
    },
  });
  return NextResponse.json(
    { msg: "User signed up" },
    {
      status: 200,
    }
  );
}
