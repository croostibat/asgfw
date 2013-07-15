createPackage("std");
createPackage("std.chainer");
createPackage("std.coll");
createPackage("std.proc");
createPackage("std.misc");

/*
 * 
 * */
createClass({
	
	_name           : "Node",
    _package        : "std.chainer",
    
    children        : {_type: "std.coll.Collection", _getter: true},
	parent          : {_type: "*", _getter: true, _setter: true},
	
    /*
     * 
     * */
    addChild        : {_type: "Method", 
        _method: function(_object) {
	    	this.children.add(_object);
            _object.setParent(this);
        }
    },

    /*
     * 
     * */
    findChild       : {_type: "Method", 
        _method: function(_fn, _params) {
    
            var fnSelect =  function(_element, _key, _params) {
                return _element.findChild(_params.fn, _params.params);
            };
            
	    	if (_fn(this,_params)) {
                return this;
            }
            
            return (this.children.foreach(fnSelect,{fn: _fn, params: _params}));
    	}
    },
    
    /*
     * 
     * */
    getNbChildren   : {_type: "Method", 
        _method: function(_object) {
	    	return this.children.getLength();
    	}
    },

    /*
     * 
     * */
    constructor		: {_type: "Method", 
        _method: function(_p) {
    		this.children = new std.coll.IdxArray({type:"std.chainer.Node"});
    	}
    }
});

/*****************************************************************************/
/* STACKS                                                           
/*****************************************************************************/
/*
 * 
 * */
createClass({
    _name       : "Stack",
    _package    : "std.coll",
    _virtual    : "pure",
    
    head        : {_type: "Method", _method: null},
    tail        : {_type: "Method", _method: null},
    push        : {_type: "Method", _method: null},
    pop         : {_type: "Method", _method: null}
});

/*****************************************************************************/
/* COLLECTIONS															
/*****************************************************************************/
/*
 *
 * */
createClass({
    _name           : "Collection",
    _package        : "std.coll",
    _virtual        : "pure",
    
    foreach         : {_type: "Method", _method: null},
    isSet           : {_type: "Method", _method: null},
    set             : {_type: "Method", _method: null},
    get             : {_type: "Method", _method: null},
    drop            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
	_name           : "MapArray",
    _package        : "std.coll",
    _implements     : ["std.coll.Collection"],
    
    length          : {_type: "Number", _getter: true},    
    objects         : {_type: "Object", _getter: true},
    valType         : {_type: "String", _getter: true},
    idxType         : {_type: "String", _getter: true},
    /*
     * 
     * */
	foreach         : {_type: "Method",
        _method: function(_fn, _params) {
			var key, ret;
            
            key = null; ret = null;
			if (isFunction(_fn)) {
				for (key in this.objects) {
					ret = _fn(this.objects[key],key,_params);
                    if (isDefined(ret) && ret !== null) {
                        return ret;
                    }
				}
			}
            return null;
		}
	},

    /*
     * 
     * */
	get         : {_type: "Method",
        _method: function(_key) {
			return (isDefined(this.objects[_key]) ? this.objects[_key] : null);
		}
	},
	
    /*
     * 
     * */
	set 		: {_type: "Method", 
        _method: function(_object,_key) {
			if (isDefined(_object) && this.isSettable(_object,_key)) {
                if (!this.isSet(_key)) {
					this.length = this.length + 1;
				}
				this.objects[_key] 	= _object; return _key;		
			}
			return null;
		}
	},
 	
    /*
     * 
     * */
	isSet       : {_type: "Method",
        _method: function(_key) {
			return isDefined(this.objects[_key]);
		}
	},
	   
    /*
     * 
     * */
    isSettable  : {_type: "Method", 
        _method: function(_object, _key) {
            return ((this.valType === "*" || implements(this.valType, _object)) && (this.idxType === "*" || implements(this.idxType, _key)));
        }
    },
    
    /*
     * 
     * */
	drop 		: {_type: "Method", 
        _method: function(_key) {
			var object = null;
			if (this.isSet(_key)) {
				this.length = this.length - 1;
				object = this.objects[_key];
				delete this.objects[_key];
			}
			return object;
		}
	},
	
    /*
     * 
     * */
	constructor : {_type: "Method", 
        _method: function(_p) {
            this.length     = 0;
            this.objects    = {};
            this.valType    = (this.valType ? this.valType : "*");
            this.idxType    = (this.idxType ? this.idxType : "*");
		}
	}
});

/*
 * 
 * */
