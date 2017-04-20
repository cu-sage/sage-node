
var execSync = require('child_process').execSync;
var Response = require('./response');

/**
 *  Function hairball
 *  This function uses the hairball framework to analyze a Scratch project
 */
module.exports = function hairball(projectFile) {
  try {
	let initialAbsolute = process.cwd();
    var stdout = execSync(`hairball -p mastery ${initialAbsolute}/${projectFile}`).toString();
    let results = stdout.split('\n')[1];
    results = results.replace('/','');
	results = results.replace(/\'/g, '\"');

    return Promise.resolve(JSON.parse(results));
  }
  catch (error) {
    return Promise.reject(Response[500]());
  }

};
