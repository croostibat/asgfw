
createPackage("asg");

asg.createClass({
    _name           : "Interface",
    _virtual        : true,
    
    drawBoard       : {_method: null},
    drawMove        : {_method: null}
}); 
/*****************************************************************************/
/*
 * 
 */
asg.createClass({
	_name           : "Board",
	
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
asg.createClass({
	
	_name           : "Square",
	
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
asg.createClass({
	
	_name           : "Pawn",
	
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
asg.createClass({
  
	_name           : "PawnsPool",
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
asg.createClass({

    _name               : "Referee"
    
    
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
asg.createClass({
	_name               : "Referee",

	board               : {_type: "Board"},
    pawnsPools          : {_type: "Collection"}
    
    

});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
asg.createClass({
    _name				: "Turn",    
    
    actions             : {_type: "Collection", _getter: true, _setter: true}
    
});

/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
asg.createClass({
    
    _name				: "Action",
            
    type                : {_type: "Object", _static: true, _value: {move:"Move",set:"Set"}}
    
});
/*****************************************************************************/
