
var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  students: 'students_enrolled',
  teacher: 'teacher',
  teacherName: 'teacher_name',
  leaderboard: 'leadership_board'
};

var apiToDatabaseMap = _.invert(databaseToApiMap);

var ClassFormat = {
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

module.exports = ClassFormat;
