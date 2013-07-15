createPackage("asgMin");
createPackage("asgMin.actions");
createPackage("asgMin.board");
createPackage("asgMin.actors");
createPackage("asgMin.comp");

/*
/*
 * 
 * */
createClass({
    _name           : "Ui",
    _package        : "asgMin",
    _implements     : ["asg.Ui"],
    
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
            
            if (isNumber(_p.nbRows) && isNumber(_p.nbColumns)) {
                this.rootUi     = new ui.container.Grid({nbRows: 1, nbColumns:2});
                this.boardUi    = new ui.container.Grid({css: "board", nbRows:_p.nbRows, nbColumns:_p.nbColumns, panesSettings: {css: "slot", onClick: this.onSlotClick}});
                
                this.rootUi.getChildByPathIndex(0,0).addElement(this.boardUi);
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "btStart", label:"Start", onClick: this.getOnClickStart()}));
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "btStop", label:"Stop", onClick: this.getOnClickStop()}));
                this.rootUi.getChildByPathIndex(0,1).addElement(new ui.std.Button({id: "btInit", label:"Init", onClick: this.getOnClickInit()}));
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
    _package            : "asgMin",
    _implements         : ["asg.Controller"],
    
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
            this.game.setOnPlay(new std.proc.Event({context:this, fnName:"onPlayFn"}));
            this.game.setOnPickPlayer(new std.proc.Event({context:this, fnName:"onPickPlayerFn"}));
            this.game.setOnMessage(new std.proc.Event({context:this, fnName:"onMessageFn"}));
            this.game.setOnStart(new std.proc.Event({context:this, fnName:"onStartFn"}));
            this.game.setOnStop(new std.proc.Event({context:this, fnName:"onStopFn"}));
            this.game.setOnInit(new std.proc.Event({context:this, fnName:"onInitFn"}));
            this.game.setOnTurnOver(new std.proc.Event({context:this, fnName:null}));
            this.game.setOnGameOver(new std.proc.Event({context:this, fnName:"onGameOverFn"}));
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
            this.getGame().getReferee().start();
        }
    },
    
    /*
     * 
     * */
    onClickStopFn   : {_type: "Method",
        _method: function(_uiButton) {
            this.getGame().getReferee().stop();
        }
    },    
    
    /*
     * 
     * */
    onClickInitFn   : {_type: "Method",
        _method: function(_uiButton) {
            this.getGame().getReferee().init();
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
                    this.getUi().removePawn(_p.row, _p.column);
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
            this.getUi().addToLog("Player " + _p.player.getNumber()  + " to play!");
        }
    },
    
    /*
     * 
     * */
    onGameOverFn    : {_type: "Method", 
        _method: function(_p) {
            if (_p.result === 0) {
                this.getUi().addToLog("Game Over : draw!");
            }
            else if (_p.result > 0) {
                this.getUi().addToLog("Game Over : player " + _p.result  + " won!");
            }
            else {
                this.getUi().addToLog("The game continue!");
            }
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
            this.getUi().resetLog();
            this.getUi().addToLog("Game initted");
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
    _name               : "Referee",
    _package            : "asgMin.actors",
    _extends            : ["asg.actors.Referee"],
    _virtual            : "mixed",
    
    playerLastTurn      : {_type: "asg.actors.Player", _getter: true, _setter: true},
    started             : {_type: "Boolean"},
        
    /*
     * 
     * */    
    pickPlayer          : {_type: "Method",
        _method: function() {
            if (this.started) {
                
                this.playerTurn = this.getGame().getPlayer(implements("asg.actors.Player", this.playerTurn) ? (this.playerTurn.getNumber() % this.getGame().getNbPlayers()) + 1 : 1);
                
                if (implements("asg.actors.Player", this.playerTurn)) {
                    
                    if (implements("std.proc.Event",this.getGame().getOnPickPlayer())) {
                        this.getGame().getOnPickPlayer().trigger({player:this.getPlayerTurn()});
                    }                    
                    this.playerTurn.turn();                    
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
            
            if (state >= 0 && implements("std.proc.Event", this.getGame().getOnGameOver())) {
                this.getGame().getOnGameOver().trigger({result: state});
            }
            
            switch(state) {
                case 0: // Draw
                    this.stop();
                    break;
                case null:
                    (new std.proc.Event({fnName: "pickPlayer", context: this, async: true})).trigger();                    
                    break;
                default:
                    this.stop();
                    break;
            }
        }
    },
    
    /*
     * 
     * */            
    isStartable         : {_type: "Method", 
        _method: function(_p) {
            
            var startable, nbPlayers, i;
            
            if (implements("asg.Game", this.getGame())) {
                nbPlayers = this.getGame().getNbPlayers();
                for (i = 1; i <= nbPlayers; i++) {
                     startable = startable && implements("asg.actors.Player", this.getGame().getPlayer(i));
                }
                return startable;
            }
            return false;
        }
    },
    
    /*
     * 
     * */            
    start               : {_type: "Method", 
        _method: function(_p) {
            if (this.started !== true) {
                this.started        = true;
                this.playerTurn     = this.playerLastTurn;
                
                if (implements("std.proc.Event", this.getGame().getOnStart())) {
                    this.getGame().getOnStart().trigger();
                }
                
                this.pickPlayer();
                return true;
            }
            return false;
        }
    },
    
    /*
     * 
     * */            
    stop                : {_type: "Method", 
        _method: function(_p) {
            if (this.started === true) {
                this.started        = false;
                this.playerTurn     = null;
                
                if (implements("std.proc.Event", this.getGame().getOnStop())) {
                    this.getGame().getOnStop().trigger();
                }
                
                return true;
            }
            return false;
        }
    },
    
    /*
     * 
     * */            
    init                : {_type: "Method", 
        _method: function(_p) {
            this.stop();
            this.playerTurn     = null;
            this.playerLastTurn = null;
           
            this.initGame();
            
             if (implements("std.proc.Event", this.getGame().getOnInit())) {
                this.getGame().getOnInit().trigger();
            }
            
            return true;
        }
    }
});

/*
 * 
 * */
createClass({
    _name               : "Mind",
    _package            : "asgMin.comp",
    _extends            : ["asg.comp.Mind"],
    _virtual            : "mixed",
    
    boardMatrix         : {_type : "*", _getter: true, _autoSet: true},
    
    /*
     * 
     * */
    importData          : {_type: "Method", 
        _method: function(_board) {
            var boardMatrix = [], slot;
            
            if (implements("asgMin.board.Board", _board)) {
                for(i = 0; i < _board.getNbRows(); i++) {
                    boardMatrix[i] = [];
                    for(j = 0; j < _board.getNbColumns(); j++) {
                        slot = _board.getSlot(i,j);
                        boardMatrix[i][j] = (slot.getOccupant() !== null ? slot.getOccupant().getPlayer().getNumber() : "");
                    }
                }
                
                this.boardMatrix = boardMatrix;
                
            }
        }
    },
    
    /*
     * 
     * */
    constructor         : {_type: "Method",
        _method: function(_p) {
            if (implements("asgMin.board.Board", _p.board)) {
                this.importData(_p.board);
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
    _name			: "ActionReferee",
    _package        : "asgMin.actions",
    _extends        : ["asg.actions.ActionReferee"],
    _virtual        : "mixed",
    
    /*
     * 
     * */
    callOnPlay      : {_type: "Method",
        _method: function(_action) {
            
            var game;
            
            game = this.getGame();
            
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

