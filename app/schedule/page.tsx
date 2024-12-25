import React from "react";
import withAuth from "@/lib/withAuth";
import EditSchedule from "./EditSchedule";
import { postRequest } from "@/lib/postRequest";

type Props = { session: any };

const Page = async ({ session }: Props) => {
  const handleSubmit = async (
    ap: number | null,
    bp: number | null,
    al: number | null,
    bl: number | null
  ) => {
    "use server";
    try {
      const result = await postRequest<{ success: boolean; message: string }>(
        "/api/update-schedule",
        { ap, bp, al, bl, email: session.user.email }
      );

      console.log("Server Response:", result);
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  return <EditSchedule callback={handleSubmit} email={session.user.email} />;
};

export default withAuth(Page);
