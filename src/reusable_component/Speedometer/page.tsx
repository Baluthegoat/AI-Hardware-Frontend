import React from "react";

interface SpeedometerProps {
  speed: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3>Speed</h3>
      <p>{speed} km/h</p>
    </div>
  );
};

export default Speedometer;