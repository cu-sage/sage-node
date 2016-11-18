
var Student = require('../../models/student');
var StudentMap = require('../../formats/student');

var StudentService = require('../student');

describe('StudentService', () => {
  var studentId = Symbol('studentId');
  var apiStudent = Symbol('apiStudent');
  var apiStudents = Symbol('apiStudents');
  var databaseStudent = Symbol('databaseStudent');
  var databaseStudents = {
    map: sinon.stub().withArgs(StudentMap.databaseToApi).returns(apiStudents)
  };

  beforeEach(() => {
    sinon.stub(Student, 'find').returns(Promise.resolve(databaseStudents));
    sinon.stub(Student, 'findById').withArgs(studentId).returns(Promise.resolve(databaseStudent));
    sinon.stub(StudentMap, 'apiToDatabase').withArgs(apiStudent).returns(databaseStudent);
    sinon.stub(StudentMap, 'databaseToApi').withArgs(databaseStudent).returns(apiStudent);
  });

  describe('.findAll()', () => {
    it('passes no parameters to Student.find()', () => {
      return StudentService.findAll().then(() => {
        expect(Student.find.calledWithExactly()).to.be.true;
      });
    });

    it('returns an array of students', () => {
      expect(StudentService.findAll()).eventually.equals(apiStudents);
    });
  });

  describe('.findById()', () => {
    it('passes an id to Student.findById()', () => {
      return StudentService.findById(studentId).then(() => {
        expect(Student.findById.calledWith(studentId)).to.be.true;
      });
    });

    it('returns a student in API format', () => {
      expect(StudentService.findById(studentId)).eventually.equals(apiStudent);
    });
  });
});
