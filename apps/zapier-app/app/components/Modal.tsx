import { Action, AvailableTA, Trigger } from "@repo/common/types/types";
import { Dispatch, SetStateAction } from "react";

export const Modal = ({
  type,
  actionIndex,
  onClose,
  availableTriggers,
  availableActions,
  setPGTrigger,
  setPGActions,
}: {
  type: "trigger" | "action";
  actionIndex: number;
  onClose: () => void;
  availableTriggers?: AvailableTA[];
  availableActions?: AvailableTA[];
  setPGTrigger: Dispatch<SetStateAction<Trigger>>;
  setPGActions: Dispatch<SetStateAction<Action[]>>;
}) => {
  function handleOnClick(ta: AvailableTA) {
    if (type === "trigger") {
      setPGTrigger({
        availableTriggerId: ta.id,
      });
    } else {
      setPGActions((prev) => {
        const newActions = [...prev];
        newActions[actionIndex] = {
          availableActionId: ta.id,
          order: actionIndex,
          metaData: newActions[actionIndex]?.metaData,
        };
        return newActions;
      });
    }
    onClose();
  }

  return (
    <div
      tabIndex={-1}
      aria-hidden="true"
      className="flex bg-zinc-500 bg-opacity-35 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] min-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {type === "trigger" ? "Select Trigger" : "Select Action"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-3 space-y-4">
            {type === "trigger"
              ? availableTriggers?.map((t, index) => (
                  <div
                    key={index}
                    className="flex hover:bg-[#f8f4ec] p-2 rounded-lg cursor-pointer"
                    onClick={() => handleOnClick(t)}
                  >
                    <div className="w-[40px] h-[40px] flex items-center bg-[#fbe5dd] rounded-lg">
                      <div className="w-full flex justify-center h-1/2">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-3/5 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center ml-4 font-semibold text-slate-700">
                      {t.name}
                    </div>
                  </div>
                ))
              : availableActions?.map((a, index) => (
                  <div
                    key={index}
                    className="flex hover:bg-[#f8f4ec] p-2 rounded-lg cursor-pointer"
                    onClick={() => handleOnClick(a)}
                  >
                    <div className="w-[40px] h-[40px] flex items-center bg-[#fbe5dd] rounded-lg">
                      <div className="w-full flex justify-center h-1/2">
                        <img
                          src={a.image}
                          alt={a.name}
                          className="w-3/5 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center ml-4 font-semibold text-slate-700">
                      {a.name}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
