'use strict';

angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore) {

    this.getHighScore = function() {
        return parseInt($cookieStore.get('highScore')) || 0;
    };

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = GridService.getSize();
    this.spaceDown = false;

    this.reinit = function() {
        this.win = false;
        this.currentScore = 0;
        this.highScore = this.getHighScore();
    };
    this.reinit();

    this.newGame = function() {
        this.reinit();
        GridService.buildEmptyGameBoard();
        GridService.buildStartingPosition();
    };

    /*
    * The game loop
    */
    this.keyEvt = function(key, evt) {
        var self = this;
        var f = function() {
            if(self.win) {
                return false;
            }
            var hasWon = false;
            var hasMoved = false;

            if(key != 'space') {
                hasMoved = GridService.move(key);
            } else {
                if(evt.type == 'keydown') {
                    if(!self.spaceDown) {
                        self.reinit();
                        GridService.buildEmptyGameBoard();
                        GridService.buildStartingPosition();
                        self.spaceDown = true;
                    }
                } else {
                    self.spaceDown = false;
                }
            }

        };
        return $q.when(f());
    };
});
