var Teacher = require('../models/teacher');
var TeacherMap = require('../maps/teacher');
var Response = require('../utils/response');

var TeacherService = {
  findAll: () => {
    return Teacher.find()
      .then(teachers => teachers.map(teacher => teacher.toObject()))
      .then(teachers => teachers.map(TeacherMap.databaseToApi));
  },

  findById: id => {
    return Teacher.findById(id)
      .then(teacher =>
        teacher ? teacher : Promise.reject(Response[404]('teacher not found'))
      )
      .then(teacher => teacher.toObject())
      .then(TeacherMap.databaseToApi);
  },

  create: properties => {
    properties = TeacherMap.apiToDatabase(properties);
    var teacher = new Teacher(properties);

    return teacher.save()
      .then(teacher => teacher.toObject())
      .then(TeacherMap.databaseToApi);
  }
};

module.exports = TeacherService;
