"use client"; // Mark as client component

import React, { useEffect, useState } from "react";
import Camera from "../reusable_component/Camera/page";
import GPS from "../reusable_component/GPS/page";
import Speedometer from "../reusable_component/Speedometer/page";
import Battery from "../reusable_component/Battery/page";
import Temperature from "../reusable_component/Temperature/page";
import axios from "axios"; // Make sure to install axios

export default function Dashboard() {
  const [time, setTime] = useState<string>("");

  // State for centralized data
  const [data, setData] = useState({
    temperature: { internal: "", external: "" },
    speed: "",
    gps: { latitude: 0, longitude: 0 },
    battery: { percentage: 0, health: "" },
    camera: { status: "", feed: "" }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from backend...");
        const response = await axios.get("http://localhost:3001/api/data");
        console.log("Data received from backend:", response.data);

        setData({
          temperature: {
            internal: response.data.temperature.internal || "Unknown", // Assuming backend provides internal temperature
            external: response.data.temperature.external || "Unknown"
          },
          speed: response.data.speed || "Unknown",
          gps: response.data.gps || { latitude: 0, longitude: 0 },
          battery: response.data.battery || { percentage: 75, health: "Good" }, // Replace with actual data if provided
          camera: response.data.camera || { status: "Streaming", feed: "http://127.0.0.1:5000" } // Example camera feed
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Update the time every second
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-zinc-700 h-screen w-screen flex flex-col p-8">
      <div className="bg-black h-full w-full rounded-2xl grid grid-cols-4 gap-4 p-4">
        
        {/* Left Column: Three Small Cards */}
        <div className="flex flex-col gap-4">

          {/* Speedometer */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
            <Speedometer speed={data.speed} />
          </div>

          {/* GPS */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
            <GPS gps={data.gps} />
          </div>

          {/* Battery */}
          <div className="bg-zinc-800 h-1/3 rounded-lg">
            <Battery battery={data.battery} />
          </div>

        </div>

        {/* Right Column: Camera and Time */}
        <div className="col-span-3 flex flex-col gap-4">
          
          {/* Camera */}
          <div className="bg-zinc-800 flex-1 rounded-lg">
            <Camera camera={data.camera} />
          </div>

          {/* Time */}
          <div className="bg-zinc-800 h-40 rounded-lg flex items-center justify-center text-2xl text-white">
            <p>{time}</p> {/* Display current time */}
          </div>
        </div>
      </div>
    </div>
  );
}