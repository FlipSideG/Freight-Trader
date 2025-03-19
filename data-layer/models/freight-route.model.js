const mongoose = require('mongoose');

/**
 * Freight Route Schema - For storing static information about freight routes
 */
const freightRouteSchema = new mongoose.Schema({
  // Route code (e.g., TD3C, TD7, TD20)
  routeCode: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  
  // Descriptive name of the route
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Origin port/region
  origin: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Destination port/region
  destination: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Type of cargo (e.g., Clean, Dirty, Crude)
  cargoType: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Typical cargo size in metric tons
  quantity: { 
    type: Number,
    default: null 
  },
  
  // Distance in nautical miles
  distance: { 
    type: Number,
    default: null 
  },
  
  // Canal passages on the route
  canalPassages: [{
    name: { 
      type: String,
      trim: true 
    },
    direction: { 
      type: String, 
      enum: ['northbound', 'southbound', 'eastbound', 'westbound'],
      trim: true 
    }
  }],
  
  // Benchmark vessel information
  benchmarkVessel: {
    type: { 
      type: String, 
      trim: true 
    }, // E.g., VLCC, Suezmax, Aframax
    size: { 
      type: Number 
    }, // Typical vessel size in DWT
    consumption: { 
      type: Number 
    }, // Typical consumption in MT/day
  },
  
  // Additional notes about the route
  notes: { 
    type: String,
    trim: true 
  },
  
  // Whether the route is active in the system
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true
});

/**
 * Static methods for the FreightRoute model
 */
freightRouteSchema.statics = {
  /**
   * Get all active routes
   * @returns {Promise<Array>} Array of active routes
   */
  getActiveRoutes: function() {
    return this.find({ isActive: true }).sort({ routeCode: 1 });
  },
  
  /**
   * Find a route by its code
   * @param {string} routeCode - The route code (e.g., TD3C)
   * @returns {Promise<Object>} Route document
   */
  findByRouteCode: function(routeCode) {
    return this.findOne({ routeCode: routeCode.toUpperCase() });
  }
};

module.exports = mongoose.model('FreightRoute', freightRouteSchema); 