
var testClass = (function () {

    //namespace

    var unitTest = jsoop.registerNamespace('unitTest', true);
    var testClassNS = jsoop.registerNamespace('unitTest.testClassNS', true);




    //////////////////////////////////////////////////////////////////////////////
    //enum unitTest.DemoEnum
    unitTest.DemoEnum = function unitTest_DemoEnum() {
        throw jsoop.errorNotImplemented();
    };

    unitTest.DemoEnum.prototype = {
        val1: 1,
        val2: 2,
        val3: 3
    };

    jsoop.registerEnum(jsoop.setTypeName(unitTest.DemoEnum, 'unitTest.DemoEnum'));


    //////////////////////////////////////////////////////////////////////////////
    //interface unitTest.DemoIntf
    unitTest.IDemoIntf = function unitTest_IDemoIntf() {
    };

    unitTest.IDemoIntf.prototype = {
    };

    jsoop.registerInterface(jsoop.setTypeName(unitTest.IDemoIntf, 'unitTest.IDemoIntf'));

    //////////////////////////////////////////////////////////////////////////////
    //interface unitTest.DemoIntf2
    unitTest.IDemoIntf2 = function unitTest_IDemoIntf2() {
    };

    unitTest.IDemoIntf2.prototype = {
    };

    jsoop.registerInterface(jsoop.setTypeName(unitTest.IDemoIntf2, 'unitTest.IDemoIntf2'));

    //////////////////////////////////////////////////////////////////////////////
    //module unitTest.DemoMod
    unitTest.DemoMod = function unitTest_DemoMod() {
    };

    function unitTest_DemoMod$modFoo() {
        return 'unitTest.DemoMod';
    }

    unitTest.DemoMod.prototype = {
        modFoo: unitTest_DemoMod$modFoo
    };

    jsoop.registerModule(jsoop.setTypeName(unitTest.DemoMod, 'unitTest.DemoMod'));

    //////////////////////////////////////////////////////////////////////////////
    //module unitTest.DemoMod
    unitTest.DemoMod2 = function unitTest_DemoMod2() {
    };

    function unitTest_DemoMod2$mod2Foo() {
        return 'unitTest.DemoMod2';
    }

    unitTest.DemoMod2.prototype = {
        mod2Foo: unitTest_DemoMod2$mod2Foo
    };

    jsoop.registerModule(jsoop.setTypeName(unitTest.DemoMod2, 'unitTest.DemoMod2'));

    //////////////////////////////////////////////////////////////////////////////
    //class unitTest.DemoBase
    unitTest.DemoBase = function unitTest_DemoBase() {
    };


    function unitTest_DemoBase$foo() {
        return 'unitTest.DemoBase';
    }

    unitTest.DemoBase.prototype = {
        foo: unitTest_DemoBase$foo
    };

    jsoop.registerClass(jsoop.setTypeName(unitTest.DemoBase, 'unitTest.DemoBase'), null, [unitTest.IDemoIntf, unitTest.IDemoIntf2], [unitTest.DemoMod, unitTest.DemoMod2]);

    //////////////////////////////////////////////////////////////////////////////
    //class unitTest.Demo
    unitTest.Demo = function unitTest_Demo() {
        jsoop.initializeBase(unitTest.Demo, this);
    };


    function unitTest_Demo$foo() {
        return 'unitTest.Demo';
    }

    function unitTest_Demo$baseFoo() {
        return jsoop.callBaseMethod(unitTest.Demo, this, "foo");
    }

    unitTest.Demo.prototype = {
        foo: unitTest_Demo$foo,
        baseFoo: unitTest_Demo$baseFoo
    };

    jsoop.registerClass(jsoop.setTypeName(unitTest.Demo, 'unitTest.Demo'), unitTest.DemoBase);

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

    function testClass() {
        var demo = new unitTest.Demo();
        var demoBase = new unitTest.DemoBase();

        //namespace
        unitTestFW.test("testClass-namespace", function () { unitTestFW.ok(unitTest.testClassNS === testClassNS, "Passed!"); });
        //DemoEnum
        unitTestFW.test("testClass-enum1", function () { unitTestFW.ok(unitTest.DemoEnum.val1 === 1, "Passed!"); });
        unitTestFW.test("testClass-enum2", function () { unitTestFW.ok(unitTest.DemoEnum.val2 === 2, "Passed!"); });
        unitTestFW.test("testClass-enum3", function () { unitTestFW.ok(unitTest.DemoEnum.val3 === 3, "Passed!"); });


        unitTestFW.test("testClass-inherit1", function () { unitTestFW.ok(demo.foo() === 'unitTest.Demo', "Passed!"); });
        unitTestFW.test("testClass-inherit2", function () { unitTestFW.ok(demoBase.foo() === 'unitTest.DemoBase', "Passed!"); });
        unitTestFW.test("testClass-inherit3", function () { unitTestFW.ok(demo.baseFoo() === 'unitTest.DemoBase', "Passed!"); });
        unitTestFW.test("testClass-className1", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.Demo) === 'unitTest.Demo', "Passed!"); });
        unitTestFW.test("testClass-className1", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.DemoBase) === 'unitTest.DemoBase', "Passed!"); });
        unitTestFW.test("testClass-intfName1", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.IDemoIntf) === 'unitTest.IDemoIntf', "Passed!"); });
        unitTestFW.test("testClass-intfName2", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.IDemoIntf2) === 'unitTest.IDemoIntf2', "Passed!"); });
        unitTestFW.test("testClass-modName1", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.DemoMod) === 'unitTest.DemoMod', "Passed!"); });
        unitTestFW.test("testClass-modName2", function () { unitTestFW.ok(jsoop.getTypeName(unitTest.DemoMod2) === 'unitTest.DemoMod2', "Passed!"); });
        unitTestFW.test("testClass-module-1", function () { unitTestFW.ok(demo.modFoo() === 'unitTest.DemoMod', "Passed!"); });
        unitTestFW.test("testClass-module-2", function () { unitTestFW.ok(demo.mod2Foo() === 'unitTest.DemoMod2', "Passed!"); });
        unitTestFW.test("testClass-module-3", function () { unitTestFW.ok(demoBase.modFoo() === 'unitTest.DemoMod', "Passed!"); });
        unitTestFW.test("testClass-module-4", function () { unitTestFW.ok(demoBase.mod2Foo() === 'unitTest.DemoMod2', "Passed!"); });
        unitTestFW.test("testClass-isClass-1", function () { unitTestFW.ok(jsoop.typeIsClass(unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isClass-2", function () { unitTestFW.ok(!jsoop.typeIsClass(unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isClass-3", function () { unitTestFW.ok(!jsoop.typeIsClass(unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isClass-4", function () { unitTestFW.ok(!jsoop.typeIsClass(unitTest.DemoEnum), "Passed!"); });
        unitTestFW.test("testClass-isInterface-1", function () { unitTestFW.ok(!jsoop.typeIsInterface(unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isInterface-2", function () { unitTestFW.ok(jsoop.typeIsInterface(unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isInterface-3", function () { unitTestFW.ok(!jsoop.typeIsInterface(unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isInterface-4", function () { unitTestFW.ok(!jsoop.typeIsInterface(unitTest.DemoEnum), "Passed!"); });
        unitTestFW.test("testClass-isModule-1", function () { unitTestFW.ok(!jsoop.typeIsModule(unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isModule-2", function () { unitTestFW.ok(!jsoop.typeIsModule(unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isModule-3", function () { unitTestFW.ok(jsoop.typeIsModule(unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isModule-4", function () { unitTestFW.ok(!jsoop.typeIsModule(unitTest.DemoEnum), "Passed!"); });
        unitTestFW.test("testClass-isEnum-1", function () { unitTestFW.ok(!jsoop.typeIsEnum(unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isEnum-2", function () { unitTestFW.ok(!jsoop.typeIsEnum(unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isEnum-3", function () { unitTestFW.ok(!jsoop.typeIsEnum(unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isEnum-4", function () { unitTestFW.ok(jsoop.typeIsEnum(unitTest.DemoEnum), "Passed!"); });
        //getInstanceType
        unitTestFW.test("testClass-getInstanceType-1", function () { unitTestFW.ok(jsoop.getInstanceType(demoBase) === unitTest.DemoBase, "Passed!"); });
        unitTestFW.test("testClass-getInstanceType-2", function () { unitTestFW.ok(jsoop.getInstanceType(demo) === unitTest.Demo, "Passed!"); });
        //isInstanceOfType
        unitTestFW.test("testClass-isInstanceOfType-1", function () { unitTestFW.ok(jsoop.isInstanceOfType(demoBase, unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-2", function () { unitTestFW.ok(jsoop.isInstanceOfType(demo, unitTest.DemoBase), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-3", function () { unitTestFW.ok(!jsoop.isInstanceOfType(demoBase, unitTest.Demo), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-4", function () { unitTestFW.ok(jsoop.isInstanceOfType(demoBase, unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-5", function () { unitTestFW.ok(jsoop.isInstanceOfType(demoBase, unitTest.IDemoIntf2), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-6", function () { unitTestFW.ok(jsoop.isInstanceOfType(demo, unitTest.IDemoIntf), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-7", function () { unitTestFW.ok(jsoop.isInstanceOfType(demo, unitTest.IDemoIntf2), "Passed!"); });
        //module just provide implemention, not is-as type
        unitTestFW.test("testClass-isInstanceOfType-8", function () { unitTestFW.ok(!jsoop.isInstanceOfType(demoBase, unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-9", function () { unitTestFW.ok(!jsoop.isInstanceOfType(demoBase, unitTest.DemoMod2), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-10", function () { unitTestFW.ok(!jsoop.isInstanceOfType(demo, unitTest.DemoMod), "Passed!"); });
        unitTestFW.test("testClass-isInstanceOfType-11", function () { unitTestFW.ok(!jsoop.isInstanceOfType(demo, unitTest.DemoMod2), "Passed!"); });

    }

    return testClass;
})();

if (typeof (exports) !== 'undefined') {
    exports.testClass = testClass;
}


