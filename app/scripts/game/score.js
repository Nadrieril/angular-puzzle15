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
.provider('ScoreService', function() {
    var service = this;

    this.lastScores = [];
    this.highScore = 0;

    this.$get = function(TimerService) {
        this.startGame = function() {
            TimerService.start();
        };
        this.endGame = function(won) {
            TimerService.stop();
            if(won) {
                var score = TimerService.getTime();
                service.lastScores.push(score);
                if(service.highScore === 0 || score < service.highScore) {
                    service.highScore = score;
                }
            }
            TimerService.reset();
        };

        this.getCurrentScore = function() {
            return TimerService.getTime();
        };
        this.getHighScore = function() {
            return service.highScore;
        };

        return this;
    };
});
