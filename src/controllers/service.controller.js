const Service = require('../models/Service');
const { successResponse, failedResponse, errorResponse } = require('../helpers/apiResponse');

/**
 * @method POST
 * Creates a new service using request body data
 */
exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    return successResponse(res, service, 'Service created', 201);
  } catch (err) {
    return errorResponse(res, err, 'Error creating service');
  }
};

/**
 * @method GET
 * Retrieves all active services
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    return successResponse(res, services, 'Services fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching services');
  }
};

/**
 * @method GET
 * Retrieves a specific service by its ID
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return failedResponse(res, 'Service not found', 404);
    return successResponse(res, service, 'Service fetched');
  } catch (err) {
    return errorResponse(res, err, 'Error fetching service');
  }
};

/**
 * @method PUT
 * Updates a service by its ID using request body data
 */
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return failedResponse(res, 'Service not found', 404);
    return successResponse(res, updated, 'Service updated');
  } catch (err) {
    return errorResponse(res, err, 'Error updating service');
  }
};

/**
 * @method DELETE
 * Deletes a service by its ID
 */
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return failedResponse(res, 'Service not found', 404);
    return successResponse(res, [], 'Service deleted');
  } catch (err) {
    return errorResponse(res, err, 'Error deleting service');
  }
};