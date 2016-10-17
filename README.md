# gulp-lesshint-checkstyle-reporter

Writes checkstyle output for [lesshint](https://github.com/lesshint/lesshint) to a stream.

## Installation

```
npm install gulp-lesshint-checkstyle-reporter
```

## Usage

### Gulp

```javascript
var gulp = require('gulp');
var lesshint = require('gulp-lesshint');
var checkstyleReporter = require('gulp-lesshint-checkstyle-reporter');

gulp.task('lesshint', function() {
  gulp.src('*.less')
    .pipe(lesshint())
    .pipe(checkstyleReporter())
    .pipe(gulp.dest('target/checkstyle-reports'));
});
```

#### Options

- *filename* (defaults to *checkstyle.xml*). Default filename of the output xml
  file.

## Reporter Code

Original reporter code by [trygveaa/lesshint-reporter-checkstyle](https://github.com/trygveaa/lesshint-reporter-checkstyle)