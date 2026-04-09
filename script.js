// game state
let answer = 0;
let guessCount = 0;
let totalWins = 0;
let totalGuesses = 0;
let scores = []; 
let range = 3; 

// timer variables
let startTime = 0;
let totalTime = 0;
let fastestTime = Infinity;

// player name
let rawName = prompt("Enter your name");
let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// time and date
function time() {
  let d = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month = months[d.getMonth()];
  let date = d.getDate();
  let year = d.getFullYear();

  // day suffixes
  let suffix = "th";
  if (date % 10 === 1 && date !== 11) suffix = "st";
  else if (date % 10 === 2 && date !== 12) suffix = "nd";
  else if (date % 10 === 3 && date !== 13) suffix = "rd";

  let timeStr = d.toLocaleTimeString(); 
  document.getElementById("date").textContent = month + " " + date + suffix + ", " + year + " - " + timeStr;
}
setInterval(time, 1000);
time();

// play button
function play() {
  let radios = document.getElementsByName("level");
  range = 3; 
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      range = parseInt(radios[i].value);
    }
  }
  
  // round setup
  answer = Math.floor(Math.random() * range) + 1;
  guessCount = 0; 
  startTime = new Date().getTime(); 

  // disable buttons and radio choices
  document.getElementById("msg").textContent = playerName + ", guess a number between 1 and " + range;
  document.getElementById("guess").value = "";
  document.getElementById("guessBtn").disabled = false;
  document.getElementById("giveUpBtn").disabled = false;
  document.getElementById("playBtn").disabled = true;

  let levelRadios = document.getElementsByName("level");
  for (let i = 0; i < levelRadios.length; i++) {
    levelRadios[i].disabled = true;
  }
}

// guessing
function makeGuess() {
  let input = document.getElementById("guess").value;
  let num = parseInt(input);

  if (isNaN(num)) {
    document.getElementById("msg").textContent = "Please enter a valid number!";
    return;
  }

  guessCount = guessCount + 1;
  let diff = Math.abs(num - answer);

  // correct
  if (num === answer) {
    document.getElementById("msg").textContent = "Correct! " + playerName + " got it in '" + guessCount + "' guesses!";
    updateScore(guessCount);
    updateTimers(new Date().getTime()); 
    reset(); 
  }
  // higher 
  else if (num > answer) {
    let temp = "";
    if (diff <= 2) {
      temp = "Hot!";
    } else if (diff <= 5) {
      temp = "Warm!";
    } else {
      temp = "Cold!";
    }
    document.getElementById("msg").textContent = "Too high. " + temp;
  }
  // lower
  else {
    let temp = "";
    if (diff <= 2) {
      temp = "Hot!";
    } else if (diff <= 5) {
      temp = "Warm!";
    } else {
      temp = "Cold!";
    }
    document.getElementById("msg").textContent = "Too low. " + temp;
  }
}

// give up
function giveUp() {
  document.getElementById("msg").textContent = playerName + " gave up! The answer was " + answer;
  updateScore(range); 
  updateTimers(new Date().getTime());
  reset();
}

// update score
function updateScore(score) {
  totalWins = totalWins + 1;
  totalGuesses = totalGuesses + score;
  
  // score for round and total wins/avg score
  document.getElementById("wins").textContent = "Total wins: " + totalWins;
  document.getElementById("avgScore").textContent = "Average Score: " + (totalGuesses / totalWins).toFixed(1);

  // update leaderboard
  scores.push(score);
  scores.sort(function(a, b) { return a - b; }); 

  let leaderboard = document.getElementsByName("leaderboard"); 
  for (let i = 0; i < leaderboard.length; i++) {
    if (i < scores.length) {
      leaderboard[i].textContent = scores[i];
    } else {
      leaderboard[i].textContent = "--";
    }
  }
}

// update timers
function updateTimers(endMs) {
  let elapsedSec = (endMs - startTime) / 1000;
  
  if (elapsedSec < fastestTime) {
    fastestTime = elapsedSec;
    document.getElementById("fastest").textContent = "Fastest Game: " + fastestTime.toFixed(2);
  }
  
  totalTime += elapsedSec;
  document.getElementById("avgTime").textContent = "Average Time: " + (totalTime / scores.length).toFixed(2);
}

// reset logic
function reset() {
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("giveUpBtn").disabled = true;
  document.getElementById("playBtn").disabled = false;

  // disable radio level selection
  let radios = document.getElementsByName("level");
  for (let i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }
}

// event listeners
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

//above and beyond

// correct
  if (num === answer) {
    let quality = "";
    if (guessCount <= 2) quality = " Amazing!";
    else if (guessCount <= 5) quality = " Good job!";
    else quality = " Needs work!";

    document.getElementById("msg").textContent = "Correct! " + playerName + " got it in '" + guessCount + "' guesses!" + quality;
    updateScore(guessCount);
    updateTimers(new Date().getTime()); 
    reset(); 
  }

  // enter key support
document.getElementById("guess").addEventListener("keypress", function(event) {
  if (event.key === "Enter" && document.getElementById("guessBtn").disabled === false) {
    event.preventDefault();
    makeGuess();
  }
});