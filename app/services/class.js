
var mongoose = require('mongoose');

var Class = require('../models/class');
var ClassFormat = require('../formats/class');
var StudentFormat = require('../formats/student');
var Student = require('../models/student');
var Teacher = require('../models/teacher');
var TeacherFormat = require('../formats/teacher');
var Response = require('../utils/response');

// 'class' is a reserved word, so use aClass instead

var __rejectEmptyResult = aClass =>
  aClass ? aClass : Promise.reject(Response[404]('class not found'));

var __formatClass = aClass => {
  aClass = aClass.toObject();

  aClass.students = aClass.students.map(StudentFormat.toApi);
  aClass.teacher = TeacherFormat.toApi(aClass.teacher);
  aClass = ClassFormat.toApi(aClass);

  return aClass;
};

var __formatClasses = classes => {
  return Promise.all(classes.map(__formatClass));
};

var ClassService = {
  findAll: () => {
    return Class.find()
        .populate('students', '_id name')
        .populate('teacher', '_id name')
      .then(__formatClasses);
  },

  findById: id => {
    return Class.findById(id)
        .populate('students', '_id name')
        .populate('teacher', '_id name')
      .then(__rejectEmptyResult)
      .then(__formatClass);
  },

  findByTeacher: teacherId => {
    return Class.find({ teacher: teacherId })
        .populate('students', '_id name')
        .populate('teacher', '_id name')
      .then(__formatClass);
  },

  create: properties => {
    properties = ClassFormat.fromApi(properties);
    var aClass = new Class(properties);

    return aClass.save()
      .then(aClass => {
        aClass.populate('students', '_id name');
        aClass.populate('teacher', '_id name');
        return aClass.execPopulate();
      })
      .then(__formatClass);
  },

  updateTeacher: (classId, teacherId) => {
    var oldTeacher;

    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        oldTeacher = aClass.teacher;
        aClass.teacher = teacherId;
        return aClass.save();
      })
      .then(aClass => {
        if (oldTeacher) {
          return Teacher.where({ _id: teacherId })
            .update({ $pull: { classes: mongoose.Types.ObjectId(classId) } })
            .then(() => aClass);
        }
        else {
          return aClass;
        }
      })
      .then(aClass => {
        return Teacher.findById(teacherId)
          .then(teacher => {
            teacher.classes.push(classId);
            teacher.markModified('classes');

            return teacher.save()
              .then(() => aClass);
          });
      })
      .then(aClass => {
        aClass.populate('students', '_id name');
        aClass.populate('teacher', '_id name');
        return aClass.execPopulate();
      })
      .then(__formatClass);
  },

  removeTeacher: (classId) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        aClass.teacher = undefined;

        return aClass.save()
          .then(aClass => {
            aClass.populate('students', '_id name');
            aClass.populate('teacher', '_id name');
            return aClass.execPopulate();
          });
      })
      .then(__formatClass);
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
        return aClass.save()
          .then(aClass => {
            aClass.populate('students', '_id name');
            aClass.populate('teacher', '_id name');
            return aClass.execPopulate();
          });
      })
      .then(aClass => {
        return Student.findById(studentIdToAdd)
          .then(student => {
            student.classes.push(classId);
            student.markModified('classes');

            return student.save()
              .then(() => aClass);
          });
      })
      .then(__formatClass);
  },

  removeStudent: (classId, studentIdToRemove) => {
    return Class.findById(classId)
      .then(__rejectEmptyResult)
      .then(aClass => {
        _.remove(aClass.students, studentId =>
          studentId.toString() === studentIdToRemove
        );
        aClass.markModified('students');
        return aClass.save()
          .then(aClass => {
            aClass.populate('students', '_id name');
            aClass.populate('teacher', '_id name');
            return aClass.execPopulate();
          });
      })
      .then(__formatClass);
  }
};

module.exports = ClassService;
