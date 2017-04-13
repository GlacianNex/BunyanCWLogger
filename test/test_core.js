/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const os = require('os');
const BunyanCWLogger = require('./../index');

describe('BunyanCWLogger', () => {
  const assert = chai.assert;
  const testName = 'test';
  const testStreamName = 'test-stream';
  const testGroupName = 'test-group';
  const testRegion = 'test-region';

  it('expect error - no stream', () => {
    assert.throws(() => {
      BunyanCWLogger.init();
    }, Error, 'logGroup attribute is missing');
  });

  it('expect error - no group', () => {
    assert.throws(() => {
      BunyanCWLogger.init(testStreamName);
    }, Error, 'streamName attribute is missing');
  });

  it('expect error - no name', () => {
    assert.throws(() => {
      BunyanCWLogger.init(testStreamName, testGroupName);
    }, Error, 'fnName attribute is missing');
  });

  it('init', () => {
    BunyanCWLogger.init(testStreamName, testGroupName, null, testName, testRegion);
    assert.isNotNull(BunyanCWLogger.loggerInstance);
  });

  it('getInstance - dev', () => {
    BunyanCWLogger.init(testStreamName, testGroupName, null, testName, testRegion);
    const logger = BunyanCWLogger.getInstance();
    assert.isNotNull(logger);
    assert.isDefined(logger);
    assert.isFunction(logger.info);
    assert.equal(logger.fields.name, testName);
    assert.equal(logger.fields.hostname, os.hostname());
    assert.equal(logger.src, true);
    assert.equal(logger._level, 20);
    assert.equal(logger.streams[0].stream.cloudwatch.config.region, testRegion);
  });

  it('getInstance - prod', () => {
    process.env.NODE_ENV = 'prod';
    const arnFnName = 'testFnName';
    const arnQualifier = 'testQualifier';
    const arnRegion = 'us-west-1';
    const testArn = `arn:aws:lambda:${arnRegion}:123456789:function:${arnFnName}:${arnQualifier}`;

    BunyanCWLogger.init(testStreamName, testGroupName, testArn);
    const logger = BunyanCWLogger.getInstance();
    assert.isNotNull(logger);
    assert.isDefined(logger);
    assert.isFunction(logger.info);
    assert.equal(logger.fields.name, arnFnName);
    assert.equal(logger.fields.hostname, testArn);
    assert.equal(logger.fields.qualifier, arnQualifier);
    assert.equal(logger.streams[0].stream.cloudwatch.config.region, arnRegion);
    assert.equal(logger._level, 30);
  });

  it('logging test', () => {
    BunyanCWLogger.init(testStreamName, testGroupName, null, 'logging test', 'us-east-1');
    const logger = BunyanCWLogger.getInstance();
    logger.error('hello');
  });
});
