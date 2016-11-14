
var databaseToApiMap = {
  _id: 'id',
  name: 'name',
  students: 'students_enrolled',
  teacher: 'teacher',
  teacherName: 'teacher_name',
  leaderboard: 'leadership_board'
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

  databaseToApi: object => {
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
