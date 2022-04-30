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

    self.update = () => {
        if (self.isPressingDown && self.y < appHeight - paddleHeight) {
            // move paddle up
            if (self.y + paddleSpeed > appHeight - paddleHeight) {
                self.y = appHeight - paddleHeight;
            } else {
                self.y += paddleSpeed;
            }
        } else if (self.isPressingUp && self.y > 0) {
            // move paddle down
            if (self.y - paddleSpeed < 0) {
                self.y = 0;
            } else {
                self.y -= paddleSpeed;
            }
        }
    };

    self.reset = () => {
        self.x = x;
        self.y = y;
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
        self.x += self.speedX;
        self.y += self.speedY;

        if (self.isCollidingWithWall()) {
            // bounce ball off wall
            self.speedY *= -1;
        }

        if (self.isCollidingWithPaddle(player1, player2)) {
            // calculate where on the paddle the ball is hitting to return ball at an angle
            var ballMidpointY = self.y + self.height / 2;
            var paddleMidpointY =
                self.speedX < 0
                    ? player1.y + player1.height / 2
                    : player2.y + player2.height / 2;
            // normalize y speed on range -5 to 5 based on ball location on paddle
            self.speedY =
                -1 * Math.floor((paddleMidpointY - ballMidpointY) / 20);

            // bounce ball off paddle, increase speed
            self.speedX *= -1;
            if (self.speedX > -player1.width && self.speedX < player1.width) {
                // capping the horizontal speed at paddle width so it doesn't skip the paddle
                self.speedX += self.speedX < 0 ? -1 : 1;
            }
        }

        if (self.isScored()) {
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
            self.initialize();
            player1.reset();
            player2.reset();
        }
    };

    self.isCollidingWithWall = () => {
        return self.y <= 0 || self.y >= appHeight - ballHeight;
    };

    self.isCollidingWithPaddle = (player1, player2) => {
        if (
            // colliding with player1
            self.x <= player1.x + player1.width &&
            self.x >= 0 &&
            self.y >= player1.y &&
            self.y <= player1.y + player1.height &&
            self.speedX < 0
        ) {
            return true;
        }
        if (
            // colliding with player2
            self.x >= player2.x - ballWidth &&
            self.x <= appWidth - ballWidth &&
            self.y >= player2.y &&
            self.y <= player2.y + player2.height &&
            self.speedX > 0
        ) {
            return true;
        }
        return false;
    };

    self.isScored = () => {
        return self.x <= 0 || self.x >= appWidth - ballWidth;
    };

    return self;
}
