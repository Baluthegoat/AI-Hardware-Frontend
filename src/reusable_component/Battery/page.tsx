// src/reusable_component/Battery/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Battery = () => {
  const [batteryData, setBatteryData] = useState({
    percentage: 0,
    health: "",
  });

  useEffect(() => {
    // Fetch battery data from the backend
    const fetchBatteryData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/battery");
        setBatteryData(response.data);
      } catch (error) {
        console.error("Error fetching battery data:", error);
      }
    };

    fetchBatteryData();
  }, []); // Run this effect only once when the component mounts

  return (
    <div>
      <h2>Battery Data</h2>
      <p>Percentage: {batteryData.percentage}%</p>
      <p>Health: {batteryData.health}</p>
    </div>
  );
};

export default Battery;