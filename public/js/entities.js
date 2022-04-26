function Node(id, x, y, width, height, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    return this;
}
function Player(id, x, y, color) {
    var self = new Node(id, x, y, PADDLE_WIDTH, PADDLE_HEIGHT, color);
    self.points = 0;
    self.isPressingLeft = false;
    self.isPressingRight = false;
    self.isPressingDown = false;
    self.isPressingUp = false;

    self.update = () => {
        if (self.isPressingRight && self.x < WIDTH - PADDLE_WIDTH) {
            self.x += PADDLE_SPEED;
        } else if (self.isPressingLeft && self.x > 0) {
            self.x -= PADDLE_SPEED;
        }
    };

    self.reset = () => {
        self.x = x;
        self.y = y;
    };

    return self;
}
function Ball(id, x, y, color) {
    var self = new Node(id, x, y, BALL_WIDTH, BALL_HEIGHT, color);

    self.initialize = () => {
        self.speedX = 1;
        self.speedY = 1;
        self.x = x;
        self.y = y;
    };

    self.initialize();

    self.update = (player1, player2) => {
        self.x += self.speedX;
        self.y += self.speedY;

        if (self.isCollidingWithWall()) {
            self.speedX *= -1;
        }

        if (self.isCollidingWithPaddle(player1, player2)) {
            self.speedY *= -1;
            if (self.speedY > -15 && self.speedY < 15) {
                // capping the vertical speed at 15 so it doesn't skip the paddle
                self.speedY += self.speedY < 0 ? -0.5 : 0.5;
            }
            self.speedX += self.speedX < 0 ? -0.5 : 0.5;
        }

        if (self.isScored()) {
            self.speedX = 0;
            self.speedY = 0;
            paused = true;
            if (self.y <= 0) {
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
        return paused;
    };

    self.isCollidingWithWall = () => {
        return self.x <= 0 || self.x >= WIDTH - BALL_WIDTH;
    };

    self.isCollidingWithPaddle = (player1, player2) => {
        // What happens when the ball is moving so fast that it skips over the paddle?
        if (
            self.y >= player2.y &&
            self.y <= HEIGHT &&
            self.x >= player2.x &&
            self.x <= player2.x + player2.width
        ) {
            return true;
        }
        if (
            self.y <= player1.y + player1.height &&
            self.y >= 0 &&
            self.x >= player1.x &&
            self.x <= player1.x + player1.width
        ) {
            return true;
        }
        return false;
    };

    self.isScored = () => {
        return self.y <= 0 || self.y >= HEIGHT - BALL_HEIGHT;
    };

    return self;
}
