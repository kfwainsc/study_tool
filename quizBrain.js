export class Question {
  constructor(ask, options, feedback) {
    this._ask = ask;
    this._answer = options[0];
    this._options = options;
    this._feedback = feedback;
    this._done = false;
    this._attempts = 0;
  }
  get ask() {
    return this._ask;
  }
  get answer() {
    return this._answer;
  }
  get options() {
    return this._options;
  }
  get feedback() {
    return this._feedback;
  }
  get done() {
    return this._done;
  }
  get attempts() {
    return this._attempts;
  }
  checkAnswer(answer) {
    if (typeof answer !== "string") throw new TypeError("Answer parameter must be of type string");
    else if (!this._done) {
      ++this._attempts;
      if (answer === this._answer) {
        this._done = true;
        return true;
      }
      return false;
    } else throw new Error("Question already properly answered");
  }
  shuffleOptions() {
    for (let i = this._options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._options[i], this._options[j]] = [this._options[j], this._options[i]];
    }
  }
  reset() {
    this._done = false;
    this._attempts = 0;
  }
}

export class Quiz {
  constructor(title, questList) {
    this._title = title;
    this._questList = questList;
    this._currQ = 0;
    this._correctCount = 0;
    this._attemptCount = 0;
    this._goNext = false;
    this._endQuiz = false;
  }
  get title() {
    return this._title;
  }
  get questList() {
    return this._questList;
  }
  get currQ() {
    return this._currQ;
  }
  get goNext() {
    return this._goNext;
  }
  set goNext(choice) {
    this._goNext = choice;
  }
  get correctCount() {
    return this._correctCount;
  }
  get endQuiz() {
    return this._endQuiz;
  }
  getCurrQuest() {
    if (this._currQ == 0) return this._questList[0];
    else return this._questList[this._currQ - 1];
  }
  // FIGURE OUT HOW TO MAKE PASS BY REF
  askQuestion() {
    ++this._currQ;
    this._goNext = false;
    if (this._currQ === this._questList.length) {
      this._endQuiz = true;
    }
    return this._questList[this._currQ - 1];
  }
  checkAnswer(answer) {
    if (this._currQ - 1 < 0) {
      throw new Error("No questions have been asked");
    }
    ++this._attemptCount;
    this._goNext = true;
    if (this._questList[this._currQ - 1].checkAnswer(answer)) {
      ++this._correctCount;
      return true;
    }
    return false;
  }
  previousQuest() {
    if (this._currQ == 0) throw new Error("At 1st question, cannot go backwards");
    else if (this._currQ == 1) {
      return this._questList[0];
    } else {
      this._currQ -= 1;
      return this._questList[this._currQ - 1];
    }
  }
  calcAccuracy() {
    if (this._attemptCount == 0 || this._correctCount == 0) {
      return 0;
    } else if (this._attemptCount < this._questList.length) {
      return (this._correctCount / this._questList.length) * 100;
    } else {
      return (this._correctCount / this._attemptCount) * 100;
    }
  }
  restart() {
    for (const q of this._questList) {
      q.reset();
    }
    this._currQ = 0;
    this._correctCount = 0;
    this._attemptCount = 0;
    this._goNext = false;
    this._endQuiz = false;
  }
}
