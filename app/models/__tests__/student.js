
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
      student = new Student(studentProperties);
      errors = student.validateSync();

      expect(errors).to.be.undefined;
      return student;
    };
    var createBadStudent = () => {
      student = new Student(studentProperties);
      errors = student.validateSync();

      expect(errors).to.not.be.undefined;
      return student;
    }

    it('creates an _id', () => {
      student = createStudent();

      expect(student._id).to.be.an.instanceof(ObjectId);
    });

    it('returns the name', () => {
      student = createStudent();

      expect(student.name).to.be.a('string').which.equals(studentName);
    });

    it('returns the avatarUrl', () => {
      student = createStudent();

      expect(student.avatarUrl).to.be.a('string').which.equals(studentAvatarUrl);
    });

    it('should not allow no name', () => {
      delete studentProperties.name;
      student = createBadStudent();

      var error = student.validateSync();
      expect(error.errors['name'].kind).equals('required');
    });

    it('should not allow empty name', () => {
      studentProperties.name = '';
      student = createBadStudent();

      var error = student.validateSync();
      expect(error.errors['name'].kind).equals('required');
    });
  });
});
