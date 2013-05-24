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
    _name           : "Game",
    _implements     : ["asg.Game"],
    _package        : "ticTacToe",
    
    initialize      : {_type: "Method", 
        _method: function() {

        }
    },
    
    play            : {_type: "Method", 
        _method: function(_p) {
            
        }
    },
    
    constructor     : {_type: "Method",
        _method: function(_p) {
            this.board = new asg.board.SquareBoard({side:_p.side});
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "Controller",
    _implements     : ["asg.Controller"],
    _package        : "ticTacToe",

    constructor     : {_type: "Method",
        _method: function(_p) {
            
        }
    },
    
    draw            : {_type: "Method",
        _method: function(_p) {
            _p = _p ? _p : {};
            if (implements("ticTacToe.Game",this.game) && implements("ticTacToe.Ui",this.ui)) {
                this.ui.draw({side: this.game.board.getSide(), htmlHook: _p.htmlHook});
            }
        }
    },
    
    setUi           : {_type: "Method", _overload: true,
        _method: function(_ui) {
            this.ui = _ui;
            this.ui.setOnSlotClick(new ui.Event({fn:this.onSlotClick}));
        }
    },
    
    setGame         : {_type: "Method", _overload: true,
        _method: function(_game) {
            this.game = _game;
            this.game.setOnShowMove(new std.proc.Event({fn:this.onShowMove}));
            this.game.setOnShowBoard(new std.proc.Event({fn:this.onShowBoard}));
        }
    },
    
    onSlotClick     : {_type: "Method", 
        _method: function(_p) {
            alert("ok");
        }
    },
    
    onShowMove      : {_type: "Method", 
        _method: function(_p) {
            
        }
    },
            
    onShowBoard     : {_type: "Method",
        _method: function(_p) {
            
        }
    }
});

