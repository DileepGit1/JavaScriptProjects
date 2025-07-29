const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.playerX = 0;
    this.playerY = 0;
    this.field[0][0] = pathCharacter;
    this.gameOver = false;
  }

  print() {
    const display = this.field.map(row => row.join('')).join('\n');
    console.log(display);
  }

  isInBounds(x, y) {
    return y >= 0 && y < this.field.length && x >= 0 && x < this.field[0].length;
  }

  getCurrentTile(x, y) {
    return this.field[y][x];
  }

  movePlayer(direction) {
    switch (direction.toLowerCase()) {
      case 'u':
        this.playerY -= 1;
        break;
      case 'd':
        this.playerY += 1;
        break;
      case 'l':
        this.playerX -= 1;
        break;
      case 'r':
        this.playerX += 1;
        break;
      default:
        console.log('Invalid move. Use U (up), D (down), L (left), R (right)');
        return;
    }

    if (!this.isInBounds(this.playerX, this.playerY)) {
      console.log('You moved out of bounds! Game over.');
      this.gameOver = true;
      return;
    }

    const tile = this.getCurrentTile(this.playerX, this.playerY);
    if (tile === hole) {
      console.log('You fell into a hole! Game over.');
      this.gameOver = true;
    } else if (tile === hat) {
      console.log('You found your hat! You win!');
      this.gameOver = true;
    } else {
      this.field[this.playerY][this.playerX] = pathCharacter;
    }
  }

  static generateField(height, width, holePercentage = 0.2) {
    const field = new Array(height).fill(null).map(() =>
      new Array(width).fill(fieldCharacter)
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() < holePercentage) {
          field[y][x] = hole;
        }
      }
    }

    // Ensure hat is not at (0,0)
    let hatX, hatY;
    do {
      hatX = Math.floor(Math.random() * width);
      hatY = Math.floor(Math.random() * height);
    } while (hatX === 0 && hatY === 0);

    field[hatY][hatX] = hat;
    return field;
  }
}

// Start the game
const myField = new Field(Field.generateField(5, 8, 0.2));

while (!myField.gameOver) {
  myField.print();
  const move = prompt('Which way? (U = up, D = down, L = left, R = right): ');
  myField.movePlayer(move);
}
