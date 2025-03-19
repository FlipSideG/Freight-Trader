/**
 * Mock data for freight routes
 * Represents major tanker shipping routes across different markets
 */

const mockFreightRoutes = [
  // VLCC Routes (Very Large Crude Carriers)
  {
    routeCode: 'TD1',
    name: 'Persian Gulf to US Gulf',
    origin: 'Persian Gulf',
    destination: 'US Gulf',
    cargoType: 'Crude Oil',
    quantity: 280000,
    distance: 12650,
    benchmarkVessel: {
      type: 'VLCC',
      size: 300000,
      consumption: 90
    },
    canalPassages: [
      { name: 'Cape of Good Hope', direction: 'eastbound' }
    ],
    notes: 'Ballast via Cape of Good Hope'
  },
  {
    routeCode: 'TD2',
    name: 'Persian Gulf to Singapore',
    origin: 'Persian Gulf',
    destination: 'Singapore',
    cargoType: 'Crude Oil',
    quantity: 260000,
    distance: 3650,
    benchmarkVessel: {
      type: 'VLCC',
      size: 300000,
      consumption: 80
    }
  },
  {
    routeCode: 'TD3C',
    name: 'Persian Gulf to China',
    origin: 'Persian Gulf',
    destination: 'China',
    cargoType: 'Crude Oil',
    quantity: 270000,
    distance: 5620,
    benchmarkVessel: {
      type: 'VLCC',
      size: 300000,
      consumption: 82
    }
  },
  {
    routeCode: 'TD15',
    name: 'West Africa to China',
    origin: 'West Africa',
    destination: 'China',
    cargoType: 'Crude Oil',
    quantity: 260000,
    distance: 10730,
    benchmarkVessel: {
      type: 'VLCC',
      size: 300000,
      consumption: 85
    },
    canalPassages: [
      { name: 'Cape of Good Hope', direction: 'eastbound' }
    ]
  },
  
  // Suezmax Routes
  {
    routeCode: 'TD6',
    name: 'Black Sea to Mediterranean',
    origin: 'Black Sea',
    destination: 'Mediterranean',
    cargoType: 'Crude Oil',
    quantity: 135000,
    distance: 1230,
    benchmarkVessel: {
      type: 'Suezmax',
      size: 145000,
      consumption: 52
    },
    canalPassages: [
      { name: 'Bosphorus', direction: 'southbound' }
    ]
  },
  {
    routeCode: 'TD20',
    name: 'West Africa to UK/Continent',
    origin: 'West Africa',
    destination: 'UK/Continent',
    cargoType: 'Crude Oil',
    quantity: 130000,
    distance: 4040,
    benchmarkVessel: {
      type: 'Suezmax',
      size: 145000,
      consumption: 50
    }
  },
  
  // Aframax Routes
  {
    routeCode: 'TD7',
    name: 'North Sea to Continent',
    origin: 'North Sea',
    destination: 'Continent',
    cargoType: 'Crude Oil',
    quantity: 80000,
    distance: 830,
    benchmarkVessel: {
      type: 'Aframax',
      size: 105000,
      consumption: 45
    }
  },
  {
    routeCode: 'TD8',
    name: 'Kuwait to Singapore',
    origin: 'Kuwait',
    destination: 'Singapore',
    cargoType: 'Crude Oil',
    quantity: 80000,
    distance: 3800,
    benchmarkVessel: {
      type: 'Aframax',
      size: 105000,
      consumption: 42
    }
  },
  {
    routeCode: 'TD9',
    name: 'Caribbean to US Gulf',
    origin: 'Caribbean',
    destination: 'US Gulf',
    cargoType: 'Crude Oil',
    quantity: 70000,
    distance: 1950,
    benchmarkVessel: {
      type: 'Aframax',
      size: 105000,
      consumption: 40
    }
  },
  {
    routeCode: 'TD19',
    name: 'Cross Mediterranean',
    origin: 'Mediterranean',
    destination: 'Mediterranean',
    cargoType: 'Crude Oil',
    quantity: 80000,
    distance: 850,
    benchmarkVessel: {
      type: 'Aframax',
      size: 105000,
      consumption: 44
    }
  },
  
  // Clean Tanker Routes (LR2, LR1, MR)
  {
    routeCode: 'TC1',
    name: 'Persian Gulf to Japan',
    origin: 'Persian Gulf',
    destination: 'Japan',
    cargoType: 'Clean Petroleum Products',
    quantity: 75000,
    distance: 6570,
    benchmarkVessel: {
      type: 'LR2',
      size: 110000,
      consumption: 46
    }
  },
  {
    routeCode: 'TC2',
    name: 'Continent to USAC',
    origin: 'Continent',
    destination: 'US Atlantic Coast',
    cargoType: 'Clean Petroleum Products',
    quantity: 37000,
    distance: 3450,
    benchmarkVessel: {
      type: 'MR',
      size: 50000,
      consumption: 30
    }
  },
  {
    routeCode: 'TC5',
    name: 'Persian Gulf to Japan',
    origin: 'Persian Gulf',
    destination: 'Japan',
    cargoType: 'Clean Petroleum Products',
    quantity: 55000,
    distance: 6570,
    benchmarkVessel: {
      type: 'LR1',
      size: 75000,
      consumption: 38
    }
  },
  {
    routeCode: 'TC14',
    name: 'US Gulf to Continent',
    origin: 'US Gulf',
    destination: 'Continent',
    cargoType: 'Clean Petroleum Products',
    quantity: 38000,
    distance: 4825,
    benchmarkVessel: {
      type: 'MR',
      size: 50000,
      consumption: 32
    }
  }
];

/**
 * Get mock freight route data
 * @returns {Array} Array of mock freight route data
 */
const getMockFreightRoutes = () => {
  return [...mockFreightRoutes];
};

module.exports = {
  getMockFreightRoutes
}; 