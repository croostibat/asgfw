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
	
    addChild        : {_type: "Method", 
        _method: function(_object) {
	    	this.children.add(_object);
            _object.setParent(this);
    	}
    },
            
    getNbChildren   : {_type: "Method", 
        _method: function(_object) {
	    	return this.children.getLength();
    	}
    },
            
    constructor     : {_type: "Method", 
        _method: function(_p) {
    		this.children = new std.coll.MapArray({type:"std.Node"});
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
			if (isDefined(_object)) {
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
				this.length = this.length - 1;
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
 * 
 * */
createClass({
	
	_name           : "Callback",
    _package        : "std.proc",
    
	fn              : {_type: "Function", _getter: true, _setter: true, _autoSet: true},
    params          : {_type: "*", _getter: true, _setter: true, _autoSet: true},
    
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

/* Fonction synchrone / asynchrone encapsulées 
 * 
 * */
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

/*
 * 
 * */
createClass({
	
	_name           : "AsyncFn",
    _package        : "std.proc",
    
	fn              : {_type: "Function", _getter: true, _setter: true, _autoSet: true},
    params          : {_type: "*", _getter: true, _setter: true, _autoSet: true},
	context         : {_type: "*", _getter: true, _setter: true, _autoSet: true},
    
   
    constructor : {_type: "Method", 
        _method : function(_p) {
            
        }
    },
            
	exec		: {_type: "Method", 
        _method: function(_params) {
			if (instanceOf(this.fn) === "function") {
				this.fn(_params);
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
        _method: function(_p) {
            var _this   = this;
            return function(){ _this.callback.exec(_p);};
		}
    },
            
	trigger             : {_type: "Method", 
        _method: function(_p) {
            this.callback.exec(_p);
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
	
    getRandomChar   : {_type: "Method", 
        _method: function() {
            var n = (Math.floor(Math.random() * 26)+65);
            return String.fromCharCode(n);
        }
    },
    
    generate        : {_type: "Method", 
        _method: function() {
            return this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar()+this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar() + this.getRandomChar();
        }
    }
});