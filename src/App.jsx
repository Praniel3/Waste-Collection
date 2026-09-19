import "./App.css";
import CityMap from "./components/CityMap";

import {
  bins,
  trucks,
  cityStats,
  getRemainingCapacity,
  getTruckCapacityPercentage,
} from "./data/mockData";

import { rankBinsForTruck } from "./utils/routeLogic";

function App() {
  // ==========================================
  // CURRENT TRUCK
  // ==========================================

  const currentTruck = trucks[0];

  const remainingCapacity =
    getRemainingCapacity(currentTruck);

  const truckCapacityPercentage =
    getTruckCapacityPercentage(currentTruck);

  // ==========================================
  // CRITICAL BINS
  // ==========================================

  const criticalBins = bins
    .filter((bin) => bin.fillLevel >= 85)
    .sort(
      (a, b) =>
        b.fillLevel - a.fillLevel
    )
    .slice(0, 3);

  // ==========================================
  // AI ROUTE RANKING
  // ==========================================

  const rankedBins = rankBinsForTruck(
    bins,
    currentTruck
  );

  const highestPriorityBin =
    rankedBins[0];

  return (
    <div className="app">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        <div className="logo-section">

          <div className="logo-icon">
            ♻
          </div>

          <div>
            <h1>SmartRoute</h1>
            <span>Waste Management</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN
          </div>

          <a className="nav-item active">
            <span>▣</span>
            Dashboard
          </a>

          <a className="nav-item">
            <span>◉</span>
            Live Map
          </a>

          <a className="nav-item">
            <span>🚛</span>
            Trucks
          </a>

          <a className="nav-item">
            <span>🗑</span>
            Bins
          </a>

          <a className="nav-item">
            <span>↗</span>
            Route Planner
          </a>

          <a className="nav-item">
            <span>▥</span>
            Analytics
          </a>

        </nav>

        <div className="sidebar-status">

          <div className="status-dot"></div>

          <div>
            <strong>System Online</strong>
            <span>All services operational</span>
          </div>

        </div>

      </aside>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="main-content">

        {/* ====================================
            TOP BAR
        ==================================== */}

        <header className="topbar">

          <div>

            <h2>City Dashboard</h2>

            <p>
              Intelligent waste collection
              monitoring
            </p>

          </div>

          <div className="topbar-right">

            <div className="date-display">
              📅 19 September 2026
            </div>

            <div className="user-profile">

              <div className="user-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <span>City Operator</span>
              </div>

            </div>

          </div>

        </header>


        {/* ====================================
            DASHBOARD CONTENT
        ==================================== */}

        <section className="dashboard-content">


          {/* ==================================
              STAT CARDS
          ================================== */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon blue">
                🗑
              </div>

              <div>

                <span>Total Bins</span>

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

              <div>

                <span>Critical Bins</span>

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

              <div>

                <span>Active Trucks</span>

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

              <div>

                <span>Waste Collected</span>

                <strong>
                  {cityStats.totalWasteCollectedToday}
                </strong>

                <small>
                  kg collected today
                </small>

              </div>

            </div>

          </div>


          {/* ==================================
              MAP + TRUCK STATUS
          ================================== */}

          <div className="dashboard-grid">


            {/* MAP */}

            <div className="panel map-panel">

              <div className="panel-header">

                <div>

                  <h2>Live City Map</h2>

                  <p>
                    Real-time bin and truck
                    locations
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
                    highestPriorityBin.binId
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

                  <h2>Truck Status</h2>

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
                    className="truck-item"
                    key={truck.id}
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

                        <span>Load</span>

                        <strong>
                          {Math.round(
                            getTruckCapacityPercentage(
                              truck
                            )
                          )}%
                        </strong>

                      </div>

                      <div>

                        <span>Fuel</span>

                        <strong>
                          {truck.fuelPercentage}%
                        </strong>

                      </div>

                    </div>

                    <span
                      className={`truck-status ${truck.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {truck.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* ==================================
              LOWER GRID
          ================================== */}

          <div className="lower-grid">


            {/* =================================
                CRITICAL BINS
            ================================= */}

            <div className="panel critical-panel">

              <div className="panel-header">

                <div>

                  <h2>Critical Bins</h2>

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

                      <span>Full</span>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* =================================
                RECOMMENDED ROUTE
            ================================= */}

            <div className="panel route-panel">

              <div className="panel-header">

                <div>

                  <h2>
                    Recommended Route
                  </h2>

                  <p>
                    AI-based route recommendation
                  </p>

                </div>

                <span className="optimized-badge">
                  SmartRoute AI
                </span>

              </div>


              {/* SMART RECOMMENDATION */}

              <div className="smart-recommendation">

                <div className="recommendation-icon">
                  🎯
                </div>

                <div className="recommendation-content">

                  <span>
                    Recommended Next Stop
                  </span>

                  <strong>
                    {highestPriorityBin.location}
                  </strong>

                  <small>
                    {highestPriorityBin.binId} •{" "}
                    {highestPriorityBin.distanceKm} km
                    away • Priority Score:{" "}
                    {highestPriorityBin.priorityScore}
                  </small>

                </div>

              </div>


              {/* ROUTE DETAILS */}

              <div className="route-details">

                <div className="route-detail-row">

                  <span>
                    Truck
                  </span>

                  <strong>
                    {currentTruck.name}
                  </strong>

                </div>


                <div className="route-detail-row">

                  <span>
                    Next Stop
                  </span>

                  <strong>
                    {highestPriorityBin.location}
                  </strong>

                </div>


                <div className="route-detail-row">

                  <span>
                    Distance
                  </span>

                  <strong>
                    {highestPriorityBin.distanceKm} km
                  </strong>

                </div>


                <div className="route-detail-row">

                  <span>
                    Waste to Collect
                  </span>

                  <strong>
                    {highestPriorityBin.wasteKg} kg
                  </strong>

                </div>


                <div className="route-detail-row">

                  <span>
                    Remaining Truck Capacity
                  </span>

                  <strong>
                    {remainingCapacity} kg
                  </strong>

                </div>


                <div className="route-detail-row">

                  <span>
                    Priority Score
                  </span>

                  <strong>
                    {highestPriorityBin.priorityScore}
                  </strong>

                </div>

              </div>


              {/* ROUTE SUMMARY */}

              <div className="route-summary">

                <div>

                  <span>
                    Truck Load
                  </span>

                  <strong>
                    {Math.round(
                      truckCapacityPercentage
                    )}%
                  </strong>

                </div>


                <div>

                  <span>
                    Fuel
                  </span>

                  <strong>
                    {currentTruck.fuelPercentage}%
                  </strong>

                </div>


                <div>

                  <span>
                    Efficiency
                  </span>

                  <strong>
                    {currentTruck.fuelEfficiency} km/L
                  </strong>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================
              FOOTER
          ================================== */}

          <footer className="dashboard-footer">

            <span>
              SmartRoute Intelligent Waste
              Management System
            </span>

            <span>
              AI Route Optimization •
              Smart City Infrastructure
            </span>

          </footer>

        </section>

      </main>

    </div>
  );
}

export default App;
