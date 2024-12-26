import React from "react";
import withAuth from "@/lib/withAuth";
import CoverageForm from "./CoverageForm";
import { postRequest } from "@/lib/postRequest";

type Props = { session: any };

const RequestCoverage = async ({ session }: Props) => {
  const handleSubmit = async (
    date: string,
    startTime: string,
    endTime: string
  ) => {
    "use server";
    try {
      const result = await postRequest<{ success: boolean; message: string }>(
        "/api/submit-request",
        {
          date,
          startTime,
          endTime,
          email: session.user.email,
          name: session.user.name,
        }
      );

      console.log("Server Response:", result);
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  return <CoverageForm callback={handleSubmit} email={session.user.email} />;
};

export default withAuth(RequestCoverage);
