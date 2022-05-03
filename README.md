# Ping Pong Game

A basic ping pong game written with HTML and JavaScript.

## Usage

-   clone this repository
-   assuming node is pre-installed, run `npm install` within the ping-pong directory.
-   start server with `node index.js`
-   navigate to `localhost:3000` in any browser to play the game

## Features

-   The game Covers whole browser and is resizable.
-   The keyboard controls both players. W and S control the red player, Up and Down control the blue player.
-   Pressing `SPACE` will start and pause the game.
-   The ball bounces off walls and paddles. Vertical ball speed is calculated based on where the ball hits the paddle in relation to the paddle's center.
-   Scoring is logged to the console as well as displayed on the game board.
-   Ball is served in a random direction.
-   The game uses 3 types of power-ups that the user can obtain by collecting with their paddle.
    1. Growth (green) - this will increase the width of the paddle by 15% for the receiving player
    2. Boost (orange) - this will increase the receiving player's paddle speed where each subsequent boost will be 2x, 3x, 4x... the original paddle speed
    3. Freeze (light blue) - this will freeze the opposing player's paddle for 1 second.

## Demo

[Video](https://recordit.co/Ro0pKF3FIV) (please note the video quality makes the game appear choppier than it really is)
