
var Teacher = require('../models/teacher');
var Response = require('../utils/response');

var rejectEmptyResult = teacher =>
  teacher ? teacher : Promise.reject(Response[404]('teacher not found'));

var TeacherService = {
  findAll: () => {
    return Teacher.find();
  },

  findById: id => {
    return Teacher.findById(id)
      .then(rejectEmptyResult);
  },

  create: properties => {
    var teacher = new Teacher(properties);

    return teacher.save();
  }
};

module.exports = TeacherService;
