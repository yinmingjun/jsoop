


var testCore = (function () {


    /////////////////////////////////////////////////////////////////////////////////////
    //test entry

    var unitTestFW = {};

    function unitTestFW$test(title, callback) {
        console.log(title);
        callback();
    }

    function unitTestFW$ok(val, msg) {
        var title = "[ok   ]  ";
        if (!val) {
            title = '[error]  '
        }

        console.log(title + '%s', msg);
    }

    if (typeof (test) !== 'undefined') {
        unitTestFW.test = test;
    }
    else {
        unitTestFW.test = unitTestFW$test;
    }

    if (typeof (ok) !== 'undefined') {
        unitTestFW.ok = ok;
    }
    else {
        unitTestFW.ok = unitTestFW$ok;
    }

    /////////////////////////////////////////////////////////////////////////////////////
    //test entry
    function testCore() {
        //jsoop.isUndefined
        unitTestFW.test("testCore-isUndefined-undefined", function () { unitTestFW.ok(jsoop.isUndefined(undefined), "Passed!"); });
        unitTestFW.test("testCore-isUndefined-null", function () { unitTestFW.ok(!jsoop.isUndefined(null), "Passed!"); });
        unitTestFW.test("testCore-isUndefined-''", function () { unitTestFW.ok(!jsoop.isUndefined(''), "Passed!"); });
        unitTestFW.test("testCore-isUndefined-1", function () { unitTestFW.ok(!jsoop.isUndefined(1), "Passed!"); });
        //jsoop.isNull
        unitTestFW.test("testCore-isNull-undefined", function () { unitTestFW.ok(!jsoop.isNull(undefined), "Passed!"); });
        unitTestFW.test("testCore-isNull-null", function () { unitTestFW.ok(jsoop.isNull(null), "Passed!"); });
        unitTestFW.test("testCore-isNull-''", function () { unitTestFW.ok(!jsoop.isNull(''), "Passed!"); });
        unitTestFW.test("testCore-isNull-1", function () { unitTestFW.ok(!jsoop.isNull(1), "Passed!"); });
        //jsoop.isNullOrUndefined
        unitTestFW.test("testCore-isNullOrUndefined-undefined", function () { unitTestFW.ok(jsoop.isNullOrUndefined(undefined), "Passed!"); });
        unitTestFW.test("testCore-isNullOrUndefined-null", function () { unitTestFW.ok(jsoop.isNullOrUndefined(null), "Passed!"); });
        unitTestFW.test("testCore-isNullOrUndefined-''", function () { unitTestFW.ok(!jsoop.isNullOrUndefined(''), "Passed!"); });
        unitTestFW.test("testCore-isNullOrUndefined-1", function () { unitTestFW.ok(!jsoop.isNullOrUndefined(1), "Passed!"); });
        //jsoop.isValue
        unitTestFW.test("testCore-isValue-undefined", function () { unitTestFW.ok(!jsoop.isValue(undefined), "Passed!"); });
        unitTestFW.test("testCore-isValue-null", function () { unitTestFW.ok(!jsoop.isValue(null), "Passed!"); });
        unitTestFW.test("testCore-isValue-''", function () { unitTestFW.ok(jsoop.isValue(''), "Passed!"); });
        unitTestFW.test("testCore-isValue-1", function () { unitTestFW.ok(jsoop.isValue(1), "Passed!"); });

        //base type name
        unitTestFW.test("testCore-baseType-Object", function () { unitTestFW.ok(jsoop.getTypeName(Object) === 'Object', "Passed!"); });
        unitTestFW.test("testCore-baseType-Boolean", function () { unitTestFW.ok(jsoop.getTypeName(Boolean) === 'Boolean', "Passed!"); });
        unitTestFW.test("testCore-baseType-Number", function () { unitTestFW.ok(jsoop.getTypeName(Number) === 'Number', "Passed!"); });
        unitTestFW.test("testCore-baseType-String", function () { unitTestFW.ok(jsoop.getTypeName(String) === 'String', "Passed!"); });
        unitTestFW.test("testCore-baseType-Array", function () { unitTestFW.ok(jsoop.getTypeName(Array) === 'Array', "Passed!"); });
        unitTestFW.test("testCore-baseType-RegExp", function () { unitTestFW.ok(jsoop.getTypeName(RegExp) === 'RegExp', "Passed!"); });
        unitTestFW.test("testCore-baseType-Date", function () { unitTestFW.ok(jsoop.getTypeName(Date) === 'Date', "Passed!"); });
        unitTestFW.test("testCore-baseType-Error", function () { unitTestFW.ok(jsoop.getTypeName(Error) === 'Error', "Passed!"); });

    }

    return testCore;

})();

if (typeof (exports) !== 'undefined') {
    exports.testCore = testCore;
}
