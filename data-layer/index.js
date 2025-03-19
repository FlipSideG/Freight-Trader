/**
 * Data Layer Entry Point
 * Exports all data layer components and initializes data fetchers
 */

// Database connection
const connectDB = require('./db');

// Models
const Vessel = require('./models/vessel.model');
const FFAPrice = require('./models/ffa.model');
const FreightRoute = require('./models/freight-route.model');
const FreightRate = require('./models/freight-rate.model');

// Repositories
const VesselRepository = require('./repositories/vessel.repository');
const FFARepository = require('./repositories/ffa.repository');
const FreightRouteRepository = require('./repositories/freight-route.repository');
const FreightRateRepository = require('./repositories/freight-rate.repository');

// Fetchers
const Q88Fetcher = require('./fetchers/q88.fetcher');
const FFAFetcher = require('./fetchers/ffa.fetcher');
const FreightGridFetcher = require('./fetchers/freight-grid.fetcher');

// Initialize data fetchers if needed
const initFetchers = (scheduleEnabled = false) => {
  // Only schedule fetchers if requested - typically in production
  if (scheduleEnabled) {
    Q88Fetcher.scheduleRegularFetching(24); // Fetch Q88 data every 24 hours
    FFAFetcher.scheduleRegularFetching(24); // Fetch FFA data every 24 hours
    FreightGridFetcher.scheduleRegularFetching(24); // Fetch freight grid data every 24 hours
  }
};

module.exports = {
  // Core database connection
  connectDB,
  
  // Models
  models: {
    Vessel,
    FFAPrice,
    FreightRoute,
    FreightRate
  },
  
  // Repositories
  repositories: {
    VesselRepository,
    FFARepository,
    FreightRouteRepository,
    FreightRateRepository
  },
  
  // Fetchers
  fetchers: {
    Q88Fetcher,
    FFAFetcher,
    FreightGridFetcher
  },
  
  // Initialization function
  initFetchers
}; 