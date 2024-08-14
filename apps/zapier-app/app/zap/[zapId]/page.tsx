"use client";

import { Action, Trigger } from "@repo/common/types/types";
import { ZapPlayground } from "../../components/ZapPlayground";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/lib/config";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/LoadingSpinner";

export default function () {
  const [trigger, setTrigger] = useState<Trigger>({
    availableTriggerId: "",
  });
  const [actions, setActions] = useState<Action[]>([
    {
      availableActionId: "",
      order: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const { zapId } = useParams();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/zap/${zapId}`).then((response) => {
      setTrigger({
        availableTriggerId: response.data.trigger.availableTriggerId,
        metaData: response.data.trigger.metaData,
      });
      setActions(
        response.data.actions.map((a: Action) => ({
          availableActionId: a.availableActionId,
          metaData: a.metaData,
          order: a.order,
        }))
      );
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center p-10">
          <LoadingSpinner />
        </div>
      ) : (
        <ZapPlayground trigger={trigger} actions={actions} typeOfZap="update" />
      )}
    </div>
  );
}
