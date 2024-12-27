"use client"; // Mark as client component

import React from "react";
import Camera from "../reusable_component/Camera/page";
import GPS from "../reusable_component/GPS/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";


export default function Dashboard() {
  return (
    <div className="bg-zinc-700 h-screen w-screen flex flex-col p-8">
      <div className="bg-black h-full w-full rounded-2xl grid grid-cols-4 gap-4 p-4">
        
        {/* Left Column: Three Small Cards */}
        <div className="flex flex-col gap-4">

          {/* Speedometer */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
          < Speedometer />
          </div>

          {/* GPS  */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
          </div>

          {/* Battery */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
          </div>

        </div>

        {/* Right Column: Camera and Time */}
        <div className="col-span-3 flex flex-col gap-4">
          
          {/* Camera */}
          <div className="bg-zinc-800 flex-1 rounded-lg">
            {/* Camera content */}
          </div>

          {/* Time */}
          <div className="bg-zinc-800 h-40 rounded-lg">
            {/* Time content */}
          </div>
        </div>
      </div>
    </div>
  );
}


