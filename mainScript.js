const emergencyBtn = document.getElementById("emergency");
emergencyBtn.addEventListener(
  "click",
  (callAlert = () => {
    alert("GET OFF THIS PAGE and call 9-1-1");
  })
);
