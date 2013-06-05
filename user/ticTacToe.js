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
    
    initialize          : {_type: "Method", 
        _method: function() {
            
        }
    },
    
    /*
     * 
     * */
    setPlayer           : {_type: "Method",
        _method : function(_id, _player){
            if (implements("asg.actors.Player", _player)) {
                this.players.set(_player, _player.id);
            }
        }
    },
    
    /*
     * 
     * */            
    play                : {_type: "Method", 
        _method: function(_p) {
    
            // Trigger the 
            if (implements("std.proc.Event",this.onPlay)) {
                this.onPlay.trigger({x: _p.x , y: _p.y, player: this.playerTurn});
            }
            this.pickPlayer();
        }
    },
    
    /*
     * 
     * */    
    pickPlayer          : {_type: "Method",
        _method: function() {
            if (this.getStarted()) {
                if (!implements("asg.actors.Player", this.playerTurn)) {
                    this.playerTurn = this.players.get("B");
                }
                else {
                    if (this.playerTurn.getId() === "B") {
                        this.playerTurn = this.players.get("N");
                    }
                    else {
                        this.playerTurn = this.players.get("B");
                    }
                }
                 
                if (implements("asg.actors.Player", this.playerTurn)) {
                    // Trigger the onChoosePlayer event
                    if (implements("std.proc.Event",this.onPickPlayer)) {
                        this.onPickPlayer.trigger({player:this.playerTurn});
                    }
                    this.playerTurn.turn();
                }
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
                this.pickPlayer();
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
            this.board      = new asg.board.SquareBoard({side:_p.side});
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
            this.ui.setOnSlotClick(new std.proc.Event({context:this, fn:this.onSlotClick}));
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
        }
    },
    
    /*
     * 
     * */
    onSlotClick         : {_type: "Method", 
        _method: function(_uiSlot) {
            var coordinate = _uiSlot.getCoordinate().split(",");
            this.context.game.play({x: coordinate[0],y: coordinate[1]});
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
    turn            : {_type: "Method",
        _method: function() {

        }
    },
    play            : {_type: "Method",
        _method: function() {

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
    turn            : {_type: "Method",
        _method: function() {

        }
    },
    play            : {_type: "Method",
        _method: function() {
            
        }
    }
});