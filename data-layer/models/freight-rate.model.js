const mongoose = require('mongoose');

/**
 * Freight Rate Schema - For storing dynamic freight rate information
 */
const freightRateSchema = new mongoose.Schema({
  // Reference to the freight route
  routeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FreightRoute', 
    required: true,
    index: true 
  },
  
  // Date of the rate update
  date: { 
    type: Date, 
    required: true,
    index: true 
  },
  
  // Optional quantity (e.g., 90, 60 for K BBL or MT), null if not applicable
  quantity: { 
    type: Number, 
    default: null 
  },
  
  // Rate value (e.g., 75 for WS75, 3100000 for USD 3.1M)
  rate: { 
    type: Number, 
    required: true 
  },
  
  // Type of rate (worldscale or USD)
  rateType: { 
    type: String, 
    enum: ['worldscale', 'usd'], 
    required: true 
  },
  
  // Change in rate from previous update (same unit as rate)
  change: { 
    type: Number,
    default: 0 
  },
  
  // TCE for non-eco vessels in USD/day
  tceNonEco: { 
    type: Number,
    default: null 
  },
  
  // TCE for eco vessels in USD/day
  tceEco: { 
    type: Number,
    default: null 
  },
  
  // TCE for scrubber-equipped vessels in USD/day
  tceScrubber: { 
    type: Number,
    default: null 
  },
  
  // Source of the rate data
  source: { 
    type: String, 
    enum: ['manual', 'email', 'iceMessenger', 'ffaCurve', 'other'], 
    required: true,
    default: 'manual' 
  },
  
  // Flexible field for source-specific details
  metadata: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed,
    default: new Map() 
  }
}, { 
  timestamps: true,
  // Create compound indexes for efficient querying
  indexes: [
    { routeId: 1, date: -1 }, // For getting latest rates for a route
    { date: -1 } // For getting all rates on a specific date
  ]
});

/**
 * Static methods for the FreightRate model
 */
freightRateSchema.statics = {
  /**
   * Get the latest rates for all routes
   * @returns {Promise<Array>} Array of latest rates
   */
  getLatestRates: function() {
    return this.aggregate([
      // Sort by date in descending order to get the latest first
      { $sort: { date: -1 } },
      // Group by route to get the latest entry for each
      { 
        $group: { 
          _id: '$routeId',
          latestRecord: { $first: '$$ROOT' }
        }
      },
      // Replace the root with the latest record
      { $replaceRoot: { newRoot: '$latestRecord' } },
      // Lookup route information
      {
        $lookup: {
          from: 'freightroutes',
          localField: 'routeId',
          foreignField: '_id',
          as: 'route'
        }
      },
      // Unwind the route array
      { $unwind: '$route' },
      // Sort by route code
      { $sort: { 'route.routeCode': 1 } }
    ]);
  },
  
  /**
   * Get rates for a specific route within a date range
   * @param {string} routeId - The route ID
   * @param {Object} options - Query options (date range, limit)
   * @returns {Promise<Array>} Array of rates
   */
  getRouteRates: function(routeId, options = {}) {
    const { startDate, endDate, limit = 30 } = options;
    
    // Build the query
    const query = { routeId: mongoose.Types.ObjectId(routeId) };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    return this.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .populate('routeId', 'routeCode name origin destination')
      .lean();
  }
};

module.exports = mongoose.model('FreightRate', freightRateSchema); 