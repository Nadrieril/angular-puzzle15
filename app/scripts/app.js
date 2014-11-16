'use strict';

angular
.module('twentyfourtyeightApp', ['Game', 'Grid', 'Keyboard', 'ngAnimate', 'ngCookies'])
.config(function(GridServiceProvider) {
    GridServiceProvider.setSize(2);
})
.controller('GameController', function(GameManager, KeyboardService) {
    this.game = GameManager;

    this.startGame = function() {
        KeyboardService.init();
        var self = this;
        KeyboardService.on(function(key, evt) {
            self.game.keyEvt(key, evt);
        });
    };

    this.newGame = function() {
        this.game.newGame();
    };

    this.startGame();
    this.newGame();
});
