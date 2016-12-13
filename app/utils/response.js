
var Response = {
  404: (message) => ({ status: 404, message: message || 'not found' }),
  400: (message) => ({ status: 400, message: message || 'input error' }),
  500: (message) => ({ status: 500, message: message || 'server error' })
};

module.exports = Response;
