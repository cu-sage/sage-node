
var execSync = require('child_process').execSync;

/**
 *  Function hairball
 *  This function uses the hairball framework to analyze a Scratch project
 */
module.exports = function hairball(projectFile) {
  var stdout = execSync(`hairball -p mastery ${projectFile}`).toString();
  var results = JSON.parse(stdout.split('\n')[1].replace(/'/g, '"'));

  return Promise.resolve(results);
};
