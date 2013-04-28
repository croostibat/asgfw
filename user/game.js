var GameTimer = createClass({
	_name		: "Timer"
});

/*****************************************************************************/

var Board = createClass({
	_name           : "Board",
	
	squares         : {_type: "Collection", _getter: true},
	
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
var Square = createClass({
	
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
var Pawn = createClass({
	
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
var PawnPools = createClass({
  
	_name           : "PawnPools",
	id              : {_type: "String", _getter: true, _setter: true},
	name            : {_type: "String", _getter: true, _setter: true},
	pawns           : {_type: "Collection", _getter: true, _setter: true}
  
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
var Referee  = createClass({

    _name               : "Referee"
    
    
});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
var Game  = createClass({
	_name               : "Referee",

	board               : {_type: "Board"}

});
/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
var Turn  = createClass({
    _name				: "Move",    
    
    actions             : {_type: "Collection", _getter: true, _setter: true}
    
});

/*****************************************************************************/

/*****************************************************************************/
/*
 * 
 */
var Action  = createClass({
    
    _name				: "Action",
            
    type                : {_type: "Object", _static: true, _value: {move:"Move",set:"Set"}}
    
});
/*****************************************************************************/
