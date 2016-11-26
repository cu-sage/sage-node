
var request = require('request-promise-native');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var host = 'http://localhost:8082';

var student;
var teacher;
var aClass;

var get = (endpoint) => {
  return request({
    method: 'GET',
    uri: `${host}${endpoint}`,
    json: true
  });
};

var post = (endpoint, body) => {
  return request({
    method: 'POST',
    uri: `${host}${endpoint}`,
    body,
    json: true
  });
};

before(() => {
  return Promise.all([
    mongoose.model('Student').remove({}).exec(),
    mongoose.model('Teacher').remove({}).exec(),
    mongoose.model('Class').remove({}).exec()
  ]);
});

describe('/students create and get', () => {
  var name = 'John Capybara';

  describe('POST /students/new', () => {
    it('should return the new student', () => {
      return post('/students/new', { name })
        .then(res => {
          expect(ObjectId.isValid(res.id)).to.be.true;
          expect(res).to.have.property('name')
            .which.equals(name);
          expect(res).to.have.property('classes')
            .which.is.instanceof(Array)
            .which.is.empty;

          student = res;
        });
    });
  });

  describe('GET /students/:id', () => {
    it('should return a student', () => {
      return get(`/students/${student.id}`)
        .then(res => {
          expect(res).deep.equals(student);
        });
    });

    it('should return 404 for unfound id', () => {
      return get('/students/582e2e6111450b0000000000')
        .then(() => {
          throw new Error('unexpectedly passed');
        })
        .catch(error => {
          expect(error).to.have.property('statusCode', 404);
        });
    });
  });

  describe('GET /students/list', () => {
    it('should return a list of students', () => {
      return get('/students/list')
        .then(res => {
          expect(res).to.deep.equals([student]);
        });
    });
  });
});

describe('/teachers create and get', () => {
  var name = 'Valerie Frizzle';

  describe('POST /teachers/new', () => {
    it('should return the new teacher', () => {
      return post('/teachers/new', { name })
        .then(res => {
          teacher = res;

          expect(ObjectId.isValid(res.id)).to.be.true;
          expect(res).to.have.property('name')
            .which.equals(name);
          expect(res).to.have.property('classes')
            .which.is.instanceof(Array)
            .which.is.empty;
        });
    });
  });

  describe('GET /teachers/:id', () => {
    it('should return a teacher', () => {
      return get(`/teachers/${teacher.id}`)
        .then(res => {
          expect(res).deep.equals(teacher);
        });
    });

    it('should return 404 for unfound id', () => {
      return get('/teachers/582e2e6111450b0000000000')
        .then(() => {
          throw new Error('unexpectedly passed');
        })
        .catch(error => {
          expect(error).to.have.property('statusCode', 404);
        });
    });
  });

  describe('GET /teachers/list', () => {
    it('should return a list of teachers', () => {
      return get('/teachers/list')
        .then(res => {
          expect(res).to.all.have.property('id');
          expect(res).to.all.have.property('name');
          expect(res).to.all.have.property('classes');
        });
    });
  });
});

describe('/classes create and get', () => {
  var name = 'Magic School Bus';

  describe('POST /classes/new', () => {
    it('should return the new class', () => {
      return post('/classes/new', { name })
        .then(res => {
          expect(ObjectId.isValid(res.id)).to.be.true;
          expect(res).to.have.property('name')
            .which.equals(name);

          aClass = res;
        });
    });
  });

  describe('GET /classes/:id', () => {
    it('should return a class', () => {
      return get(`/classes/${aClass.id}`)
        .then(res => {
          expect(res).deep.equals(aClass);
        });
    });

    it('should return 404 for unfound id', () => {
      return get('/classes/582e2e6111450b0000000000')
        .then(() => {
          throw new Error('unexpectedly passed');
        })
        .catch(error => {
          expect(error).to.have.property('statusCode', 404);
        });
    });
  });

  describe('GET /classes/list', () => {
    it('should return a list of classes', () => {
      return get('/classes/list')
        .then(res => {
          expect(res).to.all.have.property('id');
          expect(res).to.all.have.property('name');
        });
    });
  });
});

describe('/classes update', () => {
  describe('POST /classes/:id/update_teacher', () => {
    it('should return the updated class', () => {
      return post(`/classes/${aClass.id}/update_teacher`, { teacher: teacher.id })
        .then(res => {
          aClass = res;

          expect(res).to.have.property('teacher')
            .which.deep.equals({
              id: teacher.id,
              name: teacher.name
            });
        });
    });

    it('should update the teacher', () => {
      return get(`/teachers/${teacher.id}`)
        .then(res => {
          teacher = res;

          expect(res.classes).to.include.something
            .that.deep.equals({
              id: aClass.id,
              name: aClass.name
            });
        });
    });

    it('should update the class', () => {
      return get(`/classes/${aClass.id}`)
        .then(res => {
          aClass = res;

          expect(res).to.have.property('teacher')
            .which.deep.equals({
              id: teacher.id,
              name: teacher.name
            });
        });
    });
  });

  describe('POST /classes/:id/remove_teacher', () => {
    it('should return the updated class', () => {
      return post(`/classes/${aClass.id}/remove_teacher`)
        .then(res => {
          aClass = res;

          expect(res.teacher).to.be.undefined;
        });
    });

    it('should update the teacher', () => {
      return get(`/teachers/${teacher.id}`)
        .then(res => {
          teacher = res;

          expect(res.classes).to.not.include.something
            .that.has.property('id', aClass.id);
        });
    });

    it('should update the class', () => {
      return get(`/classes/${aClass.id}`)
        .then(res => {
          aClass = res;

          expect(res.teacher).to.be.undefined;
        });
    });
  });

  describe('POST /classes/:id/add_student', () => {
    it('should return the updated class', () => {
      return post(`/classes/${aClass.id}/add_student`, { student: student.id })
        .then(res => {
          aClass = res;

          expect(res.students_enrolled).to.include.something
            .that.deep.equals({
              id: student.id,
              name: student.name
            });
        });
    });

    it('should update the student', () => {
      return get(`/students/${student.id}`)
        .then(res => {
          student = res;

          expect(res.classes).to.include.something
            .that.deep.equals({
              id: aClass.id,
              name: aClass.name
            });
        });
    });

    it('should update the class', () => {
      return get(`/classes/${aClass.id}`)
        .then(res => {
          aClass = res;

          expect(res.students_enrolled).to.include.something
            .that.deep.equals({
              id: student.id,
              name: student.name
            });
        });
    });
  });

  describe('POST /classes/:id/remove_student', () => {
    it('should return the updated class', () => {
      return post(`/classes/${aClass.id}/remove_student`, { student: student.id })
        .then(res => {
          aClass = res;

          expect(res.students_enrolled).to.not.include.something
            .that.has.property('id', student.id);
        });
    });

    it('should update the student', () => {
      return get(`/students/${student.id}`)
        .then(res => {
          student = res;

          expect(res.classes).to.not.include.something
            .that.has.property('id', aClass.id);
        });
    });

    it('should update the class', () => {
      return get(`/classes/${aClass.id}`)
        .then(res => {
          aClass = res;

          expect(res.students_enrolled).to.not.include.something
            .that.has.property('id', student.id);
        });
    });
  });
});
