
var execSync = require('child_process').execSync;
var Response = require('./response');

/**
 *  Function hairball
 *  This function uses the hairball framework to analyze a Scratch project
 */
module.exports = function hairball(projectFile) {
  try {
    var stdout = execSync(`hairball -p mastery ${projectFile}`).toString();
    var results = JSON.parse(stdout.split('\n')[1].replace(/'/g, '"'));
    return Promise.resolve(results);
  }
  catch (error) {
    return Promise.reject(Response[500]());
  }

};
