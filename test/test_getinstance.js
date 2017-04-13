/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const BunyanCWLogger = require('./../index');

describe('getInstance', () => {
  const assert = chai.assert;

  it('get', () => {
    const bl = new BunyanCWLogger();
    bl.bunyanLogger = sinon.stub();
    bl._setLoggerInstance();
    assert.equal(BunyanCWLogger.getInstance(), bl.bunyanLogger);
  });

  it('error on not initilized', () => {
    const bl = new BunyanCWLogger();
    bl._setLoggerInstance(null);
    assert.throws(() => BunyanCWLogger.getInstance(), Error, 'Logger is not initialized');
  });
});
