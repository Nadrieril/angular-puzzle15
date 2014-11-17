'use strict';

angular
.module('puzzle15App', ['Game', 'Grid', 'Keyboard', 'ngAnimate', 'ngCookies'])
.config(function(GridServiceProvider) {
    GridServiceProvider.setSize(4);
})
.controller('GameController', function(GameManager, KeyboardService, $interval) {
    this.game = GameManager;

    this.startGame = function() {
        KeyboardService.init();
        var self = this;
        KeyboardService.on(function(key, evt) {
            self.game.keyEvt(key, evt);
        });
    };

    this.newGame = function() {
        this.game.initGame();
    };

    this.updateScores = function() {
        this.currentScore = this.game.getCurrentScore();
        this.highScore = this.game.getHighScore();
    };

    this.startGame();
    this.newGame();
    $interval(_.bind(this.updateScores, this), 63);
});
