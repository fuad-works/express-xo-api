const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Initialize the Tic Tac Toe game state
let gameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

// Function to check for a winner
function checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (gameState[i][0] !== '' && gameState[i][0] === gameState[i][1] && gameState[i][1] === gameState[i][2]) {
            return gameState[i][0];
        }
    }
    // Check columns
    for (let j = 0; j < 3; j++) {
        if (gameState[0][j] !== '' && gameState[0][j] === gameState[1][j] && gameState[1][j] === gameState[2][j]) {
            return gameState[0][j];
        }
    }

    // Check diagonals
    if (gameState[0][0] !== '' && gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
        return gameState[0][0];
    }

    if (gameState[0][2] !== '' && gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
        return gameState[0][2];
    }

    // Check for a tie
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] === '') {
                return null; // Game is not over yet
            }
        }
    }

    return 'tie'; // It's a tie
}

// Function to check if the board is full
function isBoardFull() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

// Function to perform the Minimax algorithm
function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();

    if (winner === 'X') {
        return -1;
    } else if (winner === 'O') {
        return 1;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

// Function to find the best move for the AI
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameState[i][j] === '') {
                gameState[i][j] = 'O';
                const score = minimax(gameState, 0, false);
                gameState[i][j] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

app.get('/clearBoard', (req, res) => {
    
    gameState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    res.json({ message: 'Move successful', gameState });
});

app.get('/getBoard', (req, res) => {
    res.json({ message: 'Move successful', gameState });
});

// Endpoint to make a move
app.post('/makeMove', (req, res) => {
    const { player, row, col } = req.body;

    if (gameState[row][col] === '' && (player === 'X' || player === 'O')) {
        gameState[row][col] = player;

        const winner = checkWinner();

        if (winner) {
            res.json({ message: winner === 'tie' ? 'It\'s a tie!' : `${winner} wins!`, gameState });
        } else {
            if (player === 'X' && !isBoardFull()) {
                const aiMove = findBestMove();
                gameState[aiMove.row][aiMove.col] = 'O';

                const aiWinner = checkWinner();
                if (aiWinner) {
                    res.json({ message: aiWinner === 'tie' ? 'It\'s a tie!' : 'O wins!', gameState });
                } else {
                    res.json({ message: 'Move successful', gameState });
                }
            } else {
                res.json({ message: 'Move successful', gameState });
            }
        }
    } else {
        res.status(400).json({ message: 'Invalid move' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
