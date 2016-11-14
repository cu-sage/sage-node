var Student = require('../models/student');
var StudentMap = require('../maps/student');

var StudentService = {
  findAll: () => {
    return Student.find()
      .then(students => students.map(StudentMap.databaseToApi));
  },

  findById: id => {
    return Student.findById(id)
      .then(StudentMap.databaseToApi);
  },

  create: properties => {
    properties = StudentMap.apiToDatabase(properties);

    var student = new Student(properties);
    var error = student.validateSync();

    if (error) {
      return Promise.reject(error.errors);
    }

    return student.save()
      .then(StudentMap.databaseToApi);
  }
};

module.exports = StudentService;
