var Teacher = require('../models/teacher');
var TeacherMap = require('../maps/teacher');

var TeacherService = {
  findAll: () => {
    return Teacher.find()
      .then(teachers => teachers.map(TeacherMap.databaseToApi));
  },

  findById: id => {
    return Teacher.findById(id)
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
