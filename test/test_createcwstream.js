/* global define, it, describe, afterEach, beforeEach, ... */

'use strict';

const chai = require('chai');
const BunyanCWLogger = require('./../index');

describe('_createCWStream', () => {
  const assert = chai.assert;

  it('create', () => {
    const bl = new BunyanCWLogger();
    bl.logGroup = 'test-Group';
    bl.streamName = 'test-Stream';
    bl.region = 'us-east-1';
    bl._createCWStream();

    assert.isDefined(bl.cwStream);
    assert.isNotNull(bl.cwStream);
    assert.isObject(bl.cwStream);

    assert.equal(bl.cwStream.logGroupName, bl.logGroup);
    assert.equal(bl.cwStream.logStreamName, bl.streamName);
    assert.equal(bl.cwStream.cloudwatch.config.region, bl.region);
  });
});
