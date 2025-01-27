"use client";

import React, { useEffect, useState } from "react";
import { FiBattery, FiCamera, FiMapPin } from "react-icons/fi";
import Camera from "../reusable_component/Camera/page";
import GPS from "../reusable_component/Gps/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [time, setTime] = useState<string>("");
  const [data, setData] = useState({
    speed: "",
    gps: { latitude: 0, longitude: 0 },
    battery: { percentage: 0, health: "" },
    camera: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/data");
        setData({
          speed: response.data.speed || "Unknown",
          gps: response.data.gps || { latitude: 0, longitude: 0 },
          battery: response.data.battery || { percentage: 0, health: "Good" },
          camera: response.data.camera || "",
        });
      } catch (error) {
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData(); // Refresh data every second
    }, 10);

    const timeInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup intervals
      clearInterval(timeInterval);
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-800">
        Loading data...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-[#F9FCFF] min-h-screen w-full flex flex-col justify-center items-center p-4 text-[#1A2D42]">
      <div className="bg-[#FFFFFF] w-full max-w-7xl h-full rounded-xl grid grid-cols-[3fr_5fr] gap-6 p-6 shadow-lg border border-[#AAB7B7]">
        {/* Left Column: Temperature & Speedometer */}
        <div className="flex flex-col gap-6">
          {/* Temperature */}
          <div className="h-1/2 bg-gradient-to-r from-[#D4D8DD] to-[#C0C8CA] rounded-lg shadow-md p-6 flex flex-col justify-center items-center gap-4 border border-[#AAB7B7]">
            <Temperature />
            <Link
              href="/TPdata"
              className="mt-4 px-4 py-2 bg-[#2E4156] text-white rounded-lg shadow-md hover:bg-[#1A2D42] transition"
            >
              View Details
            </Link>
          </div>

          {/* Speedometer */}
          <div className="h-1/2 bg-gradient-to-r from-[#D4D8DD] to-[#C0C8CA] rounded-lg shadow-md p-6 flex items-center gap-4 border border-[#AAB7B7]">
            <Speedometer />
          </div>
        </div>

        {/* Right Column: Camera, Battery, GPS */}
        <div className="flex flex-col gap-6">
          {/* Camera */}
          <div className="h-2/3 bg-gradient-to-r from-[#D4D8DD] to-[#C0C8CA] rounded-lg shadow-md border border-[#AAB7B7] flex flex-col overflow-hidden transition-transform hover:scale-105">
            <div className="flex justify-between items-center px-6 py-4 bg-[#AAB7B7] rounded-t-lg border-b border-[#AAB7B7]">
              <div className="flex items-center gap-2">
                <FiCamera className="text-2xl text-[#2E4156]" />
                <p className="text-lg font-semibold tracking-wide text-[#2E4156]">
                  Live Camera Feed
                </p>
              </div>
              <p className="text-sm text-[#1A2D42]">{time}</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <Camera
                camera={data.camera}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Battery & GPS */}
          <div className="h-1/3 grid grid-cols-2 gap-6">
            {/* Battery */}
            <div className="bg-gradient-to-r from-[#D4D8DD] to-[#C0C8CA] rounded-lg shadow-md p-6 flex items-center gap-4 border border-[#AAB7B7]">
              <Battery battery={data.battery} />
            </div>
            {/* GPS */}
            <Link
              href="/map"
              className="bg-gradient-to-r from-[#D4D8DD] to-[#C0C8CA] rounded-lg shadow-md p-6 flex items-center gap-4 border border-[#AAB7B7]"
            >
              <FiMapPin className="text-4xl text-[#2E4156]" />
              <div className="text-lg text-[#1A2D42]">
                Click to view the location of the car
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
