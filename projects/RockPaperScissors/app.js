let userScore = 0;
let compScore = 0;
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("rock");
const paper_div = document.getElementById("paper");
const scissors_div = document.getElementById("scissors");


function getComputerChoice(){
    const choices = ["rock","paper","scissors"];
    const randomNumber = parseInt(Math.random() * 3);
    return choices[randomNumber];
}

function convertToUpper(word) 
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function win(userChoice,computerChoice){
    const smallUserWord = "user".fontsize(3).sup();
    const smallCompWord = "comp".fontsize(3).sup();
    const userChoice_div = document.getElementById(userChoice);
    userScore++;
    userScore_span.innerHTML = userScore;

    result_p.innerHTML = `${convertToUpper(userChoice)}${smallUserWord} beats ${convertToUpper(computerChoice)}${smallCompWord}. You win!`;

    userChoice_div.classList.add("green-glow");
    setTimeout(() => {
        userChoice_div.classList.remove("green-glow");
    }, 420);
    
    
}

function lose(userChoice,computerChoice){
    const smallUserWord = "user".fontsize(3).sup();
    const smallCompWord = "comp".fontsize(3).sup();
    const userChoice_div = document.getElementById(userChoice);
    compScore++;
    computerScore_span.innerHTML = compScore;
    result_p.innerHTML = `${convertToUpper(userChoice)}${smallUserWord} loses to ${convertToUpper(computerChoice)}${smallCompWord}. You lost!`;

    userChoice_div.classList.add("red-glow");
    setTimeout(() => {
        userChoice_div.classList.remove("red-glow");
    }, 420);
}

function draw(userChoice,computerChoice){
    const smallUserWord = "user".fontsize(3).sup();
    const smallCompWord = "comp".fontsize(3).sup();
    const userChoice_div = document.getElementById(userChoice);

    result_p.innerHTML = `${convertToUpper(userChoice)}${smallUserWord} equals ${convertToUpper(computerChoice)}${smallCompWord}. It's a draw!`;

    userChoice_div.classList.add("gray-glow");
    setTimeout(() => {
        userChoice_div.classList.remove("gray-glow");
    }, 420);

}


function game(userChoice){
    const computerChoice = getComputerChoice();
    
    switch(userChoice + computerChoice){
        case "rockscissors":
        case "scissorspaper":
        case "paperrock":
            win(userChoice,computerChoice);
            break;
        case "scissorsrock":
        case "rockpaper":
        case "paperscissors":
            lose(userChoice,computerChoice);
            break;
        case "rockrock":
        case "paperpaper":
        case "scissorsscissors":
            draw(userChoice,computerChoice);
            break;

    }
}

function main() {
    rock_div.addEventListener("click", function () {
        game("rock")
    })

    paper_div.addEventListener("click", function () {
        game("paper")
    })

    scissors_div.addEventListener("click", function () {
        game("scissors")
    })
}

main();