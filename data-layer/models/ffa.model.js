const mongoose = require('mongoose');

/**
 * Route Price Schema - For storing price data for a specific route
 */
const routePriceSchema = new mongoose.Schema({
  // Route code (e.g., TD3C, TD7, TD8, TD9)
  routeCode: { 
    type: String, 
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  
  // Description of the route
  routeDescription: {
    type: String,
    trim: true
  },
  
  // Worldscale price
  worldscale: {
    type: Number,
    default: null
  },
  
  // Dollar per metric ton
  dollarPerMT: {
    type: Number,
    default: null
  },
  
  // Cents per barrel
  centsPerBBL: {
    type: Number,
    default: null
  },
  
  // Time Charter Equivalent value (if available)
  tce: {
    type: Number,
    default: null
  },

  // Indicates if TCE is for a round trip
  isRoundTrip: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

/**
 * FFA Price Schema - For storing FFA prices for a specific date/period
 */
const ffaSchema = new mongoose.Schema({
  // The date the data was recorded/updated
  dateRecorded: {
    type: Date,
    required: true,
    index: true
  },
  
  // Source of the FFA data
  dataSource: {
    type: String,
    default: 'Manual Entry',
    trim: true
  },
  
  // The contract month (e.g., MAR25, APR25)
  contractMonth: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true
  },
  
  // Array of route prices
  routes: [routePriceSchema],
  
  // Spot WS prices for quick access (flattened format)
  spotPrices: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Month-to-date (MTD) prices for quick access
  mtdPrices: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Year-to-date (YTD) prices for quick access
  ytdPrices: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Market comments and analysis
  marketComments: {
    type: String,
    trim: true
  },

  // Flag to indicate if this is a live feed
  isLive: { 
    type: Boolean, 
    default: false 
  },

  // Flag to identify duplicate entries during scraping
  isDuplicate: { 
    type: Boolean, 
    default: false, 
    index: true 
  },

  // Threshold for price movement alerts (percentage)
  alertThreshold: { 
    type: Number, 
    default: null 
  },
  
  // Metadata and flags
  metadata: {
    isProvisional: { type: Boolean, default: false },
    isWeekend: { type: Boolean, default: false },
    isHoliday: { type: Boolean, default: false },
    hasUnusualActivity: { type: Boolean, default: false }
  }
}, { 
  timestamps: true,
  // Create compound index for efficient querying by date range and contract
  indexes: [
    { contractMonth: 1, dateRecorded: 1 },
    { 'routes.routeCode': 1, dateRecorded: 1 }
  ]
});

/**
 * Static methods for the FFA model
 */
ffaSchema.statics = {
  /**
   * Get the latest FFA prices for all contracts
   * @returns {Promise<Array>} Array of latest FFA prices
   */
  getLatestPrices: function() {
    return this.aggregate([
      // Sort by date in descending order to get the latest first
      { $sort: { dateRecorded: -1 } },
      // Group by contract month to get the latest entry for each
      { 
        $group: { 
          _id: '$contractMonth',
          latestRecord: { $first: '$$ROOT' }
        }
      },
      // Replace the root with the latest record
      { $replaceRoot: { newRoot: '$latestRecord' } },
      // Sort by contract month
      { $sort: { contractMonth: 1 } }
    ]);
  },
  
  /**
   * Get the price history for a specific route
   * @param {string} routeCode - The route code (e.g., TD3C)
   * @param {Object} options - Query options like limit and date range
   * @returns {Promise<Array>} Array of price history
   */
  getRouteHistory: function(routeCode, options = {}) {
    const { startDate, endDate, limit = 90 } = options;
    
    // Build the query
    const query = {
      'routes.routeCode': routeCode.toUpperCase()
    };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.dateRecorded = {};
      if (startDate) query.dateRecorded.$gte = new Date(startDate);
      if (endDate) query.dateRecorded.$lte = new Date(endDate);
    }
    
    return this.find(query)
      .sort({ dateRecorded: -1 })
      .limit(limit)
      .select('dateRecorded contractMonth routes.$')
      .lean();
  }
};

// Add pre-save validation for price fields
ffaSchema.pre('save', function(next) {
  if (this.routes && this.routes.length > 0) {
    for (const route of this.routes) {
      if (route.worldscale != null && route.worldscale < 0) {
        return next(new Error('Worldscale price cannot be negative'));
      }
      if (route.dollarPerMT != null && route.dollarPerMT < 0) {
        return next(new Error('Dollar per MT price cannot be negative'));
      }
      if (route.centsPerBBL != null && route.centsPerBBL < 0) {
        return next(new Error('Cents per BBL price cannot be negative'));
      }
      if (route.tce != null && route.tce < 0) {
        return next(new Error('TCE value cannot be negative'));
      }
    }
  }
  if (this.alertThreshold != null && this.alertThreshold < 0) {
    return next(new Error('Alert threshold cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('FFAPrice', ffaSchema); 