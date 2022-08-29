/***********************************************************
  by Kendra Wainscott 2022    
  project:  Study Tool

  file contains the impelementation of the quiz pages
  itself and all interactions with the DOM
************************************************************/
import {Question, Quiz} from "./quizBrain.js";
//import rawQuizJSON from "./input_files/inputTFD.json" assert {type: "json"};

//const response = await fetch("./input_files/inputPPCP.json");
const response = await fetch("./input_files/inputNREMT.json");
const rawQuizJSON = await response.json();

// Load in questions and create quiz object
const inputQuestions = [];
for (const q of rawQuizJSON.questList) {
  inputQuestions.push(new Question(q.ask, q.options, q.feedback));
}
const quiz = new Quiz(rawQuizJSON.title, inputQuestions);

document.getElementById("quiz-title").innerHTML = rawQuizJSON.title;
document.getElementById("subtitle").innerHTML = rawQuizJSON.subtitle;
document.getElementById("logo").src = rawQuizJSON.logo;
document.getElementById("logo").style.display = "block";

/*******  Assign html elements   **/
// question buttons
const currAsk = document.getElementById("question");
const currOptions = document.getElementsByClassName("option-label");
const currOptBundles = document.getElementsByClassName("option-bundle");
const radioBtns = document.getElementsByClassName("option");
// quiz navigation buttons
const allNavBtns = document.getElementsByClassName("btn");
const backBtn = document.getElementById("btn-back");
const checkBtn = document.getElementById("btn-check-answer");
const nextBtn = document.getElementById("btn-next");
const roundBtns = document.getElementsByClassName("roundBtns");
const resetBtn = document.getElementById("btn-reset");
const finishBtn = document.getElementById("btn-finish");
// feedback and counters
const attempts = document.getElementById("attempts");
const correctCount = document.getElementById("correct-count");
const feedback = document.getElementById("feedback");
const feedbackCorrect = document.getElementById("feedback-correct");
const feedbackAnswer = document.getElementById("feedback-answer");
const feedbackLocation = document.getElementById("feedback-location");

// restart & finish
const runningQuiz = document.getElementById("running-quiz");
const finalResults = document.getElementById("final-results");
const resultsHeaders = document.getElementsByClassName("results-h");
const excellent = document.getElementById("excellent");
const toReview = document.getElementById("to-review");
const unasked = document.getElementById("unasked");

