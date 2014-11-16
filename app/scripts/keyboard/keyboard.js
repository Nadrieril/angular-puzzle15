'use strict';

angular.module('Keyboard', [])
.service('KeyboardService', function($document) {
    var keyboardMap = {
        'keydown': {
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        },
        'keyup': {
            32: 'space'
        }
    };

    function grabKeys(evtname, keymap, callback) {
        $document.bind(evtname, function(evt) {
            var key = keymap[evt.which];

            if (key) {
                // An interesting key was pressed
                evt.preventDefault();
                callback(key, evt);
            }
        });
    }

    this.init = function() {
        var self = this;
        this.keyEventHandlers = [];

        var callback = _.bind(self._handleKeyEvent, self);
        grabKeys('keydown', keyboardMap.keydown, callback);
        grabKeys('keyup', keyboardMap.keyup, callback);
    };

    this.on = function(cb) {
        this.keyEventHandlers.push(cb);
    };

    this._handleKeyEvent = function(key, evt) {
        var callbacks = this.keyEventHandlers;
        if (!callbacks) {
            return;
        }

        evt.preventDefault();

        if (callbacks) {
            for (var x = 0; x < callbacks.length; x++) {
                var cb = callbacks[x];
                cb(key, evt);
            }
        }
    };

});
