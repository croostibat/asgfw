/* @function include synchronous load a file and evaluate its content
 * @param _filePath(String ,mandatory) path of the file (relative to the server) to load
 * */
var loadFile = function(_filePath, _onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.open("get",_filePath,false);
    xhr.onreadystatechange = function() {
        if (this.status === 200) {
            _onLoad(this.responseText);
        }
        else {
            return "";
        }
    };
    xhr.send();
};

var includeLib = function(_lib) {
    loadFile("../fw/lib/" + _lib + ".js", function(_content) {
        var head = document.getElementsByTagName("head");
        var style = document.createElement("script");
        style.innerHTML = _content;
        head[0].appendChild(style);
    });
};

var includePkg = function(_pkg) {
    loadFile("../user/" + _pkg + ".js", function(_content) {
        var head = document.getElementsByTagName("head");
        var style = document.createElement("script");
        style.innerHTML = _content;
        head[0].appendChild(style);
    });
};

var includeCss = function(_css) {
    loadFile("../user/" + _css + ".css", function(_content) {
        var head = document.getElementsByTagName("head");
        var style = document.createElement("style");
        style.innerHTML = _content;
        head[0].appendChild(style);
    });
};

/* @function isArray return true if the object is an []
 * @param _object(*,mandatory) the object to be tested
 * @return boolean null if the object is undefined else true, if the object is an [], or false
 * */
var isArray = function(_object) {
    return (typeof(_object) === "undefined" ? null : (typeof(_object) === "object" && typeof(_object.length) === "number"));
};

/* @function isDefined return true if the object is defined (typeof !== undefined)
 * @param _object(*,mandatory) the object to be tested
 * @return boolean true 
 * */
var isDefined = function(_object) {
    return typeof(_object) !== "undefined";
};

/* @function isFunction return true if the object is a function 
 * @param _object(*,mandatory) the object to be tested
 * @return boolean null if the object is undefined else true, if the object is a function, or false
 * */
var isFunction = function(_object) {
    return (typeof(_object) === "undefined" ? null : (typeof(_object) === "function"));
};

/* @function isString return true if the object is a string 
 * @param _object(*,mandatory) the object to be tested
 * @return boolean null if the object is undefined else true, if the object is a string, or false
 * */
var isString = function(_object) {
    return (typeof(_object) === "undefined" ? null : (typeof(_object) === "string"));
};

/* @function isNumber return true if the object is a number 
 * @param _object(*,mandatory) the object to be tested
 * @return boolean null if the object is undefined else true, if the object is a number, or false
 * */
var isNumber = function(_object) {
    return (typeof(_object) === "undefined" ? null : (typeof(_object) === "number"));
};

/* @function clone 
 * @param _object(*, mandatory) 
 * @return {} a copy of the object
 * 
 * @todo make un function to clone an object without cloning the prototype (instance a new object and copy the values)
 * */
var clone = function(_object) {
    try{
        return eval(jsonize(_object));
    }
	catch(e) {
        
    }
};

/* @function implements
 * @param _type 
 * @parma _object
 * @return boolean true if the _object implements _type,false else
 * */
var implements = function(_type,_object) {
    
    if (_object && _object._ && _object._._implements) {
        return (!!_object._._implements[_type]);
    }
    else if (typeof(_object) === _type.toLowerCase()) {
        return true;
    }
    else {
        return (_type === "object");
    }
};

/*
 *
 * */
var instanceOf = function(_object) {
    if (_object && _object._ && _object._._classDesc) {
        return  _object._._classDesc._fullName;
    }
    return null;
};

/* @function jsonize
 * @param _object(*, mandatory) any javascript object
 * @param _paranthesis(boolean, optional) if true the result of the function is enclosed with parenthesis
 * */
var jsonize = function(_object,_parenthesis) {
    _parenthesis 	= (typeof(_parenthesis) === "undefined" ? true 	: false);

	var prop,datas,result;
    
    if (_object === null) {
		result = "null";
	}
	else {
		switch(typeof(_object)) {
			case "object":
				datas = [];
				for (prop in _object) {
                    datas[datas.length] =  "\"" + prop + "\":" + jsonize(_object[prop],false);
				}
				result = ("{" + datas.join( ",") + "}");
				break;
			case "string":
				result = "\"" + _object.replace(/\"/gi,"\\\"") + "\"";
				break;
			default:
				result = _object;
				break;
		}
	}
	return (_parenthesis ? "(" + result + ")" : result);
};
/*****************************************************************************/

