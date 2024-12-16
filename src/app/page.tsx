
"use client"; // Mark as client component

import React from "react";
import Camera from "../reusable_component/Camera/page";
import GPS from "../reusable_component/GPS/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";

export default function Dashboard() {
  return (
    <div className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Autonomous Car Dashboard</h1>
      
      {/* Main Grid for Dashboard */}
      <div className="grid grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Left GPS */}
        <div className="flex items-center justify-center p-6 bg-gray-200 rounded-lg shadow-md">
          <GPS />
        </div>

        {/* Center Camera Feed */}
        <div className="flex items-center justify-center p-6 bg-gray-200 rounded-lg shadow-md">
          <Camera />
        </div>

        {/* Right Speedometer */}
        <div className="flex items-center justify-center p-6 bg-gray-200 rounded-lg shadow-md">
          <Speedometer />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex justify-around mt-8">
        <div className="flex flex-col items-center p-6 bg-gray-200 rounded-lg shadow-md">
          <Battery />
        </div>
        <div className="flex flex-col items-center p-6 bg-gray-200 rounded-lg shadow-md">
          <Temperature />
        </div>
      </div>
    </div>
  );
}