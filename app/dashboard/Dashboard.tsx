"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  session: any;
};

const Dashboard = ({ session }: Props) => {
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (
      searchParams.get("requestSuccess") === "true" ||
      searchParams.get("updateSuccess") === "true"
    ) {
      setShowPopup(true);

      const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      const hideTimer = setTimeout(() => {
        setShowPopup(false);
        setFadeOut(false);
      }, 4000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [searchParams]);

  return (
    <div className="flex h-full items-center justify-center flex-col gap-2 relative">
      <h1 className="text-3xl font-display">Dashboard</h1>
      <p className="text-2xl">Hi, {session.user.email}</p>

      {showPopup && (
        <div
          className={`absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-1000 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {searchParams.get("requestSuccess") === "true" ? (
            <>Request submitted successfully!</>
          ) : (
            <>Schedule updated successfully!</>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
