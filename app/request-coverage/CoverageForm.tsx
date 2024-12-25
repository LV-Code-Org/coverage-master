"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  callback: (date: string, startTime: string, endTime: string) => void;
};

const CoverageForm = ({ callback }: Props) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    callback(date, startTime, endTime);
    router.push("/dashboard?requestSuccess=true");
  };

  return (
    <div className="p-8 bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Request Coverage
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label
              htmlFor="start-time"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Start Time
            </label>
            <input
              type="time"
              id="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label
              htmlFor="end-time"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              End Time
            </label>
            <input
              type="time"
              id="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-medium rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoverageForm;
