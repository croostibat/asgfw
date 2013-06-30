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
    
    draw            : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            
            var boardUiElement;
            
            if (isNumber(_p.nbRows) && isNumber(_p.nbColumns)) {
                
                this.rootUiElement = new ui.container.Row({nbColumns:2});
                
                boardUiElement = new ui.container.Grid({css: "board", nbRows:_p.nbRows, nbColumns:_p.nbColumns, panesSettings: {css: "slot", onClick: this.onSlotClick}});
                this.boardUiElement = boardUiElement;
                this.rootUiElement.getUiElement(0).addUiElement(boardUiElement);
                this.rootUiElement.getUiElement(1).addUiElement(new ui.std.Text({value:"smdlkf"}));
                this.rootUiElement.setHtmlHook(this.htmlHook);
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
    
    player1             : {_type: "asg.actors.Player", _getter: true, _autoSet: true},
    player2             : {_type: "asg.actors.Player", _getter: true, _autoSet: true},
    
    /*
     * 
     * */
    setPlayer1           : {_type: "Method",
        _method : function(_player1){
            if (implements("asg.actors.Player", _player1)) {
                _player1.setGame(this);
                _player1.setId("1");
                this.player1 = _player1;
            }
        }
    },
    
    /*
     * 
     * */
    setPlayer2           : {_type: "Method",
        _method : function(_player2){
            if (implements("asg.actors.Player", _player2)) {
                _player2.setGame(this);
                _player2.setId("2");
                this.player2 = _player2;
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
    start               : {_type: "Method", 
        _method: function(_p) {
            if (!this.getStarted()) {
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
            this.ui.setOnSlotClick(new std.proc.Event({params:this, fn:this.onSlotClickFn}));
        }
    },
    
    /*
     * 
     * */
    setGame             : {_type: "Method", _overload: true,
        _method: function(_game) {
            this.game = _game;
            _game.setOnPlay(new std.proc.Event({params:this, fn:this.onPlayFn}));
            _game.setOnPickPlayer(new std.proc.Event({params:this, fn:this.onPickPlayerFn}));
            _game.setOnTurnOver(new std.proc.Event({params:this, fn:null}));            
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
        _method: function(_params, _uiSlot) {
            var coordinate, playerTurn;
            coordinate  = _uiSlot.getPathIndex(2);
            playerTurn  = _params.getGame().getReferee().getPlayerTurn();
            if (implements("ticTacToe.PlayerUi", playerTurn)) {
                playerTurn.play({column: coordinate[1],row: coordinate[0]});
            }
        }
    },
    
    /*
     * 
     * */
    onPlayFn        : {_type: "Method",
        _method: function(_params, _p) {
            
            var boardUi    = _params.getUi().getBoardUiElement();
            var slotUi     = boardUi.getUiElement(_p.row,_p.column);

            if (_p.player.getId() === "1") {
                slotUi.setCss("slot slot_black");
            }
            else {
                slotUi.setCss("slot slot_white");
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
                    matrixBoard[i][j] = (slot.getOccupant() !== null ? slot.getOccupant().getPlayer().getId() : "");
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
    
            if (!implements("asg.actors.Player", this.playerTurn)) {
                this.setPlayerTurn(this.getGame().getPlayer1());
            }
            else {
                if (this.playerTurn.getId() === "1") {
                    this.setPlayerTurn(this.getGame().getPlayer2());
                }
                else {
                    this.setPlayerTurn(this.getGame().getPlayer1());
                }
            }
            
            if (implements("asg.actors.Player", this.getPlayerTurn())) {
                // Trigger the onChoosePlayer event
                if (implements("std.proc.Event",this.getGame().getOnPickPlayer())) {
                    this.getGame().getOnPickPlayer().trigger({player:this.getPlayerTurn()});
                }
                this.getPlayerTurn().turn();
            }
        }
    },
            
    turnOver        : {_type: "Method",
        _method: function(_p) {
            if (!this.isGameOver()) {
                this.pickPlayer();
            }
            else {
                this.setPlayerTurn(null);
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
