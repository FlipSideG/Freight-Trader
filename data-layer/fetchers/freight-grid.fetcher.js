const { getMockFreightRoutes } = require('../mocks/freight-route.mock');
const { generateMockFreightRates } = require('../mocks/freight-rate.mock');
const FreightRouteRepository = require('../repositories/freight-route.repository');
const FreightRateRepository = require('../repositories/freight-rate.repository');

/**
 * Freight Grid Fetcher
 * Responsible for fetching and managing freight grid data (routes and rates)
 */
class FreightGridFetcher {
  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === 'true';
  }

  /**
   * Initialize routes by loading/creating standard shipping routes
   * @returns {Promise<Object>} Result of the operation
   */
  async initializeRoutes() {
    try {
      // Check if routes already exist
      const existingRoutes = await FreightRouteRepository.findAll();
      
      if (existingRoutes.length > 0) {
        console.log(`Found ${existingRoutes.length} existing freight routes`);
        return {
          success: true,
          count: existingRoutes.length,
          message: `${existingRoutes.length} freight routes already exist`
        };
      }
      
      // Load routes (either from an external source or mock data)
      let routesData = [];
      
      if (this.useMockData) {
        console.log('Using mock freight route data');
        routesData = getMockFreightRoutes();
      } else {
        // In a real application, you would fetch routes from an API or other data source
        throw new Error('External route data source not configured. Set USE_MOCK_DATA=true to use mock data.');
      }
      
      console.log(`Creating ${routesData.length} freight routes`);
      
      // Save routes to the database
      const result = await FreightRouteRepository.bulkCreate(routesData);
      
      return {
        success: true,
        count: result.length,
        message: `${result.length} freight routes created successfully`
      };
    } catch (error) {
      console.error('Error initializing freight routes:', error.message);
      throw error;
    }
  }

  /**
   * Fetch and save freight rates
   * @param {Object} options - Options for fetching (source, date range, etc.)
   * @returns {Promise<Object>} Result of the operation
   */
  async fetchAndSaveRates(options = {}) {
    try {
      // Ensure we have routes first
      const routes = await FreightRouteRepository.findAll({ isActive: true });
      
      if (routes.length === 0) {
        throw new Error('No freight routes found. Initialize routes first.');
      }
      
      console.log(`Found ${routes.length} routes for rate data`);
      
      // Get rate data (either from external source or generate mock data)
      let rateData = [];
      
      if (this.useMockData || options.useMockData) {
        console.log('Generating mock freight rate data');
        const daysOfHistory = options.daysOfHistory || 30;
        rateData = generateMockFreightRates(routes, daysOfHistory);
      } else if (options.sourceType === 'email') {
        // In a real application, you would implement email parsing logic here
        console.log('Email source type not yet implemented');
        throw new Error('Email parsing not implemented yet');
      } else if (options.sourceType === 'excel') {
        // In a real application, you would implement Excel file parsing here
        console.log('Excel source type not yet implemented');
        throw new Error('Excel file parsing not implemented yet');
      } else if (options.sourceType === 'api') {
        // In a real application, you would implement API fetching here
        console.log('API source type not yet implemented');
        throw new Error('API fetching not implemented yet');
      } else {
        throw new Error('Invalid source type. Use mock data or specify a valid source type.');
      }
      
      console.log(`Processing ${rateData.length} freight rate records`);
      
      const results = {
        total: rateData.length,
        created: 0,
        updated: 0,
        errors: []
      };
      
      // Save rates to the database
      for (const rate of rateData) {
        try {
          // Check if there's already a rate for this route and date
          const existingRates = await FreightRateRepository.findAll({
            routeId: rate.routeId,
            date: {
              $gte: new Date(rate.date.setHours(0, 0, 0, 0)),
              $lte: new Date(rate.date.setHours(23, 59, 59, 999))
            }
          }, { limit: 1 });
          
          if (existingRates.length > 0) {
            // Update existing rate
            await FreightRateRepository.update(existingRates[0]._id, rate);
            results.updated++;
          } else {
            // Create new rate
            await FreightRateRepository.create(rate);
            results.created++;
          }
        } catch (error) {
          console.error(`Error processing rate for route ${rate.routeId}:`, error.message);
          results.errors.push({
            routeId: rate.routeId,
            date: rate.date,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error fetching and saving freight rates:', error.message);
      throw error;
    }
  }

  /**
   * Schedule regular fetching of freight rate data
   * @param {number} intervalHours - Hours between fetches
   */
  scheduleRegularFetching(intervalHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    console.log(`Scheduling freight grid data fetching every ${intervalHours} hours`);
    
    // Ensure we have freight routes
    this.initializeRoutes()
      .then(routeResult => {
        console.log('Freight routes initialized:', routeResult);
        
        // Initial fetch
        return this.fetchAndSaveRates();
      })
      .then(rateResult => {
        console.log('Initial freight rate fetch completed:', rateResult);
      })
      .catch(error => {
        console.error('Error in initial freight grid data setup:', error.message);
      });
    
    // Schedule regular fetches
    setInterval(() => {
      this.fetchAndSaveRates()
        .then(results => {
          console.log('Scheduled freight rate fetch completed:', results);
        })
        .catch(error => {
          console.error('Error in scheduled freight rate fetch:', error.message);
        });
    }, intervalMs);
  }
}

module.exports = new FreightGridFetcher(); 