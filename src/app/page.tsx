"use client";

import React, { useEffect, useState } from "react";
import { FiBattery, FiCamera, FiMapPin } from "react-icons/fi";
import Camera from "../reusable_component/Camera/page";
import GPS from "../reusable_component/GPS/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";
import axios from "axios";

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
    }, 1000);

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
    <div className="bg-gray-50 min-h-screen w-full flex justify-center items-center p-4 text-gray-900">
      <div className="bg-white w-full max-w-7xl min-h-[85vh] h-auto rounded-xl grid grid-cols-4 gap-6 p-6 shadow-lg border border-gray-200">
        {/* Left Column: Speedometer, GPS, Battery, Temperature */}
        <div className="flex flex-col gap-6 col-span-1">
          {/* Speedometer Component */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-200 rounded-lg shadow-md p-6 transition-transform hover:scale-105 border border-gray-300">
            <Speedometer />
          </div>

          {/* GPS Component */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-green-200 rounded-lg shadow-md p-6 transition-transform hover:scale-105 border border-gray-300">
            <FiMapPin className="text-4xl text-green-600" />
            <GPS gps={data.gps} />
          </div>

          {/* Battery Component */}
          <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-yellow-50 to-yellow-200 rounded-lg shadow-md p-6 transition-transform hover:scale-105 border border-gray-300">
            <Battery battery={data.battery} />
          </div>

          {/* Temperature Component */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-red-200 rounded-lg shadow-md p-6 transition-transform hover:scale-105 border border-gray-300">
            <Temperature />
          </div>
        </div>

        {/* Right Column: Camera */}
        <div className="col-span-3 flex flex-col">
          {/* Camera Component */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-200 rounded-lg shadow-md flex flex-col overflow-hidden transition-transform hover:scale-105 h-full border border-gray-300">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-200 rounded-t-lg border-b border-gray-300">
              <div className="flex items-center gap-2">
                <FiCamera className="text-2xl text-purple-600" />
                <p className="text-lg font-semibold tracking-wide text-purple-600">
                  Live Camera Feed
                </p>
              </div>
              <p className="text-sm text-gray-700">{time}</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="relative w-full h-full">
                {/* Ensure camera feed scales properly without distortion */}
                <Camera
                  camera={data.camera}
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
