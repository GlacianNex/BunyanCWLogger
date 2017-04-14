'use strict';

const bunyan = require('bunyan');
const createCWStream = require('bunyan-cloudwatch');
const Q = require('q');

let loggerInstance = null;

class BunyanCWLogger {

  constructor(logGroup, streamName, arn) {
    this.arn = arn;
    this.logGroup = logGroup;
    this.streamName = streamName;
  }

  static getInstance() {
    if (!loggerInstance || loggerInstance === null) {
      throw new Error('Logger is not initialized');
    }
    return loggerInstance;
  }

  build() {
    this._validateInput();
    this._populateProperties();
    this._createCWStream();
    this._createBunyanLogger();
    this._setLoggerInstance();
    BunyanCWLogger._addEndMethod();
  }

  _setLoggerInstance() {
    loggerInstance = this.bunyanLogger;
  }

  _createBunyanLogger() {
    this.bunyanLogger = bunyan.createLogger({
      name: this.name,
      hostname: this.hostname,
      src: true,
      level: this.logLevel,
      node_env: process.env.NODE_ENV,
      serializers: {
        err: err => ({
          name: err.name,
          cause: err.message,
        }),
      },
      streams: [{ stream: this.cwStream, type: 'raw' },
        { stream: process.stdout, level: this.logLevel },
      ],
    });
  }

  _createCWStream() {
    this.cwStream = createCWStream({
      logGroupName: this.logGroup,
      logStreamName: this.streamName,
      cloudWatchLogsOptions: {
        region: this.region,
      },
    });
  }

  _populateProperties() {
    const arnArray = this.arn.split(':');
    this.hostname = (arnArray[7] || 'none');
    this.name = arnArray[6];
    this.region = arnArray[3];

    this.logLevel = bunyan.DEBUG;
    if (process.env.NODE_ENV === 'prod') {
      this.logLevel = bunyan.INFO;
    }
  }

  _validateInput() {
    if (!this.arn) {
      throw Error('Unable to setup logger. No arn was supplied');
    }
    const arnArray = this.arn.split(':');
    if (arnArray.length < 7) {
      throw Error('Invalid ARN');
    }
    if (!arnArray[6] || arnArray[6].length === 0) {
      throw Error('ARN is missing function name');
    }
    if (!arnArray[3] || arnArray[3].length === 0) {
      throw Error('ARN is missing region name');
    }
    if (!this.logGroup || this.logGroup.length === 0) {
      throw Error('logGroup is missing');
    }
    if (!this.streamName || this.streamName.length === 0) {
      throw Error('streamName is missing');
    }
  }

  static _addEndMethod() {
    if (!loggerInstance || loggerInstance === null) {
      throw new Error('Logger instance is not configured');
    }

    loggerInstance.end = () => {
      const deferred = Q.defer();
      setInterval(() => {
        if (loggerInstance && !loggerInstance.streams[0].stream.writeQueued) {
          loggerInstance = null;
          deferred.resolve();
        }
      }, 10);
      return deferred.promise;
    };
  }
}

module.exports = BunyanCWLogger;
