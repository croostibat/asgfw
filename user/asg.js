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
    _virtual        : "pure",
    
    htmlHook        : {_type: "Object", _getter: true, _setter: true, _autoSet: true},
    
    rootUiElement   : {_type: "ui.Element", _getter: true},
    boardUiElement  : {_type: "ui.Element", _getter: true},
    
    onSlotClick     : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    
    draw            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name               : "Game",
    _package            : "asg",
    _virtual            : "pure",
    
    started             : {_type: "Boolean", _getter: true, _setter: true},
    
    referee             : {_type: "asg.actors.Referee", _getter: true, _setter: true, _autoSet: true},
    board               : {_type: "asg.board.Board", _getter: true, _setter: true, _autoSet: true},
    
    currentMove         : {_type: "asg.actions.Move", _getter: true, _setter: true, _autoSet: true},
    firstMove           : {_type: "asg.actions.Move", _getter: true, _setter: true, _autoSet: true},
    
    onPickPlayer        : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    onTurnOver          : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    onPlay              : {_type: "std.proc.Event", _getter: true, _setter: true, _autoSet: true},
    
    start               : {_type: "Method", _method: null},
    stop                : {_type: "Method", _method: null},
    
    addMove             : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name               : "Controller",
    _package            : "asg",
    _virtual            : "pure",
    
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
    _virtual            : "pure",
    
	slots               : {_type: "std.coll.Collection"}
    
});

/*
 * 
 * */
createClass({
	_name           : "Slot",
	_package        : "asg.board",
    _virtual        : "pure",
    
    board           : {_type: "asg.board.Board", _getter: true},
    
	id              : {_type: "String", _getter:true, _setter: true, _autoSet: true},
	name            : {_type: "String", _getter:true, _setter: true, _autoSet: true}
});

/*
 * 
 * */
createClass({
	_name           : "Pawn",
	_package        : "asg.pawns",
    
	id              : {_type: "String", _getter: true, _setter: true, _autoSet: true},
	name            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
	player          : {_type: "asg.actors.Player", _getter: true, _setter: true, _autoSet: true}
});

/*
 * 
 * */
createClass({
    _name           : "Player",
    _package        : "asg.actors",
    _virtual        : "pure",
    
    id              : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    name            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    
    turn            : {_type: "Method", _method: null},
    play            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name           : "Referee",
    _package        : "asg.actors",
    _virtual        : "pure",
    
    playerTurn      : {_type: "asg.actors.Player", _getter: true, _setter: true},
    name            : {_type: "String", _getter: true, _setter: true, _autoSet: true},
    
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    
    pickPlayer      : {_type: "Method", _method: null},
    turnOver        : {_type: "Method", _method: null},
    isMoveLegal     : {_type: "Method", _method: null},
    isGameOver      : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
    _name			: "Move",    
    _package        : "asg.actions",
    _virtual        : "pure",
    
    player          : {_type: "asg.actors.Player", _getter: true, _setter: true, _autoSet: true}
    
});

/*
 * 
 * */
createClass({
    _name			: "Action",
    _package        : "asg.actions",
    _virtual        : "pure",
    
    move            : {_type: "asg.actions.Move", _getter: true, _setter: true, _autoSet: true},
    
    execute         : {_type: "Method", _method: null},
    undo            : {_type: "Method", _method: null}
});

