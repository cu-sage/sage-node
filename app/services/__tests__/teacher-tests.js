
var Teacher = require('../../models/teacher');
var TeacherMap = require('../../maps/teacher');

var TeacherService = require('../teacher');

describe('TeacherService', () => {
  var teacherId = Symbol('teacherId');
  var apiTeacher = Symbol('apiTeacher');
  var apiTeachers = Symbol('apiTeachers');
  var databaseTeacher = Symbol('databaseTeacher');
  var databaseTeachers = {
    map: sinon.stub().withArgs(TeacherMap.databaseToApi).returns(apiTeachers)
  };

  beforeEach(() => {
    sinon.stub(Teacher, 'find').returns(Promise.resolve(databaseTeachers));
    sinon.stub(Teacher, 'findById').withArgs(teacherId).returns(Promise.resolve(databaseTeacher));
    sinon.stub(TeacherMap, 'apiToDatabase').withArgs(apiTeacher).returns(databaseTeacher);
    sinon.stub(TeacherMap, 'databaseToApi').withArgs(databaseTeacher).returns(apiTeacher);
  });

  describe('.findAll()', () => {
    it('passes no parameters to Teacher.find()', () => {
      return TeacherService.findAll().then(() => {
        expect(Teacher.find.calledWithExactly()).to.be.true;
      });
    });

    it('returns an array of teachers', () => {
      expect(TeacherService.findAll()).eventually.equals(apiTeachers);
    });
  });

  describe('.findById()', () => {
    it('passes an id to Teacher.findById()', () => {
      return TeacherService.findById(teacherId).then(() => {
        expect(Teacher.findById.calledWith(teacherId)).to.be.true;
      });
    });

    it('returns a teacher in API format', () => {
      expect(TeacherService.findById(teacherId)).eventually.equals(apiTeacher);
    });
  });
});
