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

  * Supports node.js
  * Supports client side
  * Work together with Script#'s javascript runtime lib

## How it work

jsoop is a node.js javascript module, and it puts __typeName, __class, __baseType, 
__interfaces information into class type(function).


licence
=======
Copyright 2012,  Yin MingJun - email: yinmingjuncn@gmail.com
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license

