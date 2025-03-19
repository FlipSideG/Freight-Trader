const FFAPrice = require('../models/ffa.model');

/**
 * Repository for handling FFA price data operations
 */
class FFARepository {
  /**
   * Create a new FFA price record
   * @param {Object} ffaData - FFA price data
   * @returns {Promise<Object>} - Created FFA price document
   */
  async create(ffaData) {
    try {
      const ffa = new FFAPrice(ffaData);
      return await ffa.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find FFA prices by contract month
   * @param {string} contractMonth - Contract month (e.g., MAR25)
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of FFA price documents
   */
  async findByContractMonth(contractMonth, options = { limit: 30, skip: 0, sort: { dateRecorded: -1 } }) {
    return FFAPrice.find({ contractMonth: contractMonth.toUpperCase() })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Find latest FFA prices for all contract months
   * @returns {Promise<Array>} - Array of latest FFA price documents
   */
  async findLatestPrices() {
    return FFAPrice.getLatestPrices();
  }

  /**
   * Find FFA prices by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of FFA price documents
   */
  async findByDateRange(startDate, endDate, options = { limit: 100, skip: 0, sort: { dateRecorded: -1 } }) {
    const query = {
      dateRecorded: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    return FFAPrice.find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Find prices for a specific route
   * @param {string} routeCode - Route code (e.g., TD3C)
   * @param {Object} options - Query options (date range, limit)
   * @returns {Promise<Array>} - Array of price history for the route
   */
  async findRouteHistory(routeCode, options) {
    return FFAPrice.getRouteHistory(routeCode, options);
  }

  /**
   * Find FFA prices for a specific day
   * @param {Date} date - The date to find prices for
   * @returns {Promise<Array>} - Array of FFA price documents
   */
  async findByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.findByDateRange(startOfDay, endOfDay);
  }

  /**
   * Update an existing FFA price record
   * @param {string} id - ID of the FFA price record
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated FFA price document
   */
  async update(id, updateData) {
    try {
      const result = await FFAPrice.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!result) {
        throw new Error(`FFA price record with ID ${id} not found`);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an FFA price record
   * @param {string} id - ID of the FFA price record to delete
   * @returns {Promise<Object>} - Deletion result
   */
  async delete(id) {
    try {
      const result = await FFAPrice.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error(`FFA price record with ID ${id} not found`);
      }
      
      return { success: true, message: `FFA price record deleted successfully` };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all FFA price records with pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of FFA price documents
   */
  async findAll(filter = {}, options = { limit: 50, skip: 0, sort: { dateRecorded: -1 } }) {
    return FFAPrice.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Count FFA price records matching a filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} - Count of matching records
   */
  async count(filter = {}) {
    return FFAPrice.countDocuments(filter);
  }
}

module.exports = new FFARepository(); 