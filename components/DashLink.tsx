"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

type Props = { email: string | null | undefined };

const DashLink = ({ email }: Props) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (!email) {
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/api/is-admin?email=${encodeURIComponent(
            email
          )}`
        );
        const result = await response.json();

        if (result.success) {
          setIsAdmin(result.data);
        } else {
          console.error("Failed to check admin:", result.message);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [email]);

  if (loading || !email) {
    return;
  }

  if (!isAdmin) {
    return (
      <>
        <Link href={"/dashboard"}>Dashboard</Link>
        <Link href={"/schedule"}>Schedule</Link>
      </>
    );
  }

  return <Link href={`/dashboard?admin=true`}>Dashboard</Link>;
};

export default DashLink;
