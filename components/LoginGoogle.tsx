'use client'

import { signIn } from "next-auth/react";
import React from "react";
import { FaGoogle } from "react-icons/fa";

type Props = {};

const LoginGoogle = (props: Props) => {
  return (
    <div
      onClick={() => signIn("google", { redirectTo: "/dashboard" })}
      className="w-full gap-4 hover:cursor-pointer mt-6 h-12 bg-slate-700 rounded-md p-4 flex items-center justify-center"
    >
      <FaGoogle className="w-6 h-6 text-white" />
      <p className="text-white">Sign In with Google</p>
    </div>
  );
};

export default LoginGoogle;
