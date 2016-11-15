var TeacherService = require('./teacher');
var Class = require('../models/class');
var ClassMap = require('../maps/class');
var Response = require('../utils/response');

// 'class' is a reserved word, so use aClass instead

/**
 *  Adds teacherName onto the document
 *  @param {Document} aClass - the class document
 *  @returns {Document} aClass - the class document
 */
var addTeacherName = aClass => {
  if (_.isNil(aClass.teacher)) {
    return aClass;
  }

  return TeacherService.findById(aClass.teacher)
    .then(teacher => {
      aClass.teacherName = teacher.name;
      return aClass;
    });
};

var rejectEmptyResult = aClass =>
  aClass ? aClass : Promise.reject(Response[404]('class not found'));

var ClassService = {
  findAll: () => {
    return Class.find().lean()
      .then(classes => Promise.all(classes.map(addTeacherName)))
      .then(classes => classes.map(ClassMap.databaseToApi));
  },

  findById: id => {
    return Class.findById(id).lean()
      .then(rejectEmptyResult)
      .then(addTeacherName)
      .then(ClassMap.databaseToApi);
  },

  create: properties => {
    properties = ClassMap.apiToDatabase(properties);
    var aClass = new Class(properties);

    return aClass.save()
      .then(addTeacherName)
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  },

  updateTeacher: (classId, teacherId) => {
    return Class.findById(classId)
      .then(aClass =>
        aClass ? aClass : Promise.reject(Response[404]('class not found'))
      )
      .then(aClass => {
        aClass.teacher = teacherId;
        return aClass.save();
      })
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  },

  removeTeacher: (classId) => {
    return Class.findById(classId)
      .then(aClass =>
        aClass ? aClass : Promise.reject(Response[404]('class not found'))
      )
      .then(aClass => {
        aClass.teacher = undefined;
        return aClass.save();
      })
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  },

  addStudent: (classId, studentIdToAdd) => {
    return Class.findById(classId)
      .then(aClass =>
        aClass ? aClass : Promise.reject(Response[404]('class not found'))
      )
      .then(aClass => {
        if (_.find(aClass.students, studentId =>
            studentId.toString() === studentIdToAdd)) {
          return aClass;
        }
        aClass.students.push(studentIdToAdd);
        return aClass.save();
      })
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  },

  removeStudent: (classId, studentIdToRemove) => {
    return Class.findById(classId)
      .then(aClass =>
        aClass ? aClass : Promise.reject(Response[404]('class not found'))
      )
      .then(aClass => {
        _.remove(aClass.students, studentId =>
          studentId.toString() === studentIdToRemove
        );
        aClass.markModified('students');
        return aClass.save();
      })
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  }
};

module.exports = ClassService;
