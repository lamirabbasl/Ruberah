import Navbar from "@/components/common/Navbar";
import WatchVideos from "@/components/Enroll/WatchVideos";
import React from "react";

function EnrollVideos() {
  return (
    <div className=" w-screen h-screen overflow-hidden ">
      <Navbar />
      <WatchVideos />
    </div>
  );
}

export default EnrollVideos;
