import React from "react";
import withAuth from "@/lib/withAuth";

type Props = { session: any };

const Page = async ({ session }: Props) => {
  return (
    <div className="flex h-full items-center justify-center flex-col gap-2">
      <h1 className="text-3xl font-display">Dashboard</h1>
      <p className="text-2xl">Hi, {session.user.email}</p>
    </div>
  );
};

export default withAuth(Page);
