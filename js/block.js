
(function () {

  window.Block = function (y, level) {
    // Function that provide a value of an attribute when it doesn't come
    // as argument.
    this._getRandom = function (attribute, level) {
      var value,
        colours = [
        // List of different colours
        'cadetblue', 'orange', 'goldenrod', 'darkred', 'turquoise', 'chocolate'
      ];

      switch (attribute) {
        case 'width':
          if (level <= 2) { value = (Math.random() * 360) + 120; } // They will be 120 px width min.
          else { value = (Math.random() * 480) + 1; } // They will be 1px width min.
          break;
        case 'colour':
          value = colours[Math.floor(Math.random() * colours.length)];
          break;
        case 'speed':
          if (level <= 2) { value = (Math.random() * 3); } // They will have a max speed of 3.
          else { value = (Math.random() * 7) + 2; } // They will have a speed in between [2 - 9)
          break;
        case 'x':
          // 0 || 480
          value = Math.random() < 0.5 ? 0 : 480;
          break;
      }
      return value;
    };

    // Positions and size
    this.posX = this._getRandom('x');
    this.posY = y;
    this.width = this._getRandom('width', level);
    this.height = 28;

    // Speed and direction
    this.speed = this._getRandom('speed', level);
    this.direction = this.posX === 0 ? this.speed : this.speed * -1;

    // Styles
    this.fillStyle = this._getRandom('colour');

    // Internal attributes
    this.isCatched = false;


  };

  Block.prototype.update = function (clicks) {
    this._gotCatched = function (coord) {
      // Check if the coord is into the block.
      return (coord.x >= this.posX && coord.x <= this.posX + this.width &&
        coord.y >= this.posY && coord.y <= this.posY + this.height);
    };

    if (!this.isCatched) {
      for (var j = 0; j < clicks.length; j++) {
        if (this._gotCatched(clicks[j])) {
          this.isCatched = true;
        }
      }

      if (!this.isCatched) {
        this.posX += this.direction;
      }
    }
  };

  Block.prototype.isDisplayed = function () {
    return !(this.posX > 480 || this.posX + this.width < 0);
  };

  Block.prototype.draw = function (ctx) {
    ctx.fillStyle = this.fillStyle;
    // Change styles if the block has been catched.
    if (this.isCatched) { ctx.fillStyle = 'black'; }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  };

})();
