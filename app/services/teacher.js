var Teacher = require('../models/teacher');
var TeacherMap = require('../maps/teacher');
var Response = require('../utils/response');

var rejectEmptyResult = teacher =>
  teacher ? teacher : Promise.reject(Response[404]('teacher not found'));

var TeacherService = {
  findAll: () => {
    return Teacher.find().lean()
      .then(teachers => teachers.map(TeacherMap.databaseToApi));
  },

  findById: id => {
    return Teacher.findById(id).lean()
      .then(rejectEmptyResult)
      .then(TeacherMap.databaseToApi);
  },

  create: properties => {
    properties = TeacherMap.apiToDatabase(properties);
    var teacher = new Teacher(properties);

    return teacher.save()
      .then(teacher => teacher.toObject())
      .then(TeacherMap.databaseToApi);
  },

  addClass: (teacherId, classIdToAdd) => {
    return Teacher.findById(teacherId)
      .then(teacher => {
        if (_.find(teacher.classes, classId =>
            classId.toString() === classIdToAdd)) {
          return teacher;
        }
        teacher.classes.push(classIdToAdd);
        teacher.markModified('classes');
        return teacher.save();
      });
  },

  removeClass: (teacherId, classIdToRemove) => {
    if (!teacherId) {
      return Promise.reject();
    }
    return Teacher.findById(teacherId)
      .then(teacher => {
        _.remove(teacher.classes, classId => classId.toString() === classIdToRemove);
        teacher.markModified('classes');
        return teacher.save();
      });
  }
};

module.exports = TeacherService;
