'use strict';

angular.module('Game', ['Grid', 'Score', 'ngCookies'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore, ScoreService) {

    this.getHighScore = function() {
        // return parseInt($cookieStore.get('highScore')) || 0;
        return ScoreService.getHighScore();
    };
    this.getCurrentScore = function() {
        return ScoreService.getCurrentScore();
    };

    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = GridService.getSize();
    // this.spaceDown = false;

    this.reinit = function() {
        this.win = false;
        this.playing = false;
        this.currentScore = 0;
        this.highScore = this.getHighScore();
    };
    this.reinit();

    this.newGame = function() {
        this.reinit();
        GridService.buildEmptyGameBoard();
        GridService.buildStartingPosition();
        ScoreService.startGame();
    };

    /*
    * The game loop
    */
    this.keyEvt = function(key, evt) {
        var self = this;
        var f = function() {
            if(key == 'space') {
                if(evt.type == 'keydown') {
                    // if(!self.spaceDown) {
                        self.reinit();
                        GridService.buildEmptyGameBoard();
                        GridService.buildStartingPosition();
                        ScoreService.endGame(false);
                        // self.spaceDown = true;
                    // }
                // } else {
                    // self.spaceDown = false;
                    // ScoreService.startGame();
                }
            } else if(!self.win) {
                if(!self.playing) {
                    ScoreService.startGame();
                    self.playing = true;
                }
                GridService.move(key);
            }

            if(GridService.hasWon()) {
                ScoreService.endGame(true);
                self.win = true;
            }
        };
        return $q.when(f());
    };
});
