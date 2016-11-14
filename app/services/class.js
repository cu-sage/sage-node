var Class = require('../models/class');
var ClassMap = require('../maps/class');

// 'class' is a reserved word, so use aClass instead

/**
 *  Adds teacherName onto the document
 *  @param {Document} doc - the class document
 *  @returns {Document} doc - the class document
 */
var addTeacherName = doc => {
  return doc.model('Teacher').findById(doc.teacher, 'name').lean()
    .then(teacher => {
      doc.teacherName = teacher.name;
      return doc;
    });
};

var ClassService = {
  findAll: () => {
    return Class.find()
      .then(classes => classes.map(ClassMap.databaseToApi));
  },

  findById: id => {
    return Class.findById(id)
      .then(aClass => aClass ? aClass : {})
      .then(ClassMap.databaseToApi);
  },

  create: properties => {
    properties = ClassMap.apiToDatabase(properties);
    var aClass = new Class(properties);

    return aClass.save()
      .then(addTeacherName)
      .then(aClass => aClass.toObject())
      .then(ClassMap.databaseToApi);
  }
};

module.exports = ClassService;
