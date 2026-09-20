const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const restartButton = document.getElementById("restart-btn");

// Step 1 - Hide game and end screen
gameScreen.style.display = "none";
endScreen.style.display = "none";

const questionElement = document.getElementById("question");
const answerButtons = document.querySelectorAll(".answer-btn");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const finalScoreElement = document.getElementById("final-score");

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Tool Multi Language",
      "Home Tool Markup Language",
    ],
    correctAnswerIndex: 0,
  },

  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "CSS", "Java", "Python"],
    correctAnswerIndex: 1,
  },

  {
    question: "Which language is used to make web pages interactive?",
    options: ["HTML", "CSS", "JavaScript", "SQL"],
    correctAnswerIndex: 2,
  },

  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswerIndex: 1,
  },

  {
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-color", "color", "background-color"],
    correctAnswerIndex: 2,
  },

  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["variable", "var", "declare", "letvar"],
    correctAnswerIndex: 1,
  },

  {
    question: "Which method is used to add an item to the end of an array?",
    options: ["push()", "add()", "append()", "insert()"],
    correctAnswerIndex: 0,
  },

  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets",
    ],
    correctAnswerIndex: 1,
  },

  {
    question: "Which symbol is used for a single-line comment in JavaScript?",
    options: ["<!--", "/*", "//", "#"],
    correctAnswerIndex: 2,
  },

  {
    question: "Which JavaScript method selects an element by its ID?",
    options: [
      "document.getElementById()",
      "document.selectId()",
      "document.getId()",
      "document.findId()",
    ],
    correctAnswerIndex: 0,
  },
];

const game = {
  score: 0,
  lives: 3,
  currentQuestionIndex: 0,
  askedQuestions: [],
};

let timer;
let timeLeft = 15;

const timerElement = document.getElementById("timer");

// handling timer
function startTimer() {
  timeLeft = 15;
  timerElement.textContent = timeLeft;

  timer = setInterval(function () {
    timeLeft = timeLeft - 1;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);

      // Time out = wrong answer
      game.lives = game.lives - 1;
      livesElement.textContent = "❤️".repeat(game.lives);

      console.log("Time's up! Wrong answer!");

      // Game over if no lives remain
      if (game.lives === 0) {
        finalScoreElement.textContent = game.score;
        gameScreen.style.display = "none";
        endScreen.style.display = "block";

        return;
      }

      // Move to next question
      if (game.askedQuestions.length < questions.length) {
        showRandomQuestion();
        startTimer();
      } else {
        finalScoreElement.textContent = game.score;
        gameScreen.style.display = "none";
        endScreen.style.display = "block";
      }
    }
  }, 1000);
}

//step-2 start game: Listen to Start button click
const startButton = document.getElementById("start-btn");

startButton.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  endScreen.style.display = "none";

  startTimer();
});

// Display random question without repeats
let currentQuestion;

function showRandomQuestion() {
  try {
    // Check if questions array is empty
    if (questions.length === 0) {
      throw new Error("No questions available.");
    }

    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (game.askedQuestions.includes(randomIndex));

    currentQuestion = questions[randomIndex];

    // Check if question has required data
    if (
      !currentQuestion.question ||
      !Array.isArray(currentQuestion.options) ||
      currentQuestion.options.length !== 4 ||
      typeof currentQuestion.correctAnswerIndex !== "number"
    ) {
      throw new Error("Question data is invalid.");
    }

    game.askedQuestions.push(randomIndex);

    game.currentQuestionIndex = randomIndex;

    questionElement.textContent = currentQuestion.question;

    answerButtons.forEach(function (button, index) {
      button.textContent = currentQuestion.options[index];
    });
  } catch (error) {
    questionElement.textContent =
      "Sorry, something went wrong while loading the question.";

    console.log(error);

    answerButtons.forEach(function (button) {
      button.textContent = "";
      button.disabled = true;
    });
  }
}

showRandomQuestion();

answerButtons.forEach(function (button, index) {
  button.addEventListener("click", function () {
    if (index === currentQuestion.correctAnswerIndex) {
      game.score = game.score + 1;

      scoreElement.textContent = game.score;

      console.log("Correct answer!");
    } else {
      game.lives = game.lives - 1;

      livesElement.textContent = "❤️".repeat(game.lives);

      console.log("Wrong answer!");

      if (game.lives === 0) {
        finalScoreElement.textContent = game.score;
        gameScreen.style.display = "none";
        endScreen.style.display = "block";

        return;
      }
    }

    // stop the timer before moving to the next question
    clearInterval(timer);
    // Move to next question
    if (game.askedQuestions.length < questions.length) {
      showRandomQuestion();
      startTimer();
    } else {
      finalScoreElement.textContent = game.score;
      gameScreen.style.display = "none";
      endScreen.style.display = "block";
    }
  });
});

//play again button
restartButton.addEventListener("click", function () {
  clearInterval(timer);

  game.score = 0;
  game.lives = 3;
  game.currentQuestionIndex = 0;
  game.askedQuestions = [];

  scoreElement.textContent = game.score;
  livesElement.textContent = "❤️❤️❤️";

  endScreen.style.display = "none";
  gameScreen.style.display = "block";

  showRandomQuestion();

  startTimer();
});