createClass({
	_name           : "IdxArray",
    _package        : "std.coll",
    _implements     : ["std.coll.Collection"],
    
    length          : {_type: "Number", _getter: true},    
    objects         : {_type: "Object", _getter: true},
    valType         : {_type: "String", _getter: true},
    autoKey         : {_type: "Number"},
    
    /*
     * 
     * */
	foreach         : {_type: "Method",
        _method: function(_fn, _params) {
			var key, ret;
            
            key = null;
            ret = null;
			if (isFunction(_fn)) {
				for (key in this.objects) {
					ret = _fn(this.objects[key],key,_params);
                    if (isDefined(ret) && ret !== null) {
                        return ret;
                    }
				}
			}
            return null;
		}
	},
	
    /*
     * 
     * */
	add 		: {_type: "Method", 
        _method:function(_object) {
			return this.set(_object, this.getAutoKey());
		}
	},
    
    /*
     * 
     * */
    getAutoKey     : {_type: "Method", 
        _method: function() {
            while(this.isSet(this.autoKey)) {
                this.autoKey++;
            }
            return this.autoKey;
        }
    },
    
    /*
     * 
     * */
	get         : {_type: "Method",
        _method: function(_key) {
			return (isDefined(this.objects[_key]) ? this.objects[_key] : null);
		}
	},
	
    /*
     * 
     * */
	set 		: {_type: "Method", 
        _method: function(_object,_key) {
			if (isDefined(_object)) {
				if (!this.isSet(_key)) {
					this.length = this.length + 1;
				}
				this.objects[_key] 	= _object; return _key;		
			}
			return null;
		}
	},
    
    /*
     * 
     * */
	isSet       : {_type: "Method",
        _method: function(_key) {
			return isDefined(this.objects[_key]);
		}
	},
	
    /*
     * 
     * */
    isSettable  : {_type: "Method", 
        _method: function(_object, _key) {
            return ((this.valType === "*" || implements(this.valType, _object)) && implements("Number", _key));
        }
    },
    
    /*
     * 
     * */
	drop 		: {_type: "Method", 
        _method: function(_key) {
			var object = null;
			if (this.isSet(_key)) {
				this.length = this.length - 1;
				object = this.objects[_key];
				delete this.objects[_key];
			}
			return object;
		}
	},
	
    /*
     * 
     * */
	constructor : {_type: "Method", 
        _method: function(_p) {
            this.length     = 0;
            this.objects    = {};
            this.autoKey    = 0;
		}
	}
});


/*****************************************************************************/
/* FUNCTION 
/*****************************************************************************/
/*
 * 
 * */
createClass({
	_name           : "Fn",
    _package        : "std.proc",
    _virtual        : "pure",
    
    exec		: {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
	_name           : "FnNoctx",
    _package        : "std.proc",
    _implements     : ["std.proc.Fn"],
    
	fnRef           : {_type: "Function", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    constructor : {_type: "Method", 
        _method : function(_p) {
            
        }
    },
    
    /*
     * 
     * */
	exec		: {_type: "Method", 
        _method: function(_params) {
			if (isFunction(this.fnRef)) {
				this.fnRef(_params);
			}
		}
	}
});

/*
 * 
 * */
createClass({
	_name           : "FnCtx",
    _package        : "std.proc",
    _implements     : ["std.proc.Fn"],
    
    fnName          : {_type: "String", _getter: true, _setter: true, _autoSet: true},
	context         : {_type: "*", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    constructor : {_type: "Method", 
        _method : function(_p) {
            
        }
    },
    
    /*
     * 
     * */
	exec		: {_type: "Method", 
        _method: function(_params) {
			if (isString(this.fnName)) {
				this.context[this.fnName](_params);
			}
		}
	}
});

/* @class Event
 * 
 * */
createClass({
	_name               : "Event",
    _package            : "std.proc",
    /* @attributes
     * _p.fn (Procedure)  : the procedure to be set as the callback */
    fn                  : {_type: "std.proc.Fn", _getter: true, _setter: true, _autoSet: true},
    async               : {_type: "Boolean", _getter: true, _setter: true, _autoSet: true},
    
    /* @method constructor(_p)
     * _p.fn (Function, mandatory) : the main function to be called when the event will be triggered 
     * _p.params(*,optional): this object will be passed to the main function when the event will be triggered
     * */
    constructor         : {_type: "Method", 
        _method : function(_p) {
            if (!this.fn) {
                if (_p.fnRef) {
                    this.fn = new std.proc.FnNoctx({fn: _p.fnRef});
                }
                if (_p.fnName && _p.context) {
                    this.fn = new std.proc.FnCtx({fnName: _p.fnName, context: _p.context});
                }
            }
        }
    },
    
    /* @method UiEvent.getTrigger()
     * Return a standalone function which trigger the UiEvent. */
    getTrigger          : {_type: "Method", 
        _method: function(_p) {
            var _this   = this;
            if (this.getAsync()) {
                return function(){ setTimeout(function(){_this.fn.exec(_p);},10);};
            }
            else {
                return function(){ _this.fn.exec(_p);};
            }
		}
    },
    
    /*
     * 
     * */    
	trigger             : {_type: "Method", 
        _method: function(_p) { 
            var _this   = this;
            
            if (this.getAsync()) {
                setTimeout(function(){_this.fn.exec(_p);},10)
            }
            else {
                _this.fn.exec(_p);
            }
		}
	}
});

/*****************************************************************************/
/* MISC
/*****************************************************************************/

/*
 * 
 * */
createClass({
	_name           : "IdGenerator",
    _package        : "std.misc",
	
    /*
     * 
     * */
    getRandomChar   : {_type: "Method", 
        _method: function() {
            var n = (Math.floor(Math.random() * 26)+65);
            return String.fromCharCode(n);
        }
    },
    
    /*
     * 
     * */
    generate        : {_type: "Method", 
        _method: function() {
            return this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar()+this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar();
        }
    }
});