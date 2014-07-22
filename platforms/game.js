
(function () {

  window.Game = function (canvas) {
    // Getting canvas
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.menu = new Menu(this);
  };
  Game.prototype.start = function (blocks) {
    this.clicks = [];
    this.blocks = blocks || this.blocks;

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

  Game.prototype.reset = function (listener) {
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
    var self = this;

    // Adding event listener to reset the game.
    this.canvas.addEventListener('click', function _resetGame() {
      self.reset();
      self.canvas.removeEventListener('click', _resetGame);
    });

    // Draw an opacity layer
    this.context.fillStyle = 'rgba(204,204,204,0.5)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Get how many blocks has been catched.
    this._getBlocksCatched = function () {
      var catched = 0;
      for (var i = 0; i < this.blocks.length; i++) {
        catched += this.blocks[i].isCatched ? 1 : 0;
      }
      return catched;
    };

    var blocksCatched = this._getBlocksCatched();

    if (blocksCatched >= 8) {
      this.text1 = "Well done!";
      this.text2 = "You catched";
      this.text3 = blocksCatched.toString();
      this.text4 = "blocks!";
      this.context.fillStyle = 'forestgreen';
    } else {
      this.text1 = "Booooohh!";
      this.text2 = "You only catched";
      this.text3 = blocksCatched.toString();
      this.text4 = "blocks... Try again!";
      this.context.fillStyle = 'darkred';
    }

    this.context.textAlign = 'center';
    this.context.font = 'bold 2.3em "Helveltica Neue", Arial';
    this.context.fillText(this.text1, this.canvas.width / 2, 90);
    this.context.fillText(this.text2, this.canvas.width / 2, 150);
    this.context.font = 'bold 6em "Helveltica Neue", Arial';
    this.context.fillText(this.text3, this.canvas.width / 2, 260);
    this.context.font = 'bold 2.3em "Helveltica Neue", Arial';
    this.context.fillText(this.text4, this.canvas.width / 2, 390);
  };

})();
