function solve() {
    let solveBtn = document.querySelector(".solveBtn");
    solveBtn.addEventListener("click", showResult);

    let resetBtn = document.querySelector(".resetBtn");
    resetBtn.addEventListener("click",resetTable);

    let inputs = document.getElementsByTagName("input");
    let h1 = document.querySelector("#solution");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].maxLength = 4;
    };


    function showResult() {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value == "") {
                alert("Fill all fields!");
                return;
            }
        };

        let matrix = [
            [
                inputs[0].value,
                inputs[4].value,
                inputs[8].value,
            ], [
                inputs[1].value,
                inputs[5].value,
                inputs[6].value,
            ], [
                inputs[2].value,
                inputs[3].value,
                inputs[7].value,
            ], [
                inputs[2].value,
                inputs[4].value,
                inputs[5].value,
            ], [
                inputs[1].value,
                inputs[3].value,
                inputs[8].value,
            ], [
                inputs[0].value,
                inputs[5].value,
                inputs[7].value,
            ],

        ];

        let result = 0;

        for (let i = 0; i < matrix.length; i++) {

            if (i <= 2) {
                result += matrix[i].reduce((a,b) => a*b,1);
            }else{
                result -= matrix[i].reduce((a,b) => a*b,1);
            }
        }

        let solution = "";
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let currentNumber = matrix[i][j];
                
                if(matrix[i][j] < 0){
                    currentNumber = `(${matrix[i][j]})`
                }
                
                solution += `${currentNumber} `;
                if(j != 2){
                    solution += "* ";
                }
            }
            if(i < 2){
                solution += "+ ";
            }else if(i >= 2 && i != 5){
                solution += "- ";
            };
        }
       
        h1.textContent = solution + " = " + `${result}`;

        solveBtn.style.display = "none";
        resetBtn.style.display = "inline";

    };

    function resetTable(){
        h1.textContent = "";
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        };

        solveBtn.style.display = "inline";
        resetBtn.style.display = "none";
    }
}