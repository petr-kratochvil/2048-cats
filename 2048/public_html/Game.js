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
    this.won = false;
    this.emptyFieldsCount = this.width * this.height;
    
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
    
    this.go = document.createElement("div");
    this.go.className = "gameOver";
    this.element.appendChild(this.go);
};

Game.prototype.clear = function() {
    this.emptyFieldsCount = this.width * this.height;
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
            this.fields[i][j].setValue(0);
        }
    }
};

/**
 * Merges moving into static
 * @param {Field} moving
 * @param {Field} static
 * @returns {undefined}
 */
Game.prototype.mergeBricks = function(moving, static) {
    var newValue = static.value * 2;
    static.setValue(newValue);
    moving.setValue(0);
    this.emptyFieldsCount++;
    if (newValue === 1024 && !this.won) {
        this.performWin();
    }
};

/**
 * Adds a brick with value 2 to a random free field
 * TODO: handle the situation, when all fields are occupied
 * @returns {undefined}
 */
Game.prototype.addRandomBrick = function() {
    if (this.emptyFieldsCount <= 0)
        return;
    var tryBrick = function(i, j) {
        if (this.fields[i][j].value === 0) {
            this.fields[i][j].setValue(2);
            this.emptyFieldsCount--;
            return true;
        } else {
            return false;
        }
    }.bind(this);
    
    var success = false;
    do {
        success = tryBrick(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
    } while (!success);
};

Game.prototype.performEndGame = function() {
    this.element.style.opacity = "0.5";
    this.go.style.opacity = "0";
    this.go.style.backgroundImage = "url(img/end"+Math.floor(Math.random()*5+1)+".jpg)";
    setTimeout(function() {
        this.go.style.opacity = "1";
        this.element.style.opacity = "1";
    }.bind(this), 1500);

    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
};

Game.prototype.performWin = function() {
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
    
    this.won = true;
    this.element.style.opacity = "0.5";
    this.go.style.opacity = "0";
    this.go.style.backgroundImage = "url(img/win.jpg)";
    
    setTimeout(function() {
        this.go.style.opacity = "1";
        this.element.style.opacity = "1"
        setTimeout(function() {
            this.go.style.opacity = "0";
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].disabled = false;
            }
        }.bind(this), 3000);
    }.bind(this), 2000);
};

Game.prototype.checkEndGame = function() {
    if (this.emptyFieldsCount > 0)
        return false;
    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height - 1; j++) {
            if (this.fields[i][j].value === this.fields[i][j+1].value)
                return false;
        }
    }
    for (var j = 0; j < this.height; j++) {
        for (var i = 0; i < this.width - 1; i++) {
            if (this.fields[i][j].value === this.fields[i+1][j].value)
                return false;
        }
    }
    return true;
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
    this.element.style.top = j * 25+"%";
    this.element.style.left = i * 25 + "%";
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
    if (val === 0) {
        this.element.style.backgroundImage = "";
        this.element.innerHTML = "";
    } else if (val <= 1024) {
        this.element.style.backgroundImage = "url(img/" + val + ".png)";
        this.element.innerHTML = "";
    } else {
        this.element.style.backgroundImage = "url(img/1024.png)";
        this.element.innerHTML = val / 1024;
    }
    return lastVal;
};

/**
 * Handler for "left" user action
 * @returns {undefined}
 */
Game.prototype.left = function() {
    // For each row, create a strip
    for (var y = 0; y < this.height; y++) {
        var strip = [];
        // Add fields from the current row to the strip
        for (var x = 0; x < this.width; x++) {
            strip.push(this.fields[x][y]);
        }
        this.applyGravityToStrip(strip);
    }
    this.addRandomBrick();
    if (this.checkEndGame())
        this.performEndGame();
};

/**
 * Handler for "right" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.right = function() {
    for (var y = 0; y < this.height; y++) {
        var strip = [];
        for (var x = this.width-1; x >= 0; x--)
            strip.push(this.fields[x][y]);
        this.applyGravityToStrip(strip);
    }
    this.addRandomBrick();
    if (this.checkEndGame())
        this.performEndGame();
};

/**
 * Handler for "top" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.top = function() {
    for (var x = 0; x < this.width; x++) {
        var strip = [];
        for (var y = 0; y < this.height; y++)
            strip.push(this.fields[x][y]);
        this.applyGravityToStrip(strip);
    }
    this.addRandomBrick();
    if (this.checkEndGame())
        this.performEndGame();
};

/**
 * Handler for "bottom" user action
 * TODO: implement the function
 * @returns {undefined}
 */
Game.prototype.bottom = function() {
    for (var x = 0; x < this.width; x++) {
        var strip = [];
        for (var y = this.height-1; y >= 0; y--)
            strip.push(this.fields[x][y]);
        this.applyGravityToStrip(strip);
    }
    this.addRandomBrick();
    if (this.checkEndGame())
        this.performEndGame();
};

/**
 * Takes an array of Fields and performs the gravity effect (bricks are moved to the beginning of the strip)
 * TODO: Implement merging of bricks with equal value
 * @param {Array} strip
 * @returns {undefined}
 */
Game.prototype.applyGravityToStrip = function(strip) {
    for (var i = 0; i < strip.length; i++) {

        // Looking for next non-empty field in the strip
        var j = i;
        while (j < strip.length && strip[j].value === 0) j++;
        
        // If found, bring it forward
        if (j < strip.length) {
            if (strip[i].value === 0) {
                strip[i].setValue(strip[j].value);
                strip[j].setValue(0);
            }
            
            // Looking for next non-empty brick in the strip
            var j = i+1;
            while (j < strip.length && strip[j].value === 0) j++;
            
            // If found, check its value and if the bricks are equal, merge them
            if (j < strip.length) {
                if (strip[i].value === strip[j].value) {
                    this.mergeBricks(strip[j], strip[i]);
                }
            }
        }
    }
};