"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

type Props = {
  session: any;
};

const Dashboard = ({ session }: Props) => {
  const searchParams = useSearchParams();
  const [showPopup, setShowPopup] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);

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

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!session.user.email) {
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/api/is-admin?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const result = await response.json();

        if (result.success) {
          setAdmin(result.data);
        } else {
          console.error("Failed to check admin:", result.message);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [session.user.email]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!session.user.email) {
          return;
        }
        const current_date = "2024-12-29";
        const response = await fetch(
          `http://127.0.0.1:5000/api/get-dashboard-info?email=${encodeURIComponent(
            session.user.email
          )}&date=${encodeURIComponent(current_date)}`
        );
        const result = await response.json();

        if (result.success) {
          setOutgoingRequests(result.data.outgoing);
          setIncomingRequests(result.data.covering);
        } else {
          console.error("Failed to fetch data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [session.user.email]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-2 relative p-8">
        Loading...
      </div>
    );
  }

  if (admin) {
    return <AdminDashboard email={session.user.email} />;
  }

  return (
    <div className="flex h-full justify-center flex-col gap-2 relative p-8">
      {/* Pop-up from search parameters */}
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

      {/* Dashboard content */}

      {incomingRequests.length > 0 && (
        <>
          <h2 className="text-lg font-semibold py-4">You're covering</h2>
          <table className="animate-slideInDown w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-background-dark dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  You're covering
                </th>
                <th scope="col" className="px-6 py-3">
                  Full coverage block
                </th>
                <th scope="col" className="px-6 py-3">
                  Time required
                </th>
              </tr>
            </thead>
            <tbody>
              {incomingRequests.map((request, idx) => (
                <tr
                  key={idx}
                  className={
                    "bg-white text-black dark:text-white dark:bg-secondary-dark dark:border-gray-700" +
                    (idx === incomingRequests.length - 1 ? "" : " border-b")
                  }
                >
                  <td className="px-6 py-4">{request.name}</td>
                  <td className="px-6 py-4">
                    {request.startTime} - {request.endTime}
                  </td>
                  <td className="px-6 py-4">
                    {request.teacher1Email == session.user.email
                      ? request.teacher2Email
                        ? "First half"
                        : "Full day"
                      : "Second half"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {outgoingRequests.length > 0 && (
        <>
          <h2 className="text-lg font-semibold py-4">You're covered by</h2>
          <table className="animate-slideInDown w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-background-dark dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Covering you
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {outgoingRequests.map((request, idx) => (
                <tr
                  key={idx}
                  className={
                    "bg-white text-black dark:text-white dark:bg-secondary-dark dark:border-gray-700" +
                    (idx === outgoingRequests.length - 1 ? "" : " border-b")
                  }
                >
                  <td className="px-6 py-4">
                    {request.teacher1}
                    {request.teacher2 && `, ${request.teacher2}`}
                  </td>
                  <td className="px-6 py-4">
                    {request.startTime} - {request.endTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Dashboard;
