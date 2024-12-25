import React from "react";
import LoginGoogle from "@/components/LoginGoogle"

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="w-full flex mt-20 justify-center">
      <div className="flex flex-col w-[400px]">
        <h1 className="text-4xl w-full text-center font-bold mb-10">Sign In</h1>
        <LoginGoogle />
      </div>
    </div>
  );
};

export default Page;
