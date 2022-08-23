Study Tool Overview

Avaible to try at https://kfwainsc.github.io/study_tool/quizFace

This quiz program is intended as a study tool as the user can keep guessing till they get the question right. However, it does keep track of attempts on each question and an accuracy percentage is given at the end. Feedback and reference information pertaining to the question becomes available upon answering.

The quiz can be restarted or terminated at any time. Until the quiz is terminated the user is free to go backwards/forwards through the questions. A list of correct, incorrect (if not right on first attempt) and unanswered questions is displayed upon termination.

Written in HTML, CSS and JS it makes use of APIs and there is a small test suite using mocha.

A Quiz class exists to hold all current stats and list of input questions which are instances of Question class objects. The list of questions, answers and feedback/resources come from an external JSON file. The program is intended to accept any list of questions (if properly formatted) along with an image/logo pertaining to the subject of the particular quiz.

While still very much a work in progress, it is fully functional and can be used and tested.