/******   Highlighting for hover/mouseover, clicks  *****/
for (const btn of allNavBtns) {
  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = "whitesmoke";
  });
}
backBtn.addEventListener("mouseenter", () => {
  if (quiz.currQ > 1) backBtn.style.backgroundColor = "lightblue";
});
checkBtn.addEventListener("mouseenter", () => {
  if (!quiz.getCurrQuest().done) {
    checkBtn.style.backgroundColor = "rgba(255, 255, 0, 0.553)";
  }
});
nextBtn.addEventListener("mouseenter", () => {
  if (!quiz.endQuiz) {
    nextBtn.style.backgroundColor = "lightblue";
  }
});
for (const btn of roundBtns) {
  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = "rgb(206, 31, 41, 0.9)";
    btn.style.color = "white";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.color = "black";
  });
}
const checkValidBtns = () => {
  if (quiz.endQuiz && quiz.currQ === quiz.questList.length) nextBtn.disabled = true;
  else nextBtn.disabled = false;
  if (quiz.getCurrQuest().done) checkBtn.disabled = true;
  else checkBtn.disabled = false;
  if (quiz.currQ <= 1) backBtn.disabled = true;
  else backBtn.disabled = false;
  for (const btn of allNavBtns) {
    if (btn.style.backgroundColor !== "whitesmoke") btn.style.backgroundColor = "whitesmoke";
  }
  for (const btn of roundBtns) {
    if (btn.style.color === "white") btn.style.color = "black";
  }
};
// highlighting for select and deselect radio btn elements
// find a more efficient way to do this
/*for (const btn of radioBtns) {
  btn.addEventListener("change", () => {
    for (const i in radioBtns) {
      if (radioBtns[i].checked == true) {
        currOptBundles[i].style.backgroundColor = "rgba(173, 216, 230, 0.534)";
        currOptBundles[i].style.border = "0.25rem dashed black";
      } else if (radioBtns[i].checked == false) {
        currOptBundles[i].style.backgroundColor = "whitesmoke";
        currOptBundles[i].style.border = "0.25rem dashed rgba(173, 216, 230, 0.534)";
      }
    }
  });
}*/
for (let i = 0; i < currOptBundles.length; ++i) {
  currOptBundles[i].addEventListener("click", () => {
    radioBtns[i].checked = true;
    for (const i in radioBtns) {
      if (radioBtns[i].checked == true) {
        currOptBundles[i].style.backgroundColor = "rgba(173, 216, 230, 0.534)";
        currOptBundles[i].style.border = "0.25rem dashed black";
      } else if (radioBtns[i].checked == false) {
        currOptBundles[i].style.backgroundColor = "whitesmoke";
        currOptBundles[i].style.border = "0.25rem dashed rgba(173, 216, 230, 0.534)";
      }
    }
  });
}
// for new question, set new answers for radio buttons
const setNewOptions = (newQ) => {
  newQ.shuffleOptions();
  let i = 0;
  for (const option of currOptions) {
    if (newQ.options[i] == undefined) {
      currOptBundles[i].style.display = "none";
      option.innerHTML = ""; ////////////////////////////
      radioBtns[i].value = ""; ////////////////////////
      radioBtns[i].checked = false;
    } else {
      currOptBundles[i].style.display = "block";
      // unhighlight if was checked
      currOptBundles[i].style.backgroundColor = "whitesmoke";
      currOptBundles[i].style.border = "0.25rem dashed rgba(173, 216, 230, 0.534)";
      option.innerHTML = `${newQ.options[i]}`;
      radioBtns[i].value = `${newQ.options[i]}`;
      radioBtns[i].checked = false;
    }
    ++i;
  }
};

// for new question, set new answers for radio buttons
const setNewQuestion = () => {
  //below can be better logic or fixed with submit
  if (quiz.goNext || quiz.getCurrQuest().attempts > 0) {
    feedback.style.display = "none"; //can probs removew wt logic
    const currQ = quiz.askQuestion();
    currAsk.innerHTML = currQ.ask;
    if (currQ.done) {
      quiz.goNext = true; ////////////////*
      displayFinishedQuest(currQ);
      displayFeedback("true");
    } else {
      setNewOptions(currQ); //diplay all opts if not done or new
      if (currQ.attempts > 0) {
        displayFeedback(false);
        quiz.goNext = true; ////////////////*
      }
    }
    checkValidBtns();
  } else alert("question must be checked before moving on");
};
nextBtn.addEventListener("click", setNewQuestion);

// inital set up, also called for reset
const setUp = () => {
  feedback.style.display = "none";
  correctCount.innerHTML = "Correct: 0";
  let currQ = quiz.askQuestion();
  currAsk.innerHTML = currQ.ask;
  setNewOptions(currQ);
  checkValidBtns();
};
setUp();

const displayFeedback = (correct) => {
  if (correct) {
    feedbackCorrect.innerHTML = "CORRECT :)";
    feedbackCorrect.style.color = "green";
    feedbackAnswer.innerHTML = `${quiz.getCurrQuest().feedback.info}`;
    feedbackLocation.innerHTML = `${quiz.getCurrQuest().feedback.location}`;
  } else {
    feedbackCorrect.innerHTML = "INCORRECT :(";
    feedbackCorrect.style.color = "red";
    feedbackAnswer.innerHTML = "";
    feedbackLocation.innerHTML = `${quiz.getCurrQuest().feedback.location}`;
  }
  /// MOVE TO set Question??
  attempts.innerHTML = `Attempts: ${quiz.getCurrQuest().attempts}`;
  correctCount.innerHTML = `Correct: ${quiz.correctCount} of ${quiz.questList.length}`;
  // REDUNANT somwwhere?
  feedback.style.display = "block";
};

