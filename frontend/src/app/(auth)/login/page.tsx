"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apilogin";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(username);
    if (success) {
      router.push("/home");
    } else {
      setError(
        "Login failed.\nYou can continue without logging in, but access will be limited to the Home page only.\nIf you try to access other features, the system will redirect you to log in again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className=" md:hidden bg-[#2F5F3E] flex flex-col items-center justify-center pt-40 pb-10 px-6 rounded-b-[2rem]">
        <Image
          src="/login-art.png"
          alt="Login Illustration"
          width={128}
          height={128}
          className="w-32 h-auto mb-2"
        />

        <p className="text-white italic text-lg">a Board</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#1E2D24] py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6 px-6"
        >
          <h2 className="text-white text-2xl font-semibold text-start">
            Sign in
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded border text-white border-gray-300 focus:outline-none"
          />

          {error && (
            <div className="text-sm space-y-1">
              {error.split("\n").map((line, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "text-red-400 font-medium"
                      : "text-white text-xs leading-snug"
                  }
                >
                  {line}
                </p>
              ))}

              <Link
                href="/home"
                className="block text-center mt-2 text-sm text-green-400 underline hover:text-green-300"
              >
                Access without logging in Go to Home page
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Sign In
          </button>
        </form>
      </div>

      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#2F5F3E] rounded-bl-[2rem]">
        <Image
          src="/login-art.png"
          alt="Login Illustration"
          width={200}
          height={150}
          className="w-auto h-auto mb-4 m-4"
        />
        <p className="text-white italic text-xl">a Board</p>
      </div>
    </div>
  );
}
