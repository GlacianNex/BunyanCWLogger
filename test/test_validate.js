/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const BunyanCWLogger = require('./../index');

describe('_validate', () => {
  const assert = chai.assert;

  it('No arn', () => {
    const bl = new BunyanCWLogger();
    assert.throws(() => bl._validateInput(), Error, 'Unable to setup logger. No arn was supplied');
  });

  it('Bad arn', () => {
    const arn = 'arn:aws:lambda:us-east-1:local';
    const bl = new BunyanCWLogger(null, null, arn);
    assert.throws(() => bl._validateInput(), Error, 'Invalid ARN');
  });

  it('Region name is missing', () => {
    const arn = 'arn:aws:lambda::local:function:fnName:qualifier';
    const bl = new BunyanCWLogger(null, null, arn);
    assert.throws(() => bl._validateInput(), Error, 'ARN is missing region name');
  });

  it('Function name is missing', () => {
    const arn = 'arn:aws:lambda:us-east-1:local:function::qualifier';
    const bl = new BunyanCWLogger(null, null, arn);
    assert.throws(() => bl._validateInput(), Error, 'ARN is missing function name');
  });

  it('Log group is missing', () => {
    const arn = 'arn:aws:lambda:us-east-1:local:function:testFn:qualifier';
    const bl = new BunyanCWLogger(null, null, arn);
    assert.throws(() => bl._validateInput(), Error, 'logGroup is missing');
  });

  it('Stream name is missing', () => {
    const arn = 'arn:aws:lambda:us-east-1:local:function:testFn:qualifier';
    const bl = new BunyanCWLogger('test-Group', null, arn);
    assert.throws(() => bl._validateInput(), Error, 'streamName is missing');
  });

  it('success', () => {
    const arn = 'arn:aws:lambda:us-east-1:local:function:testFn:qualifier';
    const bl = new BunyanCWLogger('test-Group', 'test-Stream', arn);
    bl._validateInput();
  });
});
