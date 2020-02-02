/* global it describe expect sinon beforeEach afterEach */
/* eslint-disable no-unused-expressions */
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
    sinon.stub(StudentMap, 'fromApi').withArgs(apiStudent).returns(databaseStudent);
    sinon.stub(StudentMap, 'toApi').withArgs(databaseStudent).returns(apiStudent);
  });

  afterEach(() => {
    Student.find.restore();
    Student.findById.restore();
    StudentMap.fromApi.restore();
    StudentMap.toApi.restore();
  });

  describe('.findAll()', () => {
    it('passes no parameters to Student.find()', () => {
      return StudentService.findAll().then(() => {
        expect(Student.find.calledWithExactly()).to.be.true;
      }).catch(() => {
        expect(Student.find.called()).to.be.false;
      });
    });

    it('returns an array of students', () => {
      return StudentService.findAll().then(() => {
        expect(StudentService.findAll()).to.deep.equal({});
      });
    });
  });

  describe('.findById()', () => {
    it('passes an id to Student.findById()', () => {
      return StudentService.findById(studentId).then(() => {
        expect(Student.findById.calledWith(studentId)).to.be.true;
      }).catch(() => {
        expect(Student.findById.calledWith(studentId)).to.be.false;
      });
    });

    it('returns a student in API format', () => {
      // expect(StudentService.findById(studentId)).eventually.equals(apiStudent);
      return StudentService.findById(studentId).then(() => {
        expect(Student.findById.calledWith(studentId)).to.equal(apiStudent);
      }).catch(() => {
        expect(Student.findById.calledWith(studentId)).to.be.false;
      });
    });
  });
});
