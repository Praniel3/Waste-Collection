import { getRemainingCapacity } from "../data/mockData";

/* =====================================================
   DISTANCE CALCULATION
===================================================== */

export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

/* =====================================================
   TRAFFIC SCORE
===================================================== */

function getTrafficScore(trafficLevel) {
  if (trafficLevel === "Low") return 10;
  if (trafficLevel === "Medium") return 6;
  if (trafficLevel === "High") return 2;

  return 5;
}

/* =====================================================
   ROAD CONDITION SCORE
===================================================== */

function getRoadConditionScore(roadCondition) {
  if (roadCondition === "Good") return 10;
  if (roadCondition === "Average") return 6;
  if (roadCondition === "Poor") return 2;

  return 5;
}

/* =====================================================
   BIN PRIORITY
   Maximum Score = 100
===================================================== */

export function calculateBinPriority(
  bin,
  truck
) {
  const distance = calculateDistance(
    truck.latitude,
    truck.longitude,
    bin.latitude,
    bin.longitude
  );

  const remainingCapacity =
    getRemainingCapacity(truck);

  const capacityPossible =
    bin.currentWeightKg <= remainingCapacity;

  // Fill level: 35 points
  const fillScore =
    (bin.fillLevel / 100) * 35;

  // Distance: 20 points
  const distanceScore =
    Math.max(0, 20 - distance * 7);

  // Waste amount: 10 points
  const wasteScore =
    Math.min(
      10,
      (bin.currentWeightKg /
        bin.capacityKg) *
        10
    );

  // Criticality: 15 points
  let criticalityScore = 0;

  if (bin.fillLevel >= 90) {
    criticalityScore = 15;
  } else if (bin.fillLevel >= 75) {
    criticalityScore = 10;
  } else if (bin.fillLevel >= 50) {
    criticalityScore = 5;
  }

  // Fuel efficiency: 10 points
  const fuelScore =
    Math.min(
      10,
      (truck.fuelEfficiency / 8) * 10
    );

  // Traffic: 5 points
  const trafficScore =
    getTrafficScore(bin.trafficLevel) / 2;

  // Road: 5 points
  const roadScore =
    getRoadConditionScore(
      bin.roadCondition
    ) / 2;

  let totalScore =
    fillScore +
    distanceScore +
    wasteScore +
    criticalityScore +
    fuelScore +
    trafficScore +
    roadScore;

  // Cannot collect if truck does not have enough capacity
  if (!capacityPossible) {
    totalScore = 0;
  }

  return {
    binId: bin.id,
    location: bin.location,

    distanceKm:
      Number(distance.toFixed(2)),

    fillLevel: bin.fillLevel,

    wasteKg: bin.currentWeightKg,

    trafficLevel:
      bin.trafficLevel,

    roadCondition:
      bin.roadCondition,

    capacityPossible,

    fillScore:
      Number(fillScore.toFixed(2)),

    distanceScore:
      Number(distanceScore.toFixed(2)),

    wasteScore:
      Number(wasteScore.toFixed(2)),

    criticalityScore:
      Number(
        criticalityScore.toFixed(2)
      ),

    fuelScore:
      Number(fuelScore.toFixed(2)),

    trafficScore:
      Number(trafficScore.toFixed(2)),

    roadScore:
      Number(roadScore.toFixed(2)),

    priorityScore:
      Number(totalScore.toFixed(2)),
  };
}

/* =====================================================
   RANK BINS FOR A TRUCK
===================================================== */

export function rankBinsForTruck(
  bins,
  truck
) {
  return bins
    .map((bin) =>
      calculateBinPriority(
        bin,
        truck
      )
    )
    .sort(
      (a, b) =>
        b.priorityScore -
        a.priorityScore
    );
}

/* =====================================================
   SELECT BEST TRUCK
===================================================== */

