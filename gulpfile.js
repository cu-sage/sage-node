var gulp = require('gulp');

var nodemon = require('gulp-nodemon');

require('gulp-plumber');

var livereload = require('gulp-livereload');

var sass = require('gulp-ruby-sass');

var path = require('path');

var zip = require('gulp-zip');

var minimist = require('minimist');

var fs = require('fs');

var moment = require('moment');

gulp.task('sass', function () {
  return sass('./public/css/**/*.scss')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function () {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

var knownOptions = {
  string: ['packageName', 'packagePath', 'packageBuildId', 'packageVersionFilepath'],
  default: {
    packageName: 'Package.zip',
    packagePath: path.join(__dirname, '_package'),
    packageBuildId: 'None',
    packageVersionFilepath: 'version.txt'
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('package', function () {
  var versionContent = 'Package Time: ' + moment().format() + '\n' +
    'Build ID: ' + options.packageBuildId;

  fs.writeFileSync(options.packageVersionFilepath, versionContent);

  var packagePaths = ['**',
    '!**/_package/**',
    '!**/typings/**',
    '!typings',
    '!_package',
    '!gulpfile.js'];

  // add exclusion patterns for all dev dependencies
  var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  var devDeps = packageJSON.devDependencies;

  for (var propName in devDeps) {
    var excludePattern1 = '!**/node_modules/' + propName + '/**';
    var excludePattern2 = '!**/node_modules/' + propName;
    packagePaths.push(excludePattern1);
    packagePaths.push(excludePattern2);
  }

  return gulp.src(packagePaths)
    .pipe(zip(options.packageName))
    .pipe(gulp.dest(options.packagePath));
});

gulp.task('default', gulp.series(
  'sass',
  'develop',
  'watch'
));
