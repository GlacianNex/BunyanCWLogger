/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const bunyan = require('bunyan');
const BunyanCWLogger = require('./../index');

describe('_populate', () => {
  process.env.NODE_ENV = 'dev';
  const assert = chai.assert;
  const qual = 'dev';
  const fnName = 'testFn';
  const region = 'us-east-1';
  const account = '1234567890';

  it('general properties', () => {
    const bl = new BunyanCWLogger();
    bl.arn = `arn:aws:lambda:${region}:${account}:function:${fnName}:${qual}`;
    bl._populateProperties();

    assert.equal(bl.hostname, qual);
    assert.equal(bl.name, fnName);
    assert.equal(bl.region, region);
    assert.equal(bl.logLevel, bunyan.DEBUG);
  });

  it('missing qualifier', () => {
    const bl = new BunyanCWLogger();
    bl.arn = `arn:aws:lambda:${region}:${account}:function:${fnName}`;
    bl._populateProperties();
    assert.equal(bl.hostname, 'none');
  });

  it('prod log level', () => {
    process.env.NODE_ENV = 'prod';
    const bl = new BunyanCWLogger();
    bl.arn = `arn:aws:lambda:${region}:${account}:function:${fnName}`;
    bl._populateProperties();
    assert.equal(bl.logLevel, bunyan.INFO);
  });
});
