'use strict';

var expect = require('chai').expect;
var rewire = require('rewire');

describe('reporter:checkstyle', function () {
    var generateReport = rewire('./index.js').__get__('generateReport');

    it('should return an empty report when not passed any errors', function () {
        var errors = [];

        var report = generateReport(errors);

        expect(report).to.equal('<?xml version="1.0" encoding="utf-8"?>' +
            '<checkstyle version="4.3"></checkstyle>');
    });

    it('should format one error correctly', function () {
        var errors = [{
            column: 5,
            fullPath: 'path/to/file.less',
            line: 1,
            linter: 'someRule',
            message: 'Message for someRule.',
            severity: 'error'
        }];

        var report = generateReport(errors);

        expect(report).to.contain('<file name="path/to/file.less">' +
            '<error line="1" column="5" severity="error" ' +
            'message="Message for someRule." source="lesshint.linters.someRule" />' +
            '</file>');
    });

    it('should group errors together by file', function () {
        var errors = [{
            column: 5,
            fullPath: 'path/to/file.less',
            line: 1,
            linter: 'firstRule',
            message: 'Message for firstRule.',
            severity: 'error'
        }, {
            column: 6,
            fullPath: 'path/to/file.less',
            line: 2,
            linter: 'secondRule',
            message: 'Message for secondRule.',
            severity: 'warning'
        }, {
            column: 7,
            fullPath: 'path/to/another.less',
            line: 3,
            linter: 'thirdRule',
            message: 'Message for thirdRule.',
            severity: 'warning'
        }];

        var report = generateReport(errors);

        expect(report).to.contain('<file name="path/to/file.less">' +
            '<error line="1" column="5" severity="error" ' +
            'message="Message for firstRule." source="lesshint.linters.firstRule" />' +
            '<error line="2" column="6" severity="warning" ' +
            'message="Message for secondRule." source="lesshint.linters.secondRule" />' +
            '</file>');

        expect(report).to.contain('<file name="path/to/another.less">' +
            '<error line="3" column="7" severity="warning" ' +
            'message="Message for thirdRule." source="lesshint.linters.thirdRule" />' +
            '</file>');
    });

    it('should escape special xml characters', function () {
        var errors = [{
            column: 5,
            fullPath: 'path/to/file\'.less',
            line: 1,
            linter: 'some&Rule',
            message: 'Message for "someRule".',
            severity: '<error>'
        }];

        var report = generateReport(errors);

        expect(report).to.contain('<file name="path/to/file&apos;.less">' +
            '<error line="1" column="5" severity="&lt;error&gt;" ' +
            'message="Message for &quot;someRule&quot;." source="lesshint.linters.some&amp;Rule" />' +
            '</file>');
    });
});
