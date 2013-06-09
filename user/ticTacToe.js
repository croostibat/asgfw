createPackage("ticTacToe");

/*
 * 
 * */
createClass({
    _name           : "Ui",
    _implements     : ["asg.Ui"],
    _package        : "ticTacToe",
    
    draw       : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            if (isNumber(_p.side)) {
                var slotsSettings = {
                    class       : "slot",
                    onClick     : this.onSlotClick
                };
                this.uiElement = new ui.container.PanesS({class: "board", nbRows:_p.side, nbColumns:_p.side, panesSettings: slotsSettings});
                this.uiElement.setHtmlHook(_p.htmlHook);
            }
        }
    }
});

/*
 * 
 * */
createClass({
    _name               : "Game",
    _implements         : ["asg.Game"],
    _package            : "ticTacToe",
    
    /*
     *
     * */
    initialize          : {_type: "Method", 
        _method: function() {
            
        }
    },
    
    /*
     * 
     * */
    setPlayer           : {_type: "Method",
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
    },
    
    /*
     * 
     * */
    constructor         : {_type: "Method",
        _method: function(_p) {
            this.board      = new ticTacToe.Board({side:_p.side});
            this.players    = new std.coll.MapArray();
        }
    }
});

/*
 * 
 * */
 createClass({
    _name               : "Controller",
    _implements         : ["asg.Controller"],
    _package            : "ticTacToe",
    
    /*
     * 
     * */
    constructor         : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     * 
     * */
    draw                : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            if (implements("ticTacToe.Game",this.game) && implements("ticTacToe.Ui",this.ui)) {
                this.ui.draw({side: this.game.board.getSide(), htmlHook: _p.htmlHook});
            }
        }
    },
    
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
    },
    
    /*
     * 
     * */
    onSlotClickFn   : {_type: "Method",
        _method: function(_uiSlot) {
            var coordinate, playerTurn;
            coordinate  = _uiSlot.getCoordinate().split(",");
            playerTurn  = this.context.game.referee.getPlayerTurn();
            if (implements("ticTacToe.PlayerUi", playerTurn)) {
                playerTurn.play({x: coordinate[0],y: coordinate[1]});
            }
        }
    },
    
    /*
     * 
     * */
    onPlayFn        : {_type: "Method",
        _method: function(_p) {
            
            var boardUi    = this.context.ui.getUiElement();
            var slotUi     = boardUi.getPane(_p.x, _p.y);
            
            if (_p.player.getId() === "N") {
                slotUi.setClass("slot slot_black");
            }
            else {
                slotUi.setClass("slot slot_white");
            }
            
            slotUi.applyStyles();
        }
    },
    
    /*
     * 
     * */
    onPickPlayerFn  : {_type: "Method", 
        _method: function(_p) {
            
        }
    }
});


/*
 * 
 * */
createClass({
	_name               : "Board",
	_package            : "ticTacToe",
    _implements         : ["asg.board.Board"],
    
    side                : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
	constructor         : {
        _type: "Method", _method: function(_p) {
            this.slots  =  new std.coll.MapArray();
             
            var i, j, id, n;
            n = 0;
            for(i = 0; i < this.side; i++) {
                for(j = 0; j < this.side; j++) {
                    id = i + "/" + j; n++;
                    this.slots.set(new ticTacToe.Slot({id:id}), id);
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
	_package        : "ticTacToe",
    _implements     : ["asg.board.Slot"],
    
	occupants       : {_type: "std.coll.Collection", _getter:true, _setter: true}
});

/*
 * 
 * */
 createClass({
    _name           : "Referee",
    _package        : "ticTacToe",
    _implements     : ["asg.actors.Referee"],
    
    /*
     * 
     * */    
    pickPlayer          : {_type: "Method",
        _method: function() {
            if (!implements("asg.actors.Player", this.playerTurn)) {
                this.playerTurn = this.game.players.get("B");
            }
            else {
                if (this.playerTurn.getId() === "B") {
                    this.playerTurn = this.game.players.get("N");
                }
                else {
                    this.playerTurn = this.game.players.get("B");
                }
            }
            
            if (implements("asg.actors.Player", this.playerTurn)) {
                // Trigger the onChoosePlayer event
                if (implements("std.proc.Event",this.game.onPickPlayer)) {
                    this.game.onPickPlayer.trigger({player:this.playerTurn});
                }
                this.playerTurn.turn();
            }
        }
    },
            
    turnOver        : {_type: "Method",
        _method: function(_p) {
            this.pickPlayer();
        }
    },
            
    /*
     * 
     * */
    isMoveLegal     : {_type: "Method",
        _method: function(_p) {
            return true;
        }
    },
            
    /*
     * 
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});
       
       
/*
 * 
 * */
 createClass({
    _name           : "Player",
    _package        : "ticTacToe",
    
    /*
     * 
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "PlayerUi",
    _extends        : ["ticTacToe.Player"],
    _implements     : ["asg.actors.Player"],
    _package        : "ticTacToe",
    
    /*
     *
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     *
     * */            
    turn            : {_type: "Method",
        _method: function() {

        }
    },
    
    /*
     * 
     * */            
    play                : {_type: "Method", 
        _method: function(_p) {
            // Trigger the 
            if (this.game.referee.isMoveLegal()) {
                if (implements("std.proc.Event",this.game.onPlay)) {
                    this.game.onPlay.trigger({x: _p.x , y: _p.y, player: this});
                }
                this.game.referee.turnOver();
            }
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "PlayerComputer",
    _extends        : ["ticTacToe.Player"],            
    _implements     : ["asg.actors.Player"],
    _package        : "ticTacToe",
    
    /*
     *
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     *
     * */            
    turn            : {_type: "Method",
        _method: function() {

        }
    },
    
    /*
     *
     * */            
    play            : {_type: "Method",
        _method: function() {
            
        }
    }
});


/*
 * 
 * */
 createClass({
    _name           : "Move",
    _package        : "ticTacToe",
    _implements     : ["asg.actions.Move"],
    
    /*
     * 
     * */
    isAllowed       : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     * 
     * */
    execute         : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     * 
     * */
    setAction       : {_type: "Method",
        _method: function(_p) {
            
        }
    },
        
    /*
     * 
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "PutAction",
    _package        : "ticTacToe",
    _implements     : ["asg.actions.Action"],
    
    x               : {_type: "Number", _getter: true, _setter: true},
    y               : {_type: "Number", _getter: true, _setter: true},
    
    /*
     * 
     * */
    isAllowed       : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     * 
     * */
    execute         : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    /*
     * 
     * */
    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});

