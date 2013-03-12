# jsoop

It's designed to provide Object-oriented programming (OOP) support for javascript. 


## Introduction

There are many kinds of Object-oriented programming (OOP) libs for javascript, and 
I never think I would write one. When I try to migrate my javascript project into 
Node.JS, and try to hide the difference between client and server, to make it work 
on both client and Node.js. I found there no OOP javascript libs is design for this 
goal.

I like Script#'s OOP programming style, and Script# is now under Microsoft Permissive 
License (Ms-PL). So this is posible to migrate it. I make some change to make it work
on node.js, and keep the feature that run on client side. also I want make it can co-work
with Script#'s original's javascript runtime lib.

## Features

  * Support class registration, inheritance, class type query, namespace registration etc.
  * Support class, enum, interface, module.
  * Supports node.js
  * Supports client side
  * Work together with Script#'s javascript runtime lib

## How it work

jsoop is a node.js javascript module, and it puts __typeName, __baseType, __interfaces,
__modules RTTI into class type(function), so when new a class intance, it bind all base
member into derived class's prototype, and so on.

All the RTTI is transparent maintained, so it's load is easy to estimate.

## Namespace

jsoop provide the way that register namespace into jsoop. All namespace that register into
jsoop are unique. So, there are a way that access class lib by query namespace from jsoop.
This feature can provide very complex API to node.js' other module. 

I think that class library that use jsoop just export it's namespace root object as it's 
export contents. So, those module that depend on this class library can query it's namespace
after require the class library.

## Client side
Include 'jsoop.js' into html file, and access it's publish function by global 'jsoop' variable. 
You can use jsoop access it's function:
    jsoop.registerClass(...);
	....


## Samples

    //namespace
    var unitTest = jsoop.registerNamespace('unitTest');

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


## licence

licence
=======
Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license

