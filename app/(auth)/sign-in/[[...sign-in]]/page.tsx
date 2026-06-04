import { SignIn } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="p-4 h-screen w-full flex-center flex-col bg-gray-800">
      {/* <h1 className="text-3xl mb-4 text-center font-semibold text-black">
        Sign in as a Technician
      </h1> */}
      <SignIn />
    </div>
  );
};

export default page;
