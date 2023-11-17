const registerButton = document.getElementById("register-btn");
const percentTextArea = document.getElementById("showpercentage");
registerButton.addEventListener("click", register);
const userGuess = document.getElementById("user-guess");
const ageOut = document.getElementById("age-out");
const acceptBtn = document.getElementById("accept");
const usersWord = document.getElementById("scrambled-word");
const info = document.getElementById("info");
const scoreOutput = document.getElementById("score");
const playArea = document.getElementById("play-area");
const guessContainer = document.getElementById("guess-container");
const startBtn = document.getElementById("start-btn");
const endBtn = document.getElementById("end-btn");
const nextBtn = document.getElementById("next-btn");
const showBtn = document.getElementById("show");
const showCharts = document.getElementById("showcharts");

let playerData = [];
let player = null;
let score = 0;
let totalQuestions = 0;
let stp = false;

function register() {
  const form = document.getElementById("player-form");
  const firstName = form.elements["first-name"].value;
  const lastName = form.elements["last-name"].value;
  const email = form.elements["email"].value;
  const dob = new Date(form.elements["dob"].value);
  const gender = form.elements["gender"].value;
  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$");

  if (firstName.length < 3) {
    alert("Please enter a valid first name with at least 3 characters.");
    return false;
  }

  if (lastName.length < 3) {
    alert("Please enter a valid last name with at least 3 characters.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid Gmail address.");
    return false;
  }

  if (isNaN(dob.getTime())) {
    alert("Please enter a valid date of birth.");
    return false;
  }

  const ageInMilliseconds = Date.now() - dob.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  ageOut.value = Math.round(ageInYears);
  if (Math.round(ageInYears) < 8 || Math.round(ageInYears) > 12) {
    alert(
      "You are " +
        Math.round(ageInYears) +
        ". You must be between 8 and 12 years old to register."
    );
    return false;
  }

  if (gender === "") {
    alert("Please select a gender.");
    return false;
  }
  player = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dob: dob.toLocaleDateString(),
    gender: gender,
    age: Math.round(ageInYears),
    answers: [],
  };

  playerData.push(player);

  console.log(playerData);


  const formElements = form.elements;
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].disabled = true;
  }
  const registerBtn = document.getElementById("register-btn");
  registerBtn.disabled = true;

  startBtn.disabled = false;
  endBtn.disabled = false;
  showBtn.disabled = false;

  alert("Successfully registered!");

  playArea.scrollIntoView({ behavior: "smooth" });

}

function updateBoard() {
  scoreOutput.innerHTML = score;
}


setInterval(function () {
  showfreq();
}, 5000);

function checkAnswer(userAnswer, correctAnswer) {
  let x = {};
  x.equation = document.getElementById("equation").textContent;
  x.answer = userAnswer;
  x.correct = correctAnswer;
  x.canswer = userGuess.getAttribute('data-correct-answer');

  if (userAnswer === correctAnswer) {
    info.innerHTML = "<span class='correct'>Correct! Well done!</span>";
    score += 1;
    x.correct = true;
  } else {
    info.innerHTML = "<span class='incorrect'>Incorrect. Try again!</span>";
    x.correct = false;
  }

  playerData[playerData.length - 1].answers.push(x);
  x=[];
  console.log(playerData);

  updateBoard();
  findPercentageScore();
  showall();
}


function PlayGame() {
  const number1 = Math.floor(Math.random() * 9) + 1; // Number from 1 to 9
  const number2 = Math.floor(Math.random() * 5) + 1; // Number from 1 to 5

  const equationText = `${number1} * ${number2}`;
  document.getElementById("equation").textContent = equationText;

  userGuess.value = "";
  userGuess.disabled = false;
  acceptBtn.disabled = false;
  info.textContent = "";

  userGuess.setAttribute('data-correct-answer', eval(equationText).toString());

  totalQuestions += 1;
}


function findPercentageScore() {
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const playerName = firstName + " " + lastName;

  document.getElementById("showpercentage").value = "";

  const currentDate = new Date().toLocaleDateString();

  const correctAnswers = score;

  const percentageScore = (correctAnswers / totalQuestions) * 100;

  percentTextArea.value = `Player Name: ${playerName}\nDate: ${currentDate}\n\nTotal Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nPercentage Score: ${percentageScore.toFixed(
    2
  )}%`;

  playerData[playerData.length - 1].percentage = percentageScore.toFixed(2);
}

function clearForm() {
  score = 0;
  totalQuestions = 0;

  const form = document.getElementById("player-form");
  form.reset();

  const formElements = form.elements;

  for (let i = 0; i < formElements.length; i++) {
    formElements[i].disabled = false;
  }
  startBtn.disabled = true;
  endBtn.disabled = true;
  nextBtn.disabled = true;
  acceptBtn.disabled = true;
  stp = true;
  info.innerHTML = "";

  playArea.disabled = true;
  percentTextArea.value = "";
  usersWord.innerHTML = "";
  guessContainer.disabled = true;
  scoreOutput.innerHTML = "";
  timerOut.innerHTML = "";
}

