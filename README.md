# BunyanCWLogger

This library is used as a helper to bunyan and bunyan-cloudwatch to work together in an AWS Lambda environment.

## Motivation

I write a lot of lambdas that require some form of customized logging to CloudWatch. I really liked bunyan-cloudwatch library but having to copy-paste code from project to project got annoying.

I wrote this tiny utility library that makes it very simply to configure your bunyan.

If you write a lot of lambdas and want to aggrigate their output into custom log groups on CloudWatch based on various attributes this library will help you make logging easy.

## Usage

### Attributes
Library permits you to specify the following attributes:
* logGroup - name of the log group you want to create (required)
* streamName - name of the stream you want this log to go to (required)
* arn - ARN of the lambda that wants to send data to CloudWatch (required)

### Flush logs
It important that before you terminate your lambda you wait for all logs to be sent to cloudwatch. In order to do make this easy there is an `end()` method. Method returns a promise that will resolve once all logs have been sent.


### Example
``` js
exports.handler = (event, context, callback) => {
    const BunyanCWLogger = require('bunyancwlogger');
    new BunyanCWLogger('group', 'stream', context.invokedFunctionArn).build();
     const logger = BunyanCWLogger.getInstance();

     logger.info({hello: 'world'}, 'Thest message');
     logger.end().then(() => callback());
}
```

### Logging Information

The logs will be sent in the JSON format and will have the following content default:
* name - **lambda name** (from ARN)
* hostname - **lambda qualifier** (from ARN)
* node_env - **node environment setting**
* level - **logging level** The level is set based on environment. INFO in prod, DEBUG everywhere else.

