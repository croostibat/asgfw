createPackage("asgMin");
createPackage("asgMin.actions");
createPackage("asgMin.board");

/*
 * 
 * */
createClass({
    _name               : "Game",
    _package            : "asgMin",
    _virtual            : "mixed",
    _extends            : ["asg.Game"],
    
    /*
     * 
     * */
    addPlayer           : {_type: "Method",
        _method : function(_player){
            if (implements("asg.actors.Player", _player)) {
                _player.setGame(this);
                this.players.set(_player, _player.id);
            }
        }
    },
    
    /*
     * 
     * */
    setReferee          : {_type: "Method", _overload: true,
        _method: function(_referee) {
            this.referee = _referee;
            this.referee.setGame(this);
        }
    },
    
    /*
     * 
     * */            
    start               : {_type: "Method", 
        _method: function(_p) {
            if (!this.getStarted()) {
                this.setStarted(true);
                this.referee.pickPlayer();
            }
        }
    },
    
    /*
     * 
     * */            
    stop                : {_type: "Method", 
        _method: function(_p) {
             if (this.getStarted()) {
                 this.setStarted(false);
             }
        }
    }
});

/*
 * 
 * */
 createClass({
    _name               : "Controller",
    _extends            : ["asg.Controller"],
    _package            : "asgMin",
    _virtual            : "mixed",
    
    /*
     * 
     * */    
    setUi               : {_type: "Method", _overload: true,
        _method: function(_ui) {
            this.ui = _ui;            
            this.ui.setOnSlotClick(new std.proc.Event({context:this, fn:this.onSlotClickFn}));
        }
    },
    
    /*
     * 
     * */
    setGame             : {_type: "Method", _overload: true,
        _method: function(_game) {
            this.game = _game;
            this.game.setOnPlay(new std.proc.Event({context:this, fn:this.onPlayFn}));
            this.game.setOnPickPlayer(new std.proc.Event({context:this, fn:this.onPickPlayerFn}));
            this.game.setOnTurnOver(new std.proc.Event({context:this, fn:null}));            
        }
    }
});

/*
 * 
 * */
createClass({
	_name           : "Slot",
	_package        : "asgMin.board",
    _extends        : ["asg.board.Slot"],
    _virtual        : "mixed",
    
	occupant        : {_type: "asg.pawns.Pawn", _getter:true, _setter: true},
    
    isFree          : {_type: "Method", 
        _method: function() {
            return this.occupant == null;
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "Move",
    _package        : "asgMin.actions",
    _extends        : ["asg.actions.Move"],
    _virtual        : "mixed",
    
    action          : {_type: "asg.actions.Action", _getter: true, _setter: true, _autoSet: true}
   
});

/*
 * 
 * */
 createClass({
    _name           : "Action",
    _package        : "asgMin.actions",
    _extends        : ["asg.actions.Action"],
    _virtual        : "mixed",    
    
    order           : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
});
