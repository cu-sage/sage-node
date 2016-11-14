var Student = require('../models/student');
var StudentMap = require('../maps/student');
var Response = require('../utils/response');

var StudentService = {
  findAll: () => {
    return Student.find()
      .then(students => students.map(student => student.toObject()))
      .then(students => students.map(StudentMap.databaseToApi));
  },

  findById: id => {
    return Student.findById(id)
      .then(student =>
        student ? student : Promise.reject(Response[404]('student not found'))
      )
      .then(student => student.toObject())
      .then(StudentMap.databaseToApi);
  },

  create: properties => {
    properties = StudentMap.apiToDatabase(properties);
    var student = new Student(properties);

    return student.save()
      .then(student => student.toObject())
      .then(StudentMap.databaseToApi);
  }
};

module.exports = StudentService;
