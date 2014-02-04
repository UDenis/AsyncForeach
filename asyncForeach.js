(function(name, context) {
    var toString = {}.toString,
        noop = function() {},
        objKeys;

    objKeys = Object.keys || function(obj) {
        var keys = [];
        for (var k in obj) {
            keys.push(k);
        };
        return keys;
    };

    function isArray(obj) {
        return toString.apply(obj) == '[object Array]';
    };

    function isObject(obj) {
        return obj != null && typeof obj == 'object';
    };

    function isFunction(value) {
        return typeof value == 'function';
    };

    function asyncForeachForObj(obj, iterator, done) {
        var keys = objKeys(obj);
        if (keys.length > 0) {
            asyncForeachForArray(keys, function(key, index, _done) {
                iterator(obj[key], key, _done);
            }, done);
        }
    };

    function asyncForeachForArray(array, iterator, done) {
        var currentIndex = -1,
            length = array.length,
            toNext;

        toNext = function() {
            currentIndex++;
            if (currentIndex < length)
                iterator(array[currentIndex], currentIndex, toNext);
            else
                done();
        };
        toNext();
    };

    function asyncForeach(obj, iterator, done) {
        if (!isFunction(iterator))
            throw "iterator parameter is not a function";

        if (isArray(obj) && obj.length > 0) {
            asyncForeachForArray(obj, iterator, done || noop);
        } else if (isObject(obj)) {
            asyncForeachForObj(obj, iterator, done || noop);
        }
    };

    context[name] = asyncForeach;
})('asyncForeach', window);