"use client";

import { useEffect, useState } from "react";
import { AllZaps } from "@repo/common/types/types";
import axios from "axios";
import { LinkButton } from "@repo/ui/LinkButton";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/LoadingSpinner";

function useZaps() {
  const [zaps, setZaps] = useState<AllZaps>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/zap`).then((response) => {
      setZaps(response.data);
      setLoading(false);
    });
  }, []);

  return { zaps, loading };
}

export const ZapsTable = () => {
  const { zaps, loading } = useZaps();
  const router = useRouter();

  return (
    <div>
      <div className="flex border-y border-slate-300 py-2 px-2">
        <div className="flex-1 text-center"></div>
        <div className="flex-1 text-center font-semibold">Zap ID</div>
        <div className="flex-1 text-center font-semibold">Created At</div>
        <div className="flex-none w-10 text-center"></div>
      </div>
      {loading ? (
        <div className="flex justify-center py-7">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          {zaps?.map((z, index) => (
            <div
              key={index}
              className="flex border-b border-slate-300 py-4 px-2 hover:bg-[#f9f2e6]"
            >
              <div className="flex-1 text-center overflow-scroll">
                <div className="flex h-full">
                  <div className="min-w-[40px] w-[40px] flex items-center bg-[#fbe5dd] rounded-lg">
                    <div className="w-full flex justify-center h-1/2">
                      <img
                        src={z.trigger?.type.image}
                        alt={z.trigger?.type.name}
                        className="w-3/5 rounded-full"
                      />
                    </div>
                  </div>
                  {z.actions.map((a, index) => (
                    <div
                      key={index}
                      className="min-w-[40px] w-[40px] flex items-center bg-[#fbe5dd] rounded-lg ml-2"
                    >
                      <div className="w-full flex justify-center h-1/2">
                        <img
                          src={a.type.image}
                          alt={a.type.name}
                          className="w-3/5 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 text-center text-sm">{z.id}</div>
              <div className="flex-1 text-center text-slate-500 flex items-center justify-center">
                {z.createdAt.toString().substring(11, 19) +
                  " , " +
                  z.createdAt.toString().substring(0, 10)}
              </div>
              <div className="flex-none text-center">
                <div>
                  <LinkButton
                    onClick={() => {
                      router.push(`/zap/${z.id}`);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </LinkButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
