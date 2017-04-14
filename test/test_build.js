/* global define, it, describe, afterEach, beforeEach, ... */
/* eslint no-empty: 'off'*/

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const BunyanCWLogger = require('./../index');

describe('build', () => {
  const assert = chai.assert;

  it('execution order', () => {
    const bl = new BunyanCWLogger();
    const valStub = sinon.stub(bl, '_validateInput');
    const popStub = sinon.stub(bl, '_populateProperties');
    const crCWStreamStub = sinon.stub(bl, '_createCWStream');
    const crBunyanStub = sinon.stub(bl, '_createBunyanLogger');
    const setLoggerInstanceStub = sinon.stub(bl, '_setLoggerInstance');
    const addEndMethodStub = sinon.stub(BunyanCWLogger, '_addEndMethod');

    bl.build();

    assert(valStub.calledOnce);
    assert(popStub.calledOnce);
    assert(popStub.calledAfter(valStub));
    assert(crCWStreamStub.calledOnce);
    assert(crCWStreamStub.calledAfter(popStub));
    assert(crBunyanStub.calledOnce);
    assert(crBunyanStub.calledAfter(crCWStreamStub));
    assert(setLoggerInstanceStub.calledOnce);
    assert(setLoggerInstanceStub.calledAfter(crBunyanStub));
    assert(addEndMethodStub.calledOnce);
    assert(addEndMethodStub.calledAfter(setLoggerInstanceStub));
  });

  it('error on bad _validateInput', () => {
    const bl = new BunyanCWLogger();
    const stub = sinon.stub(bl, '_validateInput').throws();
    try { bl.build(); } catch (err) { }
    assert(stub.threw);
  });

  it('error on bad _populateProperties', () => {
    const bl = new BunyanCWLogger();
    sinon.stub(bl, '_validateInput');
    const stub = sinon.stub(bl, '_populateProperties').throws();
    try { bl.build(); } catch (err) { }
    assert(stub.threw);
  });

  it('error on bad  _createCWStream', () => {
    const bl = new BunyanCWLogger();
    sinon.stub(bl, '_validateInput');
    sinon.stub(bl, '_populateProperties');
    const stub = sinon.stub(bl, '_createCWStream').throws();
    try { bl.build(); } catch (err) { }
    assert(stub.threw);
  });

  it('error on bad _createBunyanLogger', () => {
    const bl = new BunyanCWLogger();
    sinon.stub(bl, '_validateInput');
    sinon.stub(bl, '_populateProperties');
    sinon.stub(bl, '_createCWStream');
    const stub = sinon.stub(bl, '_createBunyanLogger').throws();
    try { bl.build(); } catch (err) { }
    assert(stub.threw);
  });

  it('error on bad _addEndMethod', () => {
    const bl = new BunyanCWLogger();
    sinon.stub(bl, '_validateInput');
    sinon.stub(bl, '_populateProperties');
    sinon.stub(bl, '_createCWStream');
    sinon.stub(bl, '_createBunyanLogger');
    const stub = sinon.stub(bl, '_addEndMethod').throws();
    try { bl.build(); } catch (err) { }
    assert(stub.threw);
  });

  it('success', () => {
    const bl = new BunyanCWLogger();
    bl.bunyanLogger = sinon.stub();
    sinon.stub(bl, '_validateInput');
    sinon.stub(bl, '_populateProperties');
    sinon.stub(bl, '_createCWStream');
    sinon.stub(bl, '_createBunyanLogger');
    bl.build();
    assert.equal(BunyanCWLogger.getInstance(), bl.bunyanLogger);
  });
});
