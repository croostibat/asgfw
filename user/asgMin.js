createPackage("asgMin");
createPackage("asgMin.actions");
createPackage("asgMin.board");
createPackage("asgMin.actors");

/*
/*
 * 
 * */
createClass({
    _name           : "Ui",
    _implements     : ["asg.Ui"],
    _package        : "asgMin",
    
    boardUi         : {_type: "ui.Element", _getter: true},
    
    /*
     * 
     * */
     addToLog        : {_type: "Method", 
        _method: function(_message) {
            var logUi;
            logUi = this.rootUi.getChildById("log");
            logUi.setValue(_message + "<br/>" + logUi.getValue());
            logUi.applyValues();
        }
    },
      
    /*
     * 
     * */
    draw            : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            
            var rootUi;
            
            if (isNumber(_p.nbRows) && isNumber(_p.nbColumns)) {
                this.rootUi     = new ui.container.Grid({nbRows: 1, nbColumns:2});
                this.boardUi    = new ui.container.Grid({css: "board", nbRows:_p.nbRows, nbColumns:_p.nbColumns, panesSettings: {css: "slot", onClick: this.onSlotClick}});
                
                this.rootUi.getChildByPathIndex(0,0).addElement(this.boardUi);
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Text({id: "log", value:"smdlkf"}));
                this.rootUi.setHtmlHook(this.htmlHook);
            }
        }
    }
});

/*
 * 
 * */
