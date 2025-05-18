import Navbar from "@/components/common/Navbar";
import SessionDetail from "@/components/Enroll/SessionDetail";
import React from "react";

function page() {
  return (
    <div className=" w-screen h-screen  ">
      <Navbar />
      <SessionDetail />
    </div>
  );
}

export default page;
