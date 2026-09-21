
// =====================================================
// SMARTROUTE - MOCK CITY DATA
// =====================================================

// -----------------------------------------------------
// CITY INFORMATION
// -----------------------------------------------------

export const cityData = {
  name: "Smart City",
  totalPopulation: 450000,
  zones: 5,
};


// -----------------------------------------------------
// WASTE BINS
// -----------------------------------------------------

export const bins = [
  {
    id: "B001",
    location: "Central Market",
    trafficLevel: "High",
    roadCondition: "Good",
    latitude: 10.0121,
    longitude: 76.3212,
    capacityKg: 100,
    currentWeightKg: 92,
    fillLevel: 92,
    status: "Critical",
    wasteType: "Mixed Waste",
  },

  {
    id: "B002",
    location: "City Hospital",
    latitude: 10.0154,
    longitude: 76.3268,
    capacityKg: 120,
    currentWeightKg: 86,
    fillLevel: 72,
    status: "High",
    wasteType: "General Waste",
    trafficLevel: "Medium",
    roadCondition: "Good",
  },

  {
    id: "B003",
    location: "North Street",
    latitude: 10.0215,
    longitude: 76.3182,
    capacityKg: 100,
    currentWeightKg: 45,
    fillLevel: 45,
    status: "Normal",
    wasteType: "Mixed Waste",
    trafficLevel: "Medium",
    roadCondition: "Good",
  },

  {
    id: "B004",
    location: "Railway Station",
    latitude: 10.0088,
    longitude: 76.3301,
    capacityKg: 150,
    currentWeightKg: 142,
    fillLevel: 95,
    status: "Critical",
    wasteType: "Mixed Waste",
    trafficLevel: "High",
    roadCondition: "Average",
  },

  {
    id: "B005",
    location: "Municipal Park",
    latitude: 10.0189,
    longitude: 76.3352,
    capacityKg: 100,
    currentWeightKg: 63,
    fillLevel: 63,
    status: "High",
    wasteType: "Organic Waste",
    trafficLevel: "Medium",
    roadCondition: "Good",
  },

  {
    id: "B006",
    location: "Bus Terminal",
    latitude: 10.0062,
    longitude: 76.3164,
    capacityKg: 200,
    currentWeightKg: 187,
    fillLevel: 93.5,
    status: "Critical",
    wasteType: "Mixed Waste",
    trafficLevel: "High",
    roadCondition: "Poor",
  },

  {
    id: "B007",
    location: "School Road",
    latitude: 10.0252,
    longitude: 76.3298,
    capacityKg: 100,
    currentWeightKg: 51,
    fillLevel: 51,
    status: "Moderate",
    wasteType: "General Waste",
    trafficLevel: "Low",
    roadCondition: "Good",
  },

  {
    id: "B008",
    location: "Industrial Area",
    latitude: 10.0018,
    longitude: 76.3375,
    capacityKg: 250,
    currentWeightKg: 218,
    fillLevel: 87.2,
    status: "High",
    wasteType: "Industrial Waste",
    trafficLevel: "Medium",
    roadCondition: "Poor",
  },

  {
    id: "B009",
    location: "East Residential Area",
    latitude: 10.0171,
    longitude: 76.3431,
    capacityKg: 120,
    currentWeightKg: 34,
    fillLevel: 28.3,
    status: "Normal",
    wasteType: "General Waste",
    trafficLevel: "Low",
    roadCondition: "Good",
  },

  {
    id: "B010",
    location: "West Residential Area",
    latitude: 10.0291,
    longitude: 76.3142,
    capacityKg: 100,
    currentWeightKg: 76,
    fillLevel: 76,
    status: "High",
    wasteType: "General Waste",
    trafficLevel: "High",
    roadCondition: "Average",
  },

  {
    id: "B011",
    location: "Community Center",
    latitude: 10.0114,
    longitude: 76.3095,
    capacityKg: 150,
    currentWeightKg: 139,
    fillLevel: 92.7,
    status: "Critical",
    wasteType: "Mixed Waste",
    trafficLevel: "Medium",
    roadCondition: "Good",
  },

  {
    id: "B012",
    location: "South Market",
    latitude: 9.9998,
    longitude: 76.3236,
    capacityKg: 120,
    currentWeightKg: 67,
    fillLevel: 55.8,
    status: "Moderate",
    wasteType: "Organic Waste",
    trafficLevel: "Low",
    roadCondition: "Average",
  },
];


// -----------------------------------------------------
// TRUCKS
// -----------------------------------------------------

export const trucks = [
  {
    id: "TRK001",
    name: "Truck-001",
    latitude: 10.0135,
    longitude: 76.3245,

    capacityKg: 2000,
    currentLoadKg: 1240,

    fuelPercentage: 72,
    fuelEfficiency: 6.8,

    status: "Collecting",

    driver: "Arun",
  },

  {
    id: "TRK002",
    name: "Truck-002",
    latitude: 10.0218,
    longitude: 76.3168,

    capacityKg: 2500,
    currentLoadKg: 910,

    fuelPercentage: 84,
    fuelEfficiency: 7.2,

    status: "Collecting",

    driver: "Ravi",
  },

  {
    id: "TRK003",
    name: "Truck-003",
    latitude: 10.0064,
    longitude: 76.3294,

    capacityKg: 1800,
    currentLoadKg: 1540,

    fuelPercentage: 46,
    fuelEfficiency: 6.4,

    status: "Returning",

    driver: "Kumar",
  },

  {
    id: "TRK004",
    name: "Truck-004",
    latitude: 10.0255,
    longitude: 76.3342,

    capacityKg: 2200,
    currentLoadKg: 720,

    fuelPercentage: 91,
    fuelEfficiency: 7.0,

    status: "Collecting",

    driver: "Suresh",
  },

  {
    id: "TRK005",
    name: "Truck-005",
    latitude: 10.0015,
    longitude: 76.3175,

    capacityKg: 2000,
    currentLoadKg: 450,

    fuelPercentage: 67,
    fuelEfficiency: 6.6,

    status: "Available",

    driver: "Manoj",
  },
];


// -----------------------------------------------------
// CITY STATISTICS
// -----------------------------------------------------

export const cityStats = {
  totalBins: bins.length,

  criticalBins: bins.filter(
    (bin) => bin.fillLevel >= 90
  ).length,

  highBins: bins.filter(
    (bin) =>
      bin.fillLevel >= 75 &&
      bin.fillLevel < 90
  ).length,

  activeTrucks: trucks.filter(
    (truck) =>
      truck.status === "Collecting"
  ).length,

  totalWasteCollectedToday: 8420,
};


// -----------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------

export function getRemainingCapacity(truck) {
  return truck.capacityKg - truck.currentLoadKg;
}


export function getTruckCapacityPercentage(truck) {
  return (
    (truck.currentLoadKg / truck.capacityKg) * 100
  );
}


export function getBinStatus(fillLevel) {

  if (fillLevel >= 90) {
    return "Critical";
  }

  if (fillLevel >= 75) {
    return "High";
  }

  if (fillLevel >= 50) {
    return "Moderate";
  }

  return "Normal";
}

