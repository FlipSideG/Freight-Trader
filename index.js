// index.js
const dotenv = require('dotenv');

// Load environment variables from .env and check for errors
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
  process.exit(1); // Exit if .env fails to load
}

console.log('Starting application...'); // Debug: Confirm script starts

const express = require('express');
// Import the data layer module instead of just the DB connection
const dataLayer = require('./data-layer');

console.log('Environment variables:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  USE_MOCK_DATA: process.env.USE_MOCK_DATA
}); // Debug: Check env vars

// Check if critical environment variables are set
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Freight Trader Software is running!');
});

// API route to get all vessels
app.get('/api/vessels', async (req, res) => {
  try {
    const vessels = await dataLayer.repositories.VesselRepository.findAll();
    res.json(vessels);
  } catch (error) {
    console.error('Error fetching vessels:', error);
    res.status(500).json({ error: 'Failed to fetch vessels' });
  }
});

// API route to get a vessel by IMO
app.get('/api/vessels/:imo', async (req, res) => {
  try {
    const vessel = await dataLayer.repositories.VesselRepository.findByIMO(req.params.imo);
    if (!vessel) {
      return res.status(404).json({ error: 'Vessel not found' });
    }
    res.json(vessel);
  } catch (error) {
    console.error(`Error fetching vessel with IMO ${req.params.imo}:`, error);
    res.status(500).json({ error: 'Failed to fetch vessel' });
  }
});

// API route to manually trigger vessel data fetching
app.post('/api/fetch/vessels', async (req, res) => {
  try {
    const results = await dataLayer.fetchers.Q88Fetcher.fetchAndSaveVessels();
    res.json(results);
  } catch (error) {
    console.error('Error fetching vessels data:', error);
    res.status(500).json({ error: 'Failed to fetch vessel data' });
  }
});

// -------------------- FFA Data API Routes --------------------

// API route to get latest FFA prices
app.get('/api/ffa/latest', async (req, res) => {
  try {
    const prices = await dataLayer.repositories.FFARepository.findLatestPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching latest FFA prices:', error);
    res.status(500).json({ error: 'Failed to fetch latest FFA prices' });
  }
});

// API route to get FFA prices by contract month
app.get('/api/ffa/month/:contractMonth', async (req, res) => {
  try {
    const prices = await dataLayer.repositories.FFARepository.findByContractMonth(
      req.params.contractMonth
    );
    res.json(prices);
  } catch (error) {
    console.error(`Error fetching FFA prices for ${req.params.contractMonth}:`, error);
    res.status(500).json({ error: 'Failed to fetch FFA prices' });
  }
});

// API route to get price history for a specific route
app.get('/api/ffa/route/:routeCode', async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 90
    };
    
    const prices = await dataLayer.repositories.FFARepository.findRouteHistory(
      req.params.routeCode,
      options
    );
    res.json(prices);
  } catch (error) {
    console.error(`Error fetching price history for route ${req.params.routeCode}:`, error);
    res.status(500).json({ error: 'Failed to fetch route price history' });
  }
});

// API route to get all FFA prices with pagination
app.get('/api/ffa', async (req, res) => {
  try {
    const { limit = 50, skip = 0, sort = 'dateRecorded', order = -1 } = req.query;
    
    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip),
      sort: { [sort]: parseInt(order) }
    };
    
    const prices = await dataLayer.repositories.FFARepository.findAll({}, options);
    res.json(prices);
  } catch (error) {
    console.error('Error fetching FFA prices:', error);
    res.status(500).json({ error: 'Failed to fetch FFA prices' });
  }
});

// API route to manually trigger FFA data fetching
app.post('/api/fetch/ffa', async (req, res) => {
  try {
    const options = req.body || {};
    const results = await dataLayer.fetchers.FFAFetcher.fetchAndSavePrices(options);
    res.json(results);
  } catch (error) {
    console.error('Error fetching FFA data:', error);
    res.status(500).json({ error: 'Failed to fetch FFA data' });
  }
});

// -------------------- Freight Grid API Routes --------------------

// API route to get all freight routes
app.get('/api/freight/routes', async (req, res) => {
  try {
    const routes = await dataLayer.repositories.FreightRouteRepository.findAll();
    res.json(routes);
  } catch (error) {
    console.error('Error fetching freight routes:', error);
    res.status(500).json({ error: 'Failed to fetch freight routes' });
  }
});

// API route to get a specific freight route by ID
app.get('/api/freight/routes/:id', async (req, res) => {
  try {
    const route = await dataLayer.repositories.FreightRouteRepository.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Freight route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error(`Error fetching freight route with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch freight route' });
  }
});

// API route to get a freight route by route code
app.get('/api/freight/routes/code/:routeCode', async (req, res) => {
  try {
    const route = await dataLayer.repositories.FreightRouteRepository.findByRouteCode(req.params.routeCode);
    if (!route) {
      return res.status(404).json({ error: 'Freight route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error(`Error fetching freight route with code ${req.params.routeCode}:`, error);
    res.status(500).json({ error: 'Failed to fetch freight route' });
  }
});

// API route to get the latest freight rates for all routes (freight grid)
app.get('/api/freight/grid', async (req, res) => {
  try {
    const rates = await dataLayer.repositories.FreightRateRepository.getLatestRates();
    res.json(rates);
  } catch (error) {
    console.error('Error fetching freight grid data:', error);
    res.status(500).json({ error: 'Failed to fetch freight grid data' });
  }
});

// API route to get freight rates for a specific route
app.get('/api/freight/rates/:routeId', async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 30
    };
    
    const rates = await dataLayer.repositories.FreightRateRepository.getRouteRates(
      req.params.routeId,
      options
    );
    res.json(rates);
  } catch (error) {
    console.error(`Error fetching freight rates for route ${req.params.routeId}:`, error);
    res.status(500).json({ error: 'Failed to fetch freight rates' });
  }
});

// API route to get freight rates for a specific date
app.get('/api/freight/rates/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    
    const rates = await dataLayer.repositories.FreightRateRepository.getRatesByDate(date);
    res.json(rates);
  } catch (error) {
    console.error(`Error fetching freight rates for date ${req.params.date}:`, error);
    res.status(500).json({ error: 'Failed to fetch freight rates' });
  }
});

// API route to create a new freight route
app.post('/api/freight/routes', async (req, res) => {
  try {
    const route = await dataLayer.repositories.FreightRouteRepository.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating freight route:', error);
    res.status(500).json({ error: 'Failed to create freight route' });
  }
});

// API route to create a new freight rate
app.post('/api/freight/rates', async (req, res) => {
  try {
    const rate = await dataLayer.repositories.FreightRateRepository.create(req.body);
    res.status(201).json(rate);
  } catch (error) {
    console.error('Error creating freight rate:', error);
    res.status(500).json({ error: 'Failed to create freight rate' });
  }
});

// API route to update a freight route
app.put('/api/freight/routes/:id', async (req, res) => {
  try {
    const route = await dataLayer.repositories.FreightRouteRepository.update(req.params.id, req.body);
    res.json(route);
  } catch (error) {
    console.error(`Error updating freight route with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update freight route' });
  }
});

// API route to update a freight rate
app.put('/api/freight/rates/:id', async (req, res) => {
  try {
    const rate = await dataLayer.repositories.FreightRateRepository.update(req.params.id, req.body);
    res.json(rate);
  } catch (error) {
    console.error(`Error updating freight rate with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update freight rate' });
  }
});

// API route to initialize freight routes
app.post('/api/freight/init/routes', async (req, res) => {
  try {
    const results = await dataLayer.fetchers.FreightGridFetcher.initializeRoutes();
    res.json(results);
  } catch (error) {
    console.error('Error initializing freight routes:', error);
    res.status(500).json({ error: 'Failed to initialize freight routes' });
  }
});

// API route to fetch and save freight rates
app.post('/api/freight/fetch/rates', async (req, res) => {
  try {
    const options = req.body || {};
    const results = await dataLayer.fetchers.FreightGridFetcher.fetchAndSaveRates(options);
    res.json(results);
  } catch (error) {
    console.error('Error fetching freight rates:', error);
    res.status(500).json({ error: 'Failed to fetch freight rates' });
  }
});

// View Routes
app.get('/', async (req, res) => {
  try {
    // Get stats
    const stats = {
      vesselCount: await dataLayer.repositories.VesselRepository.count(),
      routeCount: await dataLayer.repositories.FreightRouteRepository.count(),
      rateCount: await dataLayer.repositories.FreightRateRepository.count(),
      ffaCount: await dataLayer.repositories.FFARepository.count()
    };

    // Get latest rates
    const latestRates = await dataLayer.repositories.FreightRateRepository.findLatest(5);

    // Get latest FFA prices
    const latestFFA = await dataLayer.repositories.FFARepository.findLatestPrices(5);

    // Get recent updates (mock data for demo)
    const recentUpdates = [
      {
        timestamp: new Date(),
        title: 'Database Updated',
        description: 'Freight rates updated with latest market data'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        title: 'New Vessels Added',
        description: '15 new vessels added to the database'
      },
      {
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        title: 'Rate Calculation Updated',
        description: 'TCE calculation methodology updated for better accuracy'
      }
    ];

    // Dummy data for rate trends
    const rateTrends = [{}, {}, {}]; // Will be populated with real data

    res.render('dashboard', {
      pageTitle: 'Dashboard',
      currentPage: 'dashboard',
      stats,
      latestRates,
      latestFFA,
      recentUpdates,
      rateTrends
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).render('error', { 
      message: 'Error loading dashboard', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/freight-grid', async (req, res) => {
  try {
    const vesselType = req.query.vesselType || 'all';
    const cargoType = req.query.cargoType || 'all';
    const displayTCE = req.query.displayTCE === 'true';

    // Get routes and latest rates
    let routes = await dataLayer.repositories.FreightRouteRepository.findAll();
    
    // Filter routes by vessel type and cargo type if specified
    if (vesselType !== 'all') {
      routes = routes.filter(route => route.vesselType === vesselType);
    }
    
    if (cargoType !== 'all') {
      routes = routes.filter(route => route.cargoType === cargoType);
    }
    
    // Get latest rates for each route
    const latestRates = await Promise.all(
      routes.map(async route => {
        const rate = await dataLayer.repositories.FreightRateRepository.findLatestByRoute(route.routeCode);
        return {
          route,
          rate
        };
      })
    );

    res.render('freight-grid', {
      pageTitle: 'Freight Grid',
      currentPage: 'freight-grid',
      vesselType,
      cargoType,
      displayTCE,
      rates: latestRates
    });
  } catch (error) {
    console.error('Error rendering freight grid:', error);
    res.status(500).render('error', { 
      message: 'Error loading freight grid', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/routes', async (req, res) => {
  try {
    const vesselType = req.query.vesselType || 'all';
    const cargoType = req.query.cargoType || 'all';
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Build filter
    const filter = {};
    if (vesselType !== 'all') filter.vesselType = vesselType;
    if (cargoType !== 'all') filter.cargoType = cargoType;
    if (search) {
      filter.$or = [
        { routeCode: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Get routes with pagination
    const routes = await dataLayer.repositories.FreightRouteRepository.findAll(filter, { limit, skip });
    const totalCount = await dataLayer.repositories.FreightRouteRepository.count(filter);

    // Create pagination query string without skip parameter
    const queryParams = new URLSearchParams();
    if (vesselType !== 'all') queryParams.append('vesselType', vesselType);
    if (cargoType !== 'all') queryParams.append('cargoType', cargoType);
    if (search) queryParams.append('search', search);
    if (limit !== 20) queryParams.append('limit', limit);
    const paginationQuery = queryParams.toString();

    res.render('routes', {
      pageTitle: 'Routes',
      currentPage: 'routes',
      vesselType,
      cargoType,
      search,
      routes,
      totalCount,
      limit,
      skip,
      paginationQuery,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Routes', url: '/routes' }
      ]
    });
  } catch (error) {
    console.error('Error rendering routes:', error);
    res.status(500).render('error', { 
      message: 'Error loading routes', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/routes/:routeCode', async (req, res) => {
  try {
    const { routeCode } = req.params;
    const route = await dataLayer.repositories.FreightRouteRepository.findByRouteCode(routeCode);
    
    if (!route) {
      return res.status(404).render('error', { 
        message: 'Route not found', 
        error: { status: 404 } 
      });
    }
    
    // Get rate history for this route
    const rateHistory = await dataLayer.repositories.FreightRateRepository.findByRouteCode(routeCode, { limit: 30 });
    
    res.render('route-detail', {
      pageTitle: `Route ${route.routeCode}`,
      currentPage: 'routes',
      route,
      rateHistory,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Routes', url: '/routes' },
        { label: route.routeCode, url: `/routes/${route.routeCode}` }
      ]
    });
  } catch (error) {
    console.error('Error rendering route detail:', error);
    res.status(500).render('error', { 
      message: 'Error loading route details', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/rates', async (req, res) => {
  try {
    const routeCode = req.query.routeCode || 'all';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Build filter
    const filter = {};
    if (routeCode !== 'all') filter.routeCode = routeCode;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    // Get rates with pagination
    const rates = await dataLayer.repositories.FreightRateRepository.findAll(filter, { limit, skip, sort: { date: -1 } });
    const totalCount = await dataLayer.repositories.FreightRateRepository.count(filter);

    // Get routes for filter dropdown
    const routes = await dataLayer.repositories.FreightRouteRepository.findAll({}, { sort: { routeCode: 1 } });

    // Create pagination query string without skip parameter
    const queryParams = new URLSearchParams();
    if (routeCode !== 'all') queryParams.append('routeCode', routeCode);
    if (startDate) queryParams.append('startDate', req.query.startDate);
    if (endDate) queryParams.append('endDate', req.query.endDate);
    if (limit !== 20) queryParams.append('limit', limit);
    const paginationQuery = queryParams.toString();

    res.render('rates', {
      pageTitle: 'Freight Rates',
      currentPage: 'rates',
      routeCode,
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || '',
      rates,
      routes,
      totalCount,
      limit,
      skip,
      paginationQuery,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Rates', url: '/rates' }
      ]
    });
  } catch (error) {
    console.error('Error rendering rates:', error);
    res.status(500).render('error', { 
      message: 'Error loading rates', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/vessels', async (req, res) => {
  try {
    const vesselType = req.query.vesselType || 'all';
    const builtAfter = req.query.builtAfter ? parseInt(req.query.builtAfter) : null;
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Build filter
    const filter = {};
    if (vesselType !== 'all') filter.type = vesselType;
    if (builtAfter) filter.built = { $gte: builtAfter };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { imo: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }

    // Get vessels with pagination
    const vessels = await dataLayer.repositories.VesselRepository.findAll(filter, { limit, skip });
    const totalCount = await dataLayer.repositories.VesselRepository.count(filter);

    // Create pagination query string without skip parameter
    const queryParams = new URLSearchParams();
    if (vesselType !== 'all') queryParams.append('vesselType', vesselType);
    if (builtAfter) queryParams.append('builtAfter', builtAfter);
    if (search) queryParams.append('search', search);
    if (limit !== 20) queryParams.append('limit', limit);
    const paginationQuery = queryParams.toString();

    res.render('vessels', {
      pageTitle: 'Vessels',
      currentPage: 'vessels',
      vesselType,
      builtAfter,
      search,
      vessels,
      totalCount,
      limit,
      skip,
      paginationQuery,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Vessels', url: '/vessels' }
      ]
    });
  } catch (error) {
    console.error('Error rendering vessels:', error);
    res.status(500).render('error', { 
      message: 'Error loading vessels', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/vessels/:imo', async (req, res) => {
  try {
    const { imo } = req.params;
    const vessel = await dataLayer.repositories.VesselRepository.findByIMO(imo);
    
    if (!vessel) {
      return res.status(404).render('error', { 
        message: 'Vessel not found', 
        error: { status: 404 } 
      });
    }
    
    res.render('vessel-detail', {
      pageTitle: vessel.name,
      currentPage: 'vessels',
      vessel,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Vessels', url: '/vessels' },
        { label: vessel.name, url: `/vessels/${vessel.imo}` }
      ]
    });
  } catch (error) {
    console.error('Error rendering vessel detail:', error);
    res.status(500).render('error', { 
      message: 'Error loading vessel details', 
      error: { stack: error.stack } 
    });
  }
});

app.get('/ffa', async (req, res) => {
  try {
    const contractMonth = req.query.contractMonth || 'all';
    const routeCode = req.query.routeCode || 'all';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Build filter
    const filter = {};
    if (contractMonth !== 'all') filter.contractMonth = contractMonth;
    if (routeCode !== 'all') filter['routes.code'] = routeCode;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    // Get FFA prices with pagination
    const ffaPrices = await dataLayer.repositories.FFARepository.findAll(filter, { limit, skip, sort: { date: -1 } });
    const totalCount = await dataLayer.repositories.FFARepository.count(filter);

    // Get available contract months and route codes for filters
    const contractMonths = await dataLayer.repositories.FFARepository.getUniqueContractMonths();
    const routeCodes = await dataLayer.repositories.FFARepository.getUniqueRouteCodes();

    // Create pagination query string without skip parameter
    const queryParams = new URLSearchParams();
    if (contractMonth !== 'all') queryParams.append('contractMonth', contractMonth);
    if (routeCode !== 'all') queryParams.append('routeCode', routeCode);
    if (startDate) queryParams.append('startDate', req.query.startDate);
    if (endDate) queryParams.append('endDate', req.query.endDate);
    if (limit !== 20) queryParams.append('limit', limit);
    const paginationQuery = queryParams.toString();

    res.render('ffa', {
      pageTitle: 'FFA Prices',
      currentPage: 'ffa',
      contractMonth,
      routeCode,
      startDate: req.query.startDate || '',
      endDate: req.query.endDate || '',
      ffaPrices,
      contractMonths,
      routeCodes,
      totalCount,
      limit,
      skip,
      paginationQuery,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'FFA Prices', url: '/ffa' }
      ]
    });
  } catch (error) {
    console.error('Error rendering FFA prices:', error);
    res.status(500).render('error', { 
      message: 'Error loading FFA prices', 
      error: { stack: error.stack } 
    });
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).render('error', { 
    message: 'Page not found', 
    error: { status: 404 } 
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).render('error', { 
    message: err.message || 'An error occurred', 
    error: { stack: err.stack } 
  });
});

// Define the port
const PORT = process.env.PORT || 3000;
const BACKUP_PORT = 3001;

console.log('Attempting to connect to MongoDB...'); // Debug: Before connection
dataLayer.connectDB()
  .then(() => {
    console.log('Connection successful, starting server...'); // Debug: After connection
    
    // Initialize fetchers with scheduling disabled in development mode
    const isProduction = process.env.NODE_ENV === 'production';
    dataLayer.initFetchers(isProduction);

    // If using mock data, fetch immediately
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('Using mock data, fetching initial mock vessels and FFA prices...');
      
      // Fetch mock vessel data
      dataLayer.fetchers.Q88Fetcher.fetchAndSaveVessels()
        .then(results => {
          console.log('Initial mock vessel fetch completed:', results);
        })
        .catch(error => {
          console.error('Error fetching mock vessels:', error);
        });
      
      // Fetch mock FFA price data
      dataLayer.fetchers.FFAFetcher.fetchAndSavePrices()
        .then(results => {
          console.log('Initial mock FFA price fetch completed:', results);
        })
        .catch(error => {
          console.error('Error fetching mock FFA prices:', error);
        });
      
      // Initialize freight grid data
      dataLayer.fetchers.FreightGridFetcher.initializeRoutes()
        .then(routeResults => {
          console.log('Initial freight routes setup completed:', routeResults);
          
          // Fetch mock freight rate data
          return dataLayer.fetchers.FreightGridFetcher.fetchAndSaveRates();
        })
        .then(rateResults => {
          console.log('Initial mock freight rate fetch completed:', rateResults);
        })
        .catch(error => {
          console.error('Error setting up freight grid data:', error);
        });
    }
    
    // Try to start server on primary port, fallback to backup port if busy
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying backup port ${BACKUP_PORT}...`);
        app.listen(BACKUP_PORT, () => {
          console.log(`Server running on backup port ${BACKUP_PORT}`);
        });
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit on connection failure
  });