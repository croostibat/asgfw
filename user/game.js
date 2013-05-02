createPackage("asg");

createClass({
    _name           : "Interface",
    _package        : "asg",
    _virtual        : true,
    
    drawBoard       : {_method: null},
    drawMove        : {_method: null}
}); 
/*****************************************************************************/
/*
 * 
 */
createClass({
	_name           : "Board",
	_package        : "asg",
    interface       : {_type: "asg.Interface", _getter: true},
	squares         : {_type: "std.collection.Collection", _getter: true},
	
    addSquare       : {
        _method: function(_p) {
            
           if (implements("Square"))
        }
    },
    
    draw            : {
    
    },
            
	constructor 	: {
        _method: function(_p) {
            this.squares  =  new MapArray("Square");
        }
	}
});

/*****************************************************************************/
/*
 * 
 */
createClass({
	
	_name           : "Square",
	_package        : "asg",
	id              : {_type: "String", _getter:true, _setter: true},
	name            : {_type: "String", _getter:true, _setter: true},
	board           : {_type: "Board", _getter:true, _setter: true},
	occupants       : {_type: "Collection", _getter:true, _setter: true}
	
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
createClass({
	
	_name           : "Pawn",
	_package        : "asg",
	id              : {_type: "String", _getter: true, _setter: true},
	name            : {_type: "String", _getter: true, _setter: true},
	player          : {_type: "Player", _getter: true, _setter: true},
	
	state           : {_type: "String", _getter: true, _setter: true}
});
/*****************************************************************************/


/*****************************************************************************/
/*
 * 
 */
createClass({
  
	_name           : "PawnsPool",
    _package        : "asg",
    id              : {_type: "std.misc.Id", _getter: true},
	name            : {_type: "String", _getter: true, _setter: true},
	pawns           : {_type: "std.collection.Collection", _getter: true, _setter: true},
    
    constructor     : {
        _method : function(_p) {
            this.id = new Id();
        }
    }
  
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
createClass({

    _name           : "Referee",
    _package        : "asg"
    
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
createClass({
	_name           : "Referee",
    _package        : "asg",
	board           : {_type: "Board"},
    pawnsPools      : {_type: "Collection"}
    
    

});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
createClass({
    _name			: "Turn",    
    _package        : "asg",
    actions         : {_type: "Collection", _getter: true, _setter: true}
    
});

/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
createClass({
    
    _name			: "Action",
    _package        : "asg", 
    type            : {_type: "Object", _static: true, _value: {move:"Move",set:"Set"}}
    
});
/*****************************************************************************/
