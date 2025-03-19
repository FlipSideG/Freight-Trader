/**
 * Mock data generator for FFA prices
 * Based on the data structure from the FFA Oil Curves Excel file
 */

// Route information for descriptive context
const routeDescriptions = {
  TD3C: 'Middle East Gulf to China, 270,000mt',
  TD7: 'North Sea to Continent, 80,000mt',
  TD8: 'Kuwait to Singapore, 80,000mt',
  TD9: 'Caribbean to US Gulf, 70,000mt',
  TD14: 'SE Asia to EC Australia, 80,000mt',
  TD17: 'Baltic to UK-Continent, 100,000mt',
  TD19: 'Cross Med, 80,000mt',
  TD20: 'West Africa to UK-Continent, 130,000mt',
  TC1: 'Middle East to Japan, 75,000mt, clean',
  TC2: 'Continent to USAC, 37,000mt, clean',
  TC3: 'Japan to Singapore, 50,000mt, clean',
  TC5: 'Middle East to Japan, 55,000mt, clean',
  TC6: 'Algeria to Euromed, 30,000mt, clean',
  TC7: 'Singapore to EC Australia, 35,000mt, clean',
  TC14: 'US Gulf to Continent, 38,000mt, clean',
  TC15: 'Mediterranean to Japan, 80,000mt, clean'
};

// Sample FFA price data based on the analyzed Excel file
const mockFFAPrices = [
  {
    dateRecorded: new Date(),
    dataSource: 'Mock Data',
    contractMonth: 'MAR25',
    routes: [
      {
        routeCode: 'TD3C',
        routeDescription: routeDescriptions.TD3C,
        worldscale: 59.71,
        dollarPerMT: 12.89,
        centsPerBBL: 175.79
      },
      {
        routeCode: 'TD7',
        routeDescription: routeDescriptions.TD7,
        worldscale: 108,
        dollarPerMT: 10.39,
        centsPerBBL: 155.07
      },
      {
        routeCode: 'TD8',
        routeDescription: routeDescriptions.TD8,
        worldscale: 139.5,
        dollarPerMT: 20.77,
        centsPerBBL: 310.02
      },
      {
        routeCode: 'TD9',
        routeDescription: routeDescriptions.TD9,
        worldscale: 128.44,
        dollarPerMT: 14.49,
        centsPerBBL: 216.31
      },
      {
        routeCode: 'TD14',
        routeDescription: routeDescriptions.TD14,
        worldscale: 86.36,
        dollarPerMT: 9.97,
        centsPerBBL: 148.78
      }
    ],
    spotPrices: {
      TD3C: 60.05,
      TD7: 107.5,
      TD8: 144.54,
      TD9: 128.44,
      TD14: 86.36
    },
    mtdPrices: {
      TD3C: 57.85,
      TD7: 108.49,
      TD8: 139.44,
      TD9: 128.64,
      TD14: 86.36
    },
    ytdPrices: {
      TD3C: 59.43,
      TD7: 110.08,
      TD8: 163.95,
      TD9: 126.67,
      TD14: 86.36
    },
    marketComments: 'Middle East market slightly firmer, West African market steady.',
    metadata: {
      isProvisional: false,
      isWeekend: false,
      isHoliday: false,
      hasUnusualActivity: false
    }
  },
  {
    dateRecorded: new Date(),
    dataSource: 'Mock Data',
    contractMonth: 'APR25',
    routes: [
      {
        routeCode: 'TD3C',
        routeDescription: routeDescriptions.TD3C,
        worldscale: 60.00,
        dollarPerMT: 12.95,
        centsPerBBL: 176.64
      },
      {
        routeCode: 'TD7',
        routeDescription: routeDescriptions.TD7,
        worldscale: 103.00,
        dollarPerMT: 9.91,
        centsPerBBL: 147.89
      },
      {
        routeCode: 'TD8',
        routeDescription: routeDescriptions.TD8,
        worldscale: 136.50,
        dollarPerMT: 20.32,
        centsPerBBL: 303.36
      },
      {
        routeCode: 'TD9',
        routeDescription: routeDescriptions.TD9,
        worldscale: 137.00,
        dollarPerMT: 14.49,
        centsPerBBL: 216.31
      },
      {
        routeCode: 'TD14',
        routeDescription: routeDescriptions.TD14,
        worldscale: 86.36,
        dollarPerMT: 9.97,
        centsPerBBL: 148.78
      }
    ],
    spotPrices: {
      TD3C: 60.05,
      TD7: 107.5,
      TD8: 144.54,
      TD9: 128.44,
      TD14: 86.36
    },
    mtdPrices: {
      TD3C: 57.85,
      TD7: 108.49,
      TD8: 139.44,
      TD9: 128.64,
      TD14: 86.36
    },
    ytdPrices: {
      TD3C: 59.43,
      TD7: 110.08,
      TD8: 163.95,
      TD9: 126.67,
      TD14: 86.36
    },
    marketComments: 'Forward curves show contango structure in major routes.',
    metadata: {
      isProvisional: false,
      isWeekend: false,
      isHoliday: false,
      hasUnusualActivity: false
    }
  },
  {
    dateRecorded: new Date(),
    dataSource: 'Mock Data',
    contractMonth: 'MAY25',
    routes: [
      {
        routeCode: 'TD3C',
        routeDescription: routeDescriptions.TD3C,
        worldscale: 58.25,
        dollarPerMT: 12.57,
        centsPerBBL: 171.49
      },
      {
        routeCode: 'TD7',
        routeDescription: routeDescriptions.TD7,
        worldscale: 100.00,
        dollarPerMT: 9.62,
        centsPerBBL: 143.58
      },
      {
        routeCode: 'TD8',
        routeDescription: routeDescriptions.TD8,
        worldscale: 135.00,
        dollarPerMT: 20.10,
        centsPerBBL: 300.02
      },
      {
        routeCode: 'TD9',
        routeDescription: routeDescriptions.TD9,
        worldscale: 137.00,
        dollarPerMT: 12.81,
        centsPerBBL: 191.19
      },
      {
        routeCode: 'TD14',
        routeDescription: routeDescriptions.TD14,
        worldscale: 86.36,
        dollarPerMT: 9.97,
        centsPerBBL: 148.78
      }
    ],
    spotPrices: {
      TD3C: 60.05,
      TD7: 107.5,
      TD8: 144.54,
      TD9: 128.44,
      TD14: 86.36
    },
    mtdPrices: {
      TD3C: 57.85,
      TD7: 108.49,
      TD8: 139.44,
      TD9: 128.64,
      TD14: 86.36
    },
    ytdPrices: {
      TD3C: 59.43,
      TD7: 110.08,
      TD8: 163.95,
      TD9: 126.67,
      TD14: 86.36
    },
    marketComments: 'Seasonal expectations showing softening in Middle East rates for May.',
    metadata: {
      isProvisional: false,
      isWeekend: false,
      isHoliday: false,
      hasUnusualActivity: false
    }
  },
  {
    dateRecorded: new Date(),
    dataSource: 'Mock Data',
    contractMonth: 'JUN25',
    routes: [
      {
        routeCode: 'TD3C',
        routeDescription: routeDescriptions.TD3C,
        worldscale: 56.25,
        dollarPerMT: 12.14,
        centsPerBBL: 165.60
      },
      {
        routeCode: 'TD7',
        routeDescription: routeDescriptions.TD7,
        worldscale: 99.00,
        dollarPerMT: 9.52,
        centsPerBBL: 142.15
      },
      {
        routeCode: 'TD8',
        routeDescription: routeDescriptions.TD8,
        worldscale: 133.00,
        dollarPerMT: 19.80,
        centsPerBBL: 295.58
      },
      {
        routeCode: 'TD9',
        routeDescription: routeDescriptions.TD9,
        worldscale: 137.00,
        dollarPerMT: 12.81,
        centsPerBBL: 191.19
      },
      {
        routeCode: 'TD14',
        routeDescription: routeDescriptions.TD14,
        worldscale: 86.36,
        dollarPerMT: 9.97,
        centsPerBBL: 148.78
      }
    ],
    spotPrices: {
      TD3C: 60.05,
      TD7: 107.5,
      TD8: 144.54,
      TD9: 128.44,
      TD14: 86.36
    },
    mtdPrices: {
      TD3C: 57.85,
      TD7: 108.49,
      TD8: 139.44,
      TD9: 128.64,
      TD14: 86.36
    },
    ytdPrices: {
      TD3C: 59.43,
      TD7: 110.08,
      TD8: 163.95,
      TD9: 126.67,
      TD14: 86.36
    },
    marketComments: 'Summer trading patterns beginning to influence forward curves.',
    metadata: {
      isProvisional: false,
      isWeekend: false,
      isHoliday: false,
      hasUnusualActivity: false
    }
  }
];

