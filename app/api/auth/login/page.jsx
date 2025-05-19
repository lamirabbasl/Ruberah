import React from "react";
import HomeEnroll from "@/components/Enroll/HomeEnroll";
import Navbar from "@/components/common/Navbar";
import Login from "@/components/common/Login";

function Enroll() {
  return (
    <div className=" w-screen h-screen  ">
      <Navbar />
      <Login />
    </div>
  );
}

export default Enroll;
