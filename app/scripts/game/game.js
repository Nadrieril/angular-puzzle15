'use strict';

angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore) {

    this.getHighScore = function() {
        return parseInt($cookieStore.get('highScore')) || 0;
    };

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = GridService.getSize();

    this.reinit = function() {
        this.win = false;
        this.currentScore = 0;
        this.highScore = this.getHighScore();
    };
    this.reinit();

    this.newGame = function() {
        GridService.buildEmptyGameBoard();
        GridService.buildStartingPosition();
        this.reinit();
    };

    /*
    * The game loop
    */
    this.move = function(key) {
        var self = this;
        var f = function() {
            if(self.win) {
                return false;
            }
            var hasWon = false;
            var hasMoved = GridService.move(key);
        };
        return $q.when(f());
    };
});
