"use client";

import { signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";
import React from "react";

type Props = {};

const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

const Logout = (props: Props) => {
  return (
    <div
      onClick={async () => await logout()}
      className="bg-gray-600 text-sm text-white px-4 py-2 rounded-md cursor-pointer"
    >
      Logout
    </div>
  );
};

export default Logout;
