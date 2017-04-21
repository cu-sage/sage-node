var ProgressModel = require('../models/progress.js');
let AssignmentModel = require ('../models/assignment.js');
var Response = require('../utils/response');
let Utilities = require ('../utils/utilities.js');
var ObjectId = require('mongoose').Types.ObjectId;

function Progress () {

}

let prepareSearchQueryForSearchingStudentsProgresses = function (studentID, assignmentIDs = []) {
	let searchObject = {};
	(assignmentIDs.length) ? searchObject.assignmentID = {$in: assignmentIDs} : null;
	(studentID) ? searchObject.studentID = studentID : null;
	return searchObject;

};

Progress.prototype.create = function  (properties) {

	let {studentID, assignmentID} = properties;
	
	return AssignmentModel.findOne({assignmentID})
	.then((assignment) => {
		if (!assignment) return Promise.reject(Response[404]('No assignment.'));
		let fileLocation = assignment.sb2FileLocation;
		return Utilities.copyFile(fileLocation, 'uploads/submissions/'+studentID + '_' + assignmentID + '.sb2');

	})
	.then((fileLocation) => {
		let newProgress = ProgressModel ({assignmentID, studentID, lastUpdatedsb2FileLocation:fileLocation});
		return newProgress.save();
	})
	.catch((err) => Promise.reject(err));

};

Progress.prototype.findOne = function (properties)  {

	return ProgressModel.findOne(properties);

};

Progress.prototype.fetch = function (properties) {

	return this.findOne(properties)
	.then((progress) =>{
		if (progress) return Promise.resolve(progress);
		return this.create(properties);
	})
	.then((progress) => {return Promise.resolve(progress);})
	.catch((err) => {return Promise.reject(err);});
};


Progress.prototype.addNewJSON = function (properties)  {
	let {studentID, assignmentID, jsonString} = properties;
	return ProgressModel.findOneAndUpdate(
		{studentID, assignmentID}, 
		{
			$push : {
				progressJSON: {
					jsonString,
					timestamp : Date.now()
				}
			}
		}
	).then ((progress) => {
		return Promise.resolve ({message: 'Updated', jsonString});
	})
	.catch ((err) => {
		return Promise.reject (err);
	});


};

Progress.prototype.submitAssignment = function (properties) {
	
	let {studentID, assignmentID, lastUpdatedsb2FileLocation, results} = properties;

	return ProgressModel.findOneAndUpdate(
		{studentID, assignmentID}, 
		{
			$set : {lastUpdatedsb2FileLocation, results}
		}
	).then ((progress) => {
		return Promise.resolve ({message: 'Updated', lastUpdatedsb2FileLocation, results});
	})
	.catch ((err) => {
		return Promise.reject (err);
	});
};

Progress.prototype.fetchStudentProgresses = function (studentID, assignmentIDs = []) {
	let searchQuery = prepareSearchQueryForSearchingStudentsProgresses(studentID, assignmentIDs);
	return ProgressModel.find(searchQuery);
};

module.exports = new Progress();