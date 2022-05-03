function Node(id, x, y, width, height, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    return this;
}
function Player(
    id,
    x,
    y,
    paddleWidth,
    paddleHeight,
    paddleSpeed,
    appHeight,
    color
) {
    var self = new Node(id, x, y, paddleWidth, paddleHeight, color);
    self.points = 0;
    self.isPressingDown = false;
    self.isPressingUp = false;
    self.isFrozen = false;
    self.speedY = paddleSpeed;

    self.update = () => {
        if (self.isFrozen) {
            return;
        }
        if (self.isPressingDown && self.y < appHeight - self.height) {
            self.moveDown();
        } else if (self.isPressingUp && self.y > 0) {
            self.moveUp();
        }
    };

    self.moveDown = () => {
        if (self.y + self.speedY > appHeight - self.height) {
            self.y = appHeight - self.height;
        } else {
            self.y += self.speedY;
        }
    };

    self.moveUp = () => {
        if (self.y - self.speedY < 0) {
            self.y = 0;
        } else {
            self.y -= self.speedY;
        }
    };

    self.freeze = () => {
        // temporarily freeze paddle movement for 1 second
        self.isFrozen = true;
        setTimeout(() => {
            self.isFrozen = false;
        }, 1000);
    };

    self.grow = () => {
        var growthAmount = Math.floor(self.height * 0.15); // Increase size by 15%
        self.height += growthAmount;
        if (self.y > growthAmount / 2) {
            self.y -= growthAmount / 2;
        }
    };

    self.boostSpeed = () => {
        self.speedY += 5;
    };

    self.reset = () => {
        self.x = x;
        self.y = y;
        self.isFrozen = false;
        self.speedY = paddleSpeed;
        self.height = paddleHeight;
    };

    return self;
}
function Ball(
    id,
    x,
    y,
    ballWidth,
    ballHeight,
    startSpeed,
    appWidth,
    appHeight,
    color
) {
    var self = new Node(id, x, y, ballWidth, ballHeight, color);

    self.initialize = () => {
        var verticalDirection = Math.random() < 0.5 ? -1 : 1;
        var horizontalDirection = Math.random() < 0.5 ? -1 : 1;
        self.speedX = startSpeed * horizontalDirection;
        self.speedY = startSpeed * verticalDirection;
        self.x = x;
        self.y = y;
    };

    self.initialize();

    self.update = (player1, player2) => {
        if (self.isCollidingWithWall()) {
            // bounce ball off wall
            self.speedY *= -1;
        }

        if (self.isCollidingWithPaddle(player1, player2)) {
            self.returnBall(player1, player2);
        }

        if (self.isScored()) {
            self.scorePoints(player1, player2);
            app.reset();
        }
        self.x += self.speedX;
        self.y += self.speedY;
    };

    self.isCollidingWithWall = () => {
        return self.y <= 0 || self.y >= appHeight - self.height;
    };

    self.isCollidingWithPaddle = (player1, player2) => {
        return (
            // colliding with player1
            isCollidingWithEntity(self, player1) ||
            // colliding with player2
            isCollidingWithEntity(self, player2)
        );
    };

    self.isScored = () => {
        return self.x <= 0 || self.x >= appWidth - ballWidth;
    };

    self.returnBall = (player1, player2) => {
        // calculate where on the paddle the ball is hitting to return ball at an angle
        var ballMidpointY = self.y + self.height / 2;
        var paddleMidpointY =
            self.speedX < 0
                ? player1.y + player1.height / 2
                : player2.y + player2.height / 2;
        // normalize y speed within a range based on ball location on paddle
        self.speedY = -1 * Math.floor((paddleMidpointY - ballMidpointY) / 20);

        // bounce ball off paddle, increase speed
        self.speedX *= -1;
        if (self.speedX > -player1.width && self.speedX < player1.width) {
            // capping the horizontal speed at paddle width so it doesn't skip the paddle
            self.speedX += self.speedX < 0 ? -1 : 1;
        }
    };

    self.scorePoints = (player1, player2) => {
        self.speedX = 0;
        self.speedY = 0;
        paused = true;
        if (self.x <= 0) {
            player2.points++;
        } else {
            player1.points++;
        }
        var score = `Score: Red - ${player1.points}, Blue - ${player2.points}`;
        console.log(score);
        app.reset();
    };

    return self;
}

function PowerUp(id, x, y, width, height, type, speed, appWidth, color) {
    // implementing a powerup entity that a player can grab if their paddle collides with it
    var self = new Node(id, x, y, width, height, color);
    self.speedX = speed;
    self.type = type;

    self.update = (player1, player2) => {
        self.x += self.speedX;
        if (self.isCollidingWithPaddle(player1, player2)) {
            self.grantPowerUp(player1, player2);
            self.delete();
        }
        if (self.hasPassedPaddle()) {
            self.delete();
        }
    };

    self.grantPowerUp = (player1, player2) => {
        var poweredUpPlayer = self.speedX < 0 ? player1 : player2;
        var opposingPlayer = self.speedX < 0 ? player2 : player1;
        switch (self.type) {
            case "freeze":
                //freeze opposing player
                opposingPlayer.freeze();
                break;
            case "boost":
                // grant speed boost to powered up player
                poweredUpPlayer.boostSpeed();
                break;
            case "growth":
                // increase paddle width of powered up player
                poweredUpPlayer.grow();
                break;
            default:
                break;
        }
    };

    self.delete = () => {
        var indexToDelete = app.nodes.findIndex((node) => node.id === self.id);
        app.nodes.splice(indexToDelete, 1);
    };

    self.isCollidingWithPaddle = (player1, player2) => {
        return (
            // colliding with player1
            isCollidingWithEntity(self, player1) ||
            // colliding with player2
            isCollidingWithEntity(self, player2)
        );
    };

    self.hasPassedPaddle = () => {
        return self.x <= 0 - self.width || self.x >= appWidth;
    };
    return self;
}

isCollidingWithEntity = function (rect1, rect2) {
    return (
        rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height
    );
};