function showall() {
  let showall = document.getElementById("showallplayers");
  showall.innerHTML = "";
  for (let i = 0; i < playerData.length; i++) {
    showall.innerHTML += "-----------------------------\n";
    showall.innerHTML += "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
    showall.innerHTML += "-----------------------------\n";
    showall.innerHTML += "Player " + (i + 1) + ":\n";
    showall.innerHTML += "First Name: " + playerData[i].firstName + "\n";
    showall.innerHTML += "Last Name: " + playerData[i].lastName + "\n";
    showall.innerHTML += "Email: " + playerData[i].email + "\n";
    showall.innerHTML += "Date of Birth: " + playerData[i].dob + "\n";
    showall.innerHTML += "Gender: " + playerData[i].gender + "\n";
    showall.innerHTML += "Age: " + playerData[i].age + "\n";
    showall.innerHTML += "Percentage: " + playerData[i].percentage + "\n";
    showall.innerHTML += "----------Answers--------\n";

    playerData[i].answers.forEach((answer) => {
      showall.innerHTML += "Answer: " + answer.answer + "\n";
      showall.innerHTML += "Correct Answer: " + answer.canswer + "\n";
      showall.innerHTML += "Correct: " + answer.correct + "\n";
      showall.innerHTML += "------------------------\n";
    });
  }
}

function showfreq() {
  const malePlayers = playerData.filter((player) => player.gender === "male");

  const femalePlayers = playerData.filter(
    (player) => player.gender === "female"
  );

  const maleCount = malePlayers.length;
  const femaleCount = femalePlayers.length;

  const total = playerData.length;
  const malePercent = (maleCount / total) * 100;
  const femalePercent = (femaleCount / total) * 100;

  const genderTable = document.getElementById("gender-table");
  if (maleCount != 0 || femaleCount != 0) {
    genderTable.innerHTML = `

    <tr>
      <td>Male    : </td>
      <td><img src="bar.png" height="20px" width="${malePercent}"></td>
      <td>${malePercent.toFixed(1)}%</td>
    </tr>
    <br>
    <tr>
      <td>Female  :</td>
      <td><img src="bar.png" height="20px" width="${femalePercent}"></td>
      <td>${femalePercent.toFixed(1)}%</td>
    </tr>
  `;
  }

  const percentageRanges = [
    { range: "<50", min: 0, max: 49 },
    { range: "50 to 59", min: 50, max: 59 },
    { range: "60 to 69", min: 60, max: 69 },
    { range: "70 to 79", min: 70, max: 79 },
    { range: "80 to 89", min: 80, max: 89 },
    { range: "90 to 99", min: 90, max: 99 },
    { range: "100", min: 100, max: 100 },
  ];

  const frequencyChart = {};

  for (let i = 0; i < playerData.length; i++) {
    const score = playerData[i].percentage;
    for (let j = 0; j < percentageRanges.length; j++) {
      const range = percentageRanges[j];
      if (score >= range.min && score <= range.max) {
        if (frequencyChart[range.range]) {
          frequencyChart[range.range]++;
        } else {
          frequencyChart[range.range] = 1;
        }
        break;
      }
    }
  }

  const scoreTable = document.getElementById("freq-table");
  scoreTable.innerHTML = "";

  percentageRanges.forEach((range) => {
    const frequency = frequencyChart[range.range] || 0;
    const percentage = ((frequency / total) * 100).toFixed(2);

    if (percentage > 0) {
      scoreTable.innerHTML += `
    <tr>
      <td>${range.range}: </td>
      <td><img src="bar.png" height="20px" width="${percentage}"></td>
      <td>   ${percentage}%</td>
    </tr>
    <br>
    `;
    }
  });
}

acceptBtn.addEventListener("click", function () {
  const userAnswer = parseInt(userGuess.value, 10);
  const correctAnswer = parseInt(userGuess.getAttribute('data-correct-answer'), 10);
  checkAnswer(userAnswer, correctAnswer);
  userGuess.value = "";
  acceptBtn.disabled = true;
  userGuess.disabled = true;
  guessContainer.disabled = true;
});

playArea.addEventListener(
  "keypress",
  function (e) {
    if (e.key === "Enter") {
      checkAnswer(userGuess.value, userGuess.getAttribute('data-correct-answer'));
      guessContainer.disabled = true;
      userGuess.value = "";
      acceptBtn.disabled = true;
      stp = true;
      
    }
  },
  false
);

nextBtn.addEventListener("click", function () {
  acceptBtn.disabled = false;
  guessContainer.disabled = false;
  PlayGame();
});
startBtn.addEventListener("click", function () {
  PlayGame();
  nextBtn.disabled = false;
  acceptBtn.disabled = false;
});
endBtn.addEventListener("click", function () {
  findPercentageScore();
  clearForm();
  scoreOutput.innerHTML = "";
  showCharts.scrollIntoView({ behavior: "smooth" });
});
showBtn.addEventListener("click", function () {
  findPercentageScore();
  percentTextArea.scrollIntoView({ behavior: "smooth" });
});
