import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { WEBHOOK_URL } from "@repo/common/lib/config";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ msg: "User not logged in" }, { status: 401 });
  const userId = session?.user.id;
  const zapId = req.nextUrl.searchParams.get("zapId");
  if (!userId || !zapId)
    return NextResponse.json(
      { msg: "UserId or ZapId are invalid" },
      {
        status: 400,
      }
    );
  const webhookURL = `${WEBHOOK_URL}/hooks/catch/${userId}/${zapId}`;
  return NextResponse.json({ webhookURL });
}
