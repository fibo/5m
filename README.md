# 5m

> is a near real time utility, 5mb or 5min

[![KLP](https://img.shields.io/badge/kiss-literate-orange.svg)](http://g14n.info/kiss-literate-programming)

[Installation](#installation) |
[Use case](#use-case)
[Annotated source](#annotated-source) |
[License](#license)

## Installation

```bash
npm i 5m
```

## Use case

> I use this package with [debug] and [aws-sdk] to upload logs on S3.

Then there is a trigger that feeds every file created on S3 to an AWS Lambda
which sends file content to a server that broadcast it using [socket.io].
Yes I know there are other cool tools like CloudWatch, Kinesis, etc.
(but **5m** is free as in speach and free as in beer too ;)

## Annotated source

Store data in a namespaced buffer, as well as its function to flush data.

    var buffer = {}
    var flush = {}

Considering 1 char should be 1 byte, and dates are expressed in milliseconds,
the following constants express *5 MB* and *5 minutes*.
Aproximation is ok, since we want to achieve a near real time.
The timeout used for flushing data can be set, for testing or other purpouse
via the `FIVEM_TIMEOUT_MILLISECONDS` environment variable.


    const fiveMb = 1024 * 1024 * 5
    const fiveMin = 300 * 1000
    const flushTimeout = process.env.FIVEM_TIMEOUT_MILLISECONDS || fiveMin

Make sure no data is lost on exit.

    process.on('exit', () => {
      for (var namespace in buffer) flush[namespace]()
    })

Create the **5m** function.

Since *5m* is allowed as npm package name, but not as JavaScript
identifier, using a roman number like *Vm* can be confusing, so maybe
naming the function as *fiveM* is a good idea.

    /**
     * **@param** `{String}` namespace
     * **@param** `{Function}` write
     *
     * **@returns** `{Function}` logger
     */
    function fiveM (namespace, write) {

Create the namespaced *flush* function: write data and clean up.

      flush[namespace] = () => {
        if (buffer[namespace]) {
          write(buffer[namespace])

          delete buffer[namespace]
        }
      }

Create the **logger** function.

      /**
       * @param {*} data
       */
      return function logger (data) {

If necessary, initialize data buffer and set timeout to flush it later.

        if (typeof buffer[namespace] === 'undefined') {
          buffer[namespace] = ''

          setTimeout(flush[namespace], flushTimeout)
        }

Append data to named buffer.

        buffer[namespace] += data

Check if data is bigger than *5 MB*.

        const exceededSpace = buffer[namespace] && (buffer[namespace].length > 0) && (buffer[namespace].length > fiveMb)

If yes, flush it!

        if (exceededSpace) flush[namespace]()
      }
    }

Export *5m* function.

    module.exports = fiveM

## License

[MIT](http://g14n.info/mit-license)

[debug]: https://www.npmjs.com/package/debug "debug"
[aws-sdk]: https://www.npmjs.com/package/aws-sdk "aws-sdk"
[socket.io]: https://socket.io/ "socket.io"