/**
 * Get mock FFA price data
 * @param {number} count - Number of records to generate
 * @returns {Array} - Array of mock FFA price data
 */
const getMockFFAPrices = (count = 4) => {
  if (count <= mockFFAPrices.length) {
    return mockFFAPrices.slice(0, count);
  }
  
  // If we need more than we have, create additional months 
  // by shifting dates and slightly modifying values
  const additionalMonths = ['JUL25', 'AUG25', 'SEP25', 'OCT25', 'NOV25', 'DEC25', 'JAN26', 'FEB26'];
  const additionalPrices = [];
  
  for (let i = 0; i < count - mockFFAPrices.length; i++) {
    if (i >= additionalMonths.length) break;
    
    const basePriceIndex = i % mockFFAPrices.length;
    const basePrice = JSON.parse(JSON.stringify(mockFFAPrices[basePriceIndex]));
    
    // Modify the contract month
    basePrice.contractMonth = additionalMonths[i];
    
    // Adjust the date (move forward 1 month per record)
    const newDate = new Date(basePrice.dateRecorded);
    newDate.setMonth(newDate.getMonth() + i + 1);
    basePrice.dateRecorded = newDate;
    
    // Slightly modify the prices to create realistic variations
    // We'll apply a small random adjustment factor
    const adjustmentFactor = 0.95 + Math.random() * 0.1; // Between 0.95 and 1.05
    
    basePrice.routes.forEach(route => {
      route.worldscale = parseFloat((route.worldscale * adjustmentFactor).toFixed(2));
      route.dollarPerMT = parseFloat((route.dollarPerMT * adjustmentFactor).toFixed(2));
      route.centsPerBBL = parseFloat((route.centsPerBBL * adjustmentFactor).toFixed(2));
    });
    
    additionalPrices.push(basePrice);
  }
  
  return [...mockFFAPrices, ...additionalPrices].slice(0, count);
};

module.exports = {
  getMockFFAPrices,
  routeDescriptions
}; 