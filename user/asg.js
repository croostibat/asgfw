createPackage("asg");
createPackage("asg.ui");
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
    
    htmlHook        : {_type: "Object", _getter: true},
    uiElement       : {_type: "ui.Element", _getter: true},
    
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    draw            : {_type: "Method", _method: null}
}); 

/*
 * 
 * */
createClass({
    _name           : "Controller",
    _package        : "asg",
    _virtual        : true,
    
    game            : {_type: "asg.Game", _getter: true, _setter: true, _autoSet: true},
    ui              : {_type: "asg.Ui", _getter: true, _setter: true, _autoSet: true},
    draw            : {_type: "Method", _method: null}
    
    
}); 

/*
 * 
 * */
createClass({
    _name           : "Game",
    _package        : "asg",
    _virtual        : true,
    
    board           : {_type: "asg.board.Board", _getter: true, _setter: true, _autoSet: true},
    referee         : {_type: "asg.actors.Referee", _getter: true, _setter: true, _autoSet: true},
    players         : {_type: "std.collection.Collect", _getter: true, _setter: true, _autoSet: true},
    
    initialize      : {_type: "Method", _method: null},
    play            : {_type: "Method", _method: null}
});

/*
 * 
 * */
createClass({
	_name           : "Board",
	_package        : "asg.board",
    
	slots           : {_type: "std.collection.Collection", _getter: true},
    
    /*
     * 
     * */
    addSlot         : {
        _type: "Method", _method: function(_slot) {
           if (implements("asg.board.Slot",_slot)) {
               this.slots.set(_slot,_slot.getId());
           }
        }
    },
    
    /*
     * 
     * */
	constructor 	: {
        _type: "Method", _method: function(_p) {
            this.slots  =  new std.collection.MapArray();
        }
	}
});

/*
 * 
 * */
createClass({
	_name           : "SquareBoard",
	_package        : "asg.board",
    _extends        : ["asg.board.Board"],
    
    side            : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
	constructor 	: {
        _type: "Method", _method: function(_p) {
            
            var i, j, id, n;
            
            n = 0;
            
            for(i = 0; i < this.side; i++) {
                for(j = 0; j < this.side; j++) {
                    id = i + "/" + j; n++;
                    this.slots.set(new asg.board.Slot({id:id}), id);
                }
            }
        }
	}
});

/*
 * 
 * */
createClass({
	_name           : "Slot",
	_package        : "asg.board",
    
	id              : {_type: "String", _getter:true, _setter: true},
	name            : {_type: "String", _getter:true, _setter: true},
	board           : {_type: "asg.board.Board", _getter:true, _setter: true},
	occupants       : {_type: "std.collection.Collection", _getter:true, _setter: true}
	
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
	
	state           : {_type: "String", _getter: true, _setter: true}
});

/*
 * 
 * */
createClass({
  
	_name           : "Pool",
    _package        : "asg.pawns",
    id              : {_type: "std.misc.Id", _getter: true},
	name            : {_type: "String", _getter: true, _setter: true},
	pawns           : {_type: "std.collection.Collection", _getter: true, _setter: true},
    
    constructor     : {
        _type: "Method", _method : function(_p) {
            this.id = new std.misc.Id();
        }
    }
  
});

/*
 * 
 * */
createClass({

    _name           : "Referee",
    _package        : "asg.actors"
    
});

/*
 * 
 * */
createClass({

    _name           : "Player",
    _package        : "asg.actors"
    
});

/*
 * 
 * */
createClass({
    _name			: "Turn",    
    _package        : "asg.actions",
    actions         : {_type: "std.collection.Collection", _getter: true, _setter: true}
    
});

/*
 * 
 * */
createClass({
    
    _name			: "Action",
    _package        : "asg.actions", 
    type            : {_type: "Object", _static: true, _value: {move:"Move",set:"Set"}}
    
});
