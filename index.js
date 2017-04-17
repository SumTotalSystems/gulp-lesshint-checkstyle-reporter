'use strict';
(function(factory) {
  module.exports = factory(require('util'),
    require('through2'),
    require('vinyl'));
}(function(util,
  through,
  File) {
    
    function xmlEscape (string) {
      return string
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
    
    function groupErrorsByFile (results) {
      return results.reduce(function (previousValue, currentValue) {
        var lastFile = previousValue[previousValue.length - 1];

        if (!lastFile || currentValue.fullPath !== lastFile[0].fullPath) {
          previousValue.push([currentValue]);
        } else {
          lastFile.push(currentValue);
        }

        return previousValue;
      }, []);
    }
    
    function generateReport (results) {
      var output = '';

      output += '<?xml version="1.0" encoding="utf-8"?>';
      output += '<checkstyle version="4.3">';

      groupErrorsByFile(results).forEach(function (errors) {
        output += util.format('<file name="%s">', xmlEscape(errors[0].fullPath));

        errors.forEach(function (error) {
          output += util.format(
            '<error line="%d" column="%d" severity="%s" message="%s" source="%s" />',
            error.line,
            error.column,
            xmlEscape(error.severity),
            xmlEscape(error.message),
            xmlEscape('lesshint.linters.' + error.linter)
          );
        });

        output += '</file>';
      });

      output += '</checkstyle>';

      return output;
    }
    
    return function(opts) {
      
      opts = opts || {};

      var results = [];

      function write(file, __, cb) {
        if (file.lesshint && !file.lesshint.success) {
          results = results.concat(file.lesshint.results);
        }
        cb();
      }

      function end() {
        var checkstyle = new File({
          path: opts.filename || 'checkstyle.xml',
          contents: new Buffer(generateReport(results))
        });
        // dump the less hint results on this file object so any further less hint stuff can use it.
        checkstyle.lesshint = {
          results: results
        };
        this.push(checkstyle);
        this.push(null);
      }

      return through.obj(write, end);
    };
}));
