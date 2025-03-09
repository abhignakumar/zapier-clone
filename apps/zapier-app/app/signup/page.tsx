"use client";

import { userSignUpSchema } from "@repo/common/types/zodTypes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function SignUp() {
  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleOnClick = async () => {
    setError("");

    const signUpData = {
      email: email,
      password: password,
      name: name === "" ? undefined : name,
    };

    const parsedData = userSignUpSchema.safeParse(signUpData);
    if (!parsedData.success) {
      setError("Please enter valid email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
      });

      if (response.status !== 200) {
        setError("User already exists!");
        return;
      }

      alert("User signed up successfully!");
      router.push("/");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  };

  if (session.status === "loading") return <div>Loading...</div>;
  if (session.status === "authenticated") router.push("/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Create an Account
        </h1>
        <p className="text-slate-600 mb-6 text-sm">
          Sign up to get started with your account.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-3 rounded-lg mb-4 text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleOnClick}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
