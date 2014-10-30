
(function () {

  window.Game = function (canvas) {
    // Getting canvas
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.menu = new Menu(this);
  };
  Game.prototype.start = function (blocks, level) {
    this.clicks = [];
    this.blocks = blocks || this.blocks;
    this.level = level;

    // Event listener to catch all the clicks.
    var self = this;
    this.canvas.addEventListener('click', function (event) {
      self.clicks.push({'x': event.x, 'y': event.y});
    });

    // Start play
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.animate = true;
    requestAnimationFrame(this.loop.bind(this));
  };

  Game.prototype.reset = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.menu.drawMainMenu();
  };

  Game.prototype.loop = function () {
    // Game loop
    this.update();
    this.draw();

    if (this.animate) { requestAnimationFrame(this.loop.bind(this)); }
    // If game is finished
    else { this.showFinish(); }
  };

  Game.prototype.draw = function () {
    this.context.save();

    // Clear canvas and re-drawing all different blocks.
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.blocks.length; i++) {
      this.blocks[i].draw(this.context);
    }

    this.context.restore();
  };

  Game.prototype.update = function () {
    var goingToFinish = true;

    for (var i = 0; i < this.blocks.length; i++) {
      // Update attributes of every block.
      this.blocks[i].update(this.clicks);
      // Check if the game is still alive
      if (goingToFinish && this.blocks[i].isDisplayed() && !this.blocks[i].isCatched) {
        goingToFinish = false;
      }
    }

    // Reset clicks
    this.clicks = [];

    // Is the game finally finish?
    if (goingToFinish) {
      this.animate = false;
    }
  };

  Game.prototype.showFinish = function () {
    // Get how many blocks has been catched.
    var catched = 0;
    for (var i = 0; i < this.blocks.length; i++) {
      catched += this.blocks[i].isCatched ? 1 : 0;
    }

    this.menu.drawFinish(catched, this.level);
  };

})();
