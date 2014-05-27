var JsonReporter = require('../lib/spec-json-reporter'),
    assert = require('assert');

describe("Reporter", function() {

    var reporter, on, expected;

    beforeEach(function() {
        runner = {
            on: function(type, listener) {}
        };

        reporter = new JsonReporter(runner);
    });

    it("should create a key for the suite", function() {

        reporter.onTestEnd({
            title: 'a description',
            state: 'passed',
            parent: {
                title: 'a suite'
            }
        });

        expected = {
            "a suite" : {
                "a description" : "PASSED"
            }
        }

        assert.deepEqual(reporter.output, expected);
    });

    it("should return the value FAILED for failing test", function() {
        reporter.onTestEnd({
            title: 'a description',
            state: 'failed',
            parent: {
                title: 'a suite'
            }
        });

        expected = {
            "a suite" : {
                "a description" : "FAILED"
            }
        }
        assert.deepEqual(reporter.output, expected);
    });

    it("should flatten nested tests that have multiple suites", function() {
        reporter.onTestEnd({
            title: 'a description',
            state: 'passed',
            parent: {
                title: 'a suite',
                parent: {
                    title: 'parent'
                }
            }
        });
        expected = {
            "a suite parent" : {
                "a description" : "PASSED"
            }
        }
        assert.deepEqual(reporter.output, expected);
    });

});