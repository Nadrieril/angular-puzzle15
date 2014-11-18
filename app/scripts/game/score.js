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
.service('MovesCountService', function() {
    this.start = function() {
        this.running = true;
        this.count = 0;
    };
    this.stop = function() {
        this.running = false;
    };
    this.reset = function() {
        this.running = false;
        this.count = 0;
    };
    this.moved= function() {
        if(this.running)
            this.count++;
    };
    this.getCount = function() {
        return this.count;
    };
})
.service('ScoreService', function(TimerService, MovesCountService) {
    this.lastScores = [];
    this.highScore = {'time':-1, 'moves':-1};

    this.startGame = function() {
        TimerService.start();
        MovesCountService.start();
    };
    this.endGame = function(won) {
        TimerService.stop();
        MovesCountService.stop();
        if(won) {
            var score = this.getCurrentScore();
            this.lastScores.push(score);
            if(this.highScore.time == -1 || score.time < this.highScore.time) {
                this.highScore.time = score.time;
            }
            if(this.highScore.moves == -1 || score.moves < this.highScore.moves) {
                this.highScore.moves = score.moves;
            }
        } else {
            TimerService.reset();
            MovesCountService.reset();
        }
    };

    this.moved = function() {
        MovesCountService.moved();
    };

    this.getCurrentScore = function() {
        return {
            'time':TimerService.getTime(),
            'moves':MovesCountService.getCount()
        };
    };
    this.getHighScore = function() {
        return this.highScore;
    };
});
