# 5m

> is a near real time utility, 5mb or 5min

[![KLP](https://img.shields.io/badge/kiss-literate-orange.svg)](http://g14n.info/kiss-literate-programming)

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

Store data in a namespaced buffer, as well as last time data was write and when is current time for a given namespace.

    var buffer = {}
    var lastWrite = {}
    var now = {}

Considering 1 char should be 1 byte, and dates are expressed in milliseconds, the following constants
express *5 MB* and *5 minutes* where aproximation is ok, since we want to achieve a near real time.

    const fiveMb = 1024 * 1024 * 5
    const fiveMin = 300 * 1000

Create the **5m** function with the following signature

* **@param** `{String}` namespace
* **@param** `{Function}` write
* **@returns** `{Function}` logger

Since *5m* is allowed as npm package name, but not as JavaScript identifier,
using a roman number like *Vm* can be confusing, so maybe naming the function
as *fiveM* is a good idea..

    function fiveM (namespace, write) {

Initialize *buffer* and *lastWrite*.

      buffer[namespace] = ''
      lastWrite[namespace] = new Date()

Make sure no data is lost on exit.

      process.on('exit', () => write(buffer[namespace]))

Create the **logger** function with the following signature

* **@param** `{*}` data

      return function logger (data) {

Set write time for current namespace.

        now[namespace] = new Date()

Append data to named buffer.

        buffer[namespace] += data

Check if there is some data and it is bigger than *5 MB* or it is older than *5 minutes*.

        const thereIsSomeData = buffer[namespace].length > 0
        const exceededSpace = (buffer[namespace].length > fiveMb)
        const exceededTime = (fiveMin < now[namespace] - lastWrite[namespace])

If yes, write data and clean up.

        if (thereIsSomeData && (exceededSpace || exceededTime)) {
          write(buffer[namespace])

          delete buffer[namespace]
          lastWrite[namespace] = new Date()
        }
      }
    }

Export it.

    module.exports = fiveM
