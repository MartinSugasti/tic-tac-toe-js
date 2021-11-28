const playerFactory = (symbol) => {
  const getSymbol = () => symbol;

  let selections = [];
  const getSelections = () => selections;

  const addSelection = (selection) => {
    selections.push(selection);
  }

  const reset = () => {
    selections = [];
  }

  return { getSymbol, getSelections, addSelection, reset };
}

const gameBoard = (() => {
  let availableSelections = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  const getAvailableSelections = () => {
    return availableSelections;
  }

  const winningCombinations = [
    ['0', '1', '2'],
    ['3', '4', '5'],
    ['6', '7', '8'],
    ['0', '3', '6'],
    ['1', '4', '7'],
    ['2', '5', '8'],
    ['0', '4', '8'],
    ['2', '4', '6']
  ];
  const isAWinningCombination = (combination) => {
    for (let winningCombination of winningCombinations) {
      let isIncluded = true;

      for (let number of winningCombination) {
        if (!combination.includes(number)) {
          isIncluded = false;
          break;
        }
      }

      if (isIncluded) {
        return true;
      }
    };

    return false;
  }

  const pickSelection = (number) => {
    const index = availableSelections.indexOf(number);
    if (index > -1) {
      availableSelections.splice(index, 1);
    }
  }

  const reset = () => {
    availableSelections = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  }

  return { getAvailableSelections, isAWinningCombination, pickSelection, reset }
})();

const game = (() => {
  let playerOne = playerFactory('X');
  let playerTwo = playerFactory('O');
  let currentPlayer = playerOne;

  const pickSquare = (event) => {
    const square = event.target;

    if (square.textContent === '') {
      squareNumber = square.dataset.index;

      currentPlayer.addSelection(squareNumber);
      gameBoard.pickSelection(squareNumber);
      displayController.drawSymbol(squareNumber, currentPlayer.getSymbol());

      if (gameBoard.isAWinningCombination(currentPlayer.getSelections())) {
        alert(`Player ${currentPlayer.getSymbol()} wins`);
        resetGame();
      } else if (gameBoard.getAvailableSelections().length === 0) {
        alert("It's a tie");
        resetGame();
      }
    }

    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function resetGame() {
    gameBoard.reset();
    displayController.reset();
    playerOne.reset();
    playerTwo.reset();
  }

  return { pickSquare }
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => square.addEventListener('click', game.pickSquare));

  const drawSymbol = (selection, symbol) => {
    const selectedSquare = Array.from(squares).find(square => square.dataset.index === selection);
    selectedSquare.textContent = symbol;
  }

  const reset = () => {
    squares.forEach((square) => square.textContent = '');
  }

  return { drawSymbol, reset }
})();
