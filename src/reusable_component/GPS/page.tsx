// src/reusable_component/Gps/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Gps = () => {
  const [gpsData, setGpsData] = useState({
    speed: "",
    location: "",
    direction: "",
  });

  useEffect(() => {
    // Fetch GPS data from the backend
    const fetchGpsData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gps");
        setGpsData(response.data);
      } catch (error) {
        console.error("Error fetching GPS data:", error);
      }
    };

    fetchGpsData();
  }, []);

  return (
    <div>
      <h2>GPS Data</h2>
      <p>Location: {gpsData.location}</p>
      <p>Direction: {gpsData.direction}</p>
    </div>
  );
};

export default Gps;