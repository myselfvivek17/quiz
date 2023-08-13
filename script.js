const question = document.querySelector(".question-title");
const options = document.querySelector(".options");
const submitButton = document.querySelector(".submit");
const submitTest = document.querySelector(".submitTest");
const checker = document.querySelector(".checker");
const numberQuestion = document.querySelector("#qno");
let cat = 9;
let number = 1;
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("n") > 0) {
  cat = urlParams.get("q");
  number = urlParams.get("n");
}

for (let i = 0; i < number; i++) {
  const label = document.createElement("label");
  label.setAttribute(
    "class",
    "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm"
  );

  const button = document.createElement("button");
  button.textContent = i + 1;
  button.setAttribute("id", `size-choice-${i}-label`);
  label.appendChild(button);

  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  span.setAttribute(
    "class",
    "pointer-events-none absolute -inset-px rounded-md"
  );
  label.appendChild(span);
  numberQuestion.appendChild(label);
}
const btn = document.querySelectorAll(".question-no button");
let result = 0;
let numberOfAttempted = 0;
let idx = 0;
let quizQuestions;
async function content() {
  const loader = document.getElementById("loader"); // Get the loader element
  loader.style.display = "block"; // Show the loader

  const quizQuestionsJSON = await axios.get(
    `https://opentdb.com/api.php?amount=${number}&category=${cat}`
  );
  quizQuestions = quizQuestionsJSON.data;
  question.innerHTML = `${idx + 1}. ${quizQuestions.results[idx].question}`;
  var opt = quizQuestions.results[idx].incorrect_answers;
  let rand = Math.floor(Math.random() * 10);
  opt.splice(rand, 0, quizQuestions.results[idx].correct_answer);
  options.innerHTML = "";
  for (let i of opt) {
    let li = document.createElement("li");
    li.innerHTML = `<input type="radio" name="ans" id="${i}" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/><label for="${i}" class="text-sm font-medium leading-6 text-gray-900"
              >    ${i}</label
            >`;
    options.appendChild(li);
  }
  btn[0].parentElement.style.backgroundColor = "green";
  loader.style.display = "none"; // Hide the loader
}

content();
setInterval(startTimer, 1000);
btn.forEach(function (button) {
  button.addEventListener("click", () => {
    //checkbox enabled
    submitButton.disabled = false;
    checker.innerHTML = ``;
    checker.style.backgroundColor = "none";
    checker.style.padding = "0%";
    idx = parseInt(button.innerHTML) - 1;
    question.innerHTML = `${idx + 1}. ${quizQuestions.results[idx].question}`;
    var opt = quizQuestions.results[idx].incorrect_answers;
    let rand = Math.floor(Math.random() * 10);
    opt.splice(rand, 0, quizQuestions.results[idx].correct_answer);
    options.innerHTML = "";
    for (let i of opt) {
      let li = document.createElement("li");
      li.innerHTML = `<input type="radio" name="ans" id="${i}" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"/><label for="${i}" class="text-sm font-medium leading-6 text-gray-900"
              >    ${i}</label
            >`;
      options.appendChild(li);
    }
    button.parentElement.style.backgroundColor = "green";
    // button.disabled = true;
  });
});
submitButton.addEventListener("click", function () {
  const selectedAns = document.querySelector('input[type="radio"]:checked');
  const ans = quizQuestions.results[idx].correct_answer;
  if (selectedAns != null) {
    if (ans == selectedAns.nextElementSibling.innerHTML) {
      checker.innerHTML = `Correct`;
      checker.style.backgroundColor = "#eaf1eb";
      checker.style.color = "#63a76a";
      result++;
    } else {
      checker.innerHTML = `Wrong`;
      checker.style.backgroundColor = "#f7eaea";
      checker.style.color = "#d83735";
    }
    checker.style.padding = "0.5%";
    //checkbox disable
    submitButton.disabled = true;
    btn[idx].disabled = true;
    numberOfAttempted++;
  } else {
    alert("Enter a answer");
  }
});
submitTest.addEventListener("click", () => {
  const quiz = document.querySelector(".quiz");
  btn.forEach(function (button) {
    button.disabled = true;
  });
  quiz.innerHTML = ``;
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
});
function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ["Result", "Marks"],
    ["Correct", result],
    ["Wrong", numberOfAttempted - result],
    ["Unattended", number - numberOfAttempted],
  ]);

  const options = {
    title: "RESULT",
  };
  document.querySelector(".quiz").style.width = "100%";
  document.querySelector(".quiz").style.maxWidth = "600px";
  document.querySelector(".quiz").style.height = "500px";
  const chart = new google.visualization.PieChart(
    document.querySelector(".quiz")
  );
  chart.draw(data, options);
  const resTxt = document.createElement("span");
  if (result > number / 2) {
    resTxt.innerHTML = "PASSED";
    resTxt.setAttribute(
      "class",
      "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
    );
  } else {
    resTxt.innerHTML = "FAILED TRY AGAINST";
    resTxt.setAttribute(
      "class",
      "inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
    );
  }
  document.querySelector(".quiz").appendChild(resTxt);
}

const hrs = document.querySelector(".hrs");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");
let { h, m, s } = calculateTime(number);
console.log(`h: ${h} m: ${m} s: ${s} number: ${number}`);
s = 59;
m = m - 1;
function startTimer() {
  if (sec.innerHTML <= 60 && sec.innerHTML > 0) {
    sec.innerHTML = String(s--).padStart(2, "0");
  } else {
    min.innerHTML = String(m--).padStart(2, "0");
    s = 59;
    sec.innerHTML = "59";
  }
  if (min.innerHTML == 0 && sec.innerHTML == 0) {
    submitTest.click();
  }
}

function calculateTime(totalMinutes) {
  // Calculate hours, minutes, and seconds
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const s = 0; // Since you want the seconds to be 0
  return { h, m, s };
}
