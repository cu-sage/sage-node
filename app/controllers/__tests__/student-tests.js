
var express = require('express');
var StudentService = require('../../services/student');

var StudentController = require('../student');

describe('StudentController', () => {
  var app;
  var router;
  var req;
  var res;
  var next;
  var student = Symbol('student');
  var students = Symbol('students');
  var studentId = Symbol('studentId');
  var studentProperties = Symbol('studentProperties');

  beforeEach(() => {
    app = { use: sinon.stub() };
    router = { get: sinon.stub(), post: sinon.stub() };
    req = { body: studentProperties, params: { id: studentId } };
    res = { json: sinon.stub() };
    next = sinon.stub();
    sinon.stub(express, 'Router').returns(router);
    sinon.stub(StudentService, 'findAll').returns(Promise.resolve(students));
    sinon.stub(StudentService, 'findById').withArgs(studentId).returns(Promise.resolve(student));
    sinon.stub(StudentService, 'create').withArgs(studentProperties).returns(Promise.resolve(student));
  });

  describe('StudentController()', () => {
    it('sets a router for /student', () => {
      StudentController(app);

      expect(app.use.calledWith('/students')).to.be.true;
    })
  });

  describe('.findAll()', () => {
    var findAll = () => StudentController.findAll(req, res, next);

    it('calls StudentService.findAll() with no parameters', () => {
      return findAll().then(() => {
        expect(StudentService.findAll.calledWithExactly()).to.be.true;
      });
    });

    it('returns students as json', () => {
      return findAll().then(() => {
        expect(res.json.calledWithExactly(students)).to.be.true;
      });
    });
  });

  describe('.findById()', () => {
    var findById = () => StudentController.findById(req, res, next);

    it('calls StudentService.findById() with parameter req.params.id', () => {
      return findById().then(() => {
        expect(StudentService.findById.calledWithExactly(studentId)).to.be.true;
      });
    });

    it('returns student as json', () => {
      return findById().then(() => {
        expect(res.json.calledWithExactly(student)).to.be.true;
      });
    });
  });

  describe('.create()', () => {
    var create = () => StudentController.create(req, res, next);

    it('calls StudentService.create() with parameter req.body', () => {
      return create().then(() => {
        expect(StudentService.create.calledWithExactly(studentProperties)).to.be.true;
      });
    });

    it('returns student as json', () => {
      return create().then(() => {
        expect(res.json.calledWithExactly(student)).to.be.true;
      });
    });
  });
});
