var Class = require('../models/class');
var ClassFormat = require('../formats/class');
var Teacher = require('../models/teacher');
var TeacherFormat = require('../formats/teacher');
var Response = require('../utils/response');

var rejectEmptyResult = teacher =>
  teacher ? teacher : Promise.reject(Response[404]('teacher not found'));

var formatTeacher = teacher => {
  teacher = teacher.toObject();

  teacher.classes = teacher.classes.map(ClassFormat.toApi);

  return teacher;
};

var formatTeachers = teachers => {
  return Promise.all(teachers.map(formatTeacher));
};

var TeacherService = {
  findAll: () => {
    return Teacher.find()
      .populate('classes', '_id name')
      .then(teachers => {
        // console.log(teachers);
        return teachers;
      })
      .then(formatTeachers);
  },

  findById: id => {
    return Teacher.findById(id)
      .populate('classes', '_id name')
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
