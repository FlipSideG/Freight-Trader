const Vessel = require('../models/vessel.model');

/**
 * Repository for handling vessel data operations
 */
class VesselRepository {
  /**
   * Find a vessel by IMO number
   * @param {string} imo - IMO number of the vessel
   * @returns {Promise<Object>} - Vessel document
   */
  async findByIMO(imo) {
    return Vessel.findOne({ imo });
  }

  /**
   * Find a vessel by name
   * @param {string} name - Name of the vessel
   * @returns {Promise<Object>} - Vessel document
   */
  async findByName(name) {
    return Vessel.findOne({ name });
  }

  /**
   * Find vessels by type
   * @param {string} type - Type of vessel (e.g., "Oil Tanker")
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of vessel documents
   */
  async findByType(type, options = { limit: 50, skip: 0, sort: { name: 1 } }) {
    return Vessel.find({ vesselType: type })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Find vessels by flag
   * @param {string} flag - Flag of vessel
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of vessel documents
   */
  async findByFlag(flag, options = { limit: 50, skip: 0, sort: { name: 1 } }) {
    return Vessel.find({ flag })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Find vessels by deadweight range
   * @param {number} min - Minimum deadweight tonnage
   * @param {number} max - Maximum deadweight tonnage
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of vessel documents
   */
  async findByDeadweightRange(min, max, options = { limit: 50, skip: 0, sort: { name: 1 } }) {
    return Vessel.find({ 
      'loadline.summer.deadweight': { $gte: min, $lte: max } 
    })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Find vessels by cargo capacity range
   * @param {number} min - Minimum cargo capacity in cubic meters
   * @param {number} max - Maximum cargo capacity in cubic meters
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of vessel documents
   */
  async findByCargoCapacityRange(min, max, options = { limit: 50, skip: 0, sort: { name: 1 } }) {
    return Vessel.find({ 
      'cargoTanks.totalCapacity': { $gte: min, $lte: max } 
    })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Create a new vessel
   * @param {Object} vesselData - Vessel data
   * @returns {Promise<Object>} - Created vessel document
   */
  async create(vesselData) {
    try {
      // Check if vessel with same IMO already exists
      const existingVessel = await this.findByIMO(vesselData.imo);
      if (existingVessel) {
        throw new Error(`Vessel with IMO ${vesselData.imo} already exists`);
      }

      const vessel = new Vessel(vesselData);
      return vessel.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing vessel
   * @param {string} imo - IMO number of the vessel to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated vessel document
   */
  async update(imo, updateData) {
    try {
      const result = await Vessel.findOneAndUpdate(
        { imo }, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!result) {
        throw new Error(`Vessel with IMO ${imo} not found`);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a vessel by IMO
   * @param {string} imo - IMO number of the vessel to delete
   * @returns {Promise<Object>} - Deletion result
   */
  async delete(imo) {
    try {
      const result = await Vessel.findOneAndDelete({ imo });
      
      if (!result) {
        throw new Error(`Vessel with IMO ${imo} not found`);
      }
      
      return { success: true, message: `Vessel with IMO ${imo} deleted successfully` };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all vessels with optional filtering, sorting, and pagination
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of vessel documents
   */
  async findAll(filter = {}, options = { limit: 50, skip: 0, sort: { name: 1 } }) {
    return Vessel.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Count vessels matching a filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} - Count of matching vessels
   */
  async count(filter = {}) {
    return Vessel.countDocuments(filter);
  }
}

module.exports = new VesselRepository(); 