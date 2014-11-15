'use strict';

angular.module('Grid', [])
.factory('TileModel', function() {
    var Tile = function(pos, val) {
        this.x      = pos.x;
        this.y      = pos.y;
        this.value  = val;

        this.id = ""+val; // Somehow fails when id is int
    };

    Tile.prototype.updatePosition = function(newPosition) {
        this.x = newPosition.x;
        this.y = newPosition.y;
    };

    Tile.prototype.getPosition = function() {
        return {
            x: this.x,
            y: this.y
        };
    };

    return Tile;
})
.provider('GridService', function() {
    this.size = 4; // Default size
    this.startingTileNumber = 2; // default starting tiles

    this.setSize = function(sz) {
        this.size = sz ? sz : 0;
    };

    this.setStartingTiles = function(num) {
        this.startingTileNumber = num;
    };

    var service = this;

    this.$get = function(TileModel) {
        this.grid   = [];
        this.tiles  = [];

        // Private things
        var vectors = {
            'left': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'up': { x: 0, y: -1 },
            'down': { x: 0, y: 1 }
        };

        this.getSize = function() {
            return service.size;
        };

        // Build game board
        this.buildEmptyGameBoard = function() {
            var self = this;
            // Initialize our grid
            for (var x = 0; x < service.size * service.size; x++) {
                this.grid[x] = null;
            }

            this.forEach(function(x,y) {
                self.setCellAt({x:x,y:y}, null);
            });
        };

        /*
        * Build the initial starting position
        */
        this.buildStartingPosition = function() {
            var self = this;
            this.forEach(function(x,y) {
                var val = (y*service.size+x+1) % (service.size * service.size);
                if(val === 0) {
                    self.setCellAt({x:x,y:y}, null);
                    service.emptyTilePos = {x:x,y:y};
                } else {
                    var tile = service.newTile({x:x,y:y}, val);
                    self.setCellAt({x:x,y:y}, tile);
                }
            });
        };

        this.move = function(key) {
            var vector = vectors[key];
            var neighbourPos = {
                x: this.emptyTilePos.x + vector.x,
                y: this.emptyTilePos.y + vector.y
            };
            if(!this.withinGrid(neighbourPos)) {
                return false;
            } else {
                var neighbour = this.getCellAt(neighbourPos);
                this.moveTile(neighbour, this.emptyTilePos);
                this.emptyTilePos.y += vector.y;
                this.emptyTilePos.x += vector.x;
                return true;
            }
        };


        /*
        * Is the position within the grid?
        */
        this.withinGrid = function(cell) {
            return cell.x >= 0 && cell.x < this.size &&
            cell.y >= 0 && cell.y < this.size;
        };


        /*
        * Get a cell at a position
        */
        this.getCellAt = function(pos) {
            if (this.withinGrid(pos)) {
                var x = this._coordinatesToPosition(pos);
                return this.tiles[x];
            } else {
                return null;
            }
        };

        /*
        * Set a cell at position
        */
        this.setCellAt = function(pos, tile) {
            if (this.withinGrid(pos)) {
                var xPos = this._coordinatesToPosition(pos);
                this.tiles[xPos] = tile;
                if(tile !== null) {
                    tile.updatePosition(pos);
                }
            }
        };

        this.moveTile = function(tile, newPosition) {
            this.setCellAt(tile.getPosition(), null);
            this.setCellAt(newPosition, tile);
        };

        /*
        * Run a callback for every cell
        * either on the grid or tiles
        */
        this.forEach = function(cb) {
            var totalSize = service.size * service.size;
            for (var i = 0; i < totalSize; i++) {
                var pos = this._positionToCoordinates(i);
                cb(pos.x, pos.y, this.tiles[i]);
            }
        };

        /*
        * Helper to convert x to x,y
        */
        this._positionToCoordinates = function(i) {
            var x = i % service.size,
            y = (i - x) / service.size;
            return {
                x: x,
                y: y
            };
        };

        /*
        * Helper to convert coordinates to position
        */
        this._coordinatesToPosition = function(pos) {
            return (pos.y * service.size) + pos.x;
        };

        /*
        * Insert a new tile
        */
        this.insertTile = function(tile) {
            var pos = this._coordinatesToPosition(tile);
            this.tiles[pos] = tile;
        };

        this.newTile = function(pos, value) {
            return new TileModel(pos, value);
        };

        /*
        * Same position
        */
        this.samePositions = function(a, b) {
            return a.x === b.x && a.y === b.y;
        };

        return this;
    };
});
