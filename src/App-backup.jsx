import { useEffect, useState } from "react";
import "./App.css";
import CityMap from "./components/CityMap";

import {
  bins,
  trucks,
  cityStats,
  getRemainingCapacity,
  getTruckCapacityPercentage,
} from "./data/mockData";

import {
  rankBinsForTruck,
  selectBestTruck,
  buildSmartRoute,
} from "./utils/routeLogicNew";
import { getRoadRoute } from "./utils/roadRouting";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTruckId, setSelectedTruckId] = useState(
    trucks[0].id
  );
  const [roadRouteData, setRoadRouteData] = useState({
  distanceKm: 0,
  durationMinutes: 0,
});

  const currentTruck =
    trucks.find(
      (truck) => truck.id === selectedTruckId
    ) || trucks[0];

  const remainingCapacity =
    getRemainingCapacity(currentTruck);

  const truckCapacityPercentage =
    getTruckCapacityPercentage(currentTruck);

  /* =====================================================
     AI BIN PRIORITY
  ===================================================== */

  const rankedBins = rankBinsForTruck(
    bins,
    currentTruck
  );

  const highestPriorityBin =
    rankedBins.find(
      (bin) => bin.priorityScore > 0
    );

  const recommendedBin = bins.find(
    (bin) =>
      bin.id === highestPriorityBin?.binId
  );

  /* =====================================================
     BEST TRUCK FOR RECOMMENDED BIN
  ===================================================== */

  const bestTruck = recommendedBin
    ? selectBestTruck(
        recommendedBin,
        trucks
      )
    : null;

  /* =====================================================
     SMART MULTI-STOP ROUTE
  ===================================================== */

  const smartRoute = buildSmartRoute(
    bins,
    currentTruck
  );
  useEffect(() => {
  async function calculateRoadDistance() {
    const points = [
      {
        latitude: currentTruck.latitude,
        longitude: currentTruck.longitude,
      },

      ...smartRoute.route.map((stop) => ({
        latitude: stop.latitude,
        longitude: stop.longitude,
      })),
    ];

    const result = await getRoadRoute(points);

    setRoadRouteData(result);
  }

  calculateRoadDistance();
}, [selectedTruckId]);

  /* =====================================================
     CRITICAL BINS
  ===================================================== */

  const criticalBins = bins
    .filter(
      (bin) => bin.fillLevel >= 85
    )
    .sort(
      (a, b) =>
        b.fillLevel - a.fillLevel
    )
    .slice(0, 3);

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo-section">
          <div className="logo-icon">
            ♻
          </div>

          <div className="logo-text">
            <h1>SmartRoute</h1>
            <span>
              Waste Management
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN
          </div>

          <a
            href="#"
            className={`nav-item ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("dashboard");
            }}
          >
            <span>▣</span>
            <span>Dashboard</span>
          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage === "live-map" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("live-map");
            }}
          >
            <span>◉</span>
            <span>Live Map</span>
          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage === "trucks" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("trucks");
            }}
          >
            <span>🚛</span>
            <span>Trucks</span>
          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage === "bins" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("bins");
            }}
          >
            <span>🗑</span>
            <span>Bins</span>
          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage === "route-planner" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("route-planner");
            }}
          >
            <span>↗</span>
            <span>Route Planner</span>
          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage === "analytics" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage("analytics");
            }}
          >
            <span>▥</span>
            <span>Analytics</span>
          </a>

        </nav>

        <div className="sidebar-status">
          <div className="status-dot"></div>

          <div>
            <strong>
              System Online
            </strong>

            <span>
              All services operational
            </span>
          </div>
        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="topbar">

          <div className="page-heading">
            <h2>
              City Dashboard
            </h2>

            <p>
              Intelligent waste collection monitoring
            </p>
          </div>

          <div className="topbar-right">

            {/* ACTIVE TRUCK */}

            <div className="truck-selector">

              <label htmlFor="truckSelect">
                Active Truck
              </label>

              <select
                id="truckSelect"
                value={selectedTruckId}
                onChange={(e) =>
                  setSelectedTruckId(
                    e.target.value
                  )
                }
              >

                {trucks.map((truck) => (
                  <option
                    key={truck.id}
                    value={truck.id}
                  >
                    {truck.name}
                  </option>
                ))}

              </select>

            </div>

            <div className="date-display">
              📅
              <span>
                21 September 2026
              </span>
            </div>

            <div className="user-profile">

              <div className="user-avatar">
                A
              </div>

              <div className="user-details">

                <strong>
                  Admin
                </strong>

                <span>
                  City Operator
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        <section className="dashboard-content">

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon blue">
                🗑
              </div>

              <div className="stat-content">

                <span>
                  Total Bins
                </span>

                <strong>
                  {cityStats.totalBins}
                </strong>

                <small>
                  Monitored across city
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon red">
                ⚠
              </div>

              <div className="stat-content">

                <span>
                  Critical Bins
                </span>

                <strong>
                  {cityStats.criticalBins}
                </strong>

                <small>
                  Require immediate collection
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                🚛
              </div>

              <div className="stat-content">

                <span>
                  Active Trucks
                </span>

                <strong>
                  {cityStats.activeTrucks}
                </strong>

                <small>
                  Currently collecting
                </small>

              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon purple">
                ♻
              </div>

              <div className="stat-content">

                <span>
                  Waste Collected
                </span>

                <strong>
                  {cityStats.totalWasteCollectedToday}
                  <small className="unit">
                    {" "}kg
                  </small>
                </strong>

                <small>
                  collected today
                </small>

              </div>

            </div>

          </div>

          {/* =================================================
              MAP + TRUCK STATUS
          ================================================= */}

          <div className="dashboard-grid">

            {/* MAP */}

            <div className="panel map-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Live City Map
                  </h2>

                  <p>
                    Real-time bin and truck locations
                  </p>

                </div>

                <span className="live-badge">

                  <span></span>

                  LIVE

                </span>

              </div>

              <div className="map-area">

                <CityMap
                  recommendedBinId={
                    highestPriorityBin?.binId
                  }

                  selectedTruckId={
                    selectedTruckId
                  }
                />

              </div>

              <div className="map-legend">

                <div>
                  <span className="legend-dot green"></span>
                  Normal
                </div>

                <div>
                  <span className="legend-dot yellow"></span>
                  Moderate
                </div>

                <div>
                  <span className="legend-dot orange"></span>
                  High
                </div>

                <div>
                  <span className="legend-dot red"></span>
                  Critical
                </div>

                <div>
                  <span className="legend-dot blue"></span>
                  Truck
                </div>

              </div>

            </div>

            {/* TRUCK STATUS */}

            <div className="panel truck-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Truck Status
                  </h2>

                  <p>
                    Fleet overview
                  </p>

                </div>

                <span className="count-badge">
                  {trucks.length} Trucks
                </span>

              </div>

              <div className="truck-list">

                {trucks.map((truck) => (

                  <div
                    className={`truck-item ${
                      truck.id === selectedTruckId
                        ? "selected"
                        : ""
                    }`}
                    key={truck.id}
                    onClick={() =>
                      setSelectedTruckId(
                        truck.id
                      )
                    }
                  >

                    <div className="truck-icon">
                      🚛
                    </div>

                    <div className="truck-info">

                      <strong>
                        {truck.name}
                      </strong>

                      <span>
                        {truck.driver}
                      </span>

                    </div>

                    <div className="truck-metrics">

                      <div>

                        <span>
                          Load
                        </span>

                        <strong>
                          {Math.round(
                            getTruckCapacityPercentage(
                              truck
                            )
                          )}%
                        </strong>

                      </div>

                      <div>

                        <span>
                          Fuel
                        </span>

                        <strong>
                          {truck.fuelPercentage}%
                        </strong>

                      </div>

                    </div>

                    <span
                      className={`truck-status ${truck.status
                        .toLowerCase()
                        .replace(
                          " ",
                          "-"
                        )}`}
                    >
                      {truck.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* =================================================
              LOWER GRID
          ================================================= */}

          <div className="lower-grid">

            {/* CRITICAL BINS */}

            <div className="panel critical-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Critical Bins
                  </h2>

                  <p>
                    Bins requiring attention
                  </p>

                </div>

                <span className="count-badge red-count">
                  {cityStats.criticalBins}
                </span>

              </div>

              <div className="critical-list">

                {criticalBins.map((bin) => (

                  <div
                    className="critical-item"
                    key={bin.id}
                  >

                    <div className="critical-icon">
                      ⚠
                    </div>

                    <div className="critical-info">

                      <strong>
                        {bin.location}
                      </strong>

                      <span>
                        {bin.id} •{" "}
                        {bin.currentWeightKg} kg
                      </span>

                    </div>

                    <div className="fill-info">

                      <strong>
                        {bin.fillLevel}%
                      </strong>

                      <span>
                        Full
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* SMART ROUTE */}

            <div className="panel route-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Smart Route Planner
                  </h2>

                  <p>
                    AI-based multi-stop route
                  </p>

                </div>

                <span className="optimized-badge">
                  SmartRoute AI
                </span>

              </div>

              {/* ROUTE SUMMARY */}

              <div className="smart-recommendation">

                <div className="recommendation-icon">
                  🎯
                </div>

                <div className="recommendation-content">

                  <span>
                    Recommended Next Stop
                  </span>

                  <strong>
                    {highestPriorityBin?.location ||
                      "No suitable bin"}
                  </strong>

                  <small>
                    {highestPriorityBin
                      ? `${highestPriorityBin.binId} • ${highestPriorityBin.distanceKm} km away • Priority Score: ${highestPriorityBin.priorityScore}/100`
                      : "No suitable collection point"}
                  </small>

                </div>

              </div>

              {/* ROUTE METRICS */}

              <div className="route-summary">

                <div>

                  <span>
                    Stops
                  </span>

                  <strong>
                    {smartRoute.totalStops}
                  </strong>

                </div>

                <div>

                  <span>
                    Distance
                  </span>

                  <strong>
                    {roadRouteData.distanceKm > 0
                    ? `${roadRouteData.distanceKm} km`
                    : "Calculating..."}
                  </strong>

                </div>

                <div>

                  <span>
                    Waste
                  </span>

                  <strong>
                    {smartRoute.totalWasteKg} kg
                  </strong>

                </div>

                <div>

                  <span>
                    Fuel
                  </span>

                  <strong>
                    {roadRouteData.distanceKm > 0
                    ? `${(
                      roadRouteData.distanceKm /
                      currentTruck.fuelEfficiency
                    ).toFixed(2)} L`
                    : "Calculating..."}
                  </strong>

                </div>
                <div>
                  <span>
                    Travel Time
                    </span>
                    <strong>
                      {roadRouteData.durationMinutes > 0
                      ? `${roadRouteData.durationMinutes} min`
                      : "Calculating..."}
                      </strong>
                      </div>

              </div>

              {/* ROUTE DETAILS */}

              <div className="route-details">

                <div className="route-detail-row">

                  <span>
                    Selected Truck
                  </span>

                  <strong>
                    {currentTruck.name}
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Truck Status
                  </span>

                  <strong>
                    {currentTruck.status}
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Fuel Level
                  </span>

                  <strong>
                    {currentTruck.fuelPercentage}%
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Fuel Efficiency
                  </span>

                  <strong>
                    {currentTruck.fuelEfficiency} km/L
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Remaining Capacity
                  </span>

                  <strong>
                    {remainingCapacity} kg
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Truck Load
                  </span>

                  <strong>
                    {Math.round(
                      truckCapacityPercentage
                    )}%
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Recommended Truck
                  </span>

                  <strong>
                    {bestTruck?.truckName ||
                      "N/A"}
                  </strong>

                </div>

              </div>

              {/* ROUTE STOP LIST */}

              <div className="route-stop-list">

                <div className="route-stop-title">
                  <strong>
                    Optimized Collection Sequence
                  </strong>
                </div>

                {smartRoute.route.length === 0 ? (

                  <div className="empty-route">
                    No suitable bins available.
                  </div>

                ) : (

                  smartRoute.route.map(
                    (stop) => (

                      <div
                        className="route-stop"
                        key={stop.binId}
                      >

                        <div className="stop-number">
                          {stop.sequence}
                        </div>

                        <div className="stop-info">

                          <strong>
                            {stop.location}
                          </strong>

                          <span>
                            {stop.binId} •{" "}
                            {stop.wasteKg} kg •{" "}
                            {stop.fillLevel}%
                          </span>

                        </div>

                        <div className="stop-distance">

                          <strong>
                            {stop.distanceFromPreviousKm} km
                          </strong>

                          <span>
                            Score{" "}
                            {stop.priorityScore}
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="dashboard-footer">

            <span>
              SmartRoute Intelligent Waste Management System
            </span>

            <span>
              AI Route Optimization • Smart City Infrastructure
            </span>

          </footer>

        </section>

      </main>

    </div>
  );
}

export default App;