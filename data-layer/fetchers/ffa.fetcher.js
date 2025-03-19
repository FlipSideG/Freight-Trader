const axios = require('axios');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const FFARepository = require('../repositories/ffa.repository');
const { getMockFFAPrices, routeDescriptions } = require('../mocks/ffa.mock');

/**
 * FFA Data Fetcher
 * Responsible for fetching FFA price data from various sources
 */
class FFAFetcher {
  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === 'true';
    this.apiUrl = process.env.FFA_API_URL;
    this.apiKey = process.env.FFA_API_KEY;
  }

  /**
   * Fetch FFA prices from API
   * @param {Object} options - Options for fetching (filtering, etc.)
   * @returns {Promise<Array>} - Array of FFA price data
   */
  async fetchPricesFromAPI(options = {}) {
    try {
      if (!this.apiUrl || !this.apiKey) {
        throw new Error('FFA API URL or API Key not configured');
      }

      const response = await axios.get(`${this.apiUrl}/ffa-prices`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        params: options
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from FFA API');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching FFA prices from API:', error.message);
      throw error;
    }
  }

  /**
   * Import FFA prices from Excel file
   * @param {string} filePath - Path to Excel file
   * @returns {Promise<Array>} - Array of parsed FFA price data
   */
  async importPricesFromExcel(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assuming data is in the first sheet
      
      // Convert to JSON
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
      
      // Process the data to extract FFA prices
      // This is a simplified example - actual implementation would need to handle
      // the specific structure of the Excel file
      const processedData = [];
      
      // Looking for month rows and route column headers
      let monthRowIndex = -1;
      let routeColIndexes = {};
      
      // Find the month row and route columns
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && row.some(cell => cell && typeof cell === 'string' && cell.match(/^[A-Z]{3}\d{2}$/))) {
          monthRowIndex = i;
          break;
        }
      }
      
      if (monthRowIndex === -1) {
        throw new Error('Could not find month data in Excel file');
      }
      
      // Find route columns
      const routeCodes = ['TD3C', 'TD7', 'TD8', 'TD9', 'TD14', 'TD17', 'TD19', 'TD20'];
      
      for (let i = 0; i < rawData[0].length; i++) {
        for (let j = 0; j < routeCodes.length; j++) {
          if (
            rawData.some(row => 
              row[i] && 
              typeof row[i] === 'string' && 
              row[i].toUpperCase() === routeCodes[j]
            )
          ) {
            routeColIndexes[routeCodes[j]] = i;
          }
        }
      }
      
      // Extract pricing data for each month
      for (let i = monthRowIndex; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || !row[1] || typeof row[1] !== 'string' || !row[1].match(/^[A-Z]{3}\d{2}$/)) {
          continue;
        }
        
        const contractMonth = row[1];
        const ffaData = {
          dateRecorded: new Date(),
          dataSource: 'Excel Import',
          contractMonth,
          routes: []
        };
        
        // Process each route
        for (const [routeCode, colIndex] of Object.entries(routeColIndexes)) {
          if (row[colIndex] !== null && !isNaN(row[colIndex])) {
            // Find worldscale, $/MT, and ¢/BBL values
            const worldscale = row[colIndex];
            let dollarPerMT = null;
            let centsPerBBL = null;
            
            // Assume $/MT and ¢/BBL are in the next columns
            if (colIndex + 1 < row.length && row[colIndex + 1] !== null && !isNaN(row[colIndex + 1])) {
              dollarPerMT = row[colIndex + 1];
            }
            
            if (colIndex + 2 < row.length && row[colIndex + 2] !== null && !isNaN(row[colIndex + 2])) {
              centsPerBBL = row[colIndex + 2];
            }
            
            ffaData.routes.push({
              routeCode,
              routeDescription: routeDescriptions[routeCode] || '',
              worldscale,
              dollarPerMT,
              centsPerBBL
            });
          }
        }
        
        if (ffaData.routes.length > 0) {
          processedData.push(ffaData);
        }
      }
      
      return processedData;
    } catch (error) {
      console.error('Error importing FFA prices from Excel:', error.message);
      throw error;
    }
  }

  /**
   * Get mock FFA price data
   * @param {number} count - Number of records to generate
   * @returns {Promise<Array>} - Array of mock FFA price data
   */
  async getMockData(count = 8) {
    return Promise.resolve(getMockFFAPrices(count));
  }

  /**
   * Fetch FFA prices and save to database
   * @param {Object} options - Options for fetching
   * @returns {Promise<Object>} - Result of the operation
   */
  async fetchAndSavePrices(options = {}) {
    try {
      let prices = [];

      if (this.useMockData) {
        console.log('Using mock FFA price data');
        prices = await this.getMockData(8);
      } else if (options.fromExcel) {
        console.log('Importing FFA prices from Excel file');
        prices = await this.importPricesFromExcel(options.excelFilePath || './documents/FFA Oil Curves.xlsx');
      } else {
        console.log('Fetching FFA prices from API');
        prices = await this.fetchPricesFromAPI(options);
      }

      console.log(`Processing ${prices.length} FFA price records`);
      const results = {
        total: prices.length,
        created: 0,
        updated: 0,
        errors: []
      };

      for (const priceData of prices) {
        try {
          // Check if record already exists for this contract month and date
          const existingRecords = await FFARepository.findByContractMonth(
            priceData.contractMonth, 
            { limit: 1, sort: { dateRecorded: -1 } }
          );
          
          const existingRecord = existingRecords.length > 0 ? existingRecords[0] : null;
          
          if (existingRecord && 
              existingRecord.dateRecorded.toDateString() === new Date(priceData.dateRecorded).toDateString()) {
            // Update existing record
            await FFARepository.update(existingRecord._id, priceData);
            results.updated++;
          } else {
            // Create new record
            await FFARepository.create(priceData);
            results.created++;
          }
        } catch (error) {
          console.error(`Error processing FFA price for ${priceData.contractMonth}:`, error.message);
          results.errors.push({
            contractMonth: priceData.contractMonth,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in fetchAndSavePrices:', error.message);
      throw error;
    }
  }

  /**
   * Schedule regular fetching of FFA price data
   * @param {number} intervalHours - Hours between fetches
   */
  scheduleRegularFetching(intervalHours = 24) {
    // In a real application, you would use a proper scheduling library like node-cron
    // This is a simple implementation using setInterval
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    console.log(`Scheduling FFA price data fetching every ${intervalHours} hours`);
    
    // Fetch immediately on startup
    this.fetchAndSavePrices()
      .then(results => {
        console.log('Initial FFA price fetch completed:', results);
      })
      .catch(error => {
        console.error('Error in initial FFA price fetch:', error.message);
      });
    
    // Schedule regular fetches
    setInterval(() => {
      this.fetchAndSavePrices()
        .then(results => {
          console.log('Scheduled FFA price fetch completed:', results);
        })
        .catch(error => {
          console.error('Error in scheduled FFA price fetch:', error.message);
        });
    }, intervalMs);
  }
}

module.exports = new FFAFetcher(); 