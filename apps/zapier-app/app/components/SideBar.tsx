import { Action, AvailableTA, Trigger } from "@repo/common/types/types";
import { LogoNamePGCell } from "./LogoNamePGCell";
import { ACTION_EMAIL_ID, TRIGGER_WEBHOOK_ID } from "@repo/common/lib/config";
import { TriggerWebhook } from "./sideBarComponents/TriggerWebhook";
import { ActionEmail } from "./sideBarComponents/ActionEmail";
import { Dispatch, SetStateAction } from "react";

export const SideBar = ({
  selectedAvailableTA,
  onClose,
  type,
  setPGTrigger,
  setPGActions,
  actionIndex,
  PGTrigger,
  PGActions,
}: {
  selectedAvailableTA?: AvailableTA;
  onClose: () => void;
  type: "trigger" | "action";
  setPGTrigger: Dispatch<SetStateAction<Trigger>>;
  setPGActions: Dispatch<SetStateAction<Action[]>>;
  actionIndex: number;
  PGTrigger: Trigger;
  PGActions: Action[];
}) => {
  return (
    <div className="w-1/2 bg-gray-200 rounded-lg p-4 border border-slate-300">
      <div className="flex justify-end pb-2">
        <div
          className="cursor-pointer rounded-full p-1 hover:bg-gray-300 transition-all"
          onClick={onClose}
        >
          <CloseIcon />
        </div>
      </div>
      <div>
        <div className="py-4 px-2 mb-4 bg-gray-300 rounded-md">
          <LogoNamePGCell
            name={selectedAvailableTA?.name || ""}
            image={selectedAvailableTA?.image || ""}
          />
        </div>
        <div>
          <SideBarContent
            id={selectedAvailableTA?.id || ""}
            type={type}
            setPGTrigger={setPGTrigger}
            setPGActions={setPGActions}
            actionIndex={actionIndex}
            PGTrigger={PGTrigger}
            PGActions={PGActions}
          />
        </div>
      </div>
    </div>
  );
};

function SideBarContent({
  id,
  type,
  setPGTrigger,
  setPGActions,
  actionIndex,
  PGTrigger,
  PGActions,
}: {
  id: string;
  type: "trigger" | "action";
  setPGTrigger: Dispatch<SetStateAction<Trigger>>;
  setPGActions: Dispatch<SetStateAction<Action[]>>;
  actionIndex: number;
  PGTrigger: Trigger;
  PGActions: Action[];
}) {
  switch (id) {
    case TRIGGER_WEBHOOK_ID:
      return <TriggerWebhook />;
    case ACTION_EMAIL_ID:
      return (
        <ActionEmail
          metaData={PGActions[actionIndex]?.metaData}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === "trigger") {
              setPGTrigger((prev) => {
                return { ...prev, metaData: e.target.value };
              });
            } else {
              setPGActions((prev) => {
                const newActions = [...prev];
                newActions[actionIndex] = {
                  availableActionId:
                    newActions[actionIndex]?.availableActionId || "",
                  order: newActions[actionIndex]?.order || 0,
                  metaData:
                    e.target.id === "action-email-input-to"
                      ? {
                          to: e.target.value,
                          body: newActions[actionIndex]?.metaData?.body || "",
                        }
                      : {
                          to: newActions[actionIndex]?.metaData?.to || "",
                          body: e.target.value,
                        },
                };
                return newActions;
              });
            }
          }}
        />
      );
    default:
      return <div>No Data</div>;
  }
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6 text-slate-600"
    >
      <path
        fillRule="evenodd"
        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
