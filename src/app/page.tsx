"use client";

import React, { useEffect, useState } from "react";
import { FiBattery, FiCamera, FiMapPin, FiZap } from "react-icons/fi";
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
    camera: { status: "", feed: "" },
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
          camera: response.data.camera || {
            status: "Streaming",
            feed: "http://127.0.0.1:5001",
          },
        });
      } catch (error) {
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-800">Loading data...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 h-screen w-screen flex flex-col p-8 text-gray-900">
      <div className="bg-white h-full w-full rounded-2xl grid grid-cols-4 gap-6 p-6 shadow-xl border border-gray-200">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 h-1/3 rounded-lg shadow-md p-4 transition-transform hover:scale-105">
            <div>
              <Speedometer />  
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 h-1/3 rounded-lg shadow-md p-4 transition-transform hover:scale-105">
            <FiMapPin className="text-4xl text-green-600" />
            <div>
              <GPS gps={data.gps} />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 h-1/3 rounded-lg shadow-md p-4 transition-transform hover:scale-105">
            <FiBattery className="text-4xl text-yellow-600" />
            <div>
              <Battery battery={data.battery} />
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 flex-1 rounded-lg shadow-md flex flex-col overflow-hidden transition-transform hover:scale-105">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-200 rounded-t-lg border-b border-gray-300">
              <div className="flex items-center gap-2">
                <FiCamera className="text-2xl text-purple-600" />
                <p className="text-lg font-semibold tracking-wide text-purple-600">Live Camera Feed</p>
              </div>
              <p className="text-sm text-gray-700">{time}</p>
            </div>
            <div className="flex-1">
              <Camera camera={data.camera} />
            </div>
          </div>
          <Temperature />
        </div>
      </div>
    </div>
  );
}
