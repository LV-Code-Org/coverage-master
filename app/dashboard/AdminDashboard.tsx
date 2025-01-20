"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import SVGComponent from "../schedule/SvgComponent";

type Props = { email: string };

interface UserRecord {
  name: string;
}

const AdminDashboard = ({ email }: Props) => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<
    { teacher: string | null; substitute: string; isOpen: boolean }[]
  >([{ teacher: null, substitute: "", isOpen: false }]);

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

  const assignCoverages = async () => {
    const updatedSubstitutes = rows.reduce((acc, row) => {
      if (row.teacher) acc[row.teacher] = row.substitute;
      return acc;
    }, {} as Record<string, string>);
    setSubstitutes(updatedSubstitutes);

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
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="flex h-full justify-center flex-col gap-2 relative p-8">
      <SVGComponent translatey={0} opacity={0.3} />

      <h1 className="text-3xl font-semibold">Welcome, Admin</h1>
      <h3 className="text-1xl pb-5">Today is January 20, 2025</h3>
      <p>
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
    </div>
  );
};

export default AdminDashboard;
