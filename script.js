let calcDisplay = document.getElementById("calculation");
let resultDisplay = document.getElementById("result");
let ACButton = document.getElementById("AC");
let nrmlBtns = document.getElementById("buttons_nrml");
let sciBtns = document.getElementById("buttons_sci");
function decreaseFontSize() {
  let length = calcDisplay.textContent.length;
  if (length > 15) {
    calcDisplay.classList.add("text-2xl");
    calcDisplay.classList.remove("text-4xl");
  }
 else {
    calcDisplay.classList.add("text-4xl");
    calcDisplay.classList.remove("text-2xl");
  }
}
function appendToCalculate(value) {
  calcDisplay.textContent += value;
  updateACButton();
  showPartialResult();
  decreaseFontSize();
}
function replaceTrig(expr) {
  expr = expr.replace(/log\(([^)]+)\)/g, (_, v) => Math.log10(Number(v)));

  expr = expr.replace(/ln\(([^)]+)\)/g, (_, v) => Math.log(Number(v)));
  // INVERSE TRIG (output in degrees)
  expr = expr.replace(
    /asin\(([^)]+)\)/g,
    (_, v) => (Math.asin(Number(v)) * 180) / Math.PI
  );

  expr = expr.replace(
    /acos\(([^)]+)\)/g,
    (_, v) => (Math.acos(Number(v)) * 180) / Math.PI
  );

  expr = expr.replace(
    /atan\(([^)]+)\)/g,
    (_, v) => (Math.atan(Number(v)) * 180) / Math.PI
  );

  // NORMAL TRIG (input in degrees)
  expr = expr.replace(/sin\(([^)]+)\)/g, (_, v) =>
    Math.sin((Number(v) * Math.PI) / 180)
  );

  expr = expr.replace(/cos\(([^)]+)\)/g, (_, v) =>
    Math.cos((Number(v) * Math.PI) / 180)
  );

  expr = expr.replace(/tan\(([^)]+)\)/g, (_, v) =>
    Math.tan((Number(v) * Math.PI) / 180)
  );

  // HYPERBOLIC FUNCTIONS
  expr = expr.replace(/sinh\(([^)]+)\)/g, (_, v) => Math.sinh(Number(v)));

  expr = expr.replace(/cosh\(([^)]+)\)/g, (_, v) => Math.cosh(Number(v)));

  expr = expr.replace(/tanh\(([^)]+)\)/g, (_, v) => Math.tanh(Number(v)));

  return expr;
}

function showPartialResult() {
  let text = calcDisplay.textContent.trim();

  if (text === "") {
    resultDisplay.textContent = "";
    return;
  }

  // ONLY percentage like "25%"
  if (/^-?\d+(\.\d+)?%$/.test(text)) {
    resultDisplay.textContent = Number(text.replace("%", "")) / 100;
    return;
  }

  // Percentage with operator like "200-25%"
  if (/%$/.test(text)) {
    let match = text.match(/[\+\-\*\/]/);
    if (!match) return;

    let operator = match[0];
    let [value, percent] = text.split(operator);

    if (percent === "" || percent === "%") return;

    value = value === "" ? 0 : Number(value);
    percent = Number(percent.replace("%", ""));

    let result;

    switch (operator) {
      case "+":
        result = value + (value * percent) / 100;
        break;
      case "-":
        result = value - (value * percent) / 100;
        break;
      case "*":
        result = value * (percent / 100);
        break;
      case "/":
        result = value / (percent / 100);
        break;
    }

    resultDisplay.textContent = result;
    return;
  }

  // Normal expression preview (safe eval)
  try {
    text = replaceTrig(text);
    text = text.replace(/\^/g, "**");
    resultDisplay.textContent = eval(text);
  } catch {
    resultDisplay.textContent = "";
  }
}

function backSpace() {
  if (calcDisplay && calcDisplay.textContent.length > 0) {
    calcDisplay.textContent = calcDisplay.textContent.slice(0, -1);
  }
}
function clearDisplay() {
  calcDisplay.textContent = "";
  resultDisplay.textContent = "";
  resultDisplay.classList.remove("hidden");
  updateACButton();
}
function updateACButton() {
  ACButton.innerText = calcDisplay.textContent === "" ? "AC" : "C";
}
function calcPercentage() {
  if (!calcDisplay.textContent.endsWith("%")) {
    calcDisplay.textContent += "%";
    showPartialResult();
  }
}

function calculateResult() {

  try {
    let result = resultDisplay.textContent;
    if (result !== "") {
      calcDisplay.textContent = result;
      resultDisplay.classList.add("hidden");
    } else {
      resultDisplay.textContent = calcDisplay.textContent;
      calcDisplay.textContent = "Error";
    }
  } catch {
    calcDisplay.textContent = "ERROR";
  }
  updateACButton();

}
scientificMode = () => {
  nrmlBtns.classList.add("hidden");
  sciBtns.classList.remove("hidden");
};
normalMode = () => {
  sciBtns.classList.add("hidden");
  nrmlBtns.classList.remove("hidden");
};

function scientific(func) {
  if (func === "pi") {
    if (calcDisplay.textContent === "") {
      calcDisplay.textContent = Math.PI.toFixed(3);
    } else {
      calcDisplay.textContent =
        parseFloat(calcDisplay.textContent) * Math.PI.toFixed(3);
    }

    updateACButton();
    return;
  }
  if (func === "e") {
    if (calcDisplay.textContent === "") {
      calcDisplay.textContent = Math.E.toFixed(3);
    } else {
      calcDisplay.textContent = (
        parseFloat(calcDisplay.textContent) * Math.E
      ).toFixed(3);
    }
    updateACButton();
    return;
  }
  let value = parseFloat(calcDisplay.textContent);

  switch (func) {
    case "sin":
      calcDisplay.textContent += "sin(";
      break;
    case "cos":
      calcDisplay.textContent += "cos(";
      break;
    case "tan":
      calcDisplay.textContent += "tan(";
      break;
    case "sinh":
      calcDisplay.textContent += "sinh(";
      break;
    case "cosh":
      calcDisplay.textContent += "cosh(";
      break;
    case "tanh":
      calcDisplay.textContent += "tanh(";
      break;
    case "log":
      calcDisplay.textContent += "log(";
      break;
    case "ln":
      calcDisplay.textContent += "ln(";
      break;
    case "square":
      calcDisplay.textContent = parseFloat(Math.pow(value, 2).toFixed(5));
      break;
    case "cube":
      calcDisplay.textContent = parseFloat(Math.pow(value, 3).toFixed(5));
      break;
    case "asin":
      calcDisplay.textContent += "asin(";
      break;
    case "acos":
      calcDisplay.textContent += "acos(";
      break;
    case "atan":
      calcDisplay.textContent += "atan(";
      break;
    case "sqrt":
      calcDisplay.textContent = parseFloat(Math.sqrt(value).toFixed(5));
      break;
    case "cbrt":
      calcDisplay.textContent = parseFloat(Math.cbrt(value).toFixed(5));
      break;
  }
  updateACButton();
}
