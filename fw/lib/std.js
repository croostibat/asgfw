createPackage("std");
createPackage("std.chainer");
createPackage("std.collection");
createPackage("std.proc");
createPackage("std.misc");

/*
 * 
 */
createClass({
	
	_name		: "Node",
    _package    : "std.chainer",
    
    children    : {_type: "std.collection.Collection", _getter: true},
	parent		: {_type: "Object", _getter: true, _setter: true},
	
    addChild	: {_type: "Method", 
        _method: function(_object) {
	    	this.children.add(_object);
            _object.setParent(this);
    	}
    },
    
    constructor		: {_type: "Method", 
        _method: function(_p) {
    		this.children = new std.collection.MapArray({type:"std.Node"});
    	}
    }
});
/*****************************************************************************/

/*****************************************************************************/
/* STACKS                                                           
/*****************************************************************************/
/*
 * 
 */
createClass({
    _name       : "Stack",
    _package    : "std.collection",
    _virtual    : true,
    
    head        : {_type: "Method", _method: null},
    tail        : {_type: "Method", _method: null},
    push        : {_type: "Method", _method: null},
    pop         : {_type: "Method", _method: null}
});
/*****************************************************************************/

/*****************************************************************************/
/* COLLECTIONS															
/*****************************************************************************/
/*
 *
 */
createClass({
    _name           : "Collection",
    _package        : "std.collection",
    _virtual        : true,
    foreach         : {_type: "Method", _method: null},
    isSet           : {_type: "Method", _method: null},
    set             : {_type: "Method", _method: null},
    get             : {_type: "Method", _method: null},
    drop            : {_type: "Method", _method: null}
});

/*
 * 
 */
createClass({
	
	_name           : "MapArray",
    _package        : "std.collection",
    _implements     : ["std.collection.Collection"],
    
    length          : {_type: "Number", _getter: true},    
    objects         : {_type: "Object", _getter: true},
    type            : {_type: "String", _getter: true},
    autoKey         : {_type: "Number"},
    
	foreach         : {_type: "Method", 
        _method: function(_fn, _params) {
			var key = null;
			
			if (isFunction(_fn)) {
				for (key in this.objects) { 
					_fn(this[key],key,_params);
				}
			}
		}
	},
	
	isSet       : {_type: "Method", 
        _method: function(_key) {
			return isDefined(this.objects[_key]);
		}
	},
	
	get         : {_type: "Method", 
        _method: function(_key) {
			return this.objects[_key];
		}	
	},
	
	set 		: {_type: "Method", 
        _method: function(_object,_key) {
			if (isDefined(_object) && (!this._type || is_type(_object,this._type))) {
				if (!this.isSet(_key)) {
					this.length = this.length + 1;
				}
				this.objects[_key] 	= _object; return _key;		
			}
			return null;
		}
	},
    	
	add 		: {_type: "Method", 
        _method:function(_object) {
			return this.set(_object, this.getAutoKey());
		}
	},
    
    getAutoKey     : {_type: "Method", 
        _method: function() {
            while(this.isSet(this.autoKey)) {
                this.autoKey++;
            }
            return this.autoKey;
        }
    },
    
    isSettable  : {_type: "Method", 
        _method: function(_object) {
            return (this.type || (instanceOf(_object,this.type)));
        }
    },
    
	drop 		: {_type: "Method", 
        _method: function() {
			var object = null;
			if (this.isSet(_key)) {
				this.length 	= this.length - 1;
				object = this.objects[_key];
				delete this.objects[_key];
			}
			return object;
		}
	},
	
	constructor : {_type: "Method", 
        _method: function(_p) {
            this.length     = 0;
            this.objects    = {};
            this.type       = _p.type;
            this.autoKey    = 0;
		}
	}
});

/*****************************************************************************/
/* FUNCTION 
/*****************************************************************************/
/*
 * Constructor
 * fn (Function) :
 */
createClass({
	
	_name       : "Callback",
    _package    : "std.proc",
    
	fn          : {_type: "Function", _getter: true, _setter: true, _autoSet: true},
    aa          : {_type: "*"},
	params      : {_type: "*", _getter: true, _setter: true, _autoSet: true},
	
    addParam    : {_type: "Method", 
        _method: function(_name, _value) {
            if (instanceOf(this.params) === "object") {
                if (!this.params) {
                    this.params = {};
                }
                
                if (!this.params[_name]) {
                    this.params[_name] = _value;
                    return true;
                }                
            }
            return false;
		}
    },
    constructor : {_type: "Method", 
        _method : function(_p) {
            
        }
    },
	exec		: {_type: "Method", 
        _method: function(_params) {
			if (instanceOf(this.fn) === "function") {
				this.fn(this.params, _params);
			}
		}
	}
});

/* Fonction synchrone / asynchrone encapsul�es 
 * 
 */
createClass({
	_name			: "Job",
	_package        : "std.proc",
    
	mainCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},
	onEndCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},	
    async         	: {_type: "Boolean"},
    period          : {_type: "number", _getter: true, _setter: true},
    
    work 	: {_type: "Method", 
        _method: function(_this) {
	        _this = (_this ? _this : this);
	        if (_this.async) {
	            setTimeout(function() {_this.exec(_this);},20);
	        }
	        else {
	            _this.exec(_this);       
	        }
    	}
    },
    
    exec	: {_type: "Method", 
        _method: function(_this) {
	        _this = (_this ? _this : this);
	        mainCallback.exec();
	        onEndCallback.exec();
    	}
    },
    
    constructor : {_type: "Method", 
        _method: function(_p) {
             _p = _p ? _p : {};
             
             this.period = (_p.period ? _p.period : 50);
         }
    }
});
/*****************************************************************************/


/*****************************************************************************/
/* @class Event
 * 
 */
createClass({
	_name               : "Event",
    _package            : "std.proc",
    /* @attributes
     * _p.callback (Procedure)  : the procedure to be set as the callback */
    callback            : {_type: "std.proc.Callback", _getter: true, _setter: true, _autoSet: true, _autoInstance: true},
    
    /* @method constructor(_p)
     * _p.fn (Function, mandatory) : the main function to be called when the event will be triggered 
     * _p.params(*,optional): this object will be passed to the main function when the event will be triggered
     * */
    constructor         : {_type: "Method", 
        _method : function(_p) {
            this.callback = (this.callback ? this.callback : new std.proc.Callback(_p));
        }
    },
    
    /* @method UiEvent.getTrigger()
     * Return a standalone function which trigger the UiEvent. */
    getTrigger          : {_type: "Method", 
        _method: function() {
            var _this = this;
            return function(){ _this.callback.exec();};
		}
    },
            
	trigger             : {_type: "Method", 
        _method: function(_p) {
            this.callback.exec();
		}
	}
});
/*****************************************************************************/

/*****************************************************************************/
/* MISC
/*****************************************************************************/
/*
 * 
 */
createClass({
	
	_name           : "Id",
    _package        : "std.misc",
	value           : {_type: "String", _getter: true},
    
    getRandomChar   : {_type: "Method", 
        _method: function() {
            var n = (Math.floor(Math.random() * 26)+65);
            return String.fromCharCode(n);
        }
    },
    
    generate        : {_type: "Method", 
        _method: function() {
            this.value = this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar()+this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar();
        }
    },
    
	constructor		: {_type: "Method", 
        _method: function() {
            this.generate();
		}
	}	
});
/*****************************************************************************/

