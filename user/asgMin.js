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
     resetLog       : {_type: "Method", 
        _method: function(_message) {
            var logUi;
            logUi = this.rootUi.getChildById("log");
            logUi.setValue("");
            logUi.applyValues();
        }
    },
    
    putPawn         : {_type: "Method", 
        _method: function(_row, _column, _playerNumber) {
            var slotUi;
            slotUi = this.getBoardUi().getChildByPathIndex(_row,_column);
            slotUi.setCss("slot slot_player_"+_playerNumber);
            slotUi.applyStyles();
        }
    },
    
            
    removePawn      : {_type: "Method", 
        _method: function(_row, _column) {
            var slotUi;
            slotUi = this.getBoardUi().getChildByPathIndex(_row,_column);
            slotUi.setCss("slot");
            slotUi.applyStyles();
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
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "bt", label:"Start", onClick: this.getOnClickStart()}));
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "bt", label:"Stop", onClick: this.getOnClickStop()}));
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "bt", label:"Init", onClick: this.getOnClickInit()}));
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Text({id: "log", value:""}));
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
        _method : function(_player, _number){
            if (implements("asg.actors.Player", _player) && isNumber(_number) && _number >= 1) {
                _player.setGame(this);
                _player.setNumber(_number);
                this.players.set(_player, _number);
            }
        }
    },
                
    /*
     * 
     * */
    getPlayer           : {_type: "Method",
        _method : function(_number){
            if (isNumber(_number)) {
                return this.players.get(_number);
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
            
            var startable, nbPlayers, i;
            
            startable = true && implements("asgMin.actors.Referee", this.referee);
            nbPlayers = this.getNbPlayers();
            
            for (i = 1; i <= nbPlayers; i++) {
                 startable = startable && implements("asg.actors.Player", this.getPlayer(i));
            }
           
                
            return startable;
        }
    },
    
    /*
     * 
     * */            
    start               : {_type: "Method", 
        _method: function(_p) {
            if (!this.getStarted() && this.isStartable()) {
                this.setStarted(true);
                if (implements("std.proc.Event", this.onStart)) {
                    this.onStart.trigger();
                }
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
                if (implements("std.proc.Event", this.onStop)) {
                    this.onStop.trigger();
                }
             }
        }
    },
    
    /*
     * 
     * */            
    init                : {_type: "Method", 
        _method: function(_p) {
            if (implements("std.proc.Event", this.onInit)) {
                
                this.stop();
                this.getReferee().initBoard();
                
                this.onInit.trigger();
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
            this.ui.setOnClickStart(new std.proc.Event({context:this, fnName:"onClickStartFn"}));
            this.ui.setOnClickStop(new std.proc.Event({context:this, fnName:"onClickStopFn", async: true}));
            this.ui.setOnClickInit(new std.proc.Event({context:this, fnName:"onClickInitFn", async: true}));
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
            _game.setOnStart(new std.proc.Event({context:this, fnName:"onStartFn"}));
            _game.setOnStop(new std.proc.Event({context:this, fnName:"onStopFn"}));
            _game.setOnInit(new std.proc.Event({context:this, fnName:"onInitFn"}));
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
    onClickStartFn  : {_type: "Method",
        _method: function(_uiButton) {
            this.getGame().start();
        }
    },
    
    /*
     * 
     * */
    onClickStopFn   : {_type: "Method",
        _method: function(_uiButton) {
            this.getGame().stop();
        }
    },    
    
    /*
     * 
     * */
    onClickInitFn   : {_type: "Method",
        _method: function(_uiButton) {
            this.getGame().init();
            this.getUi().resetLog();
        }
    },
    
    /*
     * 
     * */
    onPlayFn        : {_type: "Method",
        _method: function(_p) {
            switch(_p.action) {
                case "putPawn":                    
                    this.getUi().putPawn(_p.row, _p.column, _p.playerNumber);
                    break;
                case "removePawn":
                    this.getUi().removePawn(_p.row, _p.column, _p.playerNumber);
                    break;
            }
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
    
    /*
     * 
     * */
    onMessageFn     : {_type: "Method",
        _method: function(_p) {
            this.getUi().addToLog(_p.message);
        }
    },
    
    /*
     * 
     * */
    onStartFn       : {_type: "Method",
        _method: function(_p) {
            this.getUi().addToLog("Game started");
        }
    },
    
    /*
     * 
     * */
    onStopFn        : {_type: "Method",
        _method: function(_p) {
            this.getUi().addToLog("Game stopped");
        }
    },
    
    /*
     * 
     * */
    onInitFn        : {_type: "Method",
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
                    matrixBoard[i][j] = (slot.getOccupant() !== null ? slot.getOccupant().getPlayer().getNumber() : "");
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
            var currentPlayer;
            
            if (this.getGame().getStarted()) {
                currentPlayer = (implements("asg.actors.Player", this.playerTurn) ? (this.playerTurn.getNumber() % this.getGame().getNbPlayers()) + 1 : 1);
                this.setPlayerTurn(this.getGame().getPlayer(currentPlayer));
                if (implements("asg.actors.Player", this.getPlayerTurn())) {
                    // Trigger the onChoosePlayer event
                    if (implements("std.proc.Event",this.getGame().getOnPickPlayer())) {
                        this.getGame().getOnPickPlayer().trigger({player:this.getPlayerTurn()});
                    }
                    this.getPlayerTurn().turn();
                }
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
                case 0: // Draw
                    this.getGame().getOnMessage().trigger({message: "Draw!"});
                    this.getGame().stop();
                    break;
                case null:
                    (new std.proc.Event({fnName: "pickPlayer", context: this, async: true})).trigger();                    
                    break;
                default:
                    this.getGame().getOnMessage().trigger({message: "Player " + state + " win!"});
                    this.getGame().stop();
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
    
    action          : {_type: "asg.actions.Action", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    doMove         : {_type: "Method",
        _method: function(_p) {
            if (implements("asg.actions.Action", this.action)) {                
                this.action.doAction();
            }
        }
    },
    
    /*
     * 
     * */
    undoMove       : {_type: "Method",
        _method: function(_p) {
            if (implements("asg.actions.Action", this.action)) {                
                this.action.undoAction();
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
    
    action          : {_type: "asg.actions.Action", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    doMove         : {_type: "Method",
        _method: function(_p) {
            if (implements("asg.actions.Action", this.action)) {                
                this.action.doAction();
            }
        }
    },
    
    /*
     * 
     * */
    undoMove       : {_type: "Method",
        _method: function(_p) {
            if (implements("asg.actions.Action", this.action)) {                
                this.action.undoAction();
            }
        }
    }          
});

/*
 * 
 * */
createClass({
    _name			: "Action",
    _package        : "asgMin.actions",
    _extends        : ["asg.actions.Action"],
    _virtual        : "mixed",
    
    /*
     * 
     * */
    callOnPlay      : {_type: "Method",
        _method: function(_action) {
            
            if ("std.proc.Event", game.getOnPlay()) {
                game.getOnPlay().trigger({action: _action, row: this.getSlot().getRow(), column: this.getSlot().getColumn()});
            }
        }
    }
});

/*
 * 
 * */
createClass({
    _name			: "ActionPlayer",
    _package        : "asgMin.actions",
    _extends        : ["asg.actions.ActionPlayer"],
    _virtual        : "mixed",
    
    /*
     * 
     * */
    callOnPlay      : {_type: "Method",
        _method: function(_action) {
            var game,player;
            
            player  = this.getMove().getPlayer();
            game    = player.getGame();
            if ("std.proc.Event", game.getOnPlay()) {
                game.getOnPlay().trigger({action: _action, playerNumber: player.getNumber(), row: this.getSlot().getRow(), column: this.getSlot().getColumn()});
            }
        }
    }
});

