"use client";

import { useEffect, useState } from "react";
import { PGCell } from "./PGCell";
import { PrimaryButton } from "@repo/ui/PrimaryButton";
import { Action, AvailableTA, Trigger } from "@repo/common/types/types";
import axios from "axios";
import { BACKEND_URL } from "@repo/common/lib/config";
import { Modal } from "./Modal";
import { createZapSchema, updateZapSchema } from "@repo/common/types/zodTypes";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/LoadingSpinner";
import { SideBar } from "./SideBar";
import { LogoNamePGCell } from "./LogoNamePGCell";

export const ZapPlayground = ({
  trigger,
  actions,
  typeOfZap,
}: {
  trigger: Trigger;
  actions: Action[];
  typeOfZap: "create" | "update";
}) => {
  const [PGTrigger, setPGTrigger] = useState<Trigger>(trigger);
  const [PGActions, setPGActions] = useState<Action[]>(actions);
  const [availableTriggers, setAvailableTriggers] = useState<AvailableTA[]>();
  const [availableActions, setAvailableActions] = useState<AvailableTA[]>();
  const [triggerMap, setTriggerMap] = useState<Map<string, [string, string]>>(
    new Map()
  );
  const [actionMap, setActionMap] = useState<Map<string, [string, string]>>(
    new Map()
  );
  const [openModal, setOpenModal] = useState(false);
  const [actionIndex, setActionIndex] = useState<number>(0);
  const [type, setType] = useState<"trigger" | "action">("trigger");
  const [loading, setLoading] = useState(true);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [selectedAvailableTA, setSelectedAvailableTA] = useState<AvailableTA>();
  const router = useRouter();
  const { zapId } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response1 = await axios.get(`${BACKEND_URL}/api/availableTriggers`);
      setAvailableTriggers(response1.data.availableTriggers);
      response1.data.availableTriggers.forEach((t: AvailableTA) => {
        setTriggerMap((prev) => {
          prev?.set(t.id, [t.name, t.image]);
          return prev;
        });
      });
      const response2 = await axios.get(`${BACKEND_URL}/api/availableActions`);
      setAvailableActions(response2.data.availableActions);
      response2.data.availableActions.forEach((a: AvailableTA) => {
        setActionMap((prev) => {
          prev?.set(a.id, [a.name, a.image]);
          return prev;
        });
      });
      setLoading(false);
    }
    fetchData();
  }, []);

  function handlePublishOnClick() {
    if (typeOfZap === "create") {
      const data = {
        availableTriggerId: PGTrigger.availableTriggerId,
        triggerMetadata: PGTrigger.metaData,
        actions: PGActions.map((a) => ({
          availableActionId: a.availableActionId,
          actionMetadata: a.metaData,
          order: a.order,
        })),
      };
      const parsedData = createZapSchema.safeParse(data);
      if (!parsedData.success) {
        alert("Inputs are not valid");
        return;
      }
      axios.post(`${BACKEND_URL}/api/zap`, parsedData.data).then((response) => {
        if (response.status === 200) {
          alert("Zap created");
          router.push("/dashboard");
        } else alert(response.data.msg);
        return;
      });
    } else {
      const data = {
        zapId: zapId,
        availableTriggerId: PGTrigger.availableTriggerId,
        triggerMetadata: PGTrigger.metaData,
        actions: PGActions.map((a) => ({
          availableActionId: a.availableActionId,
          actionMetadata: a.metaData,
          order: a.order,
        })),
      };
      const parsedData = updateZapSchema.safeParse(data);
      if (!parsedData.success) {
        alert("Inputs are not valid");
        return;
      }
      axios
        .post(`${BACKEND_URL}/api/zap/${zapId}`, parsedData.data)
        .then((response) => {
          if (response.status === 200) {
            alert("Zap updated");
            router.push("/dashboard");
          } else alert(response.data.msg);
          return;
        });
    }
  }

  return loading ? (
    <div className="flex justify-center p-10">
      <LoadingSpinner />
    </div>
  ) : (
    <div className="p-5 min-h-screen w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="flex min-h-screen">
        <div className="w-full">
          <div className="flex justify-end py-4 px-3">
            <PrimaryButton variant="purple" onClick={handlePublishOnClick}>
              Publish
            </PrimaryButton>
          </div>

          <div className="flex justify-center py-4 px-3">
            <PGCell
              onClick={() => {
                setType("trigger");
                if (
                  (triggerMap.get(PGTrigger.availableTriggerId) || false) &&
                  true
                ) {
                  setOpenSideBar(true);
                  setSelectedAvailableTA({
                    id: PGTrigger.availableTriggerId,
                    name:
                      triggerMap.get(PGTrigger.availableTriggerId)?.[0] || "",
                    image:
                      triggerMap.get(PGTrigger.availableTriggerId)?.[1] || "",
                  });
                } else {
                  setOpenModal(true);
                }
              }}
              closeable={false}
              isSelected={
                (triggerMap.get(PGTrigger.availableTriggerId) || false) && true
              }
            >
              {triggerMap.get(PGTrigger.availableTriggerId) ? (
                <LogoNamePGCell
                  name={triggerMap.get(PGTrigger.availableTriggerId)?.[0] || ""}
                  image={
                    triggerMap.get(PGTrigger.availableTriggerId)?.[1] || ""
                  }
                />
              ) : (
                <div className="text-center text-slate-500 font-semibold">
                  Trigger
                </div>
              )}
            </PGCell>
          </div>

          {PGActions.map((a, index) => (
            <div key={index} className={`flex justify-center py-4 px-3`}>
              <PGCell
                onClick={() => {
                  setType("action");
                  setActionIndex(index);
                  if ((actionMap.get(a.availableActionId) || false) && true) {
                    setOpenSideBar(true);
                    setSelectedAvailableTA({
                      id: a.availableActionId,
                      name: actionMap.get(a.availableActionId)?.[0] || "",
                      image: actionMap.get(a.availableActionId)?.[1] || "",
                    });
                  } else {
                    setOpenModal(true);
                  }
                }}
                closeable={PGActions.length !== 1}
                deleteActionOnClick={(e) => {
                  setPGActions((prev) => {
                    const newActions = [...prev];
                    newActions.splice(index, 1);
                    newActions.forEach((a, index) => {
                      a.order = index;
                    });
                    return newActions;
                  });
                  setOpenSideBar(false);
                  e.stopPropagation();
                }}
                isSelected={
                  (actionMap.get(a.availableActionId) || false) && true
                }
              >
                {actionMap.get(a.availableActionId) ? (
                  <LogoNamePGCell
                    name={actionMap.get(a.availableActionId)?.[0] || ""}
                    image={actionMap.get(a.availableActionId)?.[1] || ""}
                  />
                ) : (
                  <div className="text-center text-slate-500 font-semibold">
                    Action
                  </div>
                )}
              </PGCell>
            </div>
          ))}

          <div className="flex justify-center py-4 px-3">
            <PrimaryButton
              onClick={() => {
                setPGActions((prev) => [
                  ...prev,
                  {
                    availableActionId: "",
                    order: prev.length,
                  },
                ]);
              }}
            >
              <PlusIcon />
            </PrimaryButton>
          </div>
          {openModal && (
            <Modal
              type={type}
              onClose={() => setOpenModal(false)}
              actionIndex={actionIndex}
              availableTriggers={availableTriggers}
              availableActions={availableActions}
              setPGTrigger={setPGTrigger}
              setPGActions={setPGActions}
            />
          )}
        </div>

        {openSideBar && (
          <SideBar
            selectedAvailableTA={selectedAvailableTA}
            onClose={() => {
              setOpenSideBar(false);
            }}
            type={type}
            setPGTrigger={setPGTrigger}
            setPGActions={setPGActions}
            actionIndex={actionIndex}
            PGTrigger={PGTrigger}
            PGActions={PGActions}
          />
        )}
      </div>
    </div>
  );
};

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}
