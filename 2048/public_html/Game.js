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
    this.element.style.top = i * 125;
    this.element.style.left = j * 125;
    this.setValue(0);
    parent.appendChild(this.element);
};

Field.prototype.setValue = function(val) {
    this.value = val;
    if (val == 0)
        this.element.innerHTML = "";
    else
        this.element.innerHTML = val;
};

Game.prototype.left = function() {
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