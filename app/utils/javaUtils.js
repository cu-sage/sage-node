/**
 * Utilities for running Java code in sage-node.
 * @author yli 11/18
 */

const java = require('java');
java.classpath.push('./scratchJava.jar');
java.classpath.push('./FilesRequired/commons-math3-3.2.jar');
java.classpath.push('./FilesRequired/zip4j-1.3.2.jar');

/**
 * Parses the given JSON string to an SE string.
 */
const extractJson = function (jsonStr, showId) {
  const scratchExtractor = java.newInstanceSync('utils.ScratchExtractor');
  return scratchExtractor.jsonToSeSync(jsonStr, showId);
};

// const ScratchExtractor = java.import('utils.ScratchExtractor');
// ScratchExtractor.mainSync(
//   java.newArray('java.lang.String',
//     ['./example_input_output/Input', './example_input_output/Output'])
// );

// var Paths = java.import('java.nio.file.Paths');
// var scratchExtractor = java.newInstanceSync(
//  'utils.ScratchExtractor',
//  Paths.getSync('./example_input_output/Input'),
//  Paths.getSync('./example_input_output/Output')
// );

module.exports = { extractJson };
