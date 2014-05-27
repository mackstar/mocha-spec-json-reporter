var Base = require('mocha').reporters.Base,
  fs = require('fs'),
  filename = 'mocha-output.json';

/**
 * Expose `SpecJsonReporter`.
 */

exports = module.exports = SpecJsonReporter;

/**
 * Initialize a new `SpecJsonReporter` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function SpecJsonReporter(runner) {
  var self = this;
  Base.call(this, runner);
  self.output = {};

  this.onTestEnd = this.onTestEnd.bind(this);
  runner.on('test end', this.onTestEnd);

  this.onEnd = this.onEnd.bind(this);
  runner.on('end', this.onEnd);

}



SpecJsonReporter.prototype = {
  
  __proto__: Base.prototype,
  
  /**
   * @param {Test} test finished test.
   */
  onTestEnd: function(test) {
    var testStatus = test.state === 'passed' ? 'PASSED' : 'FAILED',
      current = this.getCurrentOutputPointer(test);

    current[test.title] = testStatus;
  },

  /**
   * All tests have been run.
   */
  onEnd: function() {
    fs.writeFileSync(filename, JSON.stringify(this.output, null, 4));
    console.log("File written to " + filename);
  },

  /**
   * @param {Test} test get current option.
   */
  getCurrentOutputPointer: function(test) {
    var current = this.output,
        key = this.getKey(test);

    if (current[key] === undefined) {
        current[key] = {};
    }
    current = current[key];
    return current;
  },

  getKey: function(result, text) {

    if (text === undefined && result.parent) {
      return this.getKey(result.parent, '');
    }
    if (result.parent) {

      return this.getKey(result.parent, (result.title + ' ' + text).trim());
    }

    if (text === undefined) {
      return result.title;
    }
    return (text + ' ' + result.title).trim();
  }
}