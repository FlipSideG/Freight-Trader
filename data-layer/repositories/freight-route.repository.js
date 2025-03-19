const FreightRoute = require('../models/freight-route.model');

/**
 * Repository for handling freight route data operations
 */
class FreightRouteRepository {
  /**
   * Create a new freight route
   * @param {Object} routeData - Freight route data
   * @returns {Promise<Object>} - Created freight route document
   */
  async create(routeData) {
    try {
      const route = new FreightRoute(routeData);
      return await route.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a freight route by ID
   * @param {string} id - Route ID
   * @returns {Promise<Object>} - Freight route document
   */
  async findById(id) {
    return FreightRoute.findById(id);
  }

  /**
   * Find a freight route by route code
   * @param {string} routeCode - Route code (e.g., TD3C)
   * @returns {Promise<Object>} - Freight route document
   */
  async findByRouteCode(routeCode) {
    return FreightRoute.findByRouteCode(routeCode);
  }

  /**
   * Get all active routes
   * @returns {Promise<Array>} - Array of active route documents
   */
  async getActiveRoutes() {
    return FreightRoute.getActiveRoutes();
  }

  /**
   * Find all freight routes with optional filtering
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (pagination, sorting)
   * @returns {Promise<Array>} - Array of freight route documents
   */
  async findAll(filter = {}, options = { sort: { routeCode: 1 } }) {
    return FreightRoute.find(filter).sort(options.sort);
  }

  /**
   * Update an existing freight route
   * @param {string} id - ID of the freight route
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated freight route document
   */
  async update(id, updateData) {
    try {
      const result = await FreightRoute.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!result) {
        throw new Error(`Freight route with ID ${id} not found`);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft delete a freight route by setting isActive to false
   * @param {string} id - ID of the freight route to deactivate
   * @returns {Promise<Object>} - Updated freight route document
   */
  async softDelete(id) {
    return this.update(id, { isActive: false });
  }

  /**
   * Hard delete a freight route
   * @param {string} id - ID of the freight route to delete
   * @returns {Promise<Object>} - Deletion result
   */
  async delete(id) {
    try {
      const result = await FreightRoute.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error(`Freight route with ID ${id} not found`);
      }
      
      return { success: true, message: `Freight route deleted successfully` };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk create multiple freight routes
   * @param {Array} routesData - Array of freight route data objects
   * @returns {Promise<Array>} - Array of created freight route documents
   */
  async bulkCreate(routesData) {
    try {
      return await FreightRoute.insertMany(routesData);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FreightRouteRepository(); 