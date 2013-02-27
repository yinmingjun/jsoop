
//namespace

var unitTest = {};

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

function testClass() {
    var demo = new unitTest.Demo();
    var demoBase = new unitTest.DemoBase();

    test("testClass-inherit1", function () { ok(demo.foo() === 'unitTest.Demo', "Passed!"); });
    test("testClass-inherit2", function () { ok(demoBase.foo() === 'unitTest.DemoBase', "Passed!"); });
    test("testClass-inherit3", function () { ok(demo.baseFoo() === 'unitTest.DemoBase', "Passed!"); });
    test("testClass-className1", function () { ok(jsoop.getTypeName(unitTest.Demo) === 'unitTest.Demo', "Passed!"); });
    test("testClass-className1", function () { ok(jsoop.getTypeName(unitTest.DemoBase) === 'unitTest.DemoBase', "Passed!"); });
    test("testClass-intfName1", function () { ok(jsoop.getTypeName(unitTest.IDemoIntf) === 'unitTest.IDemoIntf', "Passed!"); });
    test("testClass-intfName2", function () { ok(jsoop.getTypeName(unitTest.IDemoIntf2) === 'unitTest.IDemoIntf2', "Passed!"); });
    test("testClass-modName1", function () { ok(jsoop.getTypeName(unitTest.DemoMod) === 'unitTest.DemoMod', "Passed!"); });
    test("testClass-modName2", function () { ok(jsoop.getTypeName(unitTest.DemoMod2) === 'unitTest.DemoMod2', "Passed!"); });
    test("testClass-is-as-1", function () { ok(jsoop.isInstanceOfType(demo, unitTest.IDemoIntf), "Passed!"); });
    test("testClass-is-as-2", function () { ok(jsoop.isInstanceOfType(demoBase, unitTest.IDemoIntf), "Passed!"); });
    test("testClass-is-as-3", function () { ok(jsoop.isInstanceOfType(demo, unitTest.IDemoIntf2), "Passed!"); });
    test("testClass-is-as-3", function () { ok(jsoop.isInstanceOfType(demoBase, unitTest.IDemoIntf2), "Passed!"); });
    test("testClass-module-1", function () { ok(demo.modFoo() === 'unitTest.DemoMod', "Passed!"); });
    test("testClass-module-2", function () { ok(demo.mod2Foo() === 'unitTest.DemoMod2', "Passed!"); });
    test("testClass-module-3", function () { ok(demoBase.modFoo() === 'unitTest.DemoMod', "Passed!"); });
    test("testClass-module-4", function () { ok(demoBase.mod2Foo() === 'unitTest.DemoMod2', "Passed!"); });

}
