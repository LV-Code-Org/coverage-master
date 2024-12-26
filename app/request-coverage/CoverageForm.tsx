"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SVGComponent from "../schedule/SvgComponent";

type Props = {
  callback: (date: string, startTime: string, endTime: string) => void;
  email: string;
};

const expandDate = (date: string) => {
  const [yyyy, mm, dd] = date.split("-");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${months[parseInt(mm, 10) - 1]} ${dd}, ${yyyy}`;
};

const CoverageForm = ({ callback, email }: Props) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    if (date === "" || startTime === "" || endTime === "") {
      return;
    }
    e.preventDefault();
    callback(date, startTime, endTime);
    router.push("/dashboard?requestSuccess=true");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get-outgoing-requests?email=${encodeURIComponent(
            email
          )}`
        );
        const result = await response.json();

        if (result.success) {
          setRequests(result.data);
        } else {
          console.error("Failed to fetch requests:", result.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [email]);

  return (
    <div className="flex h-screen">
      <div className="bg-secondary-light-60 border-r dark:border-secondary-dark dark:bg-background-dark-60 flex flex-col p-8 w-1/2">
        <div className="py-8">
          <h2 className="text-4xl font-bold py-8">Request Coverage</h2>
          <p>
            Schedule the time that you'll need coverage and submit it to
            administration here.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-rows-4 gap-8">

          <div>
            <label htmlFor="date" className="block text-lg font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-tertiary-light rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light dark:focus:ring-primary-dark dark:focus:border-primary-dark dark:bg-background-dark"
              required
            />
          </div>

          <div>
            <label
              htmlFor="start-time"
              className="block text-lg font-medium mb-2"
            >
              Start Time
            </label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 dark:border-tertiary-light rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light dark:focus:ring-primary-dark dark:focus:border-primary-dark dark:bg-background-dark"
              required
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-lg font-medium mb-2"
            >
              End Time
            </label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 dark:border-tertiary-light rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light dark:focus:ring-primary-dark dark:focus:border-primary-dark dark:bg-background-dark"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-primary-light dark:bg-primary-dark hover:bg-primary-dark text-white font-medium rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold py-8">Outgoing Requests</h2>

        <div>
          <SVGComponent translatey={20} />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-background-dark dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Start
                    </th>
                    <th scope="col" className="px-6 py-3">
                      End
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={3}>No requests found.</td>
                    </tr>
                  )}
                  {requests.map(({ date, startTime, endTime }, idx) => (
                    <tr
                      key={idx}
                      className={
                        "bg-white dark:bg-secondary-dark dark:border-gray-700" +
                        (idx === requests.length - 1 ? "" : " border-b")
                      }
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {expandDate(date)}
                      </th>
                      <td className="px-6 py-4">{startTime}</td>
                      <td className="px-6 py-4">{endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-8"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverageForm;
