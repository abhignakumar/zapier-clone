"use client";

import { BACKEND_URL } from "@repo/common/lib/config";
import { LoadingSpinner } from "@repo/ui/LoadingSpinner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const TriggerWebhook = () => {
  const [loading, setLoading] = useState(true);
  const [webhookURL, setWebhookURL] = useState<string>();
  const { zapId } = useParams();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/webhook?zapId=${zapId}`).then((response) => {
      setWebhookURL(response.data.webhookURL);
      setLoading(false);
    });
  }, []);

  return loading ? (
    <div className="flex justify-center p-10">
      <LoadingSpinner />
    </div>
  ) : (
    <div>
      {zapId ? (
        <div>
          <div className="pb-2 font-semibold text-slate-700">WebHook URL</div>
          <div className="text-sm font-medium text-slate-700">{webhookURL}</div>
        </div>
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
};
