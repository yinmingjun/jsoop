# jsoop

jsoop js a pure and simple javascript OOP library, provide a way to write javascript 
class library. 

## Introduction

There are many kinds of Object-oriented programming (OOP) libs for javascript, and 
I never think I would write one. When I try to migrate my jsworkflow project to 
nodejs, try to export API by class lib's interface, and make it work on both client 
and nodejs. I found there no OOP javascript libs is designed for this target.

I had read script# version 0.7's javascript runtime, and like script#'s generated javascript
codes' coding standards. It's clear and tidy. So I rewrite it and make it work on node.js, 
and keep the feature that it can also work on client side. 

## Features

  * Support class registration, inheritance, class type query, namespace registration etc.
  * Support class, enum, interface, module.
  * Supports node.js
  * Supports client side

## How it work

jsoop is a node.js javascript module, and it puts __typeName, __baseType, __interfaces,
__modules RTTI informatin into class(function) type. when new a class intance, it combine all 
base class or module's member into current class's prototype, and so on.

All the type information is maintained transparently, and it's load is easy to estimate.

## Why use Namespace

jsoop provide the way that register namespace into jsoop. All namespace that register into
jsoop are maintained by jsoop. These registered namespaces can be load later by current or 
other modules. 

This feature support to export complex API to nodejs. The user of jsoop can access the class
lib by query namespace and index the target class by namespace's hierachy. 

I suggest that class libraries that use jsoop can just export it's root namespace as it's 
export contents, and use the export name 'rootns'. 

## Use jsoop in Multiple Module

jsoop regard itself as an global module. The first require jsoop module regard as finally 
require jsoop module. The first loaded jsoop module publish jsoop global name, and other 
jsoop module just use it. If you want to control load which jsoop module, you can load jsoop 
before load other module at the main module. 


## About Coding Standard

The programmer of jsoop has the freedom to name the class and it's member. I just give the suggestions
about it.

### The names of class, interface module and enum
I suggest use Camel Case style. Like "DomParser", "HttpContext".
The interface shoud add "I" before the name of interface. Like "IBrowser", "IContainer".

### The names of members
I suggest the names of member use Little Camel Case style.

#### Private Member
Private member (data fiels, methods, properties, etc.) should add "_" before the name of it. 
Like "_state", "_accessTime". 

#### Property
The property of class shoud add "get_" "set_" before the property name. For example, 
"get_accessTime", "set_accessTime".

#### Class Type Define
The class type's constructor should be add to namespace of class. For example:

	var DemoNamespace = jsoop.registerNamespace('DemoNamespace');

	DemoNamespace.DemoClass = function DemoNamespace_DemoClass() {
		jsoop.initializeBase(DemoNamespace.DemoClass, this);
	};

The function name of class constructor should be full name of class, and replace the "." to "_". 
For example, " function Namespace1_ClassA( ... ) ...".

#### Implementation of Class Member
The implementation of class member should combine the class constructor name and the class member name 
with "$". For example:

	function DemoNamespace_DemoClass$demoMethod() {
		return 'DemoClass.demoMethod';
	}


#### Filling Prototype
The filling of prototype should like the following style:

    DemoNamespace.DemoClass.prototype = {
        demoMethod: DemoNamespace.DemoClass$demoMethod
    };

So we can view all the member of a class.

#### Register Type
The Type registrateration should like this:

    jsoop.registerClass(jsoop.setTypeName(DemoNamespace.DemoClass, 'DemoNamespace.DemoClass'), DemoNamespace.DemoClassBase);

If don't register the full name of type, we can't retrive this type by jsoop.getType(fullTypeName). 

## Use Jsoop in Client Side
Include 'jsoop.js' into html file, and access it's publish function by global 'jsoop' variable. 
You can use jsoop access it's function:

    jsoop.registerClass(...);
	....


## Using Samples

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


## About Licence

Licence
=======
Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license

## About Script#
Script# is a development tool that generates JavaScript by compiling C# source code. 
Script# also support nodejs since version 0.8 release. It's a useful tool that combine
strong type language's type-safety and dynamic language's flexibility.

Script#'s githut is: 
https://github.com/nikhilk/scriptsharp

