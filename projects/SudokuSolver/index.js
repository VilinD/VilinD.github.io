function solve() {
    //Get button "SOLVE"
    let solveBtn = document.querySelector(".solveBtn");
    solveBtn.addEventListener("click", markAddedNumbers)
    solveBtn.addEventListener("click", solveBoard);


    //Get button "RESET"
    let resetBtn = document.querySelector(".resetBtn");
    resetBtn.addEventListener("click", resetSudoku);

    //Get all inputs
    let inputs = document.getElementsByTagName("input");

    //Add event listeners (blur / keypress) on all inputs
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].maxLength = 1;
        inputs[i].addEventListener("keypress", isNumber)
        inputs[i].addEventListener("blur", validateCell);
    };

    //check if pressed key is number, if so set input value to that number 
    function isNumber(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 48 && charCode < 58) {
            this.value = evt.key;
        }
    }

    //This function solve the whole sudoku board
    function solveBoard() {
        class Cell {
            constructor(columnNumber, rowNumber, number, game) {
                this.solved = number > 0 ? true : false;
                this.number = number;
                this.possibilities = this.solved ? [] : new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
                this.row = rowNumber;
                this.column = columnNumber;
                this.currentIndex = 0;
                this.game = game;
                if (!this.solved) {
                    this.findPossibilities();
                }
            }

            findPossibilities() {
                for (const item of this.game.getRow(this.row).concat(this.game.getColumn(this.column), this.game.getBox(this.row, this.column))) {
                    if (!(Array.isArray(item)) && this.possibilities.includes(item)) {
                        let index = this.possibilities.indexOf(item);
                        this.possibilities.splice(index, 1)
                    }
                }
                this.possibilities = new Array(this.possibilities)[0];
                this.handleOnePossibility();
            }

            checkArea(area) {
                let values = area.filter(x => x != 0);
                return values.length == new Set(values).size;
            }

            setNumber() {
                if (!this.solved) {
                    this.number = this.possibilities[this.currentIndex];
                    this.game.puzzle[this.row][this.column] = this.possibilities[this.currentIndex];
                }
            }

            handleOnePossibility() {
                if (this.possibilities.length == 1) {
                    this.solve == true;
                    this.setNumber();
                }
            }

            isValid() {

                for (const unit of [this.game.getRow(this.row), this.game.getColumn(this.column), this.game.getBox(this.row, this.column)]) {
                    if (!this.checkArea(unit)) {
                        return false;
                    }
                }
                return true;
            }

            incrementValue() {
                while (!this.isValid() && this.currentIndex < (this.possibilities.length - 1)) {
                    this.currentIndex++;
                    this.setNumber();
                }
            }
        }

        class SudokuSolver {
            constructor(puzzle) {
                this.puzzle = puzzle;
                this.solvePuzzle = [];
                this.boxSize = parseInt((this.puzzle.length) ** .5);
                this.backtrackCoord = 0;
                this.currentClass = this;
            }

            getRow(rowNumber) {
                return this.puzzle[rowNumber];
            }

            getColumn(columnNumber) {
                let result = [];
                for (const row of this.puzzle) {
                    result.push(row[columnNumber])
                }
                return result;
            }

            findBoxStart(coordinate) {
                return parseInt(coordinate / this.boxSize) * this.boxSize;
            }

            getBoxCoordinates(rowNumber, columnNumber) {
                let result = [];
                result.push(this.findBoxStart(columnNumber))
                result.push(this.findBoxStart(rowNumber))

                return result;
            }

            getBox(rowNumber, columnNumber) {
                let starts = this.getBoxCoordinates(rowNumber, columnNumber);
                let startY = starts[0];
                let startX = starts[1];

                let box = [];

                for (let i = startX; i < this.boxSize + startX; i++) {
                    box.push(this.puzzle[i].slice(startY, startY + this.boxSize))
                }

                box = box.reduce((a, b) => a.concat(b));
                return box;
            }

            initializeBoard() {
                for (let rowNum = 0; rowNum < this.puzzle.length; rowNum++) {
                    for (let colNum = 0; colNum < this.puzzle[rowNum].length; colNum++) {
                        this.solvePuzzle.push(new Cell(colNum, rowNum, this.puzzle[rowNum][colNum], this))
                    }
                }
            }

            moveForward() {
                while (this.backtrackCoord < (this.solvePuzzle.length - 1)
                    && this.solvePuzzle[this.backtrackCoord].solved) {
                    this.backtrackCoord++;
                }
            }

            backtrack() {
                this.backtrackCoord--;
                while (this.solvePuzzle[this.backtrackCoord].solved) {
                    this.backtrackCoord--;
                }
            }

            setCell() {
                let cell = this.solvePuzzle[this.backtrackCoord];
                cell.setNumber();
                return cell;
            }

            resetCell(cell) {
                cell.currentIndex = 0;
                cell.number = 0;
                this.puzzle[cell.row][cell.column] = 0;
            }

            decrementCell(cell) {
                while (cell.currentIndex == (cell.possibilities.length - 1)) {
                    this.resetCell(cell)
                    this.backtrack();
                    cell = this.solvePuzzle[this.backtrackCoord];
                }
                cell.currentIndex++;
            }

            changeCells(cell) {
                if (cell.isValid()) {
                    this.backtrackCoord++;
                } else {
                    this.decrementCell(cell);
                }
            }

            solve() {
                this.moveForward();
                let cell = this.setCell();
                cell.incrementValue();
                this.changeCells(cell);
            }

            runSolve() {
                while (this.backtrackCoord <= (this.solvePuzzle.length - 1)) {
                    this.solve();
                }
            }
        }


        let boardIsValid = validSudokuBoard(getPuzzle()[1]);
        if (boardIsValid) {
            let puzzle = getPuzzle()[0];
            var result = new SudokuSolver(puzzle);
            result.initializeBoard();
            result.runSolve();
            writeSolvedSudoku(result.puzzle);
        } else {
            alert("Invalid board!")
        }
    }

    //mark all numbers that are given by user as input
    function markAddedNumbers() {
        let currentBoard = getPuzzle()[1];
        console.log(currentBoard);

        for (let i = 0; i < currentBoard.length; i++) {
            for (let j = 0; j < currentBoard[i].length; j++) {
                let cell = currentBoard[i][j]
                let currentElement = document.getElementById(`cell-${cell.cellNumber}`);
                if (cell.number !== 0) {
                    currentElement.classList.add("disabled")
                }
            }
        }

    }

    //Check if current board contains invalid numbers
    function validSudokuBoard(currentBoard) {
        for (let i = 0; i <= 80; i++) {
            let cell = document.getElementById(`cell-${i}`)
            if (cell.style.background == "rgb(255, 0, 0)") {
                return false;
            }
        }
        return true;

    }

    //check if current cell has valid number, if not, set it background to red 
    function validateCell() {

        if (this.value != "") {
            let informationBoard = getPuzzle()[1];

            let cellToFind = +this.id.split("-")[1];

            for (let i = 0; i < informationBoard.length; i++) {
                for (let j = 0; j < informationBoard[i].length; j++) {
                    let cell = informationBoard[i][j];
                    if (cell.cellNumber == cellToFind) {
                        let currentElement = document.getElementById(`cell-${cell.cellNumber}`);
                        if (!isValid(cell.row, cell.col, informationBoard, cell)) {
                            currentElement.style.background = "#ff0000";
                            for (let i = 0; i < informationBoard.length; i++) {
                                for (let j = 0; j < informationBoard[i].length; j++) {
                                    let cell = informationBoard[i][j];
                                    if (!isValid(cell.row, cell.col, informationBoard, cell)) {
                                        let currentElement = document.getElementById(`cell-${cell.cellNumber}`);
                                        currentElement.style.background = "#ff0000";
                                    }
                                }
                            }
                        } else {
                            currentElement.style.background = "";

                            for (let i = 0; i < informationBoard.length; i++) {
                                for (let j = 0; j < informationBoard[i].length; j++) {
                                    let cell = informationBoard[i][j];
                                    if (isValid(cell.row, cell.col, informationBoard, cell)) {
                                        let currentElement = document.getElementById(`cell-${cell.cellNumber}`);
                                        currentElement.style.background = "";
                                    }
                                }
                            }
                            return;
                        }

                    }
                }
            }


            function isValid(row, column, board, cell) {

                let possibilities = getRow(row, board).concat(getColumn(column, board), getBox(row, column, board)).filter(x => x.number != 0);


                for (const element of possibilities) {
                    if (cell.number == element.number && (cell.row != element.row || cell.col != element.col)) {
                        return false;
                    }
                }

                return true;
            }

            function getRow(rowNumber, board) {
                let currentRow = board[rowNumber];
                return currentRow;
            }

            function getColumn(columnNumber, board) {
                let result = [];
                for (const row of board) {
                    result.push(row[columnNumber])
                }
                return result;
            }

            function findBoxStart(coordinate) {
                return parseInt(coordinate / 3) * 3;
            }

            function getBoxCoordinates(rowNumber, columnNumber) {
                let result = [];
                result.push(findBoxStart(columnNumber))
                result.push(findBoxStart(rowNumber))

                return result;
            }

            function getBox(rowNumber, columnNumber, board) {
                let starts = getBoxCoordinates(rowNumber, columnNumber);
                let startY = starts[0];
                let startX = starts[1];
                let box = [];

                for (let i = startX; i < 3 + startX; i++) {
                    box.push(board[i].slice(startY, startY + 3))
                }

                box = box.reduce((a, b) => a.concat(b));
                return box;
            }
        }
    }

    //clear sudoku board
    //change button to "SOLVE"
    //enable all inputs 
    function resetSudoku() {
        for (let i = 0; i <= 80; i++) {
            let cell = document.getElementById(`cell-${i}`)
            cell.disabled = false;
            cell.classList.remove("disabled");
            cell.value = "";
        }
        changeBtn();
    }

    //change buttons to "SOLVE" and "RESET"
    function changeBtn() {
        solveBtn.style.display = solveBtn.style.display == "none" ? "initial" : "none";
        resetBtn.style.display = resetBtn.style.display == "initial" ? "none" : "initial";
    }

    //write down the solved sudoku
    //change the button to "RESET"
    //disable all inputs 
    function writeSolvedSudoku(solvedSudoku) {
        let counter = 0;

        for (let row = 0; row < solvedSudoku.length; row++) {
            for (let col = 0; col < solvedSudoku[row].length; col++) {
                let cell = document.getElementById(`cell-${counter++}`)
                cell.disabled = true;
                cell.value = solvedSudoku[row][col];
            }
        }

        changeBtn();
    }


    //get current puzzle and return: 
    //first matrix of current board values 
    function getPuzzle() {
        let puzzleToSolve = [];
        let puzzleToCheck = [];
        let row = [];

        let rowCount = 0;
        let colCount = 0;

        for (let i = 0; i <= 80; i++) {
            let cell = document.getElementById(`cell-${i}`)

            let cellInfo = {
                number: cell.value == "" ? 0 : +cell.value,
                row: rowCount,
                col: colCount,
                cellNumber: i,
            };
            colCount++;
            row.push(cellInfo);

            if (i == 8 || i == 17 || i == 26 || i == 35 || i == 44 || i == 53 || i == 62 || i == 71 || i == 80) {
                puzzleToSolve.push(row.map(x => x.number));
                puzzleToCheck.push(row);
                row = [];
                rowCount++;
                colCount = 0;
            }

        }

        return [puzzleToSolve, puzzleToCheck];
    }

}