/*****************************************************************************/
/* @object classDescription description of a class.
 * @note This structure is the description of a class. The names of system element are undescored. The others element are the descriptions of the attributes and methods of the class
 * @element _name(String, mandatory)
 * @element _package(String, optional)
 * @element _implements([] of String, optionnal)
 * @element _extends([] of String, optionnal)
 * @element _virtual(Strings, optional)
 * @element [a-z]{1}[A-Za-z_]* (@object classAttribute, *)
 * */

 /* @object classAttribute description of a class attribute.
  * @note This structure is the description of a class. The names of system element are undescored. The others element are the descriptions of the attributes and methods of the class
  * @element _type(String, mandatory) type of the attribute.
  * @element _setter(boolean, mandatory) if true, a set method will be automatically generated.
  * @element _getter(boolean, mandatory) if true, a get method will be automatically generated.
  * @element _static(boolean, mandatory) if true, the value of the attribute is shared by all the instance of the class.
  * @element _values(*, mandatory) the default value of the attribute.
  * */

/*****************************************************************************/
/* @function createClass
 * @note This function create a constructor (javascript function) that can instanced with the operator "new"
 * @param _classDesc(@object classDescription,mandatory) contain the description of the class.
 * */
var createClass = function(_classDesc) {
    
	var work;
    
    /* Work is the object that contains the source code for the generation of the class. */
    work        = {_classDescToCreate : null, _constructor : [], _prototype : [], _added : {}, _implements : {}, _virtualMethods: {}, _errors : []};
    
    createClass_parseDescription(_classDesc,work);
    if (work._errors.length === 0) {
        /* The prototype of the generated classes will contains a system object "_".
         * This system object will contain the object _classDesc.
         * The description of the class is added to the prototype. All the methods and the static attributes
         * will a reference of an element object ._.classDesc */
        work._classDescToCreate = _classDesc;
        work._prototype.push(work._classDescToCreate._fullName + ".prototype._ = {_classDesc : " + jsonize(_classDesc) + "};");
        createClass_addClass(_classDesc, "creation", work);
        createClass_checkImplementations(work);
    }
    
    if (work._errors.length === 0) {
        /* Evaluation of the constructor and the prototypes array */
        try {
            work._prototype.push(work._classDescToCreate._fullName + ".prototype._._implements = " + jsonize(work._implements) + ";");
            eval(work._classDescToCreate._fullName + " = function (_p) { _p = (_p ? _p : {});" + work._constructor.join("")+ "};" + work._prototype.join("") +";");        
            return [];
        }
        catch(e) {
            work._errors.push(e.description);
            return work._errors;
        }
    }
    else {
        alert(work._errors.join(""));
        return work._errors;                
    }
};

/* @function createClass_addClass
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc)
 * @param _mode(string,mandatory,["extension","implementation","creation"])
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_addClass = function(_classDesc, _mode, _work) {
    
	if (_classDesc && _classDesc._name) {
        _work._added[_classDesc._name]          = _classDesc;
        _work._implements[_classDesc._fullName] = true;
        /* The attributes of the virtual classes are added */
		createClass_extendsClass(_classDesc, "_implements", _work);
        /* the attributes & methods of the extended classes are added */
		createClass_extendsClass(_classDesc, "_extends", _work);
        /* the attributes & methods described in _classDesc are added */
		createClass_addProperties(_classDesc, _mode, _work);        
        /* Add the call to the constructor */
		_work._constructor.push("if (typeof(this." + _classDesc._constructorName + ") == \"function\") { this." + _classDesc._constructorName + "(_p);};");
    }
};

/* @function createClass_extendsClass
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc)It contains the extension and the implementation that must be added to new class
 * @param _list(string,mandatory,["_extends","_implements"]) the list of the inherited ou implemented classes do process
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_extendsClass = function(_classDesc, _list,_work) {
    
	var  index, classDescToAdd, classNameToAdd;
    
	if (_classDesc && _classDesc[_list]) {
		for (index in _classDesc[_list]) {
			if (!_work._added[_classDesc[_list][index]]) {
                /* Retrieve the class description */
                classNameToAdd  = _classDesc[_list][index];
                classDescToAdd  = createClass_getDescriptionByName(classNameToAdd,_work);
                
                if (classDescToAdd && classDescToAdd._name) {
                    switch(_list) {
                        case "_implements":
                            /* Add the class in implementation mode 
                             * In this mode, the attributes will be added and the implementation of all the virtual methods 
                             * will be verified. */
                            createClass_addClass(classDescToAdd, "implementation",_work);
                            /* if the construction (compilation?) of any daughter class failed, the construction of this class is considered as a failure too */
                            _work._implements[_classDesc._fullName] = _work._implements[classDescToAdd._fullName];
                        break;
                        
                        case "_extends":
                            if (_classDesc._virtual === "pure" && classDescToAdd._virtual !== "pure") {
                                /* Add the class in extension mode */
                                _work._errors.push("The virtual class " + _classDesc._name + " can't extends the non virtual class " + classNameToAdd + ".");
                            }
                            else {
                                createClass_addClass(classDescToAdd, "extension",_work);
                            }
                        break;
                    }
                }
                else {
                    _work._errors.push("The class " + classNameToAdd + " doesn't exist.");
                }
			}
		}
	}
};

