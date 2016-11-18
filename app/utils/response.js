
var Response = {
  404: (message) => ({ status: 404, message }),
  400: (message) => ({ status: 400, message })
};

module.exports = Response;
