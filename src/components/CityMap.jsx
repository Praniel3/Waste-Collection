import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

import {
  bins,
  trucks,
} from "../data/mockData";

import {
  buildSmartRoute,
} from "../utils/routeLogicNew";

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

export default function CityMap({
  recommendedBinId,
  selectedTruckId,
}) {
  const center = [10.014, 76.325];

  const [roadRoute, setRoadRoute] = useState([]);

  const selectedTruck =
    trucks.find(
      (truck) =>
        truck.id === selectedTruckId
    ) || trucks[0];

  const smartRoute = buildSmartRoute(
    bins,
    selectedTruck
  );

  /*
    Build the complete route:
    Truck → Stop 1 → Stop 2 → Stop 3...
  */

  const routePoints = [
    {
      latitude: selectedTruck.latitude,
      longitude: selectedTruck.longitude,
    },

    ...smartRoute.route.map(
      (stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      })
    ),
  ];

  /*
    Request road geometry from OSRM
  */

  useEffect(() => {
    let cancelled = false;

    async function loadRoadRoute() {
      if (routePoints.length < 2) {
        setRoadRoute([]);
        return;
      }

      try {
        const coordinates =
          routePoints
            .map(
              (point) =>
                `${point.longitude},${point.latitude}`
            )
            .join(";");

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${coordinates}` +
          `?overview=full&geometries=geojson`;

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Routing request failed"
          );
        }

        const data =
          await response.json();

        if (
          !cancelled &&
          data.routes &&
          data.routes.length > 0
        ) {
          const coordinates =
            data.routes[0].geometry
              .coordinates;

          /*
            OSRM gives:
            [longitude, latitude]

            Leaflet needs:
            [latitude, longitude]
          */

          const leafletCoordinates =
            coordinates.map(
              ([longitude, latitude]) => [
                latitude,
                longitude,
              ]
            );

          setRoadRoute(
            leafletCoordinates
          );
        }
      } catch (error) {
        console.error(
          "Road routing error:",
          error
        );

        /*
          Fallback to straight route
          if OSRM is unavailable.
        */

        if (!cancelled) {
          setRoadRoute(
            routePoints.map(
              (point) => [
                point.latitude,
                point.longitude,
              ]
            )
          );
        }
      }
    }

    loadRoadRoute();

    return () => {
      cancelled = true;
    };
  }, [selectedTruckId]);

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
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* =================================================
          REAL ROAD ROUTE
      ================================================= */}

      {roadRoute.length > 1 && (
        <Polyline
          positions={roadRoute}
          pathOptions={{
            color: "#7c3aed",
            weight: 5,
            opacity: 0.9,
          }}
        />
      )}

      {/* =================================================
          BIN MARKERS
      ================================================= */}

      {bins.map((bin) => {
        const routeStop =
          smartRoute.route.find(
            (stop) =>
              stop.binId === bin.id
          );

        const isRecommended =
          bin.id === recommendedBinId;

        const isRouteStop =
          Boolean(routeStop);

        return (
          <CircleMarker
            key={bin.id}
            center={[
              bin.latitude,
              bin.longitude,
            ]}
            radius={
              isRecommended
                ? 15
                : isRouteStop
                ? 12
                : 9
            }
            pathOptions={{
              color:
                isRecommended
                  ? "#7c3aed"
                  : isRouteStop
                  ? "#6366f1"
                  : getBinColor(
                      bin.fillLevel
                    ),

              fillColor:
                isRecommended
                  ? "#a855f7"
                  : isRouteStop
                  ? "#818cf8"
                  : getBinColor(
                      bin.fillLevel
                    ),

              fillOpacity: 0.9,

              weight:
                isRecommended
                  ? 4
                  : isRouteStop
                  ? 3
                  : 2,
            }}
          >
            {isRouteStop && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -10]}
              >
                <strong>
                  {routeStop.sequence}
                </strong>
              </Tooltip>
            )}

            <Popup>
              <strong>
                {bin.id}
              </strong>

              <br />

              <strong>
                {bin.location}
              </strong>

              <br />

              Fill Level:{" "}
              {bin.fillLevel}%

              <br />

              Waste:{" "}
              {bin.currentWeightKg} kg

              <br />

              Status:{" "}
              {bin.status}

              <br />

              Type:{" "}
              {bin.wasteType}

              {isRouteStop && (
                <>
                  <br />
                  <br />

                  <strong>
                    🚛 Route Stop #
                    {routeStop.sequence}
                  </strong>

                  <br />

                  Distance from previous:{" "}
                  {
                    routeStop.distanceFromPreviousKm
                  }{" "}
                  km

                  <br />

                  Priority Score:{" "}
                  {routeStop.priorityScore}/100
                </>
              )}

              {isRecommended && (
                <>
                  <br />
                  <br />

                  <strong>
                    🎯 AI Recommended Next Stop
                  </strong>
                </>
              )}
            </Popup>
          </CircleMarker>
        );
      })}

      {/* =================================================
          TRUCK MARKERS
      ================================================= */}

      {trucks.map((truck) => {
        const isSelected =
          truck.id === selectedTruckId;

        return (
          <CircleMarker
            key={truck.id}
            center={[
              truck.latitude,
              truck.longitude,
            ]}
            radius={
              isSelected
                ? 15
                : 10
            }
            pathOptions={{
              color:
                isSelected
                  ? "#7c3aed"
                  : "#1d4ed8",

              fillColor:
                getTruckColor(
                  truck.status
                ),

              fillOpacity: 1,

              weight:
                isSelected
                  ? 5
                  : 3,
            }}
          >
            <Tooltip>
              {isSelected
                ? "🚛 Active Truck"
                : truck.name}
            </Tooltip>

            <Popup>
              <strong>
                {truck.name}
              </strong>

              <br />

              Driver:{" "}
              {truck.driver}

              <br />

              Status:{" "}
              {truck.status}

              <br />

              Load:{" "}
              {truck.currentLoadKg} kg

              <br />

              Capacity:{" "}
              {truck.capacityKg} kg

              <br />

              Fuel:{" "}
              {truck.fuelPercentage}%

              {isSelected && (
                <>
                  <br />
                  <br />

                  <strong>
                    🚛 Active Truck
                  </strong>

                  <br />

                  Route Stops:{" "}
                  {smartRoute.totalStops}

                  <br />

                  Road Distance:{" "}
                  {roadRoute.length > 0
                    ? "Calculated"
                    : "Loading..."}
                </>
              )}
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}