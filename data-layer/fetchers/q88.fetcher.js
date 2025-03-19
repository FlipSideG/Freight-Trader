const axios = require('axios');
const fs = require('fs');
const path = require('path');
const VesselRepository = require('../repositories/vessel.repository');
const { getMockVessels } = require('../mocks/vessel.mock');

/**
 * Q88 Data Fetcher
 * Responsible for fetching vessel data from Q88 API or PDF files
 */
class Q88Fetcher {
  constructor() {
    this.useMockData = process.env.USE_MOCK_DATA === 'true';
    this.apiUrl = process.env.Q88_API_URL;
    this.apiKey = process.env.Q88_API_KEY;
  }

  /**
   * Fetch vessels from Q88 API
   * @param {Object} options - Options for fetching (filtering, etc.)
   * @returns {Promise<Array>} - Array of vessel data
   */
  async fetchVesselsFromAPI(options = {}) {
    try {
      if (!this.apiUrl || !this.apiKey) {
        throw new Error('Q88 API URL or API Key not configured');
      }

      const response = await axios.get(`${this.apiUrl}/vessels`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        params: options
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from Q88 API');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching vessels from Q88 API:', error.message);
      throw error;
    }
  }

  /**
   * Import vessels from Q88 PDF files
   * @param {string} directoryPath - Path to directory containing PDF files
   * @returns {Promise<Array>} - Array of parsed vessel data
   */
  async importVesselsFromPDFs(directoryPath) {
    try {
      // This is a placeholder for PDF parsing functionality
      // In a real implementation, you would use a PDF parsing library
      // to extract the data from Q88 PDF files
      
      console.log(`Importing Q88 PDFs from ${directoryPath}`);
      return [];
    } catch (error) {
      console.error('Error importing vessels from PDFs:', error.message);
      throw error;
    }
  }

  /**
   * Get mock vessel data
   * @param {number} count - Number of vessels to generate
   * @returns {Promise<Array>} - Array of mock vessel data
   */
  async getMockData(count = 5) {
    return Promise.resolve(getMockVessels(count));
  }

  /**
   * Fetch vessels and save to database
   * @param {Object} options - Options for fetching
   * @returns {Promise<Object>} - Result of the operation
   */
  async fetchAndSaveVessels(options = {}) {
    try {
      let vessels = [];

      if (this.useMockData) {
        console.log('Using mock Q88 vessel data');
        vessels = Array.isArray(await this.getMockData(5)) 
          ? await this.getMockData(5) 
          : [await this.getMockData(1)];
      } else if (options.fromPDFs) {
        console.log('Importing vessels from Q88 PDF files');
        vessels = await this.importVesselsFromPDFs(options.pdfDirectory || './documents');
      } else {
        console.log('Fetching vessels from Q88 API');
        vessels = await this.fetchVesselsFromAPI(options);
      }

      console.log(`Processing ${vessels.length} vessels`);
      const results = {
        total: vessels.length,
        created: 0,
        updated: 0,
        errors: []
      };

      for (const vesselData of vessels) {
        try {
          const existingVessel = await VesselRepository.findByIMO(vesselData.imo);
          
          if (existingVessel) {
            await VesselRepository.update(vesselData.imo, vesselData);
            results.updated++;
          } else {
            await VesselRepository.create(vesselData);
            results.created++;
          }
        } catch (error) {
          console.error(`Error processing vessel ${vesselData.name || vesselData.imo}:`, error.message);
          results.errors.push({
            vessel: vesselData.name || vesselData.imo,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error in fetchAndSaveVessels:', error.message);
      throw error;
    }
  }

  /**
   * Schedule regular fetching of vessel data
   * @param {number} intervalHours - Hours between fetches
   */
  scheduleRegularFetching(intervalHours = 24) {
    // In a real application, you would use a proper scheduling library like node-cron
    // This is a simple implementation using setInterval
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    console.log(`Scheduling Q88 vessel data fetching every ${intervalHours} hours`);
    
    // Fetch immediately on startup
    this.fetchAndSaveVessels()
      .then(results => {
        console.log('Initial Q88 vessel fetch completed:', results);
      })
      .catch(error => {
        console.error('Error in initial Q88 vessel fetch:', error.message);
      });
    
    // Schedule regular fetches
    setInterval(() => {
      this.fetchAndSaveVessels()
        .then(results => {
          console.log('Scheduled Q88 vessel fetch completed:', results);
        })
        .catch(error => {
          console.error('Error in scheduled Q88 vessel fetch:', error.message);
        });
    }, intervalMs);
  }
}

module.exports = new Q88Fetcher(); 