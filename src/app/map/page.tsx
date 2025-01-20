"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const DynamicMap = dynamic(() => import('../../reusable_component/Gps/page'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg"></div>
});

interface GpsData {
  latitude: number;
  longitude: number;
}

const MapPage = () => {
  const router = useRouter();
  const [gpsData, setGpsData] = useState<GpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/data');
        const data = await response.json();
        
        if (data.gps) {
          setGpsData(data.gps);
          setError(null);
        } else {
          setError('No GPS data available');
        }
      } catch (error) {
        console.error('Error fetching GPS data:', error);
        setError('Failed to fetch GPS data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center justify-start p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center w-full flex-1 p-6">
        <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            View Car Location on the Map
          </h1>
          <div className="h-96 bg-gray-300 rounded-lg border border-gray-200">
            {loading && (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-600">Loading map...</span>
              </div>
            )}
            {error && (
              <div className="h-full w-full flex items-center justify-center bg-red-50">
                <span className="text-red-600">{error}</span>
              </div>
            )}
            {!loading && !error && gpsData && <DynamicMap gpsData={gpsData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;