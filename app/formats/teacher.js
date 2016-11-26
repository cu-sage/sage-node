
var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  classes: 'classes'
};

var apiToDatabaseMap = _.invert(databaseToApiMap);

var TeacherFormat = {
  toApi: object => {
    object = _.pickBy(object, (value, key) =>
      _.includes(_.keys(databaseToApiMap), key));

    return _.mapKeys(object, (value, key) =>
      databaseToApiMap[key]);
  },

  fromApi: object => {
    object = _.pickBy(object, (value, key) =>
      _.includes(_.keys(apiToDatabaseMap), key));

    return _.mapKeys(object, (value, key) =>
      apiToDatabaseMap[key]);
  }
};

module.exports = TeacherFormat;
