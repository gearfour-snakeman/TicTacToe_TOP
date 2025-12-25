function Gameboard() {

    let rows = 3;
    let columns = 3;
    let board = [];

    for (let i = 0; i < rows*columns; i++) {
        board.push(Cell());
    }
    const getBoard = () => board;
    const dropMarker = (cell, player) => {
        const availableCells = board.filter((cellItem) => cellItem.getValue() === 0);
        if(!availableCells) return; // no cells available, round finished, or invalid move
        
        //otherwise valid cell
        board[cell].addMarker(player);
    };
    const printBoard = () => {
        const boardWithCellValues = board.map((cell) => cell.getValue());
        console.log(boardWithCellValues);
      };
      const checkState = () => {
        const boardValues = board.map(cell => cell.getValue());
        
        // All possible winning combinations (indices for 3x3 grid)
        const winningCombinations = [
            // Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // Columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // Diagonals
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        // Check each winning combination
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            
            // Check if all three cells have the same value AND are not empty
            if (boardValues[a] !== 0 && 
                boardValues[a] === boardValues[b] && 
                boardValues[a] === boardValues[c]) {
                return { state: 'win', winner: boardValues[a] };
            }
        }
        
        // Check for tie (no empty cells left)
        const availableCells = boardValues.filter(cell => cell === 0);
        if (availableCells.length === 0) {
            return {state: 'tie', winner: null};
        }
        
        // Game continues
        return { state: 'continue', winner: null };
    };
    
      // Here, we provide an interface for the rest of our
      // application to interact with the board
    return { getBoard, dropMarker, printBoard, checkState };
}

function Cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };
    const getValue = () => value;
    return {
        addMarker,
        getValue
      };
}
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
    const players = [
        {
          name: playerOneName,
          token: 'X'
        },
        {
          name: playerTwoName,
          token: 'O'
        }
      ];
    let activePlayer = players[0];
    const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
      };
      
    const playRound = (cell) => {
        console.log(
            `Marker ${getActivePlayer().name}'s choice into cell ${cell}...`
          );
        board.dropMarker(cell, getActivePlayer().token);

        const result = board.checkState();
        
        if (result.state === 'win') {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins!`);
            return;
        }
        
        if (result.state === 'tie') {
            board.printBoard();
            console.log("It's a tie!");
            return;
        }
        switchPlayerTurn();
        printNewRound();
    };
    printNewRound();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
  }
  const game = GameController();