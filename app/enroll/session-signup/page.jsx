import Navbar from "@/components/common/Navbar";
import SessionSignup from "@/components/Enroll/SessionSignup";
import React from "react";

function page() {
  return (
    <div className=" w-screen h-screen overflow-hidden ">
      <Navbar />
      <SessionSignup />
    </div>
  );
}

export default page;
