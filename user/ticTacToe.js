createPackage("ticTacToe");

/*
 * 
 * */
 createClass({
    _name           : "Referee",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actors.Referee"],
          
    /*
     * 
     * */
    initGame    : {_type: "Method",
        _method: function() {
            var nbRows, nbColumns, i, j, board, slot, action, game;
            
            game        = this.getGame();
            board       = this.getGame().getBoard();
            nbRows      = board.getNbRows();
            nbColumns   = board.getNbColumns();
            
            for (i = 0; i < nbRows; i++) {
                for (j = 0; j < nbColumns; j++) {
                    slot    = board.getSlot(i, j);
                    action  = new ticTacToe.ActionFreeSlot({game: game, slot: slot});
                    action.doAction();
                }
            }
        }
    },
            
    /*
     * 
     * */
    getLegalMoves   : {_type: "Method",
        _method: function() {
            var mind = new ticTacToe.Mind({board: this.getGame().getBoard()});
            return mind.getLegalMoves();
        }
    },
    
    /*
     * 
     * */
    isMoveLegal     : {_type: "Method",
        _method: function(_move, _direct) {
            var mind,action, slot;
            if (_direct) {
                action = _move.getAction();
                if (implements("asg.actions.Action", action)) {                
                    slot = action.getSlot();
                    return slot.isFree();
                }
                return false;
            }
            else {
                if (implements("asg.actions.Move", _move)) {
                    action = _move.getAction();
                    if (implements("asg.actions.Action", action)) {
                        slot = action.getSlot();
                        mind = new ticTacToe.Mind({board: this.getGame().getBoard()});
                        return mind.getLegalMoves(slot.getRow(), slot.getColumn());
                    }
                }
            }
        }
    },
    
    /*
     * 
     * */
    isGameOver      : {_type: "Method",
        _method: function() {
            var move, action, slot, column, row, i, nbRows, nbColumns, win, player;
            
            move        = this.getGame().getCurrentMove();
            action      = (move ? move.getAction() : null);
            slot        = (action ? action.getSlot() : null);
            player      = (slot ? slot.getOccupant().getPlayer() : null);
            
            if (player) {
                
                column      = slot.getColumn();
                row         = slot.getRow();
                nbRows      = this.getGame().getBoard().getNbRows();
                nbColumns   = this.getGame().getBoard().getNbColumns();
                
                win = true;
                for(i = 0; i < nbColumns; i++) {
                    slot    = this.getGame().getBoard().getSlot(row,i);
                    if (slot.getOccupant() !== null) {
                        win     = win && (slot.getOccupant().getPlayer().getNumber() === player.getNumber());
                    }
                    else {
                        win     = false;
                    }
                }

                if (!win) {
                    win = true;
                    for(i = 0; i < nbRows; i++) {
                        slot    = this.getGame().getBoard().getSlot(i,column);
                        if (slot.getOccupant() !== null) {
                            win     = win && (slot.getOccupant().getPlayer().getNumber() === player.getNumber());
                        }
                        else {
                            win     = false;
                        }
                    }
                }
                return (win ? player.getNumber() : (this.getLegalMoves().getLength() === 0 ? 0 : null));
            }
            return null;
        }
    }    
});


/*
 * 
 * */
