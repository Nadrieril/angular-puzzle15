'use strict';

angular.module('Score', [])
.service('TimerService', function() {
    function time() {
        return new Date().getTime();
    }

    this.start = function() {
        this.running = true;
        this.startTime = time();
    };
    this.stop = function() {
        this.endTime = time();
        this.running = false;
    };
    this.reset = function() {
        this.startTime = null;
        this.endTime = null;
        this.running = false;
    };
    this.getTime = function() {
        if(!this.startTime) {
            return 0;
        } else {
            return (this.running ? time() : this.endTime) - this.startTime;
        }
    };
})
.service('ScoreService', function(TimerService) {
    this.lastScores = [];
    this.highScore = -1;

    this.startGame = function() {
        TimerService.start();
    };
    this.endGame = function(won) {
        TimerService.stop();
        if(won) {
            var score = TimerService.getTime();
            this.lastScores.push(score);
            if(this.highScore == -1 || score < this.highScore) {
                this.highScore = score;
            }
        } else {
            TimerService.reset();
        }
    };

    this.getCurrentScore = function() {
        return TimerService.getTime();
    };
    this.getHighScore = function() {
        return this.highScore;
    };
});
