/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const bunyan = require('bunyan');
const sinon = require('sinon');
const BunyanCWLogger = require('./../index');

describe('_createBunyanLogger', () => {
  const assert = chai.assert;
  process.env.NODE_ENV = 'dev';

  it('create', () => {
    const bl = new BunyanCWLogger();
    bl.name = 'test-Name';
    bl.hostname = 'test-Host';
    bl.logLevel = bunyan.DEBUG;
    bl.cwStream = sinon.stub();
    bl._createBunyanLogger();

    const logger = bl.bunyanLogger;

    assert.isDefined(logger);
    assert.isNotNull(logger);
    assert.isObject(logger);

    assert.equal(logger.fields.name, bl.name);
    assert.equal(logger.fields.hostname, bl.hostname);
    assert.equal(logger.fields.node_env, process.env.NODE_ENV);
    assert.equal(logger.src, true);
    assert.equal(logger._level, bl.logLevel);
    assert.equal(logger.streams[0].stream, bl.cwStream);
    assert.equal(logger.streams[0].type, 'raw');
    assert.equal(logger.streams[0].raw, true);
  });
});