/* @function createClass_addProperties
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc) It contains the attributes and the methods that must be added to new class
 * @param _mode(string,mandatory,["extension","implementation","creation"])
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_addProperties = function(_classDesc, _mode, _work) {

	var property, root, type, setter;
    
	if (_classDesc) {
        for (property in _classDesc) {
			/* Ignore the sys propertys (fisrt character is "_") */
			if (property.charAt(0) !== "_") {
                /* Methods
                 * */
                if (_classDesc[property]._type === "Method") {
                      /* Virtual Method 
                       * */
                    if (_work._classDescToCreate._virtual === "none" && _classDesc[property]._method === null) {                        
                       _work._virtualMethods[property] = { _classDesc: _classDesc};
                    }
                    /* Implemented method 
                     * */
                    if (typeof(_classDesc[property]._method) === "function") {
                        if (_work._added[property] && !((_work._added[property]._overloadable && _classDesc[property]._overload) || property === "constructor")) {
                            _work._errors.push("The method " + _classDesc._fullName + "." + property + " is in collision with " + _work._added[property]._classDesc._fullName + "." + property);
                        }
                        else {
                            /* Get the description of the class */  
                            /* If the property is the constructor (named "constructor"), it's renamed to _classDesc._constructorName. 
                             * This name is the concatenation of */
                            if (_work._virtualMethods[property]) {
                                delete _work._virtualMethods[property];
                            }
                            _work._prototype.push(_work._classDescToCreate._fullName + ".prototype." + (property === "constructor" ? _classDesc._constructorName  : property) + " = " + (_mode === "creation" ? _work._classDescToCreate._fullName + "" : _classDesc._fullName) +  ".prototype._._classDesc." + property + "._method;");
                            _work._added[property]             = _classDesc[property];
                            _work._added[property]._classDesc  = _classDesc;
                        }
                    }
                }
                /* Attributes
                 * */
                else {
                    if (_work._added[property]) {
                        _work._errors.push("The attribute " + property + " of " + _classDesc._name + " is in collision with an other property.");
                    }
                    else {
                        /* If a value is defined in the description
                         * */
                        setter = "set" + property.charAt(0).toUpperCase() + property.substring(1);
                        /* The statics propertys are shared by all the instances of a class.
                         * So this kind of propertys are considered as prototype 
                         * */
                        root = (_classDesc[property]._static ? _classDesc._fullName + ".prototype." : root = "this.");
                        type = (_classDesc[property]._static ? "_prototype" : "_constructor");

                        
                            if (_classDesc[property]._autoSet === true) {
                                if ((_classDesc[setter] && _classDesc[setter]._type === "Method") || _classDesc[property]._setter === true) {
                                    _work[type].push(root + property + " = null;");
                                    _work._constructor.push("if (isDefined(_p[\"" + property + "\"])){ this." + setter + "(_p[\"" + property + "\"]);};");
                                }
                                else {
                                    _work[type].push(root + property + " = (implements(\"" + _classDesc[property]._type + "\",_p[\"" + property + "\"]) ? _p[\"" + property + "\"] : null);");
                                }
                            }
                            else {
                                _work[type].push(root + property + " = null;"); 
                            }
                        
                        
//                        if (typeof(_classDesc[property]._value) === "undefined") {
//                        }                        
//                            else {
//                            _work[type].push(root + property + " = " + _classDesc._fullName + ".prototype._._classDesc." + property + "._value;");
//                        }
                        _work._added[property]         = _classDesc[property];
                        _work._added[property]._class  = _classDesc;
                    }
                }
            }
		}
	}
};

/*
 * 
 * */
var createClass_checkImplementations = function(_work) {
    var method, list;
    
    list = _work._virtualMethods;
    for (method in list) {
        _work._implements[list[method]._classDesc._fullName] = false;
        _work._errors.push("The virtual method " + list[method]._classDesc._fullName + "." + method + " is not implemented.");
    }
};

/*
 * 
 * */
var createClass_getDescriptionByName = function(_className,_work) {
    try {
        return eval("(isDefined(" + _className + ") && " + _className + ".prototype ? " + _className + ".prototype._._classDesc" + " : null);");                
    }
    catch(e) {
        _work._errors.push("Retrieving description of " + _className + " error : " + e.description);
        return null;
    }
};

/* @function createClass_parseDescription
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc) It contains the propertys and the methods that must be added to new class
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_parseDescription = function(_classDesc, _work) {

	var property, root, setter, getter;
    
	if (_classDesc) {
        
        if (isString(_classDesc._name) !== true) {
            _work._errors.push("the property _name doesn't exist or is not a <string>");
        }
        if (isString(_classDesc._package) === false) {
            _work._errors.push("the property _package is not a <string>");
        }
        
        _classDesc._package             = (_classDesc._package ? _classDesc._package : "");
        _classDesc._fullName            = (_classDesc._package ? _classDesc._package + "." : "") + _classDesc._name;
        _classDesc._constructorName     = "constructor_" + _classDesc._package.split(".").join("") + _classDesc._name;
        _classDesc._virtual             = _classDesc._virtual ? _classDesc._virtual : "none";
        
        if (_classDesc._virtual !== "none" && _classDesc._virtual !== "mixed"  && _classDesc._virtual !== "pure") {
            _work._errors.push("the property _vritual must be 'none', 'mixed' or 'pure'");
        }
        if (isArray(_classDesc._implements) === false) {
            _work._errors.push("the property _implements is not an []");
        }
        if (isArray(_classDesc._extends) === false) {
            _work._errors.push("the property _extends is not an []");           
        }
        if (isArray(_classDesc._implements) === true && _classDesc._virtual !== "none") {
            /* A virtual class cannot implement any class */
            _work._errors.push("The virtual class " + _classDesc._name + " can't implement any classes.");
        }
        
        /* Parse Methods
        * */
		for (property in _classDesc) {
			/* Ignore the sys propertys (fisrt character is "_") */
			if (property.charAt(0) !== "_") {
                if (typeof(_classDesc[property]._type) === "string") {
                    if (_classDesc[property]._type === "Method") {
                        /* Virtual Method 
                         * */
                        if (_classDesc[property]._method === null) {
                            if (!_classDesc._virtual === "none") {
                                _work._errors.push("The non-vritual class " + _classDesc._name + "." + property + " can't own virtual method.");
                            }
                        }
                        /* Implemented method 
                         * */
                        else if (typeof(_classDesc[property]._method) === "function") {
                            if (_classDesc._virtual === "pure") {
                                _work._errors.push(_classDesc._name + "."+ property + " : a pure virtual class can't own implemented method");
                            }
                        }
                        else {
                            _work._errors.push("The method " + _classDesc._name + "." + property + " is not null or a Function");
                        }
                    }
                }
            }
		}
        
        /* Parse Attributes
         * */
        for (property in _classDesc) {
			/* Ignore the sys propertys (fisrt character is "_") */
			if (property.charAt(0) !== "_") {
                if (typeof(_classDesc[property]._type) === "string") {
                    if (_classDesc[property]._type !== "Method") {
                        setter  = "set" + property.charAt(0).toUpperCase() + property.substring(1);
                        getter  = "get" + property.charAt(0).toUpperCase() + property.substring(1);
                        root    = (_classDesc[property]._static ? _classDesc._fullName + ".prototype." : root = "this.");
                        /* Add the setter method if asked */
                        if (_classDesc[property]._setter && !(_classDesc[setter] && _classDesc[setter]._type === "Method")) {
                            _classDesc[setter] = {_type :"Method", _overloadable: true, _autoGenerated: true};
                            eval("_classDesc[setter]._method = function(_object) {" + (_classDesc[property]._type === "*" ? root + property + " = _object; return true;" : "if (implements(\"" + _classDesc[property]._type + "\",_object) || _object === null) {" + root + property + " = _object; return true;} return false;") + "};");
                        }
                        /* Add the getter method if asked */
                        if (_classDesc[property]._getter && !(_classDesc[getter] && _classDesc[getter]._type === "Method")) {
                            _classDesc[getter] = {_type :"Method", _overloadable: true, _autoGenerated: true};
                             eval("_classDesc[getter]._method = function() { return " + root + property + ";};");
                        }
                    }
                }
            }
        }
        _classDesc._parsed = (_work._errors.length === 0 ? true : false);
	}
};

/*
 * 
 * */
var createPackage = function(_package) {
    var i, packagePath,newPackage,code,splitter,pathSplitted;
    
    splitter        = /^([A-Za-z0-9_.]+)\.([A-Za-z0-9_]+)$|^([A-Za-z0-9_]+)$/;
    code            = "";
    pathSplitted    = splitter.exec(_package);
    
    if (pathSplitted && pathSplitted.length === 4) {
        
        packagePath = pathSplitted[3] ? "this" : "this." + pathSplitted[1];
        newPackage  = pathSplitted[3] ? pathSplitted[3] : pathSplitted[2];
        
        if (eval("typeof(" + packagePath +")") === "object") {
            eval(packagePath + "." + newPackage + " = {_owner : " + packagePath + ", _name : \"" + newPackage + "\"};");
            return true;
        }
        else {
            alert("The package " + packagePath + " doesn't exists. The package " + packagePath + "." + newPackage + " can't be created!");
        }
    }
    return false;
};

var parsePackage = function() {
    
};