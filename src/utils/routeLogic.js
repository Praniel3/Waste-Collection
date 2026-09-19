```js
import { getRemainingCapacity } from "../data/mockData";


// =====================================================
// CALCULATE DISTANCE BETWEEN TWO GPS COORDINATES
// Haversine Formula
// =====================================================

export function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371; // Earth radius in km

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
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


// =====================================================
// CALCULATE BIN PRIORITY
// =====================================================

export function calculateBinPriority(
  bin,
  truck
) {

  // ---------------------------------------------------
  // 1. DISTANCE
  // ---------------------------------------------------

  const distance = calculateDistance(
    truck.latitude,
    truck.longitude,
    bin.latitude,
    bin.longitude
  );


  // ---------------------------------------------------
  // 2. TRUCK REMAINING CAPACITY
  // ---------------------------------------------------

  const remainingCapacity =
    getRemainingCapacity(truck);


  // ---------------------------------------------------
  // 3. CAPACITY CHECK
  // ---------------------------------------------------

  const capacityPossible =
    bin.currentWeightKg <=
    remainingCapacity;


  // ---------------------------------------------------
  // 4. FILL LEVEL SCORE
  // Maximum: 35 points
  // ---------------------------------------------------

  const fillScore =
    (bin.fillLevel / 100) * 35;


  // ---------------------------------------------------
  // 5. DISTANCE SCORE
  // Maximum: 25 points
  //
  // Closer bins receive a higher score.
  // ---------------------------------------------------

  const distanceScore =
    Math.max(
      0,
      25 - distance * 8
    );


  // ---------------------------------------------------
  // 6. WASTE QUANTITY SCORE
  // Maximum: 10 points
  //
  // Higher amount of waste = higher priority.
  // ---------------------------------------------------

  const wasteScore =
    Math.min(
      10,
      (bin.currentWeightKg /
        bin.capacityKg) *
        10
    );


  // ---------------------------------------------------
  // 7. CRITICALITY SCORE
  // Maximum: 15 points
  // ---------------------------------------------------

  let criticalScore = 0;

  if (bin.fillLevel >= 90) {

    criticalScore = 15;

  } else if (bin.fillLevel >= 75) {

    criticalScore = 10;

  } else if (bin.fillLevel >= 50) {

    criticalScore = 5;

  }


  // ---------------------------------------------------
  // 8. FUEL EFFICIENCY SCORE
  // Maximum: 15 points
  //
  // Better fuel efficiency gets a higher score.
  // ---------------------------------------------------

  const fuelEfficiency =
    truck.fuelEfficiency || 0;

  const fuelScore = Math.min(
    15,
    (fuelEfficiency / 8) * 15
  );


  // ---------------------------------------------------
  // 9. TOTAL PRIORITY SCORE
  // Maximum ≈ 100
  // ---------------------------------------------------

  let totalScore =
    fillScore +
    distanceScore +
    wasteScore +
    criticalScore +
    fuelScore;


  // ---------------------------------------------------
  // 10. CAPACITY CONSTRAINT
  //
  // Truck cannot collect a bin if it doesn't
  // have enough remaining capacity.
  // ---------------------------------------------------

  if (!capacityPossible) {

    totalScore = 0;

  }


  // ---------------------------------------------------
  // RETURN ANALYSIS
  // ---------------------------------------------------

  return {

    binId: bin.id,

    location: bin.location,

    distanceKm: Number(
      distance.toFixed(2)
    ),

    fillLevel: bin.fillLevel,

    wasteKg: bin.currentWeightKg,

    capacityPossible,

    fuelEfficiency,

    fillScore: Number(
      fillScore.toFixed(2)
    ),

    distanceScore: Number(
      distanceScore.toFixed(2)
    ),

    wasteScore: Number(
      wasteScore.toFixed(2)
    ),

    criticalScore,

    fuelScore: Number(
      fuelScore.toFixed(2)
    ),

    priorityScore: Number(
      totalScore.toFixed(2)
    ),

  };
}


// =====================================================
// RANK ALL BINS FOR A TRUCK
// =====================================================

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
```
