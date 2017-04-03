Game = function() {
    this.element = document.getElementById("gameArea");
    this.width = 4;
    this.height = 4;
    this.fields = [];
    for (var i = 0; i < this.width; i++) {
        this.fields[i] = [];
        for (var j = 0; j < this.height; j++) {
            this.fields[i][j] = new Field(this.element, i, j);
        }
    }
    this.addRandomBrick();
    this.addRandomBrick();
};

Game.prototype.addRandomBrick = function() {
    var tryBrick = function(i, j) {
        console.log("trying "+i+", "+j);
        if (this.fields[i][j].value == 0) {
            this.fields[i][j].setValue(2);
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

Game.prototype.addBrick = function(i, j) {
    this.fields[i][j].setValue(2);
};

Field = function(parent, i, j) {
    this.element = document.createElement("div");
    this.element.className = "field";
    this.x = i;
    this.y = j;
    this.element.style.top = j * 125;
    this.element.style.left = i * 125;
    this.setValue(0);
    parent.appendChild(this.element);
};

Field.prototype.setValue = function(val) {
    console.log("setValue: ["+this.x+", "+this.y+"], "+val);
    var lastVal = this.value;
    this.value = val;
    if (val == 0)
        this.element.innerHTML = "";
    else
        this.element.innerHTML = val;
    return lastVal;
};

Game.prototype.left = function() {
    for (var y = 0; y < this.height; y++) {
        var strip = [];
        for (var x = 0; x < this.width; x++)
            strip.push(this.fields[x][y]);
        this.applyGravityToStrip(strip);
    }
    this.addRandomBrick();
};

Game.prototype.right = function() {
    this.addRandomBrick();
};

Game.prototype.top = function() {
    this.addRandomBrick();
};

Game.prototype.bottom = function() {
    this.addRandomBrick();
};

Game.prototype.applyGravityToStrip = function(strip) {
    for (var i = 0; i < strip.length; i++) {
        // looking for next non-empty brick in the strip
        var j = i;
        while (j < strip.length && strip[j].value == 0)
            j++;
        console.log("gravity: "+i+", "+j);
        if (j < strip.length) {
            if (strip[i].value == 0) {
                strip[i].setValue(strip[j].value);
                strip[j].setValue(0);
            }
            // looking for next non-empty brick in the strip
            j = i+1;
            while (j < strip.length && strip[j].value == 0)
                j++;
            if (j < strip.length) {
                if (strip[i].value == strip[j].value) {
                    strip[i].setValue(strip[i].value * 2);
                    strip[j].setValue(0);
                }
            }
        }
    }
};