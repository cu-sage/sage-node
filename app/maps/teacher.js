
var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  classes: 'classes'
};

var apiToDatabaseMap = _.invert(databaseToApiMap);

var TeacherMap = {
  apiToDatabase: object => {
    var mappedObject = {};

    _.forOwn(object, (value, key) => {
      var mappedKey = apiToDatabaseMap[key];

      if (mappedKey) {
        mappedObject[mappedKey] = value;
      }
    });

    return mappedObject;
  },

  databaseToApi: document => {
    var object = document.toObject();
    var mappedObject = {};

    _.forOwn(object, (value, key) => {
      var mappedKey = databaseToApiMap[key];

      if (mappedKey) {
        mappedObject[mappedKey] = value;
      }
    });

    return mappedObject;
  }
};

module.exports = TeacherMap;
