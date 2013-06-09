createPackage("asg");
createPackage("asg.board");
createPackage("asg.actors");
createPackage("asg.actions");
createPackage("asg.pawns");

/*
 * 
 * */
createClass({
    _name           : "Ui",
    _package        : "asg",
    _virtual        : true,
    
    onSlotClick     : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    htmlHook        : {_type: "Object", _getter: true},
    uiElement       : {_type: "ui.Element", _getter: true},

    draw            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name               : "Game",
    _package            : "asg",
    _virtual            : true,
    
    started             : {_type: "Boolean", _getter: true, _setter: true},
    
    board               : {_type: "asg.board.Board", _getter: true, _setter: true, _autoSet: true},
    players             : {_type: "std.coll.Collection", _getter: true, _setter: true, _autoSet: true},
    moves               : {_type: "std.coll.Collection", _getter: true, _setter: true, _autoSet: true},
    referee             : {_type: "asg.actors.Referee", _getter: true, _setter: true, _autoSet: true},
    
    moveNumber          : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
    onPickPlayer        : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    onTurnOver          : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    onPlay              : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    
    initialize          : {_type: "Method", _method: null},
    start               : {_type: "Method", _method: null},
    stop                : {_type: "Method", _method: null},
    setPlayer           : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name               : "Controller",
    _package            : "asg",
    _virtual            : true,
    
    game                : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    ui                  : {_type: "asg.Ui", _getter: true, _setter: true, _autoSet: true},

    draw                : {_type: "Method", _method: null} 
});

/*
 * 
 * */
createClass({
	_name               : "Board",
	_package            : "asg.board",
    _virtual            : true,
    
	slots               : {_type: "std.coll.Collection", _getter: true},
  
	constructor         : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
	_name           : "Slot",
	_package        : "asg.board",
    _virtual        : true,
    
	id              : {_type: "String", _getter:true, _setter: true},
	name            : {_type: "String", _getter:true, _setter: true},
	board           : {_type: "asg.board.Board", _getter:true, _setter: true},
});

/*
 * 
 * */
createClass({
	_name           : "Pawn",
	_package        : "asg.pawns",
    
	id              : {_type: "String", _getter: true, _setter: true},
	name            : {_type: "String", _getter: true, _setter: true},
	player          : {_type: "asg.actors.Player", _getter: true, _setter: true},
    actions         : {_type: "std.coll.Collection", _getter: true, _setter: true},
	state           : {_type: "String", _getter: true, _setter: true}
});

/*
 * 
 * */
createClass({
    _name           : "Player",
    _package        : "asg.actors",
    _virtual        : true,
    
    id              : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    name            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    board           : {_type: "asg.board.Board", _getter:true, _setter: true},
    
    turn            : {_type: "Method", _method: null},
    play            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name           : "Referee",
    _package        : "asg.actors",
    _virtual        : true,
    
    playerTurn      : {_type: "asg.actors.Player", _getter: true, _setter: true},
    name            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    
    pickPlayer      : {_type: "Method", _method: null},
    turnOver        : {_type: "Method", _method: null},
    isMoveLegal     : {_type: "Method", _method: null}
    
});

/*
 * 
 * */
createClass({
    _name			: "Move",    
    _package        : "asg.actions",
    _virtual        : true,

    player          : {_type: "asg.actors.Player", _getter: true, _setter: true, _autoSet: true},
    board           : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    order           : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
    actions         : {_type: "std.coll.Collection", _getter: true, _setter: true},    
    setAction       : {_type: "Method", _method: null},
    isAllowed       : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name			: "Action",
    _package        : "asg.actions",
    _virtual        : true,
    
    order           : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    move            : {_type: "asg.actions.Move", _getter: true, _setter: true, _autoSet: true},
    
    execute         : {_type: "Method", _method: null},
    isAllowed       : {_type: "Method", _method: null}
});
