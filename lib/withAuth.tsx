import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ComponentType } from "react";

const withAuth = <P extends object>(Component: ComponentType<P & { session: any }>) => {
  const Wrapper = async (props: P) => {
    const session = await auth();

    if (!session?.user) {
      redirect("/sign-in");
      return null;
    }

    return <Component {...props} session={session} />;
  };

  return Wrapper;
};

export default withAuth;
