
(function () {

  window.Menu = function (game) {
    this.game = game;
    this.context = game.context;

    this.levels = [
      {
        'x': 20,
        'y': 200,
        'width': this.game.canvas.width / 2 - 40,
        'height': 100,
        'textX': this.game.canvas.width / 4,
        'textY': 260,
        'text': 'Level 1',
        'blocks': 7,
        'sizeBlock': 80
      }, {
        'x': 240,
        'y': 200,
        'width': this.game.canvas.width / 2 - 40,
        'height': 100,
        'textX': (this.game.canvas.width * 3 / 4) - 20,
        'textY': 260,
        'text': 'Level 2',
        'blocks': 10,
        'sizeBlock': 56
      }, {
        'x': 20,
        'y': 340,
        'width': this.game.canvas.width / 2 - 40,
        'height': 100,
        'textX': this.game.canvas.width / 4,
        'textY': 400,
        'text': 'Level 3',
        'blocks': 10,
        'sizeBlock': 56
      }, {
        'x': 240,
        'y': 340,
        'width': this.game.canvas.width / 2 - 40,
        'height': 100,
        'textX': (this.game.canvas.width * 3 / 4) - 20,
        'textY': 400,
        'text': 'Level 4',
        'blocks': 16,
        'sizeBlock': 35
      }
    ];

    this.drawMainMenu();
  };

  Menu.prototype._drawBasicLayout = function () {
    this.context.fillStyle = 'rgba(204,204,204,0.5)';
    this.context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this.context.textAlign = 'center';
    this.context.fillStyle = 'cadetblue';
    this.context.font = 'bold 5em Helveltica Neue';
    this.context.fillText('Platforms!', this.game.canvas.width/2, 100);
    this.context.fillRect(40, 120, this.game.canvas.width - 80, 5);
  };

  Menu.prototype._drawLevels = function () {
    this.context.fillStyle = 'cadetblue';
    this.context.font = 'italic 3em Helveltica Neue';
    this.context.strokeStyle = 'white';

    for (var i = 0; i < this.levels.length; i++) {
      this.context.fillRect(this.levels[i].x, this.levels[i].y, this.levels[i].width, this.levels[i].height);
      this.context.strokeText(this.levels[i].text, this.levels[i].textX, this.levels[i].textY);
    }
  };

  Menu.prototype._drawFailureLevel = function (blocks, level) {
    this._drawBasicLayout();
    this.level = level;

    this.context.font = 'bold 3em Helveltica Neue';
    this.context.fillText('oouch! You catched', this.game.canvas.width / 2, 260);
    this.context.fillText(blocks.toString() + ' blocks...', this.game.canvas.width / 2, 300);
    this.context.font = 'bold 5em Helveltica Neue';
    this.context.fillText('Try again!', this.game.canvas.width / 2, 400);

    var self = this;
    this.game.canvas.addEventListener('click', function goToLevel() {
      self.game.canvas.removeEventListener('click', goToLevel);
      self.buildLevel(self.level);
    });
  };

  Menu.prototype._drawSuccessLevel = function (blocks, nextLevel) {
    this._drawBasicLayout();
    this.level = nextLevel;

    this.context.font = 'bold 3em Helveltica Neue';
    this.context.fillText('YAY! You catched', this.game.canvas.width / 2, 260);
    this.context.fillText(blocks.toString() + ' blocks!', this.game.canvas.width / 2, 300);
    this.context.font = 'bold 5em Helveltica Neue';
    this.context.fillText('Next Level!', this.game.canvas.width / 2, 400);

    var self = this;
    this.game.canvas.addEventListener('click', function goToLevel() {
      self.game.canvas.removeEventListener('click', goToLevel);
      self.buildLevel(self.level);
    });
  };

  Menu.prototype._drawFinishGame = function () {
    this.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    this._drawBasicLayout();
    this.context.font = 'bold 8em Helveltica Neue';
    this.context.fillText('You win', this.game.canvas.width / 2, 360);
  };

  Menu.prototype.drawMainMenu = function () {
    this.context.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    this._drawBasicLayout();
    this._drawLevels();

    // Adding event listener to get which level the user chooses
    var self = this;
    this.game.canvas.addEventListener('click', function chooseLevel(event) {
      var level = self.getLevel({ 'x': event.x, 'y': event.y });
      if (level) {
        self.game.canvas.removeEventListener('click', chooseLevel);
        self.buildLevel(level);
      }
    });
  };

  Menu.prototype.getLevel = function (coord) {
    for (var i = 0; i < this.levels.length; i++) {
      if (coord.x >= this.levels[i].x && coord.x <= this.levels[i].x + this.levels[i].width &&
        coord.y >= this.levels[i].y && coord.y <= this.levels[i].y + this.levels[i].height) {
        return i+1;
      }
    }
    return false;
  };

  Menu.prototype.buildLevel = function (level) {
    this.blocks = [];
    for (var i = 0; i < this.levels[level-1].blocks; i++) {
      this.blocks.push(new Block(i*this.levels[level-1].sizeBlock, level));
    }

    this.game.start(this.blocks, level);
  };

  Menu.prototype.drawFinish = function (blocksCatched, level) {
    if (blocksCatched >= this.levels[level-1].blocks * 0.8 ) {
      if (level < 4) {
        this._drawSuccessLevel(blocksCatched, level+1);
      } else {
        this._drawFinishGame();
      }
    } else {
      this._drawFailureLevel(blocksCatched, level);
    }
  };

})();