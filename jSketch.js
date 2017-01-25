// Snake Game
PShape snack;

// Global Vars for Spin-off
var tileSize = 25;
var framesPerMove = 7;
var snakeColorFront;
var snakeColorBack;

// Global vars for game mechanichs
var segments = [];
var keyStrokes = [];
var direction;
var position;
var lastTail;
var phase = 0.0;
var phaseInc = 1.0 / 64.0;
var possibleKeys;

// Scene
var sceneAttractIndex = 2;
var sceneInPlayIndex = 0;
var sceneGameOverIndex = 1;
var scene = sceneAttractIndex;

// Food
var food;

function setup() {
    createCanvas(600, 600);
    snakeColorFront = color(255);
    snakeColorBack = color(255, 0, 255);
    direction = createVector(0, tileSize);
    position = createVector(0, 0);
    lastTail = createVector();
    possibleKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

    food = {
        position: createVector(0, 0),
    };
    textAlign(CENTER, CENTER);
    ellipseMode(CORNER);

}

var drawFood = function() {
    snack = loadShape("https://cdn.rawgit.com/jnmperrier/Donut/gh-pages/donutREsaved.svg");
    push();
    fill(255 * phase, 255, 255);
    noStroke();
    ellipse(food.position.x, food.position.y, tileSize, tileSize);
    pop();

};

var createFood = function() {
    var nTiles = width / tileSize;

    var onTail = false;
    do {
        onTail = false;
        var x = floor(random(nTiles)) * tileSize;
        var y = floor(random(nTiles)) * tileSize;
        food.position.set(x, y);

        var bodyLength = segments.length;
        for (var i = 0; i < bodyLength; i++) {
            if (segments[i].x === food.position.x && segments[i].y === food.position.y) {
                onTail = true;
                break;
            }
        }
    } while (onTail);
};

var init = function() {
    scene = sceneInPlayIndex;
    direction = createVector(0, tileSize);
    position = createVector(0, 0);
    segments = [position];
    keyStrokes = [];
    createFood();
};

var drawBody = function() {
    push();
    noStroke();
    var bodyLength = segments.length;
    var s = tileSize;
    for (var i = 0; i < bodyLength; i++) {
        fill(lerpColor(snakeColorFront, snakeColorBack, i / bodyLength));
        var offset = (tileSize - s) / 2.0;
        var segment = segments[i];
        rect(segment.x + offset, segment.y + offset, s, s);
        s *= 0.9;
        s = max(s, tileSize * 0.5);
    }
    pop();
};

var moveBody = function() {
    lastTail = segments[segments.length - 1].copy();
    position.add(direction);
    var bodyLength = segments.length;

    for (var i = bodyLength - 1; i > 0; i--) {
        var segment = segments[i - 1];
        segments[i] = segment.copy();
    }
    segments[0] = position.copy();
};

var eat = function() {
    var segment = segments[segments.length - 1];
    segments.push(segment.copy());
};

var checkEatingSelf = function() {
    var bodyLength = segments.length;
    for (var i = 1; i < bodyLength; i++) {
        var segment = segments[i];
        if (position.x === segment.x && position.y === segment.y) {
            return true;
        }
    }
    return false;
};

var checkFood = function() {
    if (frameCount % framesPerMove === 0) {
        if (position.x === food.position.x && position.y === food.position.y) {
            eat();
            createFood();
        }
    }
};

var updateBody = function() {
    if (frameCount % framesPerMove === 0) {
        moveBody();
        if (checkEatingSelf()) {
            scene = sceneGameOverIndex;
        }
        if (position.x === food.position.x && position.y === food.position.y) {
            eat();
            createFood();
        }
    }
};

var checkBoundary = function() {
    if (position.x < 0) {
        position.x = width - tileSize;
        segments[0] = position.copy();
    } else if (position.x >= width) {
        position.x = 0;
        segments[0] = position.copy();
    } else if (position.y >= height) {
        position.y -= height;
        segments[0] = position.copy();
    } else if (position.y < 0) {
        position.y += height;
        segments[0] = position.copy();
    }
};

var processKeyBuffer = function() {
    if (keyStrokes.length > 0) {
        var k = keyStrokes.shift();

        if (k === RIGHT_ARROW && direction.x !== -tileSize) {
            direction.set(tileSize, 0);
        }
        else if (k === LEFT_ARROW && direction.x !== tileSize) {
            direction.set(-tileSize, 0);
        }
        else if (k === UP_ARROW && direction.y !== tileSize) {
            direction.set(0, -tileSize);
        }
        else if (k === DOWN_ARROW && direction.y !== -tileSize) {
            direction.set(0, tileSize);
        }
    }
};

var sceneInPlay = function() {
    background("pink");
  	push();
  	noStroke();
  	fill(0);
  	rect(0, 0, width, height);
  	pop();
    processKeyBuffer();
    updateBody();
    checkBoundary();
    checkFood();
    drawBody();
    drawFood();
};

var sceneGameOver = function() {
    push();
    colorMode(HSB);
    fill(phase * 255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Thats gotta ssssuck!", width / 2.0, 100);
    textSize(25);
    text("Your Sssscore is ", width / 2.0, 200);
    text(segments.length, width / 2.0, 250);
    textSize(15);
    text("try again ssssucker!", width / 2.0, 350);
    pop();
};

var sceneAttract = function() {
    push();
    background("black");
    colorMode(HSB);
    fill(255 * phase, 255, 255);
    textSize(90);
    text("SSSSNAKE", width / 2.0, 100);

    fill(255);
    textSize(30);
    text("How to Play:", width / 2.0, 200);
    textSize(15);
    text("Move SSSSnake with Arrow Keyssss", width / 2.0, 250);
    text("Eat the Glowing Dotssss", width / 2.0, 270);
    text("Don't Eat Your Tail idiot", width / 2.0, 290);

    fill(255 * phase, 255, 255);
    textSize(30);
    text("Click Mousssse to Begin", width / 2.0, 350);
    pop();
};

var draw = function() {
    switch (scene) {
        case sceneAttractIndex:
            sceneAttract();
            break;
        case sceneInPlayIndex:
            sceneInPlay();
            break;
        case sceneGameOverIndex:
            sceneGameOver();
            break;
    }

    phase += phaseInc;
    if (phase >= 1.0) {
        phase -= 1.0;
    }
};

var keyPressed = function() {
    var k = key.toString();
    if (keyStrokes.length < 3 && possibleKeys.indexOf(keyCode) > -1) {
        keyStrokes.push(keyCode);
    }
};

var mouseClicked = function() {
    if (scene === sceneGameOverIndex) {
        init();
    }
    if (scene === sceneAttractIndex) {
        init();
    }
};
