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
    else {
        return typeof(_object);
    }
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
 * @element _virtual(Boolean, optional)
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
    
	var newClass, work;
    
	newClass    = null;    
    /* Work is the object that contains the source code for the generation of the class. */
    work        = {_class : "", _classDesc : null, _const : [], _proto : [], _added : {}, _implements : {}, _errors : []};
        
	if (isString(_classDesc._name) === true && isString(_classDesc._package) !== false) {
        
        /* Completion of 2 importants attributes of the description
         * _fullName, the concatanation _package+"."+_name */
        _classDesc._package             = (_classDesc._package ? _classDesc._package : "");
        _classDesc._fullName            = (_classDesc._package ? _classDesc._package + "." : "") + _classDesc._name;
        _classDesc._constructorName     = "constructor_" + _classDesc._package.split(".").join("") + _classDesc._name;
        work._classDesc                 = _classDesc;
        /* Verification the type of the elements _implements and extends */
        if (isArray(_classDesc._implements) === false) {
            work._errors.push("the attribute _implements is not an []");
        }
        if (isArray(_classDesc._extends) === false) {
            work._errors.push("the attribute _extends is not an []");           
        }
        if (isArray(_classDesc._implements) === true && _classDesc._virtual) {
            /* A virtual class cannot implement any class */
            work._errors.push("The virtual class " + _classDesc._name + " can't implement any classes.");
        }
	}
    else {
        work._errors.push("the attribute _name doesn't exist or is not a <string>");
    }
    
    if (work._errors.length === 0) {
        /* The prototype of the generated classes will contains a system object "_".
         * This system object will contain the object _classDesc.
         * 
         * The description of the class is added to the prototype. All the methods and the static attributes
         * will a reference of an element object ._.classDesc */
        work._proto.push(work._classDesc._fullName + ".prototype._ = {_classDesc : " + jsonize(_classDesc) + "};");
        work = createClass_addClass(_classDesc, "creation", work);
    }
    
    if (work._errors.length === 0) {
        /* Evaluation of the constructor and the prototypes array */
        try {
            work._proto.push(work._classDesc._fullName + ".prototype._._implements = " + jsonize(work._implements) + ";");
            eval(work._classDesc._fullName + " = function (_p) { _p = (_p ? _p : {});" + work._const.join("")+ "};" + work._proto.join("") +"; newClass = " + work._classDesc._fullName + ";");        
            return newClass;
        }
        catch(e) {
            work._errors.push(e.description);
            return null;
        }
    }
    else {
        alert(work._errors.join(""));
        return work._errors;                
    }
};

/* @function createClass_addClass
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc)
 * @param _type(string,mandatory,["extension","implementation","creation"])
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_addClass = function(_classDesc, _type, _work) {
    
	if (_classDesc && _classDesc._name) {
        
        _work._added[_classDesc._name]          = _classDesc;
        _work._implements[_classDesc._fullName] = true;
        
		/* the attributes & methods of the extended classes are added */
		createClass_extendsClass(_classDesc, "_extends", _work);
        /* the attributes & methods described in _classDesc are added */
		createClass_addAttributes(_classDesc, _type, _work);
        /* The attributes of the virtual classes are added and the implementation of the virtual method is verified. */
		createClass_extendsClass(_classDesc, "_implements", _work);
        
        /* Add the call to the constructor */ 
		_work._const.push("if (typeof(this." + _classDesc._constructorName + ") == \"function\") { this." + _classDesc._constructorName + "(_p);};");
    }
	return _work;
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
                try {
        			classNameToAdd  = _classDesc[_list][index];
                    classDescToAdd  = eval("(isDefined(" + classNameToAdd + ") && " + classNameToAdd + ".prototype ? " + classNameToAdd + ".prototype._._classDesc" + " : null);");                
                }
                catch(e) {
                    _work._errors.push(e.description);
                    return null;
                }
                
                if (classDescToAdd && classDescToAdd._name) {
                    switch(_list) {
                        case "_implements":
                            /* Add the class in implementation mode 
                             * In this mode, the attributes will be added and the implementation of all the virtual methods 
                             * will be verified. */
                            _work = createClass_addClass(classDescToAdd, "implementation",_work);
                            /* if the construction (compilation?) of any daughter class failed, the construction of this class is considered as a failure too */
                            _work._implements[_classDesc._fullName] = _work._implements[classDescToAdd._fullName];
                        break;
                        
                        case "_extends":
                            if (_classDesc._virtual && !classDescToAdd._virtual) {
                                /* Add the class in extension mode */
                                _work._errors.push("The virtual class " + _classDesc._name + " can't extends the non virtual class " + classNameToAdd + ".");
                            }
                            else {
                                _work = createClass_addClass(classDescToAdd, "extension",_work);
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
	return _work;
};

/* @function createClass_addAttributes
 * @param _classDesc({} string,mandatory) the description of the class. @see (@objecture _classDesc) It contains the attributes and the methods that must be added to new class
 * @param _type(string,mandatory,["extension","implementation","creation"])
 * @param _work({}; mandatory) the object is generated by createClass @see (@function createClass)
 * */
var createClass_addAttributes = function(_classDesc, _type, _work) {

	var attribute, attributeFinalName, root, definition;
    
	if (_classDesc) {
        
		for (attribute in _classDesc) {
			/* Ignore the sys attributes (fisrt character is "_") */
			if (attribute.charAt(0) !== "_") {
                
                /* Attribute */
                if (typeof(_classDesc[attribute]._type) === "string") {
                    
                    if (_classDesc[attribute]._type === "Method") {
                          /* Virtual Method */
                        if (_classDesc[attribute]._method === null) {
                            if (_classDesc._virtual) {
                                if (!(_work._added[attribute] && typeof(_work._added[attribute]._method) === "function") && _type === "implementation") {
                                    _work._errors.push("The virtual method " + _classDesc._name + "."+ attribute + " is not implemented.");
                                    _work._implements[_classDesc._fullName] = false;
                                }
                            }
                            else {
                                _work._errors.push("The non-vritual class " + _classDesc._name + "."+ attribute + " can't own virtual method.");
                            }
                        }
                        /* Implemented method */
                        else if (typeof(_classDesc[attribute]._method) === "function") {
                            if (_classDesc._virtual) {
                                _work._errors.push(_classDesc._name + "."+ attribute + " : " + "a virtual class can't own implemented method");
                            }
                            else {
                                if (_work._added[attribute] && !((_work._added[attribute]._overloadable && _classDesc[attribute]._overload) || attribute === "constructor")) {
                                    _work._errors.push("The method " + _classDesc._name + "." + attribute + " is in collision with " + _work._added[attribute]._classDesc._fullName + "." + attribute);
                                }
                                else {
                                    /* Get the description of the class */  
                                    attributeFinalName = (attribute === "constructor" ? _classDesc._constructorName  : attribute);;
                                    /* If the attribute is the constructor (named "constructor"), it's renamed to _classDesc._constructorName. 
                                     * This name is the concatenation of */
                                    _work._proto.push(_work._classDesc._fullName + ".prototype." + attributeFinalName + " = " + (_type === "creation" ? _work._classDesc._fullName + "" : _classDesc._fullName) +  ".prototype._._classDesc." + attribute + "._method;");
                                    _work._added[attribute]             = _classDesc[attribute];
                                    _work._added[attribute]._classDesc  = _classDesc;
                                }
                            }
                        }
                        else {
                            _work._errors.push("The method " + _classDesc._name + "." + attribute + " is not null or a Function");
                        }
                    }
                    
                    else {
                        if (_work._added[attribute]) {
                            _work._errors.push("The attribute " + attribute + " of " + _classDesc._name + " is in collision with an attribute ancestor.");
                        }
                        else {
                            /* If a value is defined in the description 
                             */

                            /* The statics attributes are shared by all the instances of a class.
                             * So this kind of attributes are considered as prototype */        
                            switch(typeof(_classDesc[attribute]._value)) {
                                case "function" : 
                                    definition = attribute + " = " + _classDesc._fullName + ".prototype._._classDesc." + attribute + "._value();";
                                    break;
                                case "undefined":
                                    if (_classDesc[attribute]._autoSet === true) {
                                        definition = attribute + " = (implements(\"" + _classDesc[attribute]._type + "\",_p[\"" + attribute + "\"]) ? _p[\"" + attribute + "\"] : null);";
                                    }
                                    else {
                                        definition = attribute + " = null;"; 
                                    }
                                    break;
                                default:
                                    definition = attribute + " = " + _classDesc._fullName + ".prototype._._classDesc." + attribute + "._value;";
                                    break;
                            }

                            if (_classDesc[attribute]._static) {
                                root = _work._classDesc._fullName + ".prototype.";
                                _work._proto.push(root + definition);
                            }
                            else {
                                root = "this.";
                                _work._const.push(root + definition);
                            }

                            attributeFinalName = attribute.charAt(0).toUpperCase() + attribute.substring(1);
                            /* Add the setter method if asked */
                            if (_classDesc[attribute]._setter) {
                                _work._proto.push(_work._classDesc._fullName + ".prototype.set" + attributeFinalName + " = function(_object) {" + (_classDesc[attribute]._type === "*" ? root + attribute + " = _object; return true;" : "if (implements(\"" + _classDesc[attribute]._type + "\",_object)) {" + root + attribute + " = _object; return true;} return false;") + "};");
                                _work._added["set" + attributeFinalName]          = "method";
                                _work._added["set" + attributeFinalName]._class   = _classDesc;
                            }
                            /* Add the getter method if asked */
                            if (_classDesc[attribute]._getter) {
                                _work._proto.push(_work._classDesc._fullName + ".prototype.get" + attributeFinalName + " = function() { return " + root + attribute + ";};");
                                _work._added["get" + attributeFinalName]          = "method";
                                _work._added["get" + attributeFinalName]._class   = _classDesc;
                            }
                            _work._added[attribute]         = _classDesc[attribute];
                            _work._added[attribute]._class  = _classDesc;
                        }
                    }
                }
            }
		}
	}
	return _work;
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