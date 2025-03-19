const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Noon Report Schema - Main schema for storing vessel noon reports
 */
const noonReportSchema = new Schema({
  // Vessel identification
  vessel: {
    imo: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['VLCC', 'Suezmax', 'Aframax', 'LR2', 'LR1', 'MR', 'Handysize', 'Other'],
      required: true
    }
  },

  // Report metadata
  reportDateTime: {
    type: Date,
    required: true,
    index: true
  },
  voyageNumber: {
    type: String,
    required: true,
    index: true
  },
  reportType: {
    type: String,
    enum: ['NOON', 'DEPARTURE', 'ARRIVAL', 'BUNKER', 'EVENT'],
    default: 'NOON'
  },

  // Navigation data
  navigation: {
    position: {
      latitude: Number,
      longitude: Number
    },
    course: Number,
    speed: Number,
    rpm: Number,
    slip: Number,
    distanceRun: {
      since: String,
      nauticalMiles: Number
    },
    distanceToGo: {
      nauticalMiles: Number,
      toDestination: String
    }
  },

  // Port information
  port: {
    name: String,
    country: String,
    activity: String,
    eta: Date,
    etd: Date
  },

  // Canal delays
  canalDelays: { 
    type: Number, 
    default: null 
  }, // Delay in hours

  // Consumption data
  consumption: {
    lastPeriod: {
      hfo: Number,
      lsfo: Number,
      mgo: Number,
      lng: Number,
      freshWater: Number
    },
    total: {
      hfo: Number,
      lsfo: Number,
      mgo: Number,
      lng: Number,
      freshWater: Number
    },
    remainingOnBoard: {
      hfo: Number,
      lsfo: Number,
      mgo: Number,
      lng: Number,
      freshWater: Number
    }
  },

  // Weather data
  weather: {
    windForce: Number,
    windDirection: Number,
    seaState: Number,
    swellDirection: Number,
    swellHeight: Number,
    currents: { // Added for ETA adjustments
      speed: Number, // Knots
      direction: Number // Degrees
    },
    temperature: {
      air: Number,
      sea: Number
    },
    pressure: Number,
    visibility: String,
    description: String
  },

  // Engine performance
  enginePerformance: {
    mainEngine: {
      load: Number,
      rpm: Number,
      efficiency: Number,
      fuelMode: String
    },
    generators: [{
      number: Number,
      load: Number,
      hours: Number
    }],
    boilers: [{
      number: Number,
      load: Number,
      hours: Number
    }]
  },

  // Cargo operations - using Mixed type to avoid validation issues
  cargo: Schema.Types.Mixed,

  // Operational status and remarks
  operationalStatus: {
    status: {
      type: String,
      required: true
    },
    reason: String,
    etc: Date,
    remarks: String
  },

  // Vessel performance
  performance: {
    speedEfficiency: Number,
    fuelEfficiency: Number,
    co2Emissions: Number
  },

  // Additional information
  remarks: String,
  masterName: String,
  chiefEngineerName: String,
  
  // Creation metadata
  metadata: {
    source: {
      type: String,
      default: 'MANUAL'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    reportingDelay: Number,
    isProvisional: Boolean
  }
}, {
  timestamps: true
});

// Add indexes for common queries
noonReportSchema.index({ 'vessel.imo': 1, 'reportDateTime': -1 });
noonReportSchema.index({ 'voyageNumber': 1, 'vessel.imo': 1 });
noonReportSchema.index({ 'reportDateTime': -1 });
noonReportSchema.index({ reportType: 1 });
noonReportSchema.index({ 'weather.seaState': 1 });

// Create a 2D sphere index on position for geo queries
noonReportSchema.index({ 'navigation.position': '2dsphere' });

// Pre-save middleware to update the updatedAt timestamp and validate fields
noonReportSchema.pre('save', function(next) {
  if (this.metadata) {
    this.metadata.updatedAt = new Date();
  }
  if (this.navigation.speed != null && this.navigation.speed < 0) {
    return next(new Error('Speed cannot be negative'));
  }
  if (this.consumption) {
    const fuels = ['hfo', 'lsfo', 'mgo', 'lng', 'freshWater'];
    for (const fuel of fuels) {
      if (this.consumption.lastPeriod[fuel] != null && this.consumption.lastPeriod[fuel] < 0) {
        return next(new Error(`Last period ${fuel} consumption cannot be negative`));
      }
      if (this.consumption.total[fuel] != null && this.consumption.total[fuel] < 0) {
        return next(new Error(`Total ${fuel} consumption cannot be negative`));
      }
      if (this.consumption.remainingOnBoard[fuel] != null && this.consumption.remainingOnBoard[fuel] < 0) {
        return next(new Error(`Remaining ${fuel} cannot be negative`));
      }
    }
  }
  if (this.performance.co2Emissions != null && this.performance.co2Emissions < 0) {
    return next(new Error('CO2 emissions cannot be negative'));
  }
  if (this.canalDelays != null && this.canalDelays < 0) {
    return next(new Error('Canal delays cannot be negative'));
  }
  next();
});

// Virtual property for age of report
noonReportSchema.virtual('reportAge').get(function() {
  return (new Date() - this.reportDateTime) / (1000 * 60 * 60); // Hours
});

// Create the model
const NoonReport = mongoose.model('NoonReport', noonReportSchema);

module.exports = NoonReport; 