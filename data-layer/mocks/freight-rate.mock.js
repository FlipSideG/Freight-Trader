/**
 * Mock data generator for freight rates
 * Creates realistic freight rate data for various shipping routes
 */

// Helper function to generate a random number within a range
const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Helper function to add or subtract days from a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Generate mock freight rate data
 * This requires the actual route IDs from the database
 * @param {Array} routes - Array of route documents from the database
 * @param {number} daysOfHistory - Number of days of historical data to generate
 * @returns {Array} Array of mock freight rate data
 */
const generateMockFreightRates = (routes, daysOfHistory = 30) => {
  if (!routes || !Array.isArray(routes) || routes.length === 0) {
    throw new Error('Routes array is required to generate mock freight rates');
  }

  const rates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initial rate ranges by vessel type
  const initialRates = {
    // Crude routes - Worldscale
    'VLCC': { min: 45, max: 65 },
    'Suezmax': { min: 70, max: 110 },
    'Aframax': { min: 90, max: 140 },
    // Clean routes - Worldscale
    'LR2': { min: 90, max: 130 },
    'LR1': { min: 110, max: 150 },
    'MR': { min: 120, max: 180 },
  };

  // TCE ranges by vessel type and fuel type (USD/day)
  const tceRanges = {
    'VLCC': { 
      nonEco: { min: 15000, max: 35000 },
      eco: { min: 18000, max: 40000 },
      scrubber: { min: 22000, max: 45000 }
    },
    'Suezmax': { 
      nonEco: { min: 14000, max: 30000 },
      eco: { min: 16000, max: 35000 },
      scrubber: { min: 19000, max: 38000 }
    },
    'Aframax': { 
      nonEco: { min: 12000, max: 28000 },
      eco: { min: 14000, max: 32000 },
      scrubber: { min: 17000, max: 35000 }
    },
    'LR2': { 
      nonEco: { min: 13000, max: 29000 },
      eco: { min: 15000, max: 33000 },
      scrubber: { min: 18000, max: 36000 }
    },
    'LR1': { 
      nonEco: { min: 12000, max: 26000 },
      eco: { min: 14000, max: 30000 },
      scrubber: { min: 16000, max: 33000 }
    },
    'MR': { 
      nonEco: { min: 10000, max: 24000 },
      eco: { min: 12000, max: 27000 },
      scrubber: { min: 14000, max: 30000 }
    }
  };

  // Generate rates for each route and day
  routes.forEach(route => {
    let routeId = route._id;
    let vesselType = route.benchmarkVessel ? route.benchmarkVessel.type : 'Aframax';
    let rateType = 'worldscale'; // Default for most tanker routes
    
    // Special case for some routes that might use USD instead of worldscale
    const usdRoutes = ['TD1', 'TC14']; // Example routes that might use USD
    if (usdRoutes.includes(route.routeCode)) {
      rateType = 'usd';
    }

    // Get initial rate range for this vessel type
    const rateRange = initialRates[vesselType] || initialRates['Aframax'];
    
    // Start with a base rate within the range
    let currentRate = randomInRange(rateRange.min, rateRange.max);
    
    // If USD rate, scale it appropriately (e.g., in thousands for VLCC)
    if (rateType === 'usd') {
      if (vesselType === 'VLCC') currentRate = currentRate * 100000; // e.g., $5.2M
      else if (vesselType === 'Suezmax') currentRate = currentRate * 50000; // e.g., $3.8M
      else currentRate = currentRate * 20000; // e.g., $2.2M for Aframax/other
    }
    
    // Generate rates for each day
    for (let i = 0; i < daysOfHistory; i++) {
      const date = addDays(today, -i); // Go back i days from today
      
      // Skip weekends for realism
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // 0 = Sunday, 6 = Saturday
      
      // Add some daily variation (more volatile for some routes)
      const volatility = rateType === 'worldscale' ? 
        randomInRange(0.5, 2.5) : 
        randomInRange(50000, 150000);
      
      // Decide if going up or down (slightly biased to follow trends)
      const direction = Math.random() > 0.55 ? 1 : -1; 
      
      // Calculate new rate
      const newRate = rateType === 'worldscale' ? 
        Math.max(rateRange.min * 0.8, Math.min(rateRange.max * 1.2, currentRate + (direction * volatility))) : 
        Math.max(currentRate * 0.8, Math.min(currentRate * 1.2, currentRate + (direction * volatility)));
      
      // Calculate change
      const change = newRate - currentRate;
      
      // Update current rate for next iteration
      currentRate = newRate;
      
      // Calculate TCE values
      const tceRange = tceRanges[vesselType] || tceRanges['Aframax'];
      
      const tceNonEco = Math.round(randomInRange(tceRange.nonEco.min, tceRange.nonEco.max));
      const tceEco = Math.round(randomInRange(tceRange.eco.min, tceRange.eco.max));
      const tceScrubber = Math.round(randomInRange(tceRange.scrubber.min, tceRange.scrubber.max));
      
      // Create rate object
      rates.push({
        routeId,
        date,
        quantity: route.quantity,
        rate: rateType === 'worldscale' ? Math.round(newRate * 100) / 100 : Math.round(newRate),
        rateType,
        change: rateType === 'worldscale' ? Math.round(change * 100) / 100 : Math.round(change),
        tceNonEco,
        tceEco,
        tceScrubber,
        source: 'manual',
        metadata: new Map([
          ['isPreliminary', Math.random() > 0.9 ? 'true' : 'false'],
          ['publisher', 'Mock Data Generator'],
          ['confidence', (Math.random() * 3 + 7).toFixed(1)] // 7.0 to 10.0
        ])
      });
    }
  });
  
  return rates;
};

module.exports = {
  generateMockFreightRates
}; 