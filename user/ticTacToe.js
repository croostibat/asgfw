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
    initBoard   : {_type: "Method",
        _method: function() {
            var nbRows, nbColumns, i, j, board, slot, action;
            
            board       = this.getGame().getBoard();
            nbRows      = board.getNbRows();
            nbColumns   = board.getNbColumns();
            
            for (i = 0; i < nbRows; i++) {
                for (j = 0; j < nbColumns; j++) {
                    slot    = board.getSlot(i, j);
                    action  = new ticTacToe.ActionRemove({slot: slot});
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
            var bMatrix, i, j, legalMove;
            
            legalMove   = new std.coll.MapArray();
            bMatrix     = this.getGame().getBoard().getBoardAsMatrix();
            
            for (i = 0; i < bMatrix.length; i++) {
                for (j = 0; j < bMatrix[i].length; j++) {
                    if (bMatrix[i][j] === "") {
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

                this.getGame().getBoard().getBoardAsMatrix();
                
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
    _name           : "Player",
    _extends        : ["asg.actors.Player"],
    _package        : "ticTacToe",
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
            
            move.setAction(new ticTacToe.ActionPut({move: move, slot: slot, pawn: pawn}));
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
    _implements     : ["ticTacToe.Player"],
    _package        : "ticTacToe",
    
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
      
            var bMatrix, legalMoves, moveNb, moveXY;
            
            bMatrix     = this.getGame().getBoard().getBoardAsMatrix();
            legalMoves  = this.getGame().getReferee().getLegalMoves();
            if (legalMoves.getLength() > 0) {
                moveNb = Math.floor(Math.random() * legalMoves.getLength());     
                
                moveXY = legalMoves.get(moveNb);
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
    _implements     : ["ticTacToe.Player"],
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
    _name           : "ActionPut",
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
    _name           : "ActionRemove",
    _package        : "ticTacToe",
    _implements     : ["asgMin.actions.Action"],
    
    slot            : {_type: "asg.board.Slot", _getter: true, _setter: true, _autoSet: true},
    
    /*
     * 
     * */
    doAction        : {_type: "Method",
        _method: function() {
            if (this.slot.getOccupant() !== null) {
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
                this.callOnPlay("putPawn");
            }
        }
    }
});

