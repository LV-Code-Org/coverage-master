import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth } from "@/auth";
import Logout from "./Logout";
import RequestCoverage from "./RequestCoverage";
import DarkModeToggle from "./DarkModeToggle";

type Props = {};

const Navbar = async (props: Props) => {
  const session = await auth();
  return (
    <nav className="border-b border-gray-300 dark:border-tertiary-light bg-background w-full flex items-center px-8">
      <div className="flex w-full items-center justify-between my-4">
        {!session?.user ? (
          <Link href={"/"} className="font-bold">
            Coverage Master
          </Link>
        ) : (
          <div className="flex items-center gap-x-2 text-sm">
            {session.user.image && (
              <Image
                src={session.user.image}
                width={35}
                height={35}
                alt="User Avatar"
                className="rounded-full"
              />
            )}{" "}
            {session.user.name}
          </div>
        )}

        <div className="flex items-center gap-x-5">
          <Link href={"/dashboard"}>Dashboard</Link>
          {session?.user && (
            <>
              <Link href={"/schedule"}>Schedule</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-x-5">
          {!session?.user ? (
            <Link href="/sign-in">
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                Sign In
              </div>
            </Link>
          ) : (
            <>
              <DarkModeToggle />
              <Logout />
              <RequestCoverage />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
