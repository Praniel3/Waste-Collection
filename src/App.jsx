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
  /* =====================================================
     LOGIN
  ===================================================== */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (
      username === "admin" &&
      password === "admin"
    ) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError(
        "Invalid username or password"
      );
    }
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const [activePage, setActivePage] =
    useState("dashboard");

  /* =====================================================
     TRUCK SELECTION
  ===================================================== */

  const [selectedTruckId, setSelectedTruckId] =
    useState(trucks[0].id);

  const [roadRouteData, setRoadRouteData] =
    useState({
      distanceKm: 0,
      durationMinutes: 0,
    });

  const currentTruck =
    trucks.find(
      (truck) =>
        truck.id === selectedTruckId
    ) || trucks[0];

  const remainingCapacity =
    getRemainingCapacity(currentTruck);

  const truckCapacityPercentage =
    getTruckCapacityPercentage(
      currentTruck
    );

  /* =====================================================
     AI BIN PRIORITY
  ===================================================== */

  const rankedBins =
    rankBinsForTruck(
      bins,
      currentTruck
    );

  const highestPriorityBin =
    rankedBins.find(
      (bin) =>
        bin.priorityScore > 0
    );

  const recommendedBin =
    bins.find(
      (bin) =>
        bin.id ===
        highestPriorityBin?.binId
    );

  /* =====================================================
     BEST TRUCK FOR RECOMMENDED BIN
  ===================================================== */

  const bestTruck =
    recommendedBin
      ? selectBestTruck(
          recommendedBin,
          trucks
        )
      : null;

  /* =====================================================
     SMART MULTI-STOP ROUTE
  ===================================================== */

  const smartRoute =
    buildSmartRoute(
      bins,
      currentTruck
    );

  /* =====================================================
     ROAD ROUTING
  ===================================================== */

  useEffect(() => {
    async function calculateRoadDistance() {
      const points = [
        {
          latitude:
            currentTruck.latitude,
          longitude:
            currentTruck.longitude,
        },

        ...smartRoute.route.map(
          (stop) => ({
            latitude:
              stop.latitude,
            longitude:
              stop.longitude,
          })
        ),
      ];

      const result =
        await getRoadRoute(points);

      setRoadRouteData(result);
    }

    calculateRoadDistance();
  }, [selectedTruckId]);

  /* =====================================================
     CRITICAL BINS
  ===================================================== */

  const criticalBins =
    bins
      .filter(
        (bin) =>
          bin.fillLevel >= 85
      )
      .sort(
        (a, b) =>
          b.fillLevel -
          a.fillLevel
      )
      .slice(0, 3);

  /* =====================================================
     LOGIN PAGE
  ===================================================== */

  if (!isLoggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-logo">
            ♻
          </div>

          <h1>
            SmartRoute
          </h1>

          <p className="login-subtitle">
            Intelligent Waste Management
          </p>

          <div className="login-form">

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(
                  e.target.value
                );
                setLoginError("");
              }}
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(
                  e.target.value
                );
                setLoginError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </button>

          </div>

          <div className="login-footer">
            SmartRoute • City Operator Portal
          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN APPLICATION
  ===================================================== */

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

            <h1>
              SmartRoute
            </h1>

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
              activePage ===
              "dashboard"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "dashboard"
              );
            }}
          >
            <span>
              ▣
            </span>

            <span>
              Dashboard
            </span>

          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage ===
              "live-map"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "live-map"
              );
            }}
          >
            <span>
              ◉
            </span>

            <span>
              Live Map
            </span>

          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage ===
              "trucks"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "trucks"
              );
            }}
          >
            <span>
              🚛
            </span>

            <span>
              Trucks
            </span>

          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage ===
              "bins"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "bins"
              );
            }}
          >
            <span>
              🗑
            </span>

            <span>
              Bins
            </span>

          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage ===
              "route-planner"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "route-planner"
              );
            }}
          >
            <span>
              ↗
            </span>

            <span>
              Route Planner
            </span>

          </a>

          <a
            href="#"
            className={`nav-item ${
              activePage ===
              "analytics"
                ? "active"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setActivePage(
                "analytics"
              );
            }}
          >
            <span>
              ▥
            </span>

            <span>
              Analytics
            </span>

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

                {trucks.map(
                  (truck) => (
                    <option
                      key={truck.id}
                      value={truck.id}
                    >
                      {truck.name}
                    </option>
                  )
                )}

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

        {activePage ===
          "dashboard" && (
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
                    {
                      cityStats.totalWasteCollectedToday
                    }

                    <small className="unit">
                      {" "}
                      kg
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

                  {trucks.map(
                    (truck) => (

                      <div
                        className={`truck-item ${
                          truck.id ===
                          selectedTruckId
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
                              )}
                              %
                            </strong>

                          </div>

                          <div>

                            <span>
                              Fuel
                            </span>

                            <strong>
                              {
                                truck.fuelPercentage
                              }
                              %
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

                    )
                  )}

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

                  {criticalBins.map(
                    (bin) => (

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
                            {
                              bin.currentWeightKg
                            }{" "}
                            kg
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

                    )
                  )}

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

                {/* ROUTE RECOMMENDATION */}

                <div className="smart-recommendation">

                  <div className="recommendation-icon">
                    🎯
                  </div>

                  <div className="recommendation-content">

                    <span>
                      Recommended Next Stop
                    </span>

                    <strong>
                      {
                        highestPriorityBin?.location ||
                        "No suitable bin"
                      }
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

                      {roadRouteData.distanceKm >
                      0
                        ? `${roadRouteData.distanceKm} km`
                        : "Calculating..."}

                    </strong>

                  </div>

                  <div>

                    <span>
                      Waste
                    </span>

                    <strong>
                      {
                        smartRoute.totalWasteKg
                      }{" "}
                      kg
                    </strong>

                  </div>

                  <div>

                    <span>
                      Fuel
                    </span>

                    <strong>

                      {roadRouteData.distanceKm >
                      0
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

                      {roadRouteData.durationMinutes >
                      0
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
                      {
                        currentTruck.fuelPercentage
                      }%
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Fuel Efficiency
                    </span>

                    <strong>
                      {
                        currentTruck.fuelEfficiency
                      }{" "}
                      km/L
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
                      )}
                      %
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Recommended Truck
                    </span>

                    <strong>
                      {
                        bestTruck?.truckName ||
                        "N/A"
                      }
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

                  {smartRoute.route.length ===
                  0 ? (

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
                              {
                                stop.distanceFromPreviousKm
                              }{" "}
                              km
                            </strong>

                            <span>
                              Score{" "}
                              {
                                stop.priorityScore
                              }
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
        )}

        {/* =================================================
            LIVE MAP
        ================================================= */}

        {activePage ===
          "live-map" && (
          <section className="dashboard-content">

            <div
              className="panel"
              style={{
                width: "100%",
              }}
            >

              <div className="panel-header">

                <div>

                  <h2>
                    Live City Map
                  </h2>

                  <p>
                    All bins, trucks and collection routes
                  </p>

                </div>

                <span className="live-badge">

                  <span></span>

                  LIVE

                </span>

              </div>

              <div
                style={{
                  width: "100%",
                  height:
                    "calc(100vh - 230px)",
                  minHeight: "520px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >

                <CityMap
                  recommendedBinId={
                    highestPriorityBin?.binId
                  }
                  selectedTruckId={
                    selectedTruckId
                  }
                />

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            TRUCKS
        ================================================= */}

        {activePage ===
          "trucks" && (
          <section className="dashboard-content">

            <div
              className="panel"
              style={{
                width: "100%",
              }}
            >

              <div className="panel-header">

                <div>

                  <h2>
                    Truck Management
                  </h2>

                  <p>
                    Complete fleet details and current status
                  </p>

                </div>

                <span className="count-badge">
                  {trucks.length} Trucks
                </span>

              </div>

              <div className="truck-list">

                {trucks.map(
                  (truck) => (

                    <div
                      className={`truck-item ${
                        truck.id ===
                        selectedTruckId
                          ? "selected"
                          : ""
                      }`}
                      key={truck.id}
                      onClick={() =>
                        setSelectedTruckId(
                          truck.id
                        )
                      }
                      style={{
                        cursor:
                          "pointer",
                      }}
                    >

                      <div className="truck-icon">
                        🚛
                      </div>

                      <div className="truck-info">

                        <strong>
                          {truck.name}
                        </strong>

                        <span>
                          {truck.id} • Driver:{" "}
                          {truck.driver}
                        </span>

                      </div>

                      <div className="truck-metrics">

                        <div>

                          <span>
                            Capacity
                          </span>

                          <strong>
                            {
                              getRemainingCapacity(
                                truck
                              ) +
                              (truck.currentWeightKg ||
                                0)
                            }{" "}
                            kg
                          </strong>

                        </div>

                        <div>

                          <span>
                            Load
                          </span>

                          <strong>
                            {Math.round(
                              getTruckCapacityPercentage(
                                truck
                              )
                            )}
                            %
                          </strong>

                        </div>

                        <div>

                          <span>
                            Fuel
                          </span>

                          <strong>
                            {
                              truck.fuelPercentage
                            }
                            %
                          </strong>

                        </div>

                        <div>

                          <span>
                            Efficiency
                          </span>

                          <strong>
                            {
                              truck.fuelEfficiency
                            }{" "}
                            km/L
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

                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            BINS
        ================================================= */}

        {activePage ===
          "bins" && (
          <section className="dashboard-content">

            <div
              className="panel"
              style={{
                width: "100%",
              }}
            >

              <div className="panel-header">

                <div>

                  <h2>
                    Bin Management
                  </h2>

                  <p>
                    Monitor fill level, waste and collection priority
                  </p>

                </div>

                <span className="count-badge">
                  {bins.length} Bins
                </span>

              </div>

              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    minWidth:
                      "760px",
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        textAlign:
                          "left",
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Bin
                      </th>

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Location
                      </th>

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Fill Level
                      </th>

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Waste
                      </th>

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Status
                      </th>

                      <th
                        style={{
                          padding:
                            "14px 10px",
                        }}
                      >
                        Coordinates
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {bins.map(
                      (bin) => {

                        const status =
                          bin.fillLevel >=
                          90
                            ? "Critical"
                            : bin.fillLevel >=
                              75
                            ? "High"
                            : bin.fillLevel >=
                              50
                            ? "Moderate"
                            : "Normal";

                        return (
                          <tr
                            key={bin.id}
                            style={{
                              borderBottom:
                                "1px solid #eef0f4",
                            }}
                          >

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                                fontWeight:
                                  700,
                              }}
                            >
                              {bin.id}
                            </td>

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                              }}
                            >
                              {bin.location}
                            </td>

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                                fontWeight:
                                  700,
                              }}
                            >
                              {bin.fillLevel}%
                            </td>

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                              }}
                            >
                              {
                                bin.currentWeightKg
                              }{" "}
                              kg
                            </td>

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                              }}
                            >
                              {status}
                            </td>

                            <td
                              style={{
                                padding:
                                  "14px 10px",
                              }}
                            >
                              {
                                bin.latitude
                              }
                              ,{" "}
                              {
                                bin.longitude
                              }
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            ROUTE PLANNER
        ================================================= */}

        {activePage ===
          "route-planner" && (
          <section className="dashboard-content">

            <div
              className="panel route-panel"
              style={{
                width: "100%",
              }}
            >

              <div className="panel-header">

                <div>

                  <h2>
                    Smart Route Planner
                  </h2>

                  <p>
                    AI-based multi-stop collection route for the selected truck
                  </p>

                </div>

                <span className="optimized-badge">
                  SmartRoute AI
                </span>

              </div>

              <div className="smart-recommendation">

                <div className="recommendation-icon">
                  🎯
                </div>

                <div className="recommendation-content">

                  <span>
                    Recommended Next Stop
                  </span>

                  <strong>
                    {
                      highestPriorityBin?.location ||
                      "No suitable bin"
                    }
                  </strong>

                  <small>

                    {highestPriorityBin
                      ? `${highestPriorityBin.binId} • ${highestPriorityBin.distanceKm} km away • Priority Score: ${highestPriorityBin.priorityScore}/100`
                      : "No suitable collection point"}

                  </small>

                </div>

              </div>

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

                    {roadRouteData.distanceKm >
                    0
                      ? `${roadRouteData.distanceKm} km`
                      : "Calculating..."}

                  </strong>

                </div>

                <div>

                  <span>
                    Waste
                  </span>

                  <strong>
                    {
                      smartRoute.totalWasteKg
                    }{" "}
                    kg
                  </strong>

                </div>

                <div>

                  <span>
                    Fuel
                  </span>

                  <strong>

                    {roadRouteData.distanceKm >
                    0
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

                    {roadRouteData.durationMinutes >
                    0
                      ? `${roadRouteData.durationMinutes} min`
                      : "Calculating..."}

                  </strong>

                </div>

              </div>

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
                    {
                      currentTruck.fuelPercentage
                    }%
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Fuel Efficiency
                  </span>

                  <strong>
                    {
                      currentTruck.fuelEfficiency
                    }{" "}
                    km/L
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
                    )}
                    %
                  </strong>

                </div>

                <div className="route-detail-row">

                  <span>
                    Recommended Truck
                  </span>

                  <strong>
                    {
                      bestTruck?.truckName ||
                      "N/A"
                    }
                  </strong>

                </div>

              </div>

              <div className="route-stop-list">

                <div className="route-stop-title">

                  <strong>
                    Optimized Collection Sequence
                  </strong>

                </div>

                {smartRoute.route.length ===
                0 ? (

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
                            {
                              stop.distanceFromPreviousKm
                            }{" "}
                            km
                          </strong>

                          <span>
                            Score{" "}
                            {
                              stop.priorityScore
                            }
                          </span>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            ANALYTICS
        ================================================= */}

        {activePage ===
          "analytics" && (
          <section className="dashboard-content">

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
                    Require attention
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
                    {
                      cityStats.totalWasteCollectedToday
                    }{" "}
                    kg
                  </strong>

                  <small>
                    Collected today
                  </small>

                </div>

              </div>

            </div>

            <div className="lower-grid">

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <h2>
                      Fleet Overview
                    </h2>

                    <p>
                      Current operational status
                    </p>

                  </div>

                </div>

                <div className="truck-list">

                  {trucks.map(
                    (truck) => (

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
                            {truck.status} •{" "}
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
                              )}
                              %
                            </strong>

                          </div>

                          <div>

                            <span>
                              Fuel
                            </span>

                            <strong>
                              {
                                truck.fuelPercentage
                              }
                              %
                            </strong>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              <div className="panel">

                <div className="panel-header">

                  <div>

                    <h2>
                      Bin Distribution
                    </h2>

                    <p>
                      Current fill-level overview
                    </p>

                  </div>

                </div>

                <div className="route-details">

                  <div className="route-detail-row">

                    <span>
                      Critical (90%+)
                    </span>

                    <strong>
                      {
                        bins.filter(
                          (b) =>
                            b.fillLevel >=
                            90
                        ).length
                      }
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      High (75–89%)
                    </span>

                    <strong>
                      {
                        bins.filter(
                          (b) =>
                            b.fillLevel >=
                              75 &&
                            b.fillLevel <
                              90
                        ).length
                      }
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Moderate (50–74%)
                    </span>

                    <strong>
                      {
                        bins.filter(
                          (b) =>
                            b.fillLevel >=
                              50 &&
                            b.fillLevel <
                              75
                        ).length
                      }
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Normal (&lt;50%)
                    </span>

                    <strong>
                      {
                        bins.filter(
                          (b) =>
                            b.fillLevel <
                            50
                        ).length
                      }
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Planned Route Waste
                    </span>

                    <strong>
                      {
                        smartRoute.totalWasteKg
                      }{" "}
                      kg
                    </strong>

                  </div>

                  <div className="route-detail-row">

                    <span>
                      Planned Route Stops
                    </span>

                    <strong>
                      {
                        smartRoute.totalStops
                      }
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;