import Navbar from "@/components/common/Navbar";
import Signup from "@/components/common/Signup";
import React from "react";

function page() {
  return (
    <div className=" w-screen h-screen overflow-hidden ">
      <Navbar />
      <Signup />
    </div>
  );
}

export default page;
