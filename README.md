# Japan
## JSON patcher 

[![Build Status via Travis CI](https://travis-ci.org/aynik/japan.svg?branch=master)](https://travis-ci.org/aynik/japan)

Pull requests are very welcome!

## Install 

```bash
$ npm install [-g] japan
```

## Features

- Patches any JSON input with a series of patches contained in files.

## Documentation

### Usage

```bash
$ jp [options] patch.json [...patches] < data.json
```

### Options

* [`--pretty, -p`](#pretty)

### Information

* [`Patch format`](#patch-format)
* [`Operations`](#operations)
* [`Library usage`](#library-usage)

### Examples

* [`Serial patching`](#serial)

---

## Options

<a name="pretty" />
### jp --pretty | -p

Pretty prints resulting data JSON.

---

## Information

<a name="patch-format" />
### Patch format

The patches consist on an array of operations, each one contained in another array:

```js
[
    [<path>, <operation>, <argument>],    
    [<path>, <operation>, <argument>],    
    ...
] 
```
* `path` - A path in data object to operate. Supports dot notation, like "a.b.c" or "a.b.0".
* `operation` - One of the implemented operations.
* `argument` - Argument for the operation.

---

<a name="operations" />
### Operations

* `fetch()` - Returns value stored on the selected path.
* `put(value)` - Adds `value` to the selected path, creating parent objects as needed.
* `remove()` - Removes key and contents stored on the selected path.
* `move(`path`)` - Moves contents to given `path`, removing them from the selected path.
* `copy(`path`)` - Copy contents to given `path`.

---

<a name="library-usage" />
### Library usage

This module also provides a class for using in your Node.js application.

```js
var Patcheable = require('japan').Patcheable;

var data = Patcheable({"a":{"b":2},"c":2}); // Example data object

// Patcheable.prototype.getKey(path)
// Used to get mutable slices of data object on selected path
// NOTE: Throws error if key is not accessible
console.log(data.getKey("a.b")); // { root: { b: 2 }, value: 'b' } 

// Patcheable.prototype.makeKey(path)
// Used to generate mutable slices of data object on selected path
console.log(data.getKey("a.c.x.z")); // { root: { z: {} }, value: 'z' } 

// Common operations
console.log(data.fetch("a")); // { b: 2 }
console.log(data.put("a.c", 3)); // 3
console.log(data.copy("c", "a.b")); // 2
console.log(data.move("a.c", "c")); // 3
console.log(data.remove("c")); // 3

// You can use data as a normal object
console.log(JSON.stringify(data)); // '{"a":{"b":2}}'
```

---

## Exmaples

<a name="serial" />
### Serial patching

```bash
$ echo '{"a":1,"c":2}' > data.json
$ echo '[["d.f", "put", 4], ["c", "move", "a.b.c"]]' > patch1.json
$ echo '[["d", "remove"], ["a.b.c", "copy", "d"], ["a.b.c", "put", 5]]' > patch2.json
$ jp patch1.json patch2.json < data.json

{"a":{"b":{"c":5}},"d":2}
```
