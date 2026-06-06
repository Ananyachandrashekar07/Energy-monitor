'use strict';
 
/**
 * Send a success response.
 * @param {Response} res  - Express response object
 * @param {*}        data - Payload to return
 * @param {string}   message
 * @param {number}   statusCode  - HTTP status (default 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};
 
/**
 * Send an error response.
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
 
/**
 * Wrap paginated list responses.
 */
const sendPaginated = (res, rows, total, page, limit) => {
  return res.status(200).json({
    success:    true,
    data:       rows,
    pagination: {
      total,
      page:       parseInt(page, 10),
      limit:      parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
    },
  });
};
 
module.exports = { sendSuccess, sendError, sendPaginated };