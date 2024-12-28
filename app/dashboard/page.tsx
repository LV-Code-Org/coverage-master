import React from "react";
import withAuth from "@/lib/withAuth";
import Dashboard from "./Dashboard";

type Props = { session: any };

const Page = async ({ session }: Props) => {
  return <Dashboard session={session} />;
};

export default withAuth(Page);
