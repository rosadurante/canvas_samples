
(function () {

  window.Block = function (y, width, color, speed) {
    // Function that provide a value of an attribute when it doesn't come
    // as argument.
    this._getRandom = function (attribute) {
      var value,
        colours = [
        // List of different colours
        'cadetblue', 'orange', 'goldenrod', 'darkred', 'turquoise', 'chocolate'
      ];

      switch (attribute) {
        case 'width':
          // [1 - 480]
          value = (Math.random() * 480) + 1;
          break;
        case 'colour':
          value = colours[Math.floor(Math.random() * colours.length)];
          break;
        case 'speed':
          // [0 - 8]
          value = (Math.random() * 8) + 1;
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
    this.width = width || this._getRandom('width');
    this.height = 28;

    // Speed and direction
    this.speed = speed || this._getRandom('speed');
    this.direction = this.posX === 0 ? this.speed : this.speed * -1;

    // Styles
    this.fillStyle = color || this._getRandom('colour');

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