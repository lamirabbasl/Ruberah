"use client";


import FirstPageSetting from "@/components/admin/FirstPageSetting";
import React, { useState } from "react";

const FirstPage = () => {
  return (
    <div className="w-5/6 max-md:w-screen whitespace-nowrap  max-md:pt-14 max-md:text-sm min-h-screen bg-white text-black">
      <FirstPageSetting />
    </div>
  );
};

export default FirstPage;
