
var mapKeys = function(map, object) {
  // Remove extraneous properties
  object = _.pickBy(object, (value, key) =>
    _.includes(_.keys(map), key));

  // Copy properties to new object with mapped keys
  return _.mapKeys(object, (value, key) => map[key]);
};

var Formatter = function(databaseToApiMap) {
  this.databaseToApiMap = databaseToApiMap;
  this.apiToDatabaseMap = _.invert(databaseToApiMap);

  this.toApi = this.toApi.bind(this);
  this.fromApi = this.fromApi.bind(this);
};

Formatter.prototype.toApi = function(object) {
  if (object instanceof Array) {
    return object.map(o => mapKeys(this.databaseToApiMap, o));
  }

  return mapKeys(this.databaseToApiMap, object);
};

Formatter.prototype.fromApi = function(object) {
  if (object instanceof Array) {
    return object.map(o => mapKeys(this.apiToDatabaseMap, o));
  }

  return mapKeys(this.apiToDatabaseMap, object);
};

var format = function(databaseToApiMap) {
  return new Formatter(databaseToApiMap);
};

module.exports = format;
