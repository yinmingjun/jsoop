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

## Why is Namespace

jsoop provide the way that register namespace into jsoop. All namespace that register into
jsoop are unique. And registered namespace of one module can be load by other module. All
namespaces that registered into jsoop is transparent to all other modules. So, there are a 
way that access class lib by query namespace from jsoop.

This feature support provide very complex API for node.js', also support the extention of
class lib in an OOP way. Those module that just require the depend on class library, then
query it's namespace, and access the class library throw it's namespace.

I think that class library that use jsoop just export it's namespace root object as it's 
export contents, and use the export name 'rootns'. 


## Suggest Coding Standard

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
^^^^^^^^^^^^^^^^^^^^^^^            ^^^^^^^^^^^^^^^^^^^^^^^
	...
};

The function name of class constructor should be full name of class, and replace the "." to "_". For
example, " function Namespace1_ClassA( ... ) ...".

#### Implementation of Class Member
The implementation of class member should combine the class constructor name and the class member name 
with "$". For example:
function DemoNamespace_DemoClass$demoMethod() {
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	...
}

#### Filling Prototype
The filling of prototype should like the following style:
    DemoNamespace.DemoClass.prototype = {
		...
        modFoo: DemoNamespace.DemoClass$demoMethod,
		^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		...
    };
So we can view all the member of a class.

#### Register Type
The Type registrateration should like this:
    jsoop.registerClass(jsoop.setTypeName(DemoNamespace.DemoClass, 'DemoNamespace.DemoClass'), DemoNamespace.DemoClassBase);
	                          ^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^
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

