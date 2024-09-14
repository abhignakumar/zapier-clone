"use client";

import { Action, Trigger } from "@repo/common/types/types";
import { ZapPlayground } from "../../components/ZapPlayground";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/LoadingSpinner";
import { useSession } from "next-auth/react";

export default function () {
  const session = useSession();
  const router = useRouter();

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
    axios.get(`/api/zap/${zapId}`).then((response) => {
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

  if (session.status === "loading")
    return (
      <div className="flex justify-center p-10">
        <LoadingSpinner />
      </div>
    );

  if (session.status === "unauthenticated") router.push("/");

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
