"use client";

import { PrimaryButton } from "@repo/ui/PrimaryButton";
import { useRouter } from "next/navigation";

export const CreateZap = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between py-5">
      <div className="text-2xl font-bold">Zaps</div>
      <div>
        <PrimaryButton
          variant="purple"
          onClick={() => {
            router.push("/zap/create");
          }}
        >
          New Zap
        </PrimaryButton>
      </div>
    </div>
  );
};
