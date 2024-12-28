"use client";

import React, { useState, useEffect } from "react";

type Props = { email: string };

const AdminDashboard = ({ email }: Props) => {
  // TODO: redirect to /dashboard if not admin
  const assignCoverages = async () => {
    try {
      await fetch(`http://127.0.0.1:5000/api/assign-coverages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: "2024-12-29", day: "A" }),
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <button
      onClick={async () => await assignCoverages()}
      className="p-2 bg-primary-light text-white dark:bg-primary-dark"
    >
      Assign Coverages
    </button>
  );
};

export default AdminDashboard;
