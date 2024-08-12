"use client";

import { PrimaryButton } from "@repo/ui/PrimaryButton";
import { SecondaryButton } from "@repo/ui/SecondaryButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center py-20 px-5">
      <div className="flex flex-col items-center w-3/4">
        <div className="text-6xl font-semibold max-w-3xl text-center">
          Automate as fast as you can type
        </div>

        <div className="text-2xl font-normal text-center py-7">
          AI gives you automation superpowers, and Zapier puts them to work.
          Pairing AI and Zapier helps you turn ideas into workflows and bots
          that work for you.
        </div>

        <div className="flex">
          <div className="px-2">
            <PrimaryButton
              onClick={() => {
                router.push("/signup");
              }}
              size="large"
            >
              Start free with email
            </PrimaryButton>
          </div>
          <div className="px-2">
            <SecondaryButton
              onClick={() => {
                router.push("/signup");
              }}
              size="large"
            >
              Start free with Google
            </SecondaryButton>
          </div>
        </div>

        <div className="pt-7">
          <video
            src="https://res.cloudinary.com/zapier-media/video/upload/f_auto,q_auto/v1706042175/Homepage%20ZAP%20Jan%2024/012324_Homepage_Hero1_1920x1080_pwkvu4.mp4"
            controls={false}
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>
    </div>
  );
};
