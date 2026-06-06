'use strict';
 
const { sendError } = require('../utils/response');
 
/**
 * authorize(...roles)
 * Returns a middleware that only allows users whose role is in the given list.
 *
 * Usage:
 *   router.delete('/:id', authenticate, authorize('admin'), deleteBuilding);
 *   router.put('/:id',    authenticate, authorize('admin','manager'), updateBuilding);
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }
  if (!roles.includes(req.user.role)) {
    return sendError(
      res,
      `Role '${req.user.role}' is not permitted to perform this action`,
      403,
    );
  }
  next();
};
 
module.exports = authorize;