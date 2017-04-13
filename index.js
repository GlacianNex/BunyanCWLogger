'use strict';

const bunyan = require('bunyan');
const createCWStream = require('bunyan-cloudwatch');
const os = require('os');

let loggerInstance = null;

class BunyanCWLogger {

  static init(logGroup, streamName, arn, fnName, fnRegion) {
    let qualifier = '';
    let hostname = os.hostname();
    let name = fnName;
    let region = (fnRegion || process.env.AWS_DEFAULT_REGION);
    if (arn) {
      hostname = arn;
      qualifier = arn.split(':')[7] || 'none';
      name = arn.split(':')[6];
      region = arn.split(':')[3];
    }

    BunyanCWLogger.checkForMissingProperties([logGroup, streamName, name, region]);

    const stream = createCWStream({
      logGroupName: logGroup,
      logStreamName: streamName,
      cloudWatchLogsOptions: {
        region,
      },
    });

    loggerInstance = bunyan.createLogger({
      name,
      src: true,
      level: BunyanCWLogger.selectLevel(),
      hostname,
      qualifier,
      streams: [
        {
          stream,
          type: 'raw',
        },
        {
          stream: process.stdout,
          level: BunyanCWLogger.selectLevel(),
        },
      ],
    });
  }

  static selectLevel() {
    let logLevel = bunyan.DEBUG;
    if (process.env.NODE_ENV === 'prod') {
      logLevel = bunyan.INFO;
    }
    return logLevel;
  }

  static checkForMissingProperties(props) {
    const expected = ['logGroup', 'streamName', 'fnName', 'fnRegion'];
    for (let i = 0; i < expected.length; i += 1) {
      if (!props[i]) {
        throw new Error(`${expected[i]} attribute is missing`);
      }
    }
  }

  static getInstance() {
    if (loggerInstance) {
      return loggerInstance;
    }
    throw new Error('Logger is not initialized');
  }
}

module.exports = BunyanCWLogger;
