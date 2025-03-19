const FreightRate = require('../models/freight-rate.model');
const mongoose = require('mongoose');

/**
 * Repository for handling freight rate data operations
 */
class FreightRateRepository {
  /**
   * Create a new freight rate record
   * @param {Object} rateData - Freight rate data
   * @returns {Promise<Object>} - Created freight rate document
   */
  async create(rateData) {
    try {
      const rate = new FreightRate(rateData);
      return await rate.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a freight rate by ID
   * @param {string} id - Rate ID
   * @returns {Promise<Object>} - Freight rate document
   */
  async findById(id) {
    return FreightRate.findById(id).populate('routeId');
  }

  /**
   * Get the latest rate for a specific route
   * @param {string} routeId - Route ID
   * @returns {Promise<Object>} - Latest freight rate document
   */
  async getLatestRateForRoute(routeId) {
    return FreightRate.findOne({ routeId })
      .sort({ date: -1 })
      .populate('routeId');
  }

  /**
   * Get latest rates for all routes
   * @returns {Promise<Array>} - Array of latest freight rate documents
   */
  async getLatestRates() {
    return FreightRate.getLatestRates();
  }

  /**
   * Get rates for a route within a date range
   * @param {string} routeId - Route ID
   * @param {Object} options - Query options (startDate, endDate, limit)
   * @returns {Promise<Array>} - Array of freight rate documents
   */
  async getRouteRates(routeId, options) {
    return FreightRate.getRouteRates(routeId, options);
  }

  /**
   * Get rates for a specific date
   * @param {Date} date - The date to find rates for
   * @returns {Promise<Array>} - Array of freight rate documents
   */
  async getRatesByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return FreightRate.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('routeId');
  }

  /**
   * Get rates for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of freight rate documents
   */
  async findByDateRange(startDate, endDate, options = { limit: 100, skip: 0, sort: { date: -1 } }) {
    const query = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    return FreightRate.find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate('routeId');
  }

  /**
   * Update an existing freight rate record
   * @param {string} id - ID of the freight rate record
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated freight rate document
   */
  async update(id, updateData) {
    try {
      const result = await FreightRate.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!result) {
        throw new Error(`Freight rate with ID ${id} not found`);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a freight rate record
   * @param {string} id - ID of the freight rate record
   * @returns {Promise<Object>} - Deletion result
   */
  async delete(id) {
    try {
      const result = await FreightRate.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error(`Freight rate with ID ${id} not found`);
      }
      
      return { success: true, message: `Freight rate deleted successfully` };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all freight rates with optional filtering and pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of freight rate documents
   */
  async findAll(filter = {}, options = { limit: 50, skip: 0, sort: { date: -1 } }) {
    return FreightRate.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate('routeId');
  }

  /**
   * Calculate changes in rates between updates
   * This can be used to update the 'change' field when adding new rates
   * @param {string} routeId - Route ID
   * @param {number} currentRate - Current rate value
   * @param {string} rateType - Type of rate (worldscale or usd)
   * @returns {Promise<number>} - Calculated change value
   */
  async calculateRateChange(routeId, currentRate, rateType) {
    try {
      // Find the previous rate record for this route and rate type
      const previousRate = await FreightRate.findOne({
        routeId,
        rateType
      }).sort({ date: -1 }).limit(1);
      
      if (!previousRate) {
        return 0; // No previous rate to compare with
      }
      
      return currentRate - previousRate.rate;
    } catch (error) {
      console.error('Error calculating rate change:', error);
      return 0; // Default to 0 if there's an error
    }
  }

  /**
   * Bulk create multiple freight rate records
   * @param {Array} ratesData - Array of freight rate data objects
   * @returns {Promise<Array>} - Array of created freight rate documents
   */
  async bulkCreate(ratesData) {
    try {
      return await FreightRate.insertMany(ratesData);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FreightRateRepository(); 