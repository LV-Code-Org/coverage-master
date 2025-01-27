"use client";

import { FaPlus, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import SVGComponent from "../schedule/SvgComponent";

type Props = { email: string };

interface UserRecord {
  name: string;
}

type ScheduleItem = {
  date: string;
  email: string;
  endTime: string;
  isSub: boolean;
  name: string;
  startTime: string;
  sub: string | null;
  teacher1: string | null;
  teacher2: string | null;
};

const prettifyTimeRange = (timeRange: string) => {
  const convertTo12Hour = (time: string) => {
    let [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "p.m." : "a.m.";
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const [start, end] = timeRange.split(" - ").map(convertTo12Hour);

  const startPeriod = start.slice(-4);
  const endPeriod = end.slice(-4);

  if (startPeriod === endPeriod) {
    return `${start.slice(0, -4)} ${startPeriod} - ${end}`;
  }
  return `${start} - ${end}`;
};

const AdminDashboard = ({ email }: Props) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<
    { teacher: string | null; substitute: string; isOpen: boolean }[]
  >([{ teacher: null, substitute: "", isOpen: false }]);
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [coverages, setCoverages] = useState<ScheduleItem[]>([]);
  const [unresolved, setUnresolved] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (!email) {
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/api/get-all-teachers`
        );
        const result = await response.json();

        if (result.success) {
          setTeachers(result.data.map((item: UserRecord) => item.name).sort());
        } else {
          console.error("Failed to get all users:", result.message);
        }
      } catch (error) {
        console.error("Error getting users:", error);
      }
    };

    checkAdmin();
  }, [email]);

  useEffect(() => {
    const populate = async () => await repopulate_assignment_table();
    populate();
  }, []);

  const toggleDropdown = (index: number) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) => ({
        ...row,
        isOpen: idx === index ? !row.isOpen : false,
      }))
    );
  };

  const handleTeacherSelect = (index: number, teacher: string) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, teacher, isOpen: false } : row
      )
    );
  };

  const handleSubstituteChange = (index: number, substitute: string) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) => (idx === index ? { ...row, substitute } : row))
    );
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { teacher: null, substitute: "", isOpen: false },
    ]);
  };

  const handleDeleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, idx) => idx !== index));
  };

  const repopulate_assignment_table = async () => {
    try {
      if (!email) {
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:5000/api/get-all-coverages-for-date?date=${encodeURIComponent(
          "2024-12-29"
        )}`
      );
      const result = await response.json();

      if (result.success) {
        setCoverages(result.data);
        setUnresolved([]);
        for (const item of result.data) {
          if ((item.teacher1 === null || item.teacher2 === null) && !item.sub) {
            setUnresolved((prev) => [...prev, item]);
          }
        }
        // console.log(unresolved)
      } else {
        console.error("Failed to get all users:", result.message);
      }
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };

  const renderList = (list: ScheduleItem[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="py-2 bg-gray-50 dark:bg-background-dark dark:text-gray-400">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Requester</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Teacher 1</th>
              <th className="px-4 py-2">Teacher 2</th>
            </tr>
          </thead>
          <tbody className="py-2">
            {coverages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              list.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">
                    {prettifyTimeRange(`${item.startTime} - ${item.endTime}`)}
                  </td>
                  {item.sub ? (
                    <>
                      <td colSpan={2} className="px-4 py-2 text-center">
                        {item.sub}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">
                        {item.teacher1 ? item.teacher1 : "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {item.teacher2 ? item.teacher2 : "N/A"}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const assignCoverages = async () => {
    const updatedSubstitutes = rows.reduce((acc, row) => {
      if (row.teacher) acc[row.teacher] = row.substitute;
      return acc;
    }, {} as Record<string, string>);
    setSubstitutes(updatedSubstitutes);

    const popUpAction = () => {
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
    };

    try {
      await fetch(`http://127.0.0.1:5000/api/assign-coverages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: "2024-12-29",
          day: "A",
          substitutes: rows,
        }),
      });
      await repopulate_assignment_table();
      popUpAction();
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="flex h-full justify-center flex-col gap-2 relative p-8">
      <SVGComponent translatey={0} opacity={0.3} />

      {/* Pop-up */}
      {showPopup && (
        <div
          className={`absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-1000 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          Coverages assigned! You can re-assign coverages if necessary by
          clicking the button again.
        </div>
      )}

      <h1 className="text-3xl font-semibold">Welcome, Admin</h1>
      <h3 className="text-1xl pb-3">Today is December 29, 2024</h3>
      <p className="py-2">
        Before assigning coverages, make sure to fill out which substitutes are
        replacing which teachers in the building today.
      </p>
      <table className="animate-slideInDown w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-background-dark dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Teacher
            </th>
            <th scope="col" className="px-6 py-3">
              Substitute replacement
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4">
                <div className="relative inline-block text-left w-full">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="inline-flex w-56 bg-white text-black dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light dark:focus:ring-primary-dark dark:focus:border-primary-dark dark:bg-background-dark"
                  >
                    {row.teacher || "Select a teacher..."}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {row.isOpen && (
                    <div
                      className="absolute z-10 left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-background-dark ring-1 ring-black ring-opacity-5 focus:outline-none"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      <div className="py-1">
                        {teachers.map((teacher, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTeacherSelect(index, teacher)}
                            className="block px-4 py-2 text-sm text-gray-700 dark:bg-background-dark dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {teacher}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-2">
                <input
                  type="text"
                  value={row.substitute}
                  onChange={(e) =>
                    handleSubstituteChange(index, e.target.value)
                  }
                  className="w-full border border-gray-300 dark:border-tertiary-light rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light dark:focus:ring-primary-dark dark:focus:border-primary-dark dark:bg-background-dark"
                  placeholder="Enter substitute name"
                />
              </td>
              <td className="px-6 py-2 text-center">
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        className="mt-4 text-black dark:text-white bg-gray-50 dark:bg-background-dark text-sm px-4 py-2 rounded-md flex items-center justify-content-center space-x-2"
      >
        <FaPlus />
        <p className="">Add Row...</p>
      </button>
      <button
        onClick={assignCoverages}
        className="mt-4 bg-primary-light dark:bg-primary-dark text-sm text-white px-4 py-2 rounded-md cursor-pointer flex items-center space-x-2"
      >
        <BsFillPeopleFill />
        <p className="text-white">Assign Coverages</p>
      </button>

      <div className="py-6">
        {unresolved.length > 0 && (
          <div className="mb-4">
            <h2 className="py-2 my-4 text-white bg-red-400 dark:bg-red-500 rounded-md px-4">
              <FaExclamationTriangle className="inline-block mr-2" />
              You have unresolved coverages
            </h2>
            {renderList(unresolved)}
          </div>
        )}
        <h1 className="text-2xl font-bold my-4">Schedule Table</h1>
        {renderList(coverages)}
      </div>
    </div>
  );
};

export default AdminDashboard;
