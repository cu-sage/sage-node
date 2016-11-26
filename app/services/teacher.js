var Class = require('../models/class');
var ClassFormat = require('../formats/class');
var Teacher = require('../models/teacher');
var TeacherFormat = require('../formats/teacher');
var Response = require('../utils/response');

var rejectEmptyResult = teacher =>
  teacher ? teacher : Promise.reject(Response[404]('teacher not found'));

var formatTeacher = teacher => {
  teacher = teacher.toObject();

  return Class.find({ teacher: teacher._id }, '_id name')
    .lean()
    .then(classes => {
      classes = classes.map(ClassFormat.toApi);

      teacher.classes = classes;
      teacher = TeacherFormat.toApi(teacher);

      return teacher;
    });
};

var formatTeachers = teachers => {
  return Promise.all(teachers.map(formatTeacher));
};

var TeacherService = {
  findAll: () => {
    return Teacher.find()
      .then(teachers => {
        return teachers;
      })
      .then(formatTeachers);
  },

  findById: id => {
    return Teacher.findById(id)
      .then(rejectEmptyResult)
      .then(formatTeacher);
  },

  create: properties => {
    properties = TeacherFormat.fromApi(properties);
    var teacher = new Teacher(properties);

    return teacher.save()
      .then(formatTeacher);
  }
};

module.exports = TeacherService;
