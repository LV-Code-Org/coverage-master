"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type Props = {
  callback: (
    ap: number | null,
    bp: number | null,
    al: number | null,
    bl: number | null
  ) => void;
  email: string;
};

const EditSchedule = ({ callback, email }: Props) => {
  const [aDayPrep, setADayPrep] = useState<number | null>(1);
  const [bDayPrep, setBDayPrep] = useState<number | null>(2);
  const [aDayLunch, setADayLunch] = useState<number | null>(1);
  const [bDayLunch, setBDayLunch] = useState<number | null>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const buttonStyles = (selected: boolean) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      selected ? "bg-primary text-white" : "bg-gray-200 hover:bg-gray-300"
    }`;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get-schedule?email=${encodeURIComponent(
            email
          )}`
        );
        const result = await response.json();

        if (result.success) {
          setADayPrep(result.data.prepA || 1);
          setBDayPrep(result.data.prepB || 2);
          setADayLunch(result.data.lunchA || 1);
          setBDayLunch(result.data.lunchB || 1);
        } else {
          console.error("Failed to fetch schedule:", result.message);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-10 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Schedule
        </h2>
        <form className="space-y-8">
          {/* A-Day Prep */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              A-Day Prep
            </label>
            <div className="flex space-x-4">
              {[1, 3, 5, 7].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={buttonStyles(aDayPrep === option)}
                  onClick={() => setADayPrep(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* B-Day Prep */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              B-Day Prep
            </label>
            <div className="flex space-x-4">
              {[2, 4, 6, 8].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={buttonStyles(bDayPrep === option)}
                  onClick={() => setBDayPrep(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* A-Day Lunch */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              A-Day Lunch
            </label>
            <div className="flex space-x-4">
              {[1, 2, 3].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={buttonStyles(aDayLunch === option)}
                  onClick={() => setADayLunch(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* B-Day Lunch */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              B-Day Lunch
            </label>
            <div className="flex space-x-4">
              {[1, 2, 3].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={buttonStyles(bDayLunch === option)}
                  onClick={() => setBDayLunch(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded px-6 py-2"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white rounded px-6 py-2"
              onClick={async (e) => {
                e.preventDefault();
                await callback(aDayPrep, bDayPrep, aDayLunch, bDayLunch);
                router.push("/dashboard?updateSuccess=true");
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchedule;
