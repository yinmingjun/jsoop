/*
* jsoop's core source code.
* 2013.02.22: Create By Yin Mingjun - email: yinmingjuncn@gmail.com
* 
* Copyright 2013,  Yin MingJun - email: yinmingjuncn@gmail.com
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
*/

/*
* Project's goal:
*    1. Provide an minimal, useful OOP programming javascript library.
*    2. Support write javascript class in a simple way, and mantained RTTI transparently in class type.
*    3. Make minimal change of javascript runtime.
*
* Tokens list of using:
*     __typeName: string literal name, use to mark a class
*     __baseType: base class type
*     __interfaces: array of support interfaces
*     __modules: array of include modules
*     __class, __namespace, __interface, __module, __enum, __mergePrototype: some flags of class type.
*    
*/

(function (globalContext) {
    ///////////////////////////////////////////////////////////////////////////////
    // boot code
    var jsoop = {};

    ///////////////////////////////////////////////////////////////////////////////
    //is running in client side
    jsoop.isClientSide = function jsoop$isClientSide() {
        var retval = !!(
            (typeof (window) !== "undefined") &&
            (typeof (navigator) !== "undefined") &&
            (typeof (document) !== "undefined"));

        return retval;
    };

    ///////////////////////////////////////////////////////////////////////////////
    //null and undefined detect
    jsoop.isUndefined = function jsoop$isUndefined(value) {
        return (value === undefined);
    };

    jsoop.isNull = function jsoop$isNull(value) {
        return (value === null);
    };

    jsoop.isNullOrUndefined = function jsoop$isNullOrUndefined(value) {
        return (value === null) || (value === undefined);
    };

    ///////////////////////////////////////////////////////////////////////////////
    //exports function
    //ignore all member start with "_"
    jsoop.Exports = function jsoop$Exports(dict, exports) {
        for (var key in dict) {
            if (!dict.hasOwnProperty(key)) {
                continue;
            }

            if (jsoop.stringStartsWith(key, "_")) {
                continue;
            }

            exports[key] = dict[key];
        }

    };

    ///////////////////////////////////////////////////////////////////////////////
    //first install module hold jsoop's namespace root
    if (!jsoop.isClientSide()) {

        //not in browser
        //is node, change globalContext to global
        globalContext = global;
    }

    ///////////////////////////////////////////////////////////////////////////////
    //build ns_rtti for jsoop
    jsoop.__ns_rtti = {
        __typeName: 'jsoop$ns_rtti',
        ns_root: {},
        ns_map: {},
        type_map: {},
        class_idtr: 0
    };


    //check jsoop's ns_rtti is already exists
    if (globalContext.jsoop$ns_rtti && (globalContext.jsoop$ns_rtti.__typeName === 'jsoop$ns_rtti')) {

        //use global as current namespace root
        jsoop.__ns_rtti = globalContext.jsoop$ns_rtti;
    }
    else {
        //publish current nsroot as global nsroot
        globalContext.jsoop$ns_rtti = jsoop.__ns_rtti;
    }

    //helper function
    var get_ns_root = function jsoop$get_ns_root() {
        return jsoop.__ns_rtti.ns_root;
    };

    var get_ns_map = function jsoop$get_ns_map() {
        return jsoop.__ns_rtti.ns_map;
    };

    var clear_ns_map = function jsoop$clear_ns_map() {
        jsoop.__ns_rtti.ns_map = {};
    };

    var get_type_map = function jsoop$get_type_map() {
        return jsoop.__ns_rtti.type_map;
    };

    var alloc_class_idtr = function jsoop$alloc_class_idtr() {
        var retval = jsoop.__ns_rtti.class_idtr++;
    };

    ///////////////////////////////////////////////////////////////////////////////
    // setup root RTTI information for exists types
    Object.__typeName = 'Object';
    Object.__baseType = null;
    Boolean.__typeName = 'Boolean';
    Number.__typeName = 'Number';
    String.__typeName = 'String';
    Array.__typeName = 'Array';
    RegExp.__typeName = 'RegExp';
    Date.__typeName = 'Date';
    Error.__typeName = 'Error';
    Function.__typeName = 'Function';

    ///////////////////////////////////////////////////////////////////////////////
    // jsoop Type System Implementation

    jsoop.__gen_unique_name = function jsoop$gen_class_name(prefix, type) {

        var class_idtr = alloc_class_idtr();
        return prefix + class_idtr;
    };

    jsoop.__gen_class_name = function jsoop$gen_class_name(type) {
        return jsoop.__gen_unique_name("js_class$", type);
    };

    jsoop.__gen_enum_name = function jsoop$gen_class_name(type) {
        return jsoop.__gen_unique_name("js_enum$", type);
    };

    jsoop.__gen_interface_name = function jsoop$gen_interface_name(type) {
        return jsoop.__gen_unique_name("js_interface$", type);
    };

    jsoop.__gen_module_name = function jsoop$gen_module_name(type) {
        return jsoop.__gen_unique_name("js_module$", type);
    };

    //set TypeName of thisType，and return thisType
    //if skipOverride is true, don't override the global type of type map
    jsoop.setTypeName = function jsoop$setTypeName(thisType, name, skipOverride) {
        thisType.__typeName = name;

        var type_map = get_type_map();

        if (skipOverride && type_map[name]) {
            return thisType;
        }

        //put type into type jsoop registry
        type_map[name] = thisType;
        return thisType;
    };

    jsoop.getType = function jsoop$getType(fullTypeName) {
        //get type from jsoop type registry
        var type_map = get_type_map();
        var type = type_map[fullTypeName];

        return type;
    };

    jsoop.getTypeName = function jsoop$getTypeName(thisType) {
        return thisType.__typeName;
    };

    //use when display message
    jsoop.getTypeShortName = function jsoop$getTypeShortName(thisType) {
        var fullName = thisType.__typeName;
        var nsIndex = fullName.lastIndexOf('.');
        if (nsIndex > 0) {
            return fullName.substr(nsIndex + 1);
        }
        return fullName;
    };

    //namespace implementation
    jsoop.__ns = function jsoop$__ns(name) {
        this.__typeName = name;
    };

    jsoop.__ns.prototype = {
        __namespace: true,
        getName: function () {
            return this.__typeName;
        }
    };

    //register namespace, default behevior is create a new namespace.
    //if skipOverride is true, return old namespace when exists. Otherwise, create a new namespace when one exists.
    jsoop.registerNamespace = function jsoop$registerNamespace(name, skipOverride) {

        var root = get_ns_root();
        var ns_map = get_ns_map();
        var retval = ns_map[name];

        if (retval) {
            //don't create new namespace, return exists one
            if (skipOverride) {
                return retval;
            }
        }

        var ns_itor = root;
        var nameParts = name.split('.');

        for (var i = 0, ilen = nameParts.length; i < ilen; i++) {
            //get next part from parent namespace
            var part = nameParts[i];
            var ns_next = ns_itor[part];

            //just create the last level of namespace, that normally is root namespace of a class lib
            if (!ns_next || (!skipOverride && (i === ilen - 1))) {
                if (ns_next) {
                    //override the exist namespace, clear namespace map
                    clear_ns_map();
                }
                //create one if namespace don't exists.
                ns_itor[part] = ns_next = new jsoop.__ns(nameParts.slice(0, i + 1).join('.'));
            }

            //navigate to next namespace level
            ns_itor = ns_next;
        }

        //return last part of namespace, and fill namespace mapping.
        ns_map[name] = retval = ns_itor;
        return retval;
    };

    //require namespace
    //if checkExists is true, throw jsoop.errorNotExists when namespace not exists. other, return undefined
    jsoop.ns = jsoop.namespace = function jsoop$namespace(name, checkExists) {
        var root = get_ns_root();
        var ns_map = get_ns_map();
        var retval = ns_map[name];

        if (retval) {
            return retval;
        }

        var ns_itor = root;
        var nameParts = name.split('.');

        for (var i = 0; i < nameParts.length; i++) {
            //get next part from parent namespace
            var part = nameParts[i];
            var ns_next = ns_itor[part];

            if (!ns_next) {
                if (checkExists) {
                    throw jsoop.errorNotExists('namespace [' + name + ']');
                }
                return null;
            }
            ns_itor = ns_next;
        }

        ns_map[name] = retval = ns_itor;

        return retval;
    };

    //register class
    jsoop.registerClass = function jsoop$registerClass(thisType, baseType, interfaceTypes, modules) {
        thisType.prototype.constructor = thisType;
        thisType.__class = true;
        thisType.__baseType = baseType || Object;

        if (jsoop.isNullOrUndefined(thisType.__typeName)) {
            thisType.__typeName = jsoop.__gen_class_name(thisType);
        }

        //need rebuild prototype?
        if (baseType || modules) {
            thisType.__mergePrototype = true;
        }
        else {
            thisType.__mergePrototype = false;
        }

        if (interfaceTypes) {
            thisType.__interfaces = [];
            for (var i = 0; i < interfaceTypes.length; i++) {
                interfaceType = interfaceTypes[i];
                jsoop.arrayAdd(thisType.__interfaces, interfaceType);
            }
        }

        if (modules) {
            thisType.__modules = [];
            for (var i = 0; i < modules.length; i++) {
                module = modules[i];
                jsoop.arrayAdd(thisType.__modules, module);
            }
        }

        return thisType;
    };

    jsoop.registerInterface = function jsoop$registerInterface(intfType) {
        intfType.__interface = true;

        if (jsoop.isNullOrUndefined(intfType.__typeName)) {
            intfType.__typeName = jsoop.__gen_interface_name(intfType);
        }

    };

    jsoop.registerModule = function jsoop$registerModule(modType) {
        modType.__module = true;
        if (jsoop.isNullOrUndefined(modType.__typeName)) {
            modType.__typeName = jsoop.__gen_module_name(modType);
        }

    };

    jsoop.registerEnum = function jsoop$registerEnum(enumType) {

        if (jsoop.isNullOrUndefined(enumType.__typeName)) {
            enumType.__typeName = jsoop.__gen_enum_name(enumType);
        }

        for (var field in enumType.prototype) {
            enumType[field] = enumType.prototype[field];
        }

        enumType.__enum = true;
    };

    jsoop._mergePrototype = function jsoop$_mergePrototype(thisType) {

        //need build prototype?
        if (!thisType.__mergePrototype) {
            return;
        }

        //get base type
        var baseType = thisType.__baseType;

        //process basetype
        if (baseType) {

            //build basetype's prototype first.
            jsoop._mergePrototype(baseType);

            //add all basetype's member into thisType
            for (var memberName in baseType.prototype) {
                var memberValue = baseType.prototype[memberName];

                //base can't override the same member of derived class
                if (!thisType.prototype[memberName]) {
                    thisType.prototype[memberName] = memberValue;
                }
            }

            //for all memer defined in interface, just act as a symble, we don't merge
            //any member into prototype
            if (thisType.__interfaces) {
                //do nothing
            }
        }

        //process modules
        if (thisType.__modules) {

            //get modules
            var modules = thisType.__modules;

            //put all member of module into class
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];

                //copy method from module
                for (var memberName in module.prototype) {
                    var memberValue = module.prototype[memberName];

                    //module member can't override the sameMember of current type.
                    if (!thisType.prototype[memberName]) {
                        thisType.prototype[memberName] = memberValue;
                    }
                }
            }
        }

        //set process end flags.
        thisType.__mergePrototype = false;
    };

    jsoop.initializeBase = function jsoop$initializeBase(thisType, instance, args) {
        if (thisType.__mergePrototype) {
            jsoop._mergePrototype(thisType);
        }

        if (!args) {
            thisType.__baseType.apply(instance);
        }
        else {
            thisType.__baseType.apply(instance, args);
        }
    };

    jsoop.callBaseMethod = function jsoop$callBaseMethod(thisType, instance, name, args) {
        var baseMethod = thisType.__baseType.prototype[name];

        if (!args) {
            return baseMethod.apply(instance);
        }
        else {
            return baseMethod.apply(instance, args);
        }
    };

    jsoop.getBaseType = function jsoop$getBaseType(thisType) {
        return thisType.__baseType || null;
    };

    jsoop.getInterfaces = function jsoop$getInterfaces(thisType) {
        return thisType.__interfaces;
    };

    jsoop.getModules = function jsoop$getModules(thisType) {
        return thisType.__modules;
    };

    jsoop.isInstanceOfType = function jsoop$isInstanceOfType(instance, type) {

        //all type can be assigned by null or undefined. but undefined and null dosn't have a type.
        if (jsoop.isNullOrUndefined(instance)) {
            return false;
        }

        //object is any type's parent
        if ((type == Object) || (instance instanceof type)) {
            return true;
        }

        var fromType = jsoop.getInstanceType(instance);
        return jsoop.isAssignableFrom(fromType, type);
    };

    //check type converting of fromType and toType
    //class FromType fromType;
    //class ToType toType;
    //toType = fromType?
    jsoop.isAssignableFrom = function jsoop$isAssignableFrom(fromType, toType) {

        //object can accept all other instance.
        if ((toType == Object) || (toType == fromType)) {
            return true;
        }

        if (jsoop.typeIsClass(toType)) {
            var baseType = fromType.__baseType;
            while (baseType) {
                if (toType == baseType) {
                    return true;
                }
                baseType = baseType.__baseType;
            }
        }
        else if (jsoop.typeIsInterface(toType)) {
            var interfaces = fromType.__interfaces;
            if (interfaces && jsoop.arrayContains(interfaces, toType)) {
                return true;
            }

            var baseType = fromType.__baseType;
            while (baseType) {
                interfaces = baseType.__interfaces;
                if (interfaces && jsoop.arrayContains(interfaces, toType)) {
                    return true;
                }
                baseType = baseType.__baseType;
            }
        }
        return false;
    };

    jsoop._createInstance = function jsoop$_createInstance(type, p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
        return new type(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
    };

    jsoop.createInstance = function jsoop$createInstance(fullTypeName, args) {
        var type = null;

        if (jsoop.isString(fullTypeName)) {
            type = jsoop.getType(fullTypeName);
        }
        else {
            type = fullTypeName;
        }

        if (!type) {
            throw jsoop.errorInvalidOperation('Invalidate type name:[' + fullTypeName + ']!');
        }

        if (!args) {
            args = [];
        }

        if (args.length > 10) {
            throw jsoop.errorInvalidOperation('createInstance support maximum parameter count is 10!');
        }

        var args2 = jsoop.arrayClone(args);
        jsoop.arrayInsert(args2, 0, type);

        var ins = jsoop._createInstance.apply(this, args2);
        return ins;
    }

    ///////////////////////////////////////////////////////////////////////////////
    // RTTI type category Query
    jsoop.typeIsClass = function jsoop$typeIsClass(type) {
        return (type.__class == true);
    };

    jsoop.typeIsEnum = function jsoop$typeIsEnum(type) {
        return (type.__enum == true);
    };

    jsoop.typeIsInterface = function jsoop$typeIsInterface(type) {
        return (type.__interface == true);
    };

    jsoop.typeIsModule = function jsoop$typeIsModule(type) {
        return (type.__module == true);
    };

    jsoop.getInstanceType = function jsoop$getInstanceType(instance) {
        var ctor = null;

        //null or undefined has no constructor
        if (jsoop.isNullOrUndefined(instance)) {
            return ctor;
        }

        // NOTE: We have to catch exceptions because the constructor
        //       cannot be looked up on native COM objects
        try {
            ctor = instance.constructor;
        }
        catch (ex) {
        }

        //all type shuold has a __typeName. 
        //if one type has no __typeName, regard as Object's instance
        if (!ctor || !ctor.__typeName) {
            ctor = Object;
        }
        return ctor;
    };

    ///////////////////////////////////////////////////////////////////////////////
    //primary type detect

    //is pure object
    jsoop.isPureObject = function jsoop$isPureObject(obj) {
        var type = jsoop.getInstanceType(obj);

        return (type === Object);
    };

    jsoop.isBoolean = function jsoop$isBoolean(obj) {
        return jsoop.isInstanceOfType(obj, Boolean);
    };

    jsoop.isNumber = function jsoop$isNumber(obj) {
        return jsoop.isInstanceOfType(obj, Number);
    };

    jsoop.isRegExp = function jsoop$isRegExp(obj) {
        return jsoop.isInstanceOfType(obj, RegExp);
    };

    jsoop.isDate = function jsoop$isDate(obj) {
        return jsoop.isInstanceOfType(obj, Date);
    };

    jsoop.isError = function jsoop$isError(obj) {
        return jsoop.isInstanceOfType(obj, Error);
    };

    jsoop.isFunction = function jsoop$isFunction(obj) {
        return jsoop.isInstanceOfType(obj, Function);
    };

    jsoop.isString = function jsoop$isString(obj) {
        return jsoop.isInstanceOfType(obj, String);
    };

    jsoop.isArray = function jsoop$isArray(obj) {
        return jsoop.isInstanceOfType(obj, Array);
    };

    ///////////////////////////////////////////////////////////////////////////////
    //Object extention

    jsoop.objectClearKeys = function jsoop$objectClearKeys(d) {
        for (var n in d) {
            delete d[n];
        }
    };

    jsoop.objectKeyExists = function jsoop$objectKeyExists(d, key) {
        return d[key] !== undefined;
    };

    jsoop.objectGetKeys = function jsoop$objectGetKeys(d) {
        var keys = [];
        for (var n in d) {
            keys.push(n);
        }
        return keys;
    };

    jsoop.objectGetKeyCount = function jsoop$objectGetKeyCount(d) {
        var count = 0;
        for (var n in d) {
            count++;
        }
        return count;
    };


    //copy from jquery
    //jsoop.objectExtend([deep, ] target, src1[ , ...srcn);
    //examples:
    //    jsoop.objectExtend(settings, options);
    //    jsoop.objectExtend({}, defaults, options);
    jsoop.objectExtend = function jsoop$objectExtend() {

        // copy reference to target object
        var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

        // Handle a deep copy situation
        //if (typeof target === "boolean") {
        if (jsoop.isBoolean(target)) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        //if (typeof target !== "object" && !jQuery.isFunction(target)) {
        if (!jsoop.isPureObject(target) && !jsoop.isFunction(target)) {
            target = {};
        }


        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging object literal values or arrays
                    //if (deep && copy && (jQuery.isPlainObject(copy) || jQuery.isArray(copy))) {
                    if (deep && copy && (jsoop.isPureObject(copy) || jsoop.isArray(copy))) {
                        //var clone = src && (jQuery.isPlainObject(src) || jQuery.isArray(src)) ? src
                        //	: jQuery.isArray(copy) ? [] : {};
                        var clone = src && (jsoop.isPureObject(src) || jsoop.isArray(src)) ? src
                    	: jsoop.isArray(copy) ? [] : {};

                        // Never move original objects, clone them
                        //target[name] = jQuery.extend(deep, clone, copy);
                        target[name] = jsoop.objectExtend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    ///////////////////////////////////////////////////////////////////////////////
    //array extention

    jsoop.arrayAdd = function jsoop$arrayAdd(array, item) {
        array[array.length] = item;
    };

    jsoop.arrayClone = function jsoop$arrayClone(array) {
        if (array.length === 1) {
            return [array[0]];
        }
        else {
            return Array.apply(null, array);
        }
    };

    jsoop.arrayClear = function jsoop$arrayClear(array) {
        array.length = 0;
    };

    //get and remove first item
    jsoop.arrayDequeue = function jsoop$arrayDequeue(array) {
        return array.shift();
    };

    //put item to array end
    jsoop.arrayEnqueue = function jsoop$arrayEnqueue(array, item) {
        array.push(item);
    };

    //get [0] item
    jsoop.arrayPeek = function jsoop$arrayPeek(array) {
        if (array.length) {
            return array[0];
        }
        return null;
    };

    jsoop.arrayPush = function jsoop$arrayPush(array, item) {
        array.push(item);
    };

    jsoop.arrayPop = function jsoop$arrayPop(array) {
        var item = array.pop();
        return item;
    };

    jsoop.arrayIndexOf = function jsoop$arrayIndexOf(array, item, startIndex) {
        array = array || [];
        startIndex = startIndex || 0;
        var length = array.length;
        if (length) {
            for (var index = startIndex; index < length; index++) {
                if (array[index] === item) {
                    return index;
                }
            }
        }
        return -1;
    };

    jsoop.arrayContains = function jsoop$arrayContains(array, item) {
        array = array || [];
        var index = -1;
        if (array.indexOf) {
            index = array.indexOf(item);
        }
        else {
            index = jsoop.arrayIndexOf(array, item);
        }
        return (index >= 0);
    };

    jsoop.arrayRemoveAt = function jsoop$arrayRemoveAt(array, index) {
        array = array || [];
        array.splice(index, 1);
    };

    jsoop.arrayRemove = function jsoop$arrayRemove(array, item) {
        var index = jsoop.arrayIndexOf(array, item);
        if (index >= 0) {
            array.splice(index, 1);
            return true;
        }
        return false;
    };

    jsoop.arrayInsert = function jsoop$arrayInsert(array, index, item) {
        array.splice(index, 0, item);
    }

    jsoop.arrayInsertRange = function jsoop$arrayInsertRange(array, index, items) {
        if (index === 0) {
            array.unshift.apply(array, items);
        }
        else {
            for (var i = 0; i < items.length; i++) {
                array.splice(index + i, 0, items[i]);
            }
        }
    }

    jsoop.arrayExtract = function jsoop$arrayExtract(array, index, count) {
        array = array || [];

        if (!count) {
            return array.slice(index);
        }
        return array.slice(index, index + count);
    }


    ///////////////////////////////////////////////////////////////////////////////
    //string extention

    jsoop.stringIsNullOrEmpty = function jsoop$stringIsNullOrEmpty(str) {
        return !str || !str.length;
    };

    jsoop.stringCompare = function jsoop$stringCompare(s1, s2, ignoreCase) {
        if (ignoreCase) {
            if (s1) {
                s1 = s1.toUpperCase();
            }
            if (s2) {
                s2 = s2.toUpperCase();
            }
        }

        s1 = s1 || '';
        s2 = s2 || '';

        if (s1 == s2) {
            return 0;
        }
        if (s1 < s2) {
            return -1;
        }
        return 1;
    };

    //join all string into one
    jsoop.stringConcat = function jsoop$stringConcat() {
        if (arguments.length === 2) {
            return arguments[0] + arguments[1];
        }

        if (arguments.length === 0) {
            return '';
        }

        var retval = arguments.join('');

        return retval;
    };

    jsoop.stringInsert = function jsoop$stringInsert(str, index, value) {
        if (!value) {
            return str;
        }

        //index is 0
        if (!index) {
            return value + str;
        }

        var s1 = str.substr(0, index);
        var s2 = str.substr(index);
        return s1 + value + s2;
    };

    jsoop.stringRemove = function jsoop$stringRemove(str, index, count) {

        str = str || '';

        if (!count || ((index + count) > str.length)) {
            return str.substr(0, index);
        }
        return str.substr(0, index) + str.substr(index + count);
    };

    jsoop.stringReplaceAll = function jsoop$stringReplaceAll(str, oldValue, newValue) {
        str = str || '';
        newValue = newValue || '';
        return str.split(oldValue).join(newValue);
    };

    jsoop.stringStartsWith = function jsoop$stringStartsWith(str, prefix) {
        str = str || '';
        if (!prefix.length) {
            return true;
        }
        if (prefix.length > str.length) {
            return false;
        }
        return (str.substr(0, prefix.length) == prefix);
    };

    jsoop.stringEndsWith = function jsoop$stringEndsWith(str, suffix) {
        str = str || '';
        if (!suffix.length) {
            return true;
        }
        if (suffix.length > str.length) {
            return false;
        }
        return (str.substr(str.length - suffix.length) == suffix);
    };


    jsoop.stringTrimEnd = function jsoop$stringTrimEnd(str) {
        str = str || '';
        return str.replace(/\s*$/, '');
    };

    jsoop.stringTrimStart = function jsoop$stringTrimStart(str) {
        str = str || '';
        return str.replace(/^\s*/, '');
    };

    jsoop.stringTrim = function jsoop$stringTrim(str) {
        str = str || '';
        return jsoop.stringTrimEnd(jsoop.stringTrimStart(str));
    };

    jsoop.stringEquals = function jsoop$stringEquals(s1, s2, ignoreCase) {
        return jsoop.stringCompare(s1, s2, ignoreCase) == 0;
    };

    jsoop.stringFromChar = function jsoop$stringFromChar(ch, count) {
        var s = ch;
        for (var i = 1; i < count; i++) {
            s += ch;
        }
        return s;
    };

    jsoop.stringIndexOf = function jsoop$stringIndexOf(str, subStr, startIndex) {
        str = str || '';
        return str.indexOf(subStr, startIndex);
    };

    jsoop.stringLastIndexOf = function jsoop$stringLastIndexOf(str, subStr, startIndex) {
        str = str || '';
        return str.lastIndexOf(subStr, startIndex);
    };

    jsoop.stringIndexOfAny = function jsoop$stringIndexOfAny(str, chars, startIndex, count) {
        str = str || '';
        var length = str.length;
        if (!length) {
            return -1;
        }

        startIndex = startIndex || 0;
        count = count || length;

        var endIndex = startIndex + count - 1;
        if (endIndex >= length) {
            endIndex = length - 1;
        }

        for (var i = startIndex; i <= endIndex; i++) {
            if (chars.indexOf(str.charAt(i)) >= 0) {
                return i;
            }
        }
        return -1;
    };

    jsoop.stringLastIndexOfAny = function jsoop$stringLastIndexOfAny(str, chars, startIndex, count) {
        str = str || '';
        var length = str.length;
        if (!length) {
            return -1;
        }

        startIndex = startIndex || length - 1;
        count = count || length;

        var endIndex = startIndex - count + 1;
        if (endIndex < 0) {
            endIndex = 0;
        }

        for (var i = startIndex; i >= endIndex; i--) {
            if (chars.indexOf(str.charAt(i)) >= 0) {
                return i;
            }
        }
        return -1;
    };

    ///////////////////////////////////////////////////////////////////////////////
    //Error extention
    jsoop._errorCreate = function jsoop$_errorCreate(message, errorInfo) {
        var err = new Error(message);
        err.message = message;
        if (errorInfo) {
            for (var v in errorInfo) {
                err[v] = errorInfo[v];
            }
        }

        jsoop._popStackFrame(err);
        return err;
    };

    jsoop._popStackFrame = function jsoop$_popStackFrame(err) {
        //TODO:
        //need rewrite in node.js
        if (jsoop.isNullOrUndefined(err.stack) ||
            jsoop.isNullOrUndefined(err.fileName) ||
            jsoop.isNullOrUndefined(err.lineNumber)) {
            return;
        }

        var stackFrames = err.stack.split('\n');
        var currentFrame = stackFrames[0];
        var pattern = err.fileName + ':' + err.lineNumber;
        while (!jsoop.isNullOrUndefined(currentFrame) &&
           currentFrame.indexOf(pattern) === -1) {
            stackFrames.shift();
            currentFrame = stackFrames[0];
        }

        var nextFrame = stackFrames[1];
        if (isNullOrUndefined(nextFrame)) {
            return;
        }

        var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
        if (jsoop.isNullOrUndefined(nextFrameParts)) {
            return;
        }

        stackFrames.shift();
        err.stack = stackFrames.join("\n");
        err.fileName = nextFrameParts[1];
        err.lineNumber = parseInt(nextFrameParts[2]);
    };

    jsoop.errorArgument = function jsoop$errorArgument(paramName, message) {
        var displayMessage = "jsoop.errorArgument: " + (message ? message : "");
        if (paramName) {
            displayMessage += "\nparamName:" + paramName;
        }

        var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgument", paramName: paramName });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorArgumentNull = function jsoop$errorArgumentNull(paramName, message) {

        var displayMessage = "jsoop.errorArgumentNull: " + (message ? message : "");
        if (paramName) {
            displayMessage += "\nparamName:" + paramName;
        }

        var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgumentNull", paramName: paramName });

        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorArgumentOutOfRange = function jsoop$errorArgumentOutOfRange(paramName, actualValue, message) {
        var displayMessage = "jsoop.errorArgumentOutOfRange: " + (message ? message : "");
        if (paramName) {
            displayMessage += "\nparamName:" + paramName;
        }
        if (typeof (actualValue) !== "undefined" && actualValue !== null) {
            displayMessage += "\nactualValue:" + actualValue;
        }
        var err = jsoop._errorCreate(displayMessage, {
            name: "jsoop.errorArgumentOutOfRange",
            paramName: paramName,
            actualValue: actualValue
        });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorArgumentType = function jsoop$errorArgumentType(paramName, actualType, expectedType, message) {
        var displayMessage = "jsoop.errorArgumentType: ";
        if (message) {
            displayMessage += message;
        }
        else if (actualType && expectedType) {
            displayMessage += 'actualType:[' + jsoop.getTypeName(actualType) + ']'
            + ' expectedType:[' + jsoop.getTypeName(expectedType) + ']';
        }
        else {
            displayMessage += 'Object cannot be converted!';
        }
        if (paramName) {
            displayMessage += "\nparamName:" + paramName;
        }
        var err = jsoop._errorCreate(displayMessage, {
            name: "Sys.ArgumentTypeException",
            paramName: paramName,
            actualType: actualType,
            expectedType: expectedType
        });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorArgumentUndefined = function jsoop$errorArgumentUndefined(paramName, message) {
        var displayMessage = "jsoop.errorArgumentUndefined: " + (message ? message : "");
        if (paramName) {
            displayMessage += "\nparamName:" + paramName;
        }
        var err = jsoop._errorCreate(displayMessage, { name: "jsoop.errorArgumentUndefined", paramName: paramName });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorFormat = function jsoop$errorFormat(message) {
        var displayMessage = "jsoop.errorFormat: " + (message ? message : "");
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorFormat' });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorInvalidOperation = function jsoop$errorInvalidOperation(message) {
        var displayMessage = "jsoop.errorInvalidOperation: " + (message ? message : '');
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorInvalidOperation' });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorNotImplemented = function jsoop$errorNotImplemented(message) {
        var displayMessage = "jsoop.errorNotImplemented: " + (message ? message : '');
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorNotImplemented' });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorParameterCount = function jsoop$errorParameterCount(message) {
        var displayMessage = "jsoop.errorParameterCount: " + (message ? message : '');
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorParameterCount' });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorExists = function jsoop$errorExists(message) {
        var displayMessage = "jsoop.errorExists: " + (message ? message : '');
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorExists' });
        jsoop._popStackFrame(err);
        return err;
    };

    jsoop.errorNotExists = function jsoop$errorNotExists(message) {
        var displayMessage = "jsoop.errorNotExists: " + (message ? message : '');
        var err = jsoop._errorCreate(displayMessage, { name: 'jsoop.errorNotExists' });
        jsoop._popStackFrame(err);
        return err;
    };


    ///////////////////////////////////////////////////////////////////////////////
    //createDelegate
    //bind class instance and class method
    jsoop.createDelegate = function jsoop$createDelegate(instance, method) {
        return function () {
            return method.apply(instance, arguments);
        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    //EventArgs class
    jsoop.EventArgs = function jsoop_EventArgs() { };

    jsoop.registerClass(jsoop.setTypeName(jsoop.EventArgs, 'jsoop.EventArgs', true));

    jsoop.EventArgs.Empty = new jsoop.EventArgs();


    ///////////////////////////////////////////////////////////////////////////////
    //EventHandlerList class
    jsoop.EventHandlerList = function jsoop_EventHandlerList() {
        this._list = {};
    };

    function jsoop_EventHandlerList$_addHandler(name, handler) {
        var eventQueue = this._getEventQueue(name, true);
        jsoop.arrayAdd(eventQueue, handler);
    }

    function jsoop_EventHandlerList$addHandler(name, handler) {
        this._addHandler(name, handler);
    }

    function jsoop_EventHandlerList$_removeHandler(name, handler) {
        var eventQueue = this._getEventQueue(name);

        if (!eventQueue) return;

        jsoop.arrayRemove(eventQueue, handler);
    }

    function jsoop_EventHandlerList$removeHandler(name, handler) {
        this._removeHandler(name, handler);
    }

    function jsoop_EventHandlerList$getHandler(name) {
        var eventQueue = this._getEventQueue(name);

        if (!eventQueue || (eventQueue.length === 0))
            return null;

        eventQueue = jsoop.arrayClone(eventQueue);

        return function (source, args) {
            for (var i = 0, ilen = eventQueue.length; i < ilen; i++) {
                eventQueue[i](source, args);
            }
        };
    }

    function jsoop_EventHandlerList$_getEventQueue(name, create) {
        var eventQueue = this._list[name];
        if (!eventQueue) {
            if (!create) return null;
            this._list[name] = eventQueue = [];
        }
        return eventQueue;
    }

    function jsoop_EventHandlerList$raiseEvent(name, source, args) {
        var handler = this.getHandler(name);

        if (handler) {
            handler(source, args);
        }
    }

    jsoop.EventHandlerList.prototype = {
        _addHandler: jsoop_EventHandlerList$_addHandler,
        addHandler: jsoop_EventHandlerList$addHandler,
        _removeHandler: jsoop_EventHandlerList$_removeHandler,
        removeHandler: jsoop_EventHandlerList$removeHandler,
        getHandler: jsoop_EventHandlerList$getHandler,
        _getEventQueue: jsoop_EventHandlerList$_getEventQueue,
        raiseEvent: jsoop_EventHandlerList$raiseEvent
    };

    jsoop.registerClass(jsoop.setTypeName(jsoop.EventHandlerList, 'jsoop.EventHandlerList', true));

    //exports module symbols to exports contents
    if (!jsoop.isClientSide()) {
        if (typeof exports !== 'undefined') {
            //node
            jsoop.Exports(jsoop, exports);
        }
    }

    //publish jsoop name to global context
    //First jsoop as finally jsoop rule.
    if (!globalContext.jsoop || (globalContext.jsoop.__typeName !== 'jsoop')) {
        //register jsoop namespace, and publish all API into it.
        var jsoopNS = jsoop.ns('jsoop');

        if (!jsoopNS) {
            //jsoop namespace don't exists, create one
            jsoopNS = jsoop.registerNamespace('jsoop');

            //then, publish all method to jsoopNS
            jsoop.Exports(jsoop, jsoopNS);
        }

        globalContext.jsoop = jsoopNS;
    }

})(this);

