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
                this.uiElement = new ui.container.PanesS({class: "board", nbRows:_p.side, nbColumns:_p.side, panesSettings:{class: "slot"}});
                this.uiElement.setHtmlHook(_p.htmlHook);
            }
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
        _method: function() {

        }
    },

    constructor     : {_type: "Method",
        _method: function(_p) {
            this.board = new asg.board.SquareBoard({side:_p.side});
        }
    }
});