createClass({
    _name               : "Game",
    _package            : "asgMin",
    _implements         : ["asg.Game"],
    
    players             : {_type: "std.coll.MapArray"},
    
    /*
     * 
     * */
    setPlayer           : {_type: "Method",
        _method : function(_player, _order){
            if (implements("asg.actors.Player", _player) && isNumber(_order)) {
                _player.setGame(this);
                _player.setOrder(_order);
                this.players.set(_player, _order);
            }
        }
    },
                
    /*
     * 
     * */
    getPlayer           : {_type: "Method",
        _method : function(_order){
            if (isNumber(_order)) {
                return this.players.get(_order);
            }
            return null;
        }
    },
                
    /*
     * 
     * */
    getNbPlayers        : {_type: "Method",
        _method : function(){
            return this.players.getLength();
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
    addMove             : {_type: "Method",
        _method: function(_move) {
            this.setCurrentMove(_move);
            if (this.getFirstMove(null)) {
                this.setFirstMove(_move);
            }
        }
    },
    
    /*
     * 
     * */            
    isStartable         : {_type: "Method", 
        _method: function(_p) {
            return true;
        }
    },
    
    /*
     * 
     * */            
    start               : {_type: "Method", 
        _method: function(_p) {
            if (!this.getStarted() && this.isStartable()) {
                this.setStarted(true);
                this.getReferee().pickPlayer();
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
            this.setBoard(new asgMin.board.Board({nbColumns: _p.nbColumns, nbRows: _p.nbRows}));
            this.players = new std.coll.MapArray();
        }
    }
});

/*
 * 
 * */
 createClass({
    _name               : "Controller",
    _implements         : ["asg.Controller"],
    _package            : "asgMin",
  
    /*
     * 
     * */    
    setUi               : {_type: "Method", _overload: true,
        _method: function(_ui) {
            this.ui = _ui;            
            this.ui.setOnSlotClick(new std.proc.Event({context:this, fnName:"onSlotClickFn"}));
        }
    },
    
    /*
     * 
     * */
    setGame             : {_type: "Method", _overload: true,
        _method: function(_game) {
            this.game = _game;
            _game.setOnPlay(new std.proc.Event({context:this, fnName:"onPlayFn"}));
            _game.setOnPickPlayer(new std.proc.Event({context:this, fnName:"onPickPlayerFn"}));
            _game.setOnMessage(new std.proc.Event({context:this, fnName:"onMessageFn"}));
            _game.setOnTurnOver(new std.proc.Event({context:this, fnName:null}));
        }
    },
    
    /*
     * 
     * */
    draw                : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            if (implements("asgMin.Game",this.game) && implements("asgMin.Ui",this.ui)) {
                this.ui.draw({nbRows: this.getGame().getBoard().getNbRows(), nbColumns: this.getGame().getBoard().getNbColumns()});
            }
        }
    },
    
    /*
     * 
     * */
    onSlotClickFn   : {_type: "Method",
        _method: function(_uiSlot) {
            var coordinate, playerTurn;
            coordinate  = _uiSlot.getPathIndex(2);
            playerTurn  = this.getGame().getReferee().getPlayerTurn();
            if (implements("ticTacToe.PlayerUi", playerTurn)) {
                playerTurn.play({column: coordinate[1],row: coordinate[0]});
            }
        }
    },
    
    /*
     * 
     * */
    onPlayFn        : {_type: "Method",
        _method: function(_p) {
            
            var boardUi    = this.getUi().getBoardUi();
            var slotUi     = boardUi.getChildByPathIndex(_p.row,_p.column);

            
            slotUi.setCss("slot slot_player_"+_p.player.getOrder());
            slotUi.applyStyles();
            
            
            this.getUi().addToLog(_p.row + "," + _p.column);
        }
    },
    
    /*
     * 
     * */
    onPickPlayerFn  : {_type: "Method", 
        _method: function(_p) {
            
        }
    },
    
    onMessageFn     : {_type: "Method",
        _method: function(_p) {
            this.getUi().addToLog(_p.message);
        }
    }
});

/*
 * 
 * */
createClass({
	_name               : "Board",
	_package            : "asgMin.board",
    _extends            : ["asg.board.Board"],
    _virtual            : "mixed",
    
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
    getBoardAsMatrix    : {_type: "Method", 
        _method: function() {
            var matrixBoard = [], slot;
            
            for(i = 0; i < this.getNbRows(); i++) {
                matrixBoard[i] = [];
                for(j = 0; j < this.getNbColumns(); j++) {
                    slot = this.getSlot(i,j);
                    matrixBoard[i][j] = (slot.getOccupant() !== null ? slot.getOccupant().getPlayer().getOrder() : "");
                }
            }
            return matrixBoard;
        }
    },

    /*
     * 
     * */
	constructor         : {
        _type: "Method", _method: function(_p) {
            this.slots = new std.coll.MapArray();
            
            var i, j, id;
            
            for(i = 0; i < this.getNbRows(); i++) {
                for(j = 0; j < this.getNbColumns(); j++) {
                    id = i + "/" + j;
                    this.slots.set(new asgMin.board.Slot({id:id, row: i, column: j}), id);
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
	_package        : "asgMin.board",
    _extends        : ["asg.board.Slot"],
    _virtual        : "mixed",
    
	occupant        : {_type: "asg.pawns.Pawn", _getter:true, _setter: true},
    row             : {_type: "Number", _getter:true, _setter: true, _autoSet: true},
    column          : {_type: "Number", _getter:true, _setter: true, _autoSet: true},
    
   
    /*
     * 
     * */
     isFree          : {_type: "Method", 
        _method: function() {
            return this.getOccupant() === null;
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "Referee",
    _package        : "asgMin.actors",
    _extends        : ["asg.actors.Referee"],
    _virtual        : "mixed",
    
    /*
     * 
     * */    
    pickPlayer          : {_type: "Method",
        _method: function() {
    
            var currentPlayer   = (implements("asg.actors.Player", this.playerTurn) ? ((this.playerTurn.getOrder() + 1) % this.getGame().getNbPlayers()) : 0);
            
            this.setPlayerTurn(this.getGame().getPlayer(currentPlayer));
            if (implements("asg.actors.Player", this.getPlayerTurn())) {
                // Trigger the onChoosePlayer event
                if (implements("std.proc.Event",this.getGame().getOnPickPlayer())) {
                    this.getGame().getOnPickPlayer().trigger({player:this.getPlayerTurn()});
                }
                this.getPlayerTurn().turn();
            }
        }
    },            
    
    /*
     * 
     * */
     turnOver        : {_type: "Method",
        _method: function(_p) {
            var state = this.isGameOver();
            switch(state) {
                case -1: // Draw
                    this.getGame().getOnMessage().trigger({message: "Draw!"});
                    this.setPlayerTurn(null);
                    break;
                case null:
                    (new std.proc.Event({fnName: "pickPlayer", context: this, async: true})).trigger();
                    break;
                default:
                    this.getGame().getOnMessage().trigger({message: "Player " + state + " win!"});
                    this.setPlayerTurn(null);
                    break;
            }
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
    
    order           : {_type: "Number", _getter: true, _setter: true, _autoSet: true}
    
});
