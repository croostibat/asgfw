/*****************************************************************************/
/*
 * 
 */

createPackage("std");
std.createPackage("chainer");
std.createPackage("collection");
std.createPackage("proc");
std.createPackage("misc");

std.chainer.createClass({
	
	_name		: "Node",
    
	parent		: {_type: "Object", _getter:true, _setter:true},
	
    addChild	: { 
        _method: function(_object) {
	    	this.children.add(_object);
            _object.setParent(this);
    	}
    },
    
    constructor		: { 
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
std.collection.createClass({
    _name       : "Stack",
    _virtual    : true,
    
    head        : {_method: null},
    tail        : {_method: null},
    push        : {_method: null},
    pop         : {_method: null}
});
/*****************************************************************************/

/*****************************************************************************/
/* COLLECTIONS															
/*****************************************************************************/
/*
 *
 */
std.collection.createClass({
    _name           : "Collection",
    _virtual        : true,
    foreach         : {_method: null},
    isSet           : {_method: null},
    set             : {_method: null},
    get             : {_method: null},
    drop            : {_method: null}
});

/*
 * 
 */
std.collection.createClass({
	
	_name           : "MapArray",
    _implements     : ["std.collection.Collection"],
    
    length          : {_type: "Number", _getter: true},    
    objects         : {_type: "Object", _getter: true},
    type            : {_type: "String", _getter: true},
    autoKey         : {_type: "Number"},
    
	foreach         : {
        _method: function(_fn, _params) {
			var key = null;
			
			if (isFunction(_fn)) {
				for (key in this.objects) { 
					_fn(this[key],key,_params);
				}
			}
		}
	},
	
	isSet       : { 
        _method: function(_key) {
			return isDefined(this.objects[_key]);
		}
	},
	
	get         : { 
        _method: function(_key) {
			return this.objects[_key];
		}	
	},
	
	set 		: {
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
    	
	add 		: {
        _method:function(_object) {
			return this.set(_object, this.getAutoKey());
		}
	},
    
    getAutoKey     : {
        _method: function() {
            while(this.isSet(this.autoKey)) {
                this.autoKey++;
            }
            return this.autoKey;
        }
    },
    
    isSettable  : {
        _method: function(_object) {
            return (this.type || (instanceOf(_object,this.type)));
        }
    },
    
	drop 		: {
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
	
	constructor : { 
        _method: function(_p) {
            this.length     = 0;
            this.objects    = {};
            this.type       = _p.type;
            this.autoKey    = 0;
		}
	}
});
/*****************************************************************************/

/*****************************************************************************/
/* FUNCTION 
/*****************************************************************************/
/*
 * Constructor
 * fn (Function) :
 */
std.proc.createClass({
	
	_name       : "Callback",
	fn          : {_type: "Function",_getter: true, _setter: true},
	params      : {_type: "Object",_getter: true, _setter: true},
	
    addParam    : {
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
    
	exec		: {
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
std.proc.createClass({
	_name			: "Job",
	
	mainCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},
	onEndCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},	
    async         	: {_type: "Boolean"},
    period          : {_type: "number", _getter: true, _setter: true},
    
    work 	: { 
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
    
    exec	: { 
        _method: function(_this) {
	        _this = (_this ? _this : this);
	        mainCallback.exec();
	        onEndCallback.exec();
    	}
    },
    
    constructor : {
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
std.proc.createClass({
	_name               : "Event",
    
    /* @attributes
     * _p.callback (Procedure)  : the procedure to be set as the callback */
    callback            : {_type: "std.proc.Callback", _getter: true, _setter: true, _autoSet: true},
    
    /* @method UiEvent.constructor(_p)
     * _p.callbackFn (Function) : the main function to be called when the event will be triggered */
    constructor         : {
        _method : function(_p) {
            
            this.callback = (this.callback ? this.callback : new Callback());
            
            if (instanceOf(_p.callbackFn) === "function") {                
                this.callback.setFn(_p.callbackFn);
            }
        }
    },
    
    /* @method UiEvent.getTrigger()
     * Return a standalone function which trigger the UiEvent. */
    getTrigger          : {
        _method: function() {
            var _this = this;
            return function(){ _this.callback.exec();};
		}
    },
            
	trigger             : {
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
std.misc.createClass({
	
	_name           : "Id",
	value           : {_type: "String", _getter: true},
    
    getRandomChar   : {
        _method: function() {
            var n = (Math.floor(Math.random() * 26)+65);
            return String.fromCharCode(n);
        }
    },
    
    generate        : {
        _method: function() {
            this.value = this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar()+this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar();
        }
    },
    
	constructor		: { 
        _method: function() {
            this.generate();
		}
	}	
});
/*****************************************************************************/

