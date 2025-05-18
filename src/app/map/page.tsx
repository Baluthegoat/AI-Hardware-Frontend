// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FiArrowLeft } from "react-icons/fi";
// import dynamic from "next/dynamic";
// import "leaflet/dist/leaflet.css";

// const DynamicMap = dynamic(() => import("../../reusable_component/GPS/page"), {
//   ssr: false,
//   loading: () => <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg"></div>
// });

// interface GpsData {
//   latitude: number;
//   longitude: number;
// }

// const MapPage = () => {
//   const router = useRouter();
//   const [gpsData, setGpsData] = useState<GpsData | null>(null);
//   const [searchedLocation, setSearchedLocation] = useState<GpsData | null>(null);
//   const [markedLocations, setMarkedLocations] = useState<GpsData[]>([]);
//   const [routeData, setRouteData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [trackingCar, setTrackingCar] = useState(true);
//   const [notifications, setNotifications] = useState<string[]>([]); // Notifications state

//   // Fetch Car GPS Data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:3001/api/data");
//         const data = await response.json();

//         if (data.gps) {
//           setGpsData(data.gps);
//           setError(null);
//         } else {
//           setError("No GPS data available");
//         }
//       } catch (error) {
//         console.error("Error fetching GPS data:", error);
//         setError("Failed to fetch GPS data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Handle Search for Custom Location
//   const handleSearch = async () => {
//     if (!searchQuery) return;

//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
//       );
//       const data = await response.json();

//       if (data.length > 0) {
//         setSearchedLocation({
//           latitude: parseFloat(data[0].lat),
//           longitude: parseFloat(data[0].lon),
//         });
//         setTrackingCar(false);
//         setError(null);
//       } else {
//         setError("Location not found");
//       }
//     } catch (error) {
//       console.error("Error fetching location data:", error);
//       setError("Failed to search location");
//     }
//   };

//   // Handle Marking Location
//   const handleMarkLocation = () => {
//     if (!searchedLocation) return;
//     setMarkedLocations([...markedLocations, searchedLocation]);
//     fetchRoute(searchedLocation);
//     showNotification("Location marked!");
//   };

//   // Handle Unmarking Location
//   const handleUnmarkLocation = (location: GpsData) => {
//     setMarkedLocations(markedLocations.filter((loc) => loc !== location));
//     showNotification("Location unmarked!");
//   };

//   // Show notification
//   const showNotification = (message: string) => {
//     setNotifications((prevNotifications) => [...prevNotifications, message]);
//     setTimeout(() => {
//       setNotifications((prevNotifications) =>
//         prevNotifications.filter((notif) => notif !== message)
//       );
//     }, 3000); // Hide notification after 3 seconds
//   };

//   // Fetch Route
//   const fetchRoute = async (destination: GpsData) => {
//     if (!gpsData || !destination) return;

//     try {
//       const response = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${gpsData.longitude},${gpsData.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
//       );
//       const data = await response.json();

//       if (data.routes && data.routes.length > 0) {
//         setRouteData(data.routes[0].geometry.coordinates);
//         setError(null);
//       } else {
//         setError("No route found");
//       }
//     } catch (error) {
//       console.error("Error fetching route:", error);
//       setError("Failed to fetch route");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FCFF] flex flex-col">
//       {/* Top Navigation */}
//       <div className="flex items-center justify-between p-4">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 bg-[#2E4156] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#1A2D42] transition-colors"
//         >
//           <FiArrowLeft className="text-xl" />
//           <span className="text-lg font-medium">Back</span>
//         </button>

//         {/* Search Bar & View Car Location */}
//         <div className="flex items-center gap-3">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search location..."
//             className="px-4 py-2 border rounded-lg shadow-sm w-72"
//           />
//           <button
//             onClick={handleSearch}
//             className="px-4 py-2 bg-[#2E4156] text-white rounded-lg shadow-md hover:bg-[#1A2D42] transition-colors"
//           >
//             Search
//           </button>
//           {searchedLocation && (
//             <button
//               onClick={handleMarkLocation}
//               className="px-4 py-2 bg-[#1A2D42] text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
//             >
//               Mark Location
//             </button>
//           )}
//           <button
//             onClick={() => setTrackingCar(true)}
//             className={`px-4 py-2 rounded-lg shadow-md transition-colors ${
//               trackingCar ? "bg-[#1A2D42] text-white" : "bg-gray-300 text-gray-700"
//             }`}
//           >
//             View Car Location
//           </button>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="fixed top-0 right-0 m-4 space-y-2">
//         {notifications.map((notification, index) => (
//           <div
//             key={index}
//             className="bg-[#1A2D42] text-white p-4 rounded-lg shadow-md animate-fadeIn"
//           >
//             {notification}
//           </div>
//         ))}
//       </div>

//       {/* Map Display */}
//       <div className="flex flex-col items-center justify-center w-full flex-1 p-6">
//         <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
//           <h1 className="text-3xl font-bold text-center text-[#1A2D42] mb-6">
//             {markedLocations.length > 0 ? "Marked Locations" : "Live Car Location"}
//           </h1>

//           <div className="h-96 bg-[#D4D8DD] rounded-lg border border-[#AAB7B7]">
//             {loading && (
//               <div className="h-full w-full flex items-center justify-center bg-gray-200">
//                 <span className="text-gray-600">Loading map...</span>
//               </div>
//             )}
//             {error && (
//               <div className="h-full w-full flex items-center justify-center bg-red-50">
//                 <span className="text-red-600">{error}</span>
//               </div>
//             )}
//             {!loading && !error && (gpsData || searchedLocation) && (
//               <DynamicMap gpsData={trackingCar ? gpsData : searchedLocation} markedLocations={markedLocations} routeData={routeData} />
//             )}
//           </div>
//         </div>
        
//         {/* Marked Locations List */}
//         {markedLocations.length > 0 && (
//           <div className="mt-6 w-full max-w-4xl p-6 bg-white rounded-xl shadow-lg">
//             <h2 className="text-2xl font-bold text-[#1A2D42] mb-4">Marked Locations</h2>
//             <ul className="space-y-3">
//               {markedLocations.map((location, index) => (
//                 <li
//                   key={index}
//                   className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
//                 >
//                   <div>
//                     <span className="font-medium text-[#2E4156]">
//                       Lat: {location.latitude}, Lon: {location.longitude}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => handleUnmarkLocation(location)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Unmark
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MapPage;
// "use client";

// import LiveMapBox from "@/reusable_component/Map/page";

// export default function MapPage() {
//   return (
//     <div className="w-full h-screen">
//       <LiveMapBox />
//     </div>
//   );
// }