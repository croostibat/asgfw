/* @function isDefined return true if the object is defined (typeof !== undefined)
 * @param _object(*,mandatory) the object to be tested
 * @return boolean true 
 * */
var isDefined = function(_object) {
    return typeof(_object) !== "undefined";
};

/* @function clone 
 * @param _object(*, mandatory) 
 * @return {} a copy of the object
 * 
 * @todo make un function to clone an object without cloning the prototype (instance a new object and copy the values)
 * */
var clone = function(_object) {
	return eval(jsonize(_object));
};

/* @function implemetns
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
					datas[datas.length] =  prop + ":" + jsonize(_object[prop],false);
				}
				result = ("{" + datas.join( ",") + "}");
				break;
			case "function":
				result = _object;
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