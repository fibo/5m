# 5m

> is a near real time utility, 5mb or 5min

[![KLP](https://img.shields.io/badge/kiss-literate-orange.svg)](http://g14n.info/kiss-literate-programming)

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
* **@param** `{Function}` [append]
* **@returns** `{Function}` logger

    function 5m (namespace, write, append) {

Make sure *lastWrite* is initialized.

      lastWrite[namespace] = new Date()

Default *append* function, parses data as JSON and append it to the buffer with a new line.

      if (typeof append === 'undefined') {
        append = (buffer, data) => { buffer += JSON.parse(data) + '\n' }
      }

Create the **logger** function with the following signature

* **@param** `{*}` data
      
      return function logger (data) {

Set write time for current namespace.

        now[namespace] = new Date()

Append data to named buffer.

        append(buffer[namespace], data)

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

    module.exports = 5m
