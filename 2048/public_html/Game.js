/**
 * Game class, represents the whole game
 * @param {Object} element - DOM element for the game
 * @returns {Game}
 */
Game = function(element) {
    this.element = element;
    this.width = 4;
    this.height = 4;
    this.fields = [];
    this.done = false;
    
    // Generate fields
    for (var i = 0; i < this.width; i++) {
        this.fields[i] = [];
        for (var j = 0; j < this.height; j++) {
            this.fields[i][j] = new Field(this.element, i, j);
        }
    }
    
    // Add initial bricks
    this.addRandomBrick();
    this.addRandomBrick();
};

/**
 * Adds a brick with value 2 to a random free field
 * TODO: handle the situation, when all fields are occupied
 * @returns {undefined}
 */
Game.prototype.addRandomBrick = function() {
    var gameOver = false;
    var tryBrick = function(i, j) {
        if (this.fields[i][j].value === 0) {
            this.fields[i][j].setValue(2);
            return true;
            } else {
                return false;
            }
        return false;
    }.bind(this);
    
    if (!this.hasFreeSpace())
        gameOver = true;
    
    // if all squares are full calls gameEnd(), otherwise
    // adds a brick at a random location
    if (gameOver) {
        this.gameEnd();
    } else {
        var success = false;
        do {
         success = tryBrick(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
        } while (!success);
    }
};

Game.prototype.hasFreeSpace = function() {
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            if (this.fields[i][j].value === 0)
                return true;
        }
    }
    return false;
};

Game.prototype.gameEnd = function() {
   var s = [0,0,0,0,"G","A","M","E","O","V","E","R",0,0,0,0],
           pos = 0;
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            this.fields[i][j].setValue(s[pos]);
            pos++;
        }
    }
    this.done = true;
};

/**
 * Field class, represents one field in the game
 * @param {Object} parent - parent DOM element (the game element)
 * @param {Number} i - horizontal coordinate
 * @param {Number} j - vertical coordinate
 * @returns {Field}
 */
Field = function(parent, i, j) {
    this.x = i;
    this.y = j;
    this.element = document.createElement("div");
    this.element.className = "field";
    this.element.style.top = j * 125;
    this.element.style.left = i * 125;
    this.setValue(0);
    parent.appendChild(this.element);
};

/**
 * Set a value to the brick and displays it: 0 means empty field
 * @param {type} val
 * @returns {Field.value} previous brick value
 */
Field.prototype.setValue = function(val) {
    var lastVal = this.value;
    this.value = val;
    if (val === 0)
        this.element.innerHTML = "";
    else
        this.element.innerHTML = val;
    return lastVal;
};

/**
 * Handler for "left" user action
 * @returns {undefined}
 */
Game.prototype.left = function() {
    if (this.done) return;
    // For each row, create a strip
    for (var y = 0; y < this.height; y++) {
        var strip = [];
        // Add fields from the current row to the strip
        for (var x = 0; x < this.width; x++) {
            strip.push(this.fields[x][y]);
        }
        do {
            this.applyGravityToStrip(strip);
        } while (this.merge(strip));
    }
    this.addRandomBrick();
};

/**
 * Handler for "right" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.right = function() {
    if (this.done) return;
    
    for (var y = this.height-1; y >= 0; y--) {
        var strip = [];
        
        for (var x = this.width-1; x >= 0; x--) {
            strip.push(this.fields[x][y]);
        }
        do {
            this.applyGravityToStrip(strip);
        } while (this.merge(strip));
    }
    
    this.addRandomBrick();
};

/**
 * Handler for "top" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.top = function() {
    if (this.done) return;
    
    for (var x = 0; x < this.width; x++) {
        var strip = [];
        
        for (var y = 0; y < this.height; y++) {
            strip.push(this.fields[x][y]);
        }
        do {
            this.applyGravityToStrip(strip);
        } while (this.merge(strip));
    }
    
    this.addRandomBrick();
};

/**
 * Handler for "bottom" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.bottom = function() {
    if (this.done) return;
    
    for (var x = this.width-1; x >= 0; x--) {
        var strip = [];
        
        for (var y = this.height-1; y >= 0; y--) {
            strip.push(this.fields[x][y]);
        }
        this.applyGravityToStrip(strip);
        this.merge(strip);
        this.applyGravityToStrip(strip);
        
    }
    
    this.addRandomBrick();
};

/**
 * Takes an array of Fields and performs the gravity effect (bricks are moved to the beginning of the strip)
 * TODO: Implement merging of bricks with equal value
 * @param {Array} strip
 * @returns {undefined}
 */
Game.prototype.applyGravityToStrip = function(strip) {
    for (var i = 0; i < strip.length; i++) {
        // Go through the strip; if there is an empty field, look for the next non-empty field and bring it forward
        if (strip[i].value === 0 && i + 1 < strip.length) {
            
            // Looking for next non-empty field in the strip
            var j = i;
            while (j < strip.length && strip[j].value === 0) j++;
            
            // If next brick was found, bring it forward
            if (j < strip.length) {
                strip[i].setValue(strip[j].value);
                strip[j].setValue(0);
            }
        }
    }
};

Game.prototype.merge = function(strip) {
    var merged = false;
    console.log("Merging strip: "+JSON.stringify(strip));
    for (var i = 0; i < strip.length-1; i++) {
        if (strip[i].value !== 0 && strip[i].value === strip[i+1].value) {
            strip[i].setValue(strip[i+1].value + strip[i].value);
            strip[i+1].setValue(0);
            merged = true;
        }
    }
    console.log("Result strip: "+JSON.stringify(strip));
    return merged;
};