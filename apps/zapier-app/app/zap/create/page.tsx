import { Action, Trigger } from "@repo/common/types/types";
import { ZapPlayground } from "../../components/ZapPlayground";

export default function () {
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
