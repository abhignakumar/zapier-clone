import { Action, Trigger } from "@repo/common/types/types";
import { ZapPlayground } from "../../components/ZapPlayground";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function () {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const trigger: Trigger = { availableTriggerId: "" };
  const actions: Action[] = [
    {
      availableActionId: "",
      order: 0,
    },
  ];

  return (
    <div>
      <ZapPlayground trigger={trigger} actions={actions} typeOfZap="create" />
    </div>
  );
}