export function selectBestTruck(
  bin,
  trucks
) {
  const suitableTrucks = trucks
    .filter((truck) => {
      const remainingCapacity =
        getRemainingCapacity(truck);

      const capacityPossible =
        bin.currentWeightKg <=
        remainingCapacity;

      const availableStatus =
        truck.status !== "Returning";

      return (
        capacityPossible &&
        availableStatus
      );
    })
    .map((truck) => {
      const distance =
        calculateDistance(
          truck.latitude,
          truck.longitude,
          bin.latitude,
          bin.longitude
        );

      const remainingCapacity =
        getRemainingCapacity(truck);

      const distanceScore =
        Math.max(
          0,
          40 - distance * 10
        );

      const capacityScore =
        Math.min(
          25,
          (remainingCapacity /
            truck.capacityKg) *
            25
        );

      const fuelScore =
        Math.min(
          20,
          (truck.fuelEfficiency / 8) *
            20
        );

      const fuelLevelScore =
        (truck.fuelPercentage / 100) *
        15;

      const totalScore =
        distanceScore +
        capacityScore +
        fuelScore +
        fuelLevelScore;

      return {
        truckId: truck.id,

        truckName:
          truck.name,

        distanceKm:
          Number(distance.toFixed(2)),

        remainingCapacity,

        fuelPercentage:
          truck.fuelPercentage,

        fuelEfficiency:
          truck.fuelEfficiency,

        score:
          Number(
            totalScore.toFixed(2)
          ),
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score
    );

  return (
    suitableTrucks[0] || null
  );
}

/* =====================================================
   SMART ROUTE PLANNER
===================================================== */

export function buildSmartRoute(
  bins,
  truck
) {
  let remainingCapacity =
    getRemainingCapacity(truck);

  let currentLatitude =
    truck.latitude;

  let currentLongitude =
    truck.longitude;

  const route = [];

  let totalDistance = 0;

  let totalWaste = 0;

  /*
    Only consider bins that:

    1. Need collection
    2. Can fit inside truck
    3. Are not already normal
  */

  let availableBins = bins.filter(
    (bin) =>
      bin.fillLevel >= 50 &&
      bin.currentWeightKg <=
        remainingCapacity
  );

  /*
    Continue selecting the highest
    priority bin from the truck's
    current location.
  */

  while (
    availableBins.length > 0
  ) {
    const virtualTruck = {
      ...truck,
      latitude:
        currentLatitude,
      longitude:
        currentLongitude,
    };

    const rankedBins =
      rankBinsForTruck(
        availableBins,
        virtualTruck
      );

    const nextBin =
      rankedBins[0];

    if (!nextBin) {
      break;
    }

    const selectedBin =
      availableBins.find(
        (bin) =>
          bin.id === nextBin.binId
      );

    if (!selectedBin) {
      break;
    }

    const distance =
      calculateDistance(
        currentLatitude,
        currentLongitude,
        selectedBin.latitude,
        selectedBin.longitude
      );

    /*
      Add selected bin to route
    */

    route.push({
      sequence:
        route.length + 1,

      binId:
        selectedBin.id,

      location:
        selectedBin.location,

      latitude:
        selectedBin.latitude,

      longitude:
        selectedBin.longitude,

      distanceFromPreviousKm:
        Number(
          distance.toFixed(2)
        ),

      fillLevel:
        selectedBin.fillLevel,

      wasteKg:
        selectedBin.currentWeightKg,

      priorityScore:
        nextBin.priorityScore,

      trafficLevel:
        selectedBin.trafficLevel,

      roadCondition:
        selectedBin.roadCondition,
    });

    /*
      Update route totals
    */

    totalDistance += distance;

    totalWaste +=
      selectedBin.currentWeightKg;

    remainingCapacity -=
      selectedBin.currentWeightKg;

    /*
      Move truck position to
      selected bin.
    */

    currentLatitude =
      selectedBin.latitude;

    currentLongitude =
      selectedBin.longitude;

    /*
      Remove selected bin.
    */

    availableBins =
      availableBins.filter(
        (bin) =>
          bin.id !==
          selectedBin.id
      );

    /*
      Remove bins that no longer
      fit inside truck.
    */

    availableBins =
      availableBins.filter(
        (bin) =>
          bin.currentWeightKg <=
          remainingCapacity
      );
  }

  /*
    Estimate fuel consumption.

    Example:
    6.8 km/L efficiency
  */

  const estimatedFuel =
    truck.fuelEfficiency > 0
      ? totalDistance /
        truck.fuelEfficiency
      : 0;

  return {
    truckId:
      truck.id,

    truckName:
      truck.name,

    route,

    totalStops:
      route.length,

    totalDistanceKm:
      Number(
        totalDistance.toFixed(2)
      ),

    totalWasteKg:
      Number(
        totalWaste.toFixed(2)
      ),

    remainingCapacityKg:
      Number(
        remainingCapacity.toFixed(2)
      ),

    estimatedFuelLiters:
      Number(
        estimatedFuel.toFixed(2)
      ),
  };
}