import Navbar from "@/components/common/Navbar";
import HomeSessions from "@/components/Enroll/HomeSessions";
import React from "react";

function page() {
  return (
    <div className=" w-screen h-screen ">
      <Navbar />
      <HomeSessions />
    </div>
  );
}

export default page;
