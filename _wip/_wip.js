/* Fonction synchrone / asynchrone encapsulées 
 * 
 * */
createClass({
	_name			: "Job",
	_package        : "std.proc",
    
	mainCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},
	onEndCallback	: {_type: "std.proc.Callback", _getter: true, _setter: true},	
    async         	: {_type: "Boolean"},
    period          : {_type: "Number", _getter: true, _setter: true},
    
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