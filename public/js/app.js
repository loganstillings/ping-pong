var app = {
    //initial variables
    canvas: null,
    context: null,

    //resizing
    width: 800,
    height: 400,

    //nodes
    nodes: [],

    //timing
    timestamp: 0,
    now: 0,
    lastUpdate: 0,

    init: function () {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.render();
        this.onInit();
    },
    render: function () {
        this.clear();
        this.update();

        window.requestAnimationFrame(this.render.bind(this));
    },
    clear: function () {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    update: function () {
        var dt = Date.now() - this.lastUpdate;

        this.onUpdate(dt);

        for (var index in this.nodes) {
            var node = this.nodes[index];

            this.context.fillStyle = node.color;
            this.context.fillRect(node.x, node.y, node.width, node.height);
        }

        this.lastUpdate = Date.now();
        this.timestamp += dt;
        var player1 = this.getNode("player1");
        var player2 = this.getNode("player2");
        this.drawScore(player1.points, player2.points);
    },
    getNode: function (id) {
        for (var index in this.nodes) {
            var node = this.nodes[index];

            if (node.id == id) {
                return node;
            }
        }

        return { x: null, y: null, width: null, height: null };
    },

    drawScore: function (player1Points, player2Points) {
        var positionY = this.canvas.height / 10;
        var player1PointsPositionX = this.canvas.width / 4;
        var player2PointsPositionX = this.canvas.width - player1PointsPositionX;
        this.context.font = "48px serif";
        this.context.fillText(player1Points, player1PointsPositionX, positionY);
        this.context.fillText(player2Points, player2PointsPositionX, positionY);
    },

    //events
    onInit: function () {},
    onUpdate: function () {},
};

window.onload = function () {
    app.init();
};
