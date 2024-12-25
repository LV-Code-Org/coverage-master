"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

type Props = {};

const RequestCoverageBtn = (props: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/request-coverage")}
      className="bg-primary-light dark:bg-primary-dark text-sm text-white px-4 py-2 rounded-md cursor-pointer flex items-center space-x-2"
    >
      <FaPlus />
      <p className="text-white">Request Coverage</p>
    </div>
  );
};

export default RequestCoverageBtn;
