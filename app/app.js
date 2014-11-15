'use strict';

angular.module('puzzle15.app', [
  'ui.bootstrap'
])
.controller("mainctrl", MainCtrl)
.controller("gamectrl", GameCtrl)
;

function MainCtrl() {

}

function GameCtrl() {
    this.board = [];
    for (var i = 0; i < 4; i++) {
        this.board[i] = [];
        for (var j = 0; j < 4; j++) {
            this.board[i][j] = (4*i+j+1) % 16;
        }
    }

}
