function Node(id, x, y, width, height, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    return this;
}
function Player(id, x, y, paddleWidth, paddleHeight, appHeight, color) {
    var self = new Node(id, x, y, paddleWidth, paddleHeight, color);
    self.points = 0;
    self.isPressingDown = false;
    self.isPressingUp = false;

    self.update = () => {
        if (self.isPressingDown && self.y < appHeight - paddleHeight) {
            // move paddle up
            if (self.y + PADDLE_SPEED > appHeight - paddleHeight) {
                self.y = appHeight - paddleHeight;
            } else {
                self.y += PADDLE_SPEED;
            }
        } else if (self.isPressingUp && self.y > 0) {
            // move paddle down
            if (self.y - PADDLE_SPEED < 0) {
                self.y = 0;
            } else {
                self.y -= PADDLE_SPEED;
            }
        }
    };

    self.reset = () => {
        self.x = x;
        self.y = y;
    };

    return self;
}
function Ball(id, x, y, ballWidth, ballHeight, appWidth, appHeight, color) {
    var self = new Node(id, x, y, ballWidth, ballHeight, color);

    self.initialize = () => {
        // TODO randomize speed directions
        self.speedX = 3;
        self.speedY = 1;
        self.x = x;
        self.y = y;
    };

    self.initialize();

    self.update = (player1, player2) => {
        self.x += self.speedX;
        self.y += self.speedY;

        if (self.isCollidingWithWall()) {
            self.speedY *= -1;
        }

        if (self.isCollidingWithPaddle(player1, player2)) {
            self.speedX *= -1;
            if (self.speedX > -15 && self.speedX < 15) {
                // capping the horizontal speed at 15 so it doesn't skip the paddle. TODO: make this dynamic as well
                self.speedX += self.speedX < 0 ? -0.5 : 0.5;
            }
            self.speedY += self.speedY < 0 ? -0.5 : 0.5;
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
        // What happens when the ball is moving so fast that it skips over the paddle?
        if (
            self.x >= player2.x &&
            self.x <= appWidth &&
            self.y >= player2.y &&
            self.y <= player2.y + player2.height
        ) {
            return true;
        }
        if (
            self.x <= player1.x + player1.width &&
            self.x >= 0 &&
            self.y >= player1.y &&
            self.y <= player1.y + player1.height
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
