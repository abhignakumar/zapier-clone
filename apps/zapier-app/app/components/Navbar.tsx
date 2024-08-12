"use client";

import { LinkButton } from "@repo/ui/LinkButton";
import { PrimaryButton } from "@repo/ui/PrimaryButton";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex justify-between px-8 py-3 border-b">
      <div className="flex">
        <div
          className="flex items-center font-extrabold text-2xl cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Zapier
        </div>
        {session.status === "authenticated" && (
          <div className="ml-6">
            <LinkButton
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Dashboard
            </LinkButton>
          </div>
        )}
      </div>

      <div className="flex items-center">
        {session.status !== "authenticated" ? (
          <div className="flex items-center">
            <div className="mr-4">
              <LinkButton
                onClick={() => {
                  signIn();
                }}
              >
                Log in
              </LinkButton>
            </div>
            <div>
              <PrimaryButton
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Sign up
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div>
            <PrimaryButton
              onClick={() => {
                signOut();
              }}
            >
              Log Out
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};
