
var Class = require('../models/class');
var Response = require('../utils/response');

// 'class' is a reserved word, so use aClass instead

var __rejectEmptyResult = aClass =>
  aClass ? aClass : Promise.reject(Response[404]('class not found'));

var ClassService = {
  findAll: (projection) => {
    return Class.find(projection);
  },

  findById: (id, projection) => {
    return Class.findById(id, projection)
      .then(__rejectEmptyResult);
  },

  findByTeacher: (teacherId, projection) => {
    return Class.find({ teacher: teacherId }, projection);
  },

  findByStudent: (studentId, projection) => {
    return Class.find({ students: studentId }, projection);
  },

  create: properties => {
    var aClass = new Class(properties);

    return aClass.save();
  },

  updateTeacher: (classId, teacherId) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        aClass.teacher = teacherId;
        return aClass.save();
      });
  },

  removeTeacher: (classId) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        aClass.teacher = undefined;
        return aClass.save();
      });
  },

  addStudent: (classId, studentIdToAdd) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        if (_.find(aClass.students, studentId =>
            studentId.toString() === studentIdToAdd)) {
          return aClass;
        }
        aClass.students.push(studentIdToAdd);
        return aClass.save();
      });
  },

  removeStudent: (classId, studentIdToRemove) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        _.remove(aClass.students, studentId =>
          studentId.toString() === studentIdToRemove
        );
        aClass.markModified('students');
        return aClass.save();
      });
  }
};

module.exports = ClassService;
