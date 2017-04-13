/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const BunyanCWLogger = require('./../index');

describe('addEndMethod', () => {
  const assert = chai.assert;

  it('logger not set', () => {
    const bl = new BunyanCWLogger();
    assert.throw(() => { bl._addEndMethod(); }, Error, 'Logger instance is not configured');
  });

  it('add', () => {
    const bl = new BunyanCWLogger();
    bl.bunyanLogger = {};
    bl._setLoggerInstance();
    bl._addEndMethod();
    assert.isFunction(BunyanCWLogger.getInstance().end);
  });
});
