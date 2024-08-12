"use client";

import { userSignUpSchema } from "@repo/common/types/zodTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function () {
  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [name, setName] = useState<string>();

  const handleOnClick = async () => {
    const signUpData = {
      email: email,
      password: password,
      name: name === "" ? undefined : name,
    };
    const parsedData = userSignUpSchema.safeParse(signUpData);
    if (!parsedData.success) {
      alert("Inputs are not valid!");
      return;
    }
    const response = await axios.post("http://localhost:3000/api/signup", {
      email: parsedData.data.email,
      password: parsedData.data.password,
      name: parsedData.data.name,
    });
    if (response.status !== 200) {
      alert("User already exists!");
      return;
    } else {
      alert("User Signed Up");
      router.push("/");
    }
  };

  if (session.status === "loading") return <div>Loading ...</div>;

  if (session.status === "authenticated") router.push("/");

  return (
    <div className="flex justify-center h-screen bg-slate-50">
      <div className="flex flex-col justify-center w-1/4">
        <div className="bg-slate-200 rounded-md p-3 border border-slate-300">
          <div className="text-center font-bold text-zinc-800 text-2xl py-3 bg-slate-300 rounded-md">
            Sign Up
          </div>

          <div className="px-3 py-4">
            <div className="font-bold text-zinc-700">
              Email<span className="text-red-500 p-1">*</span>
            </div>
            <div>
              <input
                className="w-full rounded p-1 mt-1"
                type="text"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="px-3 py-4">
            <div className="font-bold text-zinc-700">
              Password<span className="text-red-500 p-1">*</span>
            </div>
            <div>
              <input
                className="w-full rounded p-1 mt-1"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="px-3 py-4">
            <div className="font-bold text-zinc-700">Name</div>
            <div>
              <input
                className="w-full rounded p-1 mt-1"
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex px-3 py-4 justify-center">
            <button
              className="bg-blue-400 rounded-md p-2 hover:bg-blue-500 text-zinc-800 font-bold"
              onClick={() => {
                handleOnClick();
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
