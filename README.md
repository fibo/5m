# 5m

> is a near real time utility, 5mb or 5min

[![KLP](https://img.shields.io/badge/kiss-literate-orange.svg)](http://g14n.info/kiss-literate-programming)

[Installation](#installation) |
[Test](#test) |
[Annotated source](#annotated-source) |
[License](#license)

## Installation

```bash
npm i 5m
```

## Test

*NOTA BENE* tests will require at least five minutes to run.

```bash
npm t
```

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
