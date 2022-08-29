/***********************************************************
  by Kendra Wainscott 2022    
  project:  Study Tool

  file contains the impelementation of the quiz pages
  itself and all interactions with the DOM
************************************************************/
const emergencyBtn = document.getElementById("emergency");
emergencyBtn.addEventListener(
  "click",
  (callAlert = () => {
    alert("GET OFF THIS PAGE and call 9-1-1");
  })
);

let chosenSubject = "";

const opts = document.getElementsByTagName("option");

const chooseSubject = () => {
  for (const opt of opts) {
    if (opt.selected) {
      return JSON.stringify(opt.value);
    }
  }
  throw new Error("Study Topic Selection must be made.");
};
