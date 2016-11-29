
var databaseToApiMap = {
  _id: 'id',
  xml: 'xml',
  teacher: 'teacher',
  quest: 'quest_id',
  questSort: 'quest_sort',
  pointsUnlock: 'points_unlock',
  pointsTotal: 'points_total'
};

var apiToDatabaseMap = _.invert(databaseToApiMap);

var AssignmentFormat = {
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

module.exports = AssignmentFormat;