const checkAnswer = () => {
  if (!quiz.getCurrQuest.done) {
    let answer = undefined;
    for (const btn of radioBtns) {
      if (btn.checked) {
        answer = btn.value;
        quiz.goNext = true;
        break;
      }
    }
    if (answer === undefined) alert("Please select an option");
    else if (typeof answer !== "string")
      throw new Error("invalid answer input, must be type string");
    else displayFeedback(quiz.checkAnswer(answer));
  } else throw new Error("Question already properly answered");
};
checkBtn.addEventListener("click", checkAnswer);

const displayFinishedQuest = (doneQ) => {
  currOptBundles[0].style.display = "block";
  currOptions[0].innerHTML = doneQ.answer;
  for (let i = 1; i < currOptions.length; ++i) {
    currOptBundles[i].style.display = "none";
  }
};

const previousQuestion = () => {
  //feedback.style.display = "block";
  const currQ = quiz.previousQuest();
  currAsk.innerHTML = currQ.ask;
  if (currQ.done) {
    displayFinishedQuest(currQ);
  } else {
    setNewOptions(currQ);
  }
  if (currQ.done) displayFeedback("true");
  else if (currQ.attempts > 0) displayFeedback(false);
  checkValidBtns();
  quiz.goNext = true;
};
backBtn.addEventListener("click", previousQuestion);

const restartQuiz = () => {
  if (confirm("Are you sure you want to restart?")) {
    if (runningQuiz.style.display === "none") {
      runningQuiz.style.display = "block";
      finalResults.style.display = "none";

      for (const h of resultsHeaders) {
        if (h.style.display === "none") h.style.display = "block";
      }
      for (const p of document.getElementsByClassName("results-p")) {
        if (p.innerHTML != "") p.innerHTML = "";
      }
      if (unasked.style.display === "none") {
        unasked.style.display = "block";
      }
      if (toReview.style.display === "none") {
        unasked.style.display = "block";
      }
      document.getElementById("accuracy").innerHTML = "Accuracy:";
      finishBtn.disabled = false;
    }
    quiz.restart();
    setUp();
  }
};
resetBtn.addEventListener("click", restartQuiz);

const displayAllQuestions = () => {
  document.getElementById("accuracy").innerHTML += `${quiz.calcAccuracy()}%`;
  for (const quest of quiz.questList) {
    if (quest.done === true && quest.attempts === 1) {
      excellent.innerHTML += `<br><b>${quest.ask}</b><br>${quest.feedback.info}<br><em>${quest.feedback.location}</em><br>`;
    } else if (!quest.done && quest.attempts === 0) {
      unasked.innerHTML += `<br><b>${quest.ask}</b><br>${quest.feedback.info}<br><em>${quest.feedback.location}</em><br>`;
    } else {
      toReview.innerHTML += `<br><b>${quest.ask}</b><br>${quest.feedback.info}<br><em>${quest.feedback.location}</em><br><b>Attempts: ${quest.attempts}</b><br>`;
    }
  }
  if (unasked.innerHTML === "") {
    resultsHeaders[2].style.display = "none";
    if (toReview.innerHTML === "") {
      resultsHeaders[1].style.display = "none";
    }
  }
  if (excellent.innerHTML === "") {
    resultsHeaders[0].style.display = "none";
  }
};

const finishQuiz = () => {
  if (confirm("Are you sure you want to end this quiz?")) {
    document.getElementById("running-quiz").style.display = "none";
    document.getElementById("final-results").style.display = "block";
  }
  displayAllQuestions();
  finishBtn.disabled = true;
};
finishBtn.addEventListener("click", finishQuiz);

/*const finishedJsonQuiz = JSON.stringify(quiz);
export {finishedJsonQuiz};

const finishQuiz = () => {
  if (confirm("Are you sure you want to end this quiz?")) {
    //window.location.href = "./quizResults.html";
    const resultsMain = JSON.parse("./input_files/finalResults.json");
    document.getElementsByTagName("main")[0].innerHTML = resultsMain;
  }
};
finishBtn.addEventListener("click", finishQuiz);
*/