createClass({
    _name               : "Mind",
    _package            : "ticTacToe",
    _implements         : ["asgMin.comp.Mind"],
    
    /*
     * 
     * */
    getLegalMoves       : {_type: "Method",
        _method: function() {
             var i, j, legalMove;
            
            legalMove   = new std.coll.IdxArray();
            for (i = 0; i < this.boardMatrix.length; i++) {
                for (j = 0; j < this.boardMatrix[i].length; j++) {
                    if (this.boardMatrix[i][j] === "") {
                        legalMove.add({row: i, column: j});
                    }
                 }
            }
            return legalMove;
        }
    },
    
    /*
     * 
     * */
    isMoveLegal         : {_type: "Method",
        _method: function(_row, _column) {
            if (isDefined(this.boardMatrix[_row])) {
                return this.boardMatrix[_row][_column] === "";
            }
            return false;
        }
    },

    /*
     * 
     * */
    isGameOver          : {_type: "Method",
        _method: function() {
            
            var win, occupant;
            
            for (i = 0; i < this.boardMatrix.length; i++) {
                for (j = 0; j < this.boardMatrix[i].length; j++) {
                    if (this.boardMatrix[i][j] === "") {
                        legalMove.add({row: i, column: j});
                    }
                 }
            }
            
            return (win ? player.getNumber() : (this.getLegalMoves().getLength() === 0 ? 0 : null));
    
        }
    },

    /*
     * 
     * */
    findBestMove        : {_type: "Method",
        _method: function() {
            var legalMoves, moveNb, moveXY;
            
            legalMoves  = this.getLegalMoves();
            if (legalMoves.getLength() > 0) {
                moveNb = Math.floor(Math.random() * legalMoves.getLength());     
                
                moveXY = legalMoves.get(moveNb);
                
                return {row:moveXY.row, column: moveXY.column};
            }
        }
    }
    
});

/*
 * 
 * */
 createClass({
    _name           : "Player",
    _package        : "ticTacToe",
    _extends        : ["asg.actors.Player"],
    _virtual        : "mixed",
    
    /*
     * 
     * */            
    doMove          : {_type: "Method", 
        _method: function(_p) {
            var move,slot,pawn,action;
            
            slot    = this.getGame().getBoard().getSlot(_p.row, _p.column);
            move    = new asgMin.actions.Move({player: this});
            pawn    = new asg.pawns.Pawn({player: this});
            
            move.setAction(new ticTacToe.ActionPutPawn({move: move, slot: slot, pawn: pawn}));
            // Trigger the 
            if (this.getGame().getReferee().isMoveLegal(move)) {                
                move.doMove();               
                this.getGame().addMove(move);
                this.getGame().getReferee().turnOver();
                return true;
            }
            return false;
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "PlayerComputer",
    _package        : "ticTacToe",
    _implements     : ["ticTacToe.Player"],
    
    /*
     *
     * */            
    turn            : {_type: "Method",
        _method: function() {
            this.play();
        }
    },
    
    /*
     * 
     * */            
    play                : {_type: "Method",  
        _method: function() {
            
            var mind, moveXY;
                    
            mind    = new ticTacToe.Mind({board: this.getGame().getBoard()});
            moveXY  = mind.findBestMove();
            if (moveXY) {
                this.doMove({row:moveXY.row, column: moveXY.column});
            }
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "PlayerUi",
    _package        : "ticTacToe",
    _implements     : ["ticTacToe.Player"],

    
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
        _method: function(_p) {
            this.doMove({row:_p.row, column: _p.column});
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "ActionPutPawn",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actions.ActionPlayer"],
    
    slot            : {_type: "asg.board.Slot", _getter: true, _setter: true, _autoSet: true},
    pawn            : {_type: "asg.pawns.Pawn", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    doAction        : {_type: "Method",
        _method: function() {
            if (this.pawn !== null) {
                this.slot.setOccupant(this.pawn);
                this.callOnPlay("putPawn");
            }
        }
    },
    
    /*
     * 
     * */
    undoAction      : {_type: "Method",
        _method: function(_p) {
            if (this.slot.getOccupant() !== null) {
                this.slot.setOccupant(null);
                this.callOnPlay("removePawn");
            }
        }
    }
});

/*
 * 
 * */
 createClass({
    _name           : "ActionFreeSlot",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actions.ActionReferee"],
    
    slot            : {_type: "asg.board.Slot", _getter: true, _setter: true, _autoSet: true},
    pawn            : {_type: "asg.pawns.Pawn"},
    
    /*
     * 
     * */
    doAction        : {_type: "Method",
        _method: function() {
            if (this.slot.getOccupant() !== null) {
                this.pawn   = this.slot.getOccupant();
                this.slot.setOccupant(null);
                this.callOnPlay("removePawn");
            }
        }
    },
    
    /*
     * 
     * */
    undoAction      : {_type: "Method",
        _method: function(_p) {
             if (this.pawn !== null) {
                this.slot.setOccupant(this.pawn);
                this.pawn = null;
                this.callOnPlay("putPawn");
            }
        }
    }
});
