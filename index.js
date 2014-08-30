exports.patch = function(dataObj, patchObj){
    var patcheable = Patcheable(dataObj);
    patchObj.forEach(function(patch){
        var path = patch[0], op = patch[1], arg = patch[2];
        (patcheable[op] || Function()).call(patcheable, path, arg);
    }); 
    return patcheable;
};

var Patcheable = exports.Patcheable = function(obj){
    for (var fn in Patcheable.prototype){
        obj.__proto__[fn] = Patcheable.prototype[fn];
    }
    return obj;
};

Patcheable.prototype.getKey = function(path){
    var parts = path.split('.'), _obj = this, key; 
    while ((key = parts.shift()) && parts.length > 0) { 
        if (!(key in _obj)){
            throw new Error('KeyNotFound: cannot access key '+key);
        }
        _obj = _obj[key];
    }
    return { root: _obj, value: key };
};

Patcheable.prototype.makeKey = function(path){
    var parts = path.split('.'), _obj = this, key; 
    while ((key = parts.shift()) && parts.length > 0) { 
        if (!(key in _obj) || (typeof _obj[key] !== 'object')){
            _obj[key] = {};
        }
        _obj = _obj[key];
    }
    if (!(key in _obj)) _obj[key] = {};
    return { root: _obj, value: key };
};

Patcheable.prototype.fetch = function(path){ 
    var key = this.getKey(path); 
    return key.root[key.value];
};

Patcheable.prototype.put = function(path, val){ 
    var key = this.makeKey(path); 
    return key.root[key.value] = val; 
};

Patcheable.prototype.remove = function(path){ 
    var key = this.getKey(path); 
    var tmp = key.root[key.value];
    delete key.root[key.value];
    return tmp;
};

Patcheable.prototype.move = function(from, to){ 
    this.copy(from, to);
    return this.remove(from);
};

Patcheable.prototype.copy = function(from, to){ 
    var key = this.getKey(from); 
    return this.put(to, key.root[key.value]);
};
