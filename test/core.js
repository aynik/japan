var test = require('tape').test;
var exec = require('child_process').exec;
var fs = require('fs');

var testOut = function(t, success){
    return function(err, stdout, stderr){
        t.notOk(err);
        t.notOk(stderr);
        success(stdout.substr(0, stdout.length - 1));
    };
};

test("Should run all tests", function(t){ 
    t.test("-- no patch", function(t){
        t.plan(3);
        exec('echo \'{"a":1}\' | ./bin/jp',
            testOut(t, function(stdout){
                t.same('{"a":1}', stdout);
            }));
    });

    t.test("-- many patches", function(t){
        t.plan(3);
        var p1 = '[[\\"d.f\\", \\"put\\", 4], [\\"c\\", \\"move\\", \\"a.b.c\\"]]';
        var p2 = '[[\\"d\\", \\"remove\\"], [\\"a.b.c\\", \\"copy\\", \\"d\\"], [\\"a.b.c\\", \\"put\\", 5]]';
        exec('echo "'+p1+'" > p1.json; echo "'+p2+'" > p2.json; echo \'{"a":1,"c":2}\' | ./bin/jp p1.json p2.json; rm p1.json p2.json', 
            testOut(t, function(stdout){
                t.same('{"a":{"b":{"c":5}},"d":2}', stdout);
            }));
    });

    t.test("jp --pretty", function(t){
        t.plan(3);
        exec('echo \'{"a":1}\' | ./bin/jp -p',
            testOut(t, function(stdout){
                t.same('{\n    "a": 1\n}', stdout);
            }));
    });
});

