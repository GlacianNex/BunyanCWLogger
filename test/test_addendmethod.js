/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const BunyanCWLogger = require('./../index');

describe('addEndMethod', () => {
  const assert = chai.assert;

  it('logger not set', () => {
    assert.throw(() => { BunyanCWLogger._addEndMethod(); }, Error, 'Logger instance is not configured');
  });

  it('add', () => {
    const bl = new BunyanCWLogger();
    bl.bunyanLogger = {};
    bl._setLoggerInstance();
    BunyanCWLogger._addEndMethod();
    assert.isFunction(BunyanCWLogger.getInstance().end);
  });

  it('verify setInterval', (done) => {
    new BunyanCWLogger('test', 'test', 'arn:aws:lambda:us-east-1:local:function:testFn:qualifier').build();
    const logger = BunyanCWLogger.getInstance();
    logger.end()
    .then(() => done());
  });
});
