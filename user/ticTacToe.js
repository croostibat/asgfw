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
            if (isNumber(_p.nbRows) && isNumber(_p.nbColumns)) {
                var slotsSettings = {
                    class       : "slot",
                    onClick     : this.onSlotClick
                };
                this.uiElement = new ui.container.PanesS({class: "board", nbRows:_p.nbRows, nbColumns:_p.nbColumns, panesSettings: slotsSettings});
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
    _implements         : ["asgMin.Game"],
    _package            : "ticTacToe",
    
    /*
     * 
     * */
    addMove             : {_type: "Method",
        _method: function(_move) {
            this.setCurrentMove(_move);
            this.setFirstMove(_move);
        }
    },
    
    /*
     * 
     * */
    constructor         : {_type: "Method",
        _method: function(_p) {
            this.board      = new ticTacToe.Board({nbColumns: _p.nbColumns, nbRows: _p.nbRows});
            this.players    = new std.coll.MapArray();
        }
    }
});

/*
 * 
 * */
 createClass({
    _name               : "Controller",
    _implements         : ["asgMin.Controller"],
    _package            : "ticTacToe",
    
    /*
     * 
     * */
    draw                : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            if (implements("ticTacToe.Game",this.game) && implements("ticTacToe.Ui",this.ui)) {
                this.ui.draw({nbRows: this.game.board.getNbRows(), nbColumns: this.game.board.getNbColumns(), htmlHook: _p.htmlHook});
            }
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
                playerTurn.play({column: parseInt(coordinate[0]),row: parseInt(coordinate[1])});
            }
        }
    },
    
    /*
     * 
     * */
    onPlayFn        : {_type: "Method",
        _method: function(_p) {
            
            var boardUi    = this.context.ui.getUiElement();
            var slotUi     = boardUi.getPane(_p.column, _p.row);
            
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
    
    nbColumns           : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    nbRows              : {_type: "Number", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
     getSlot            : {_type: "Method",
        _method: function(_row, _column) {
            return this.slots.get(_row + "/" + _column);
        }
    },
            
    
    /*
     * 
     * */
	constructor         : {
        _type: "Method", _method: function(_p) {
            this.slots  =  new std.coll.MapArray();
            
            var i, j, id;
            
            for(i = 0; i < this.nbRows; i++) {
                for(j = 0; j < this.nbColumns; j++) {
                    id = i + "/" + j;
                    this.slots.set(new asgMin.board.Slot({id:id}), id);
                }
            }
        }
	}
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
        _method: function(_move) {
            var action, slot;

            action = _move.getAction();
            if (implements("asg.actions.Action", action)) {                
                slot = action.getSlot();
                return slot.isFree();
            }
            return false;
        }
    },
            
    /*
     * 
     * */
    isGameOver      : {_type: "Method",
        _method: function(_move) {
            var action, slot;

            action = _move.getAction();
            if (implements("asg.actions.Action", action)) {                
                slot = action.getSlot();
                return slot.isFree();
            }
            return false;
        }
    }    
});

/*
 * 
 * */
 createClass({
    _name           : "PlayerUi",
    _implements     : ["asg.actors.Player"],
    _package        : "ticTacToe",
    
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
            var move,slot,pawn,action;

            move    = new ticTacToe.Move();
            slot    = this.game.board.getSlot(_p.row, _p.column);
            pawn    = new asg.pawns.Pawn();
            
            move.setAction(new ticTacToe.ActionPut({move: move, slot: slot, pawn: pawn}));
            
            // Trigger the 
            if (this.game.referee.isMoveLegal(move)) {
                
                move.execute();
                
                this.game.addMove(move);
                
                if (implements("std.proc.Event",this.game.onPlay)) {
                    this.game.onPlay.trigger({column: _p.column , row: _p.row, player: this});
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
    _name           : "Move",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actions.Move"],
    
    /*
     * 
     * */
    execute         : {_type: "Method",
        _method: function(_p) {
            if (implements("asg.actions.Action", this.action)) {                
                this.action.execute();
            }
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "ActionPut",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actions.Action"],
    
    slot            : {_type: "asg.board.Slot", _getter: true, _setter: true, _autoSet: true},
    pawn            : {_type: "asg.pawns.Pawn", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    execute         : {_type: "Method",
        _method: function() {
            this.slot.setOccupant(this.pawn);
        }
    },
    
    /*
     * 
     * */
    undo            : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});

