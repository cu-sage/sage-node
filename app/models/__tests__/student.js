
var ObjectId = require('mongoose').Types.ObjectId;
var Student = require('../student');

describe('Student model', () => {
  var studentProperties;
  var studentName = 'John Capybara';
  var studentAvatarUrl = 'http://google.com';

  beforeEach(() => {
    studentProperties = {
      name: studentName,
      avatarUrl: studentAvatarUrl
    };
  });

  describe('Student()', () => {
    var createStudent = () => {
      var student = new Student(studentProperties);
      var error = student.validateSync();

      expect(error).to.be.undefined;
      return student;
    };
    var createBadStudent = () => {
      var student = new Student(studentProperties);
      var error = student.validateSync();

      expect(error).to.not.be.undefined;
      return student;
    };

    it('creates an _id', () => {
      var student = createStudent();

      expect(student._id).to.be.an.instanceof(ObjectId);
    });

    it('returns the name', () => {
      var student = createStudent();

      expect(student.name).to.be.a('string').which.equals(studentName);
    });

    it('returns the avatarUrl', () => {
      var student = createStudent();

      expect(student.avatarUrl).to.be.a('string').which.equals(studentAvatarUrl);
    });

    it('should not allow no name', () => {
      delete studentProperties.name;
      var student = createBadStudent();

      var error = student.validateSync();
      expect(error.errors['name'].kind).equals('required');
    });

    it('should not allow empty name', () => {
      studentProperties.name = '';
      var student = createBadStudent();

      var error = student.validateSync();
      expect(error.errors['name'].kind).equals('required');
    });
  });
});
