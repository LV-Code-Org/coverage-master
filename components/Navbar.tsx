import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth } from "@/auth";
import Logout from "./Logout";
import RequestCoverage from "./RequestCoverage";
import DarkModeToggle from "./DarkModeToggle";
import DashLink from "./DashLink";

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
          {session?.user && (
            <>
              <DashLink email={session?.user?.email} />
            </>
          )}
        </div>

        <div className="flex items-center gap-x-5">
          {!session?.user ? (
            <Link href="/sign-in">
              <div className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-md">
                Sign In
              </div>
            </Link>
          ) : (
            <>
              <Logout />
              <RequestCoverage />
            </>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
