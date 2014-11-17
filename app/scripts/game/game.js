'use strict';

angular.module('Game', ['Grid', 'Score', 'ngCookies', 'Settings'])
.service('GameManager', function($q, $timeout, GridService, $cookieStore, ScoreService, SettingsService) {
    this.grid = GridService.grid;
    this.tiles = GridService.tiles;
    this.gameSize = GridService.getSize();
    // this.spaceDown = false;
    this.win = false;
    this.playing = false;

    this.getHighScore = function() {
        // return parseInt($cookieStore.get('highScore')) || 0;
        return ScoreService.getHighScore();
    };
    this.getCurrentScore = function() {
        return ScoreService.getCurrentScore();
    };
    this.settings = SettingsService;

    this.initGame = function() {
        this.win = false;
        this.playing = false;
        ScoreService.endGame(false);
        GridService.buildEmptyGameBoard();
        GridService.buildStartingPosition();
    };

    this.startGame = function() {
        this.playing = true;
        ScoreService.startGame();
    };

    this.newGame = function() {
        this.initGame();
        this.startGame();
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
                        self.initGame();
                        // self.spaceDown = true;
                    // }
                // } else {
                    // self.spaceDown = false;
                    // ScoreService.startGame();
                }
            } else if(!self.win) {
                if(!self.playing) {
                    self.startGame();
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
