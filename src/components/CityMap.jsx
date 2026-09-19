import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { bins, trucks } from "../data/mockData";

function getBinColor(fillLevel) {
  if (fillLevel >= 90) return "#ef4444";
  if (fillLevel >= 75) return "#f97316";
  if (fillLevel >= 50) return "#eab308";
  return "#22c55e";
}

function getTruckColor(status) {
  if (status === "Collecting") return "#2563eb";
  if (status === "Returning") return "#9333ea";
  return "#16a34a";
}

export default function CityMap() {
  const center = [10.014, 76.325];

  const priorityBins = [...bins]
    .sort((a, b) => b.fillLevel - a.fillLevel)
    .slice(0, 4);

  const routePoints = [
    [trucks[0].latitude, trucks[0].longitude],
    ...priorityBins.map((bin) => [
      bin.latitude,
      bin.longitude,
    ]),
  ];

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "100%",
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* WASTE BINS */}

      {bins.map((bin) => (
        <CircleMarker
          key={bin.id}
          center={[
            bin.latitude,
            bin.longitude,
          ]}
          radius={9}
          pathOptions={{
            color: getBinColor(bin.fillLevel),
            fillColor: getBinColor(bin.fillLevel),
            fillOpacity: 0.85,
            weight: 2,
          }}
        >

          <Popup>

            <strong>
              {bin.id}
            </strong>

            <br />

            <strong>
              {bin.location}
            </strong>

            <br />

            Fill Level: {bin.fillLevel}%

            <br />

            Waste: {bin.currentWeightKg} kg

            <br />

            Status: {bin.status}

            <br />

            Type: {bin.wasteType}

          </Popup>

        </CircleMarker>
      ))}

      {/* TRUCKS */}

      {trucks.map((truck) => (
        <CircleMarker
          key={truck.id}
          center={[
            truck.latitude,
            truck.longitude,
          ]}
          radius={12}
          pathOptions={{
            color: "#1d4ed8",
            fillColor: getTruckColor(
              truck.status
            ),
            fillOpacity: 1,
            weight: 3,
          }}
        >

          <Popup>

            <strong>
              {truck.name}
            </strong>

            <br />

            Driver: {truck.driver}

            <br />

            Status: {truck.status}

            <br />

            Load: {truck.currentLoadKg} kg

            <br />

            Capacity: {truck.capacityKg} kg

            <br />

            Fuel: {truck.fuelPercentage}%

          </Popup>

        </CircleMarker>
      ))}

      {/* ROUTE PREVIEW */}

      <Polyline
        positions={routePoints}
        pathOptions={{
          color: "#2563eb",
          weight: 4,
          opacity: 0.8,
          dashArray: "8 8",
        }}
      />

    </MapContainer>
  );
}

