let tens = 0;
let seconds = 0;
const appendTens = document.getElementById('tens');
const appendSeconds = document.getElementById('seconds');
let running = false;
let Interval;

function startTimer() {
  clearInterval(Interval);
  running = true;
  Interval = setInterval(scoreTimer, 10);
}

function stopTimer() {
  clearInterval(Interval);
  running = false;
  return `${seconds}:${tens}`;
}

function resetTimer() {
  clearInterval(Interval);
  running = false;
  tens = 0;
  seconds = 0;
  appendTens.textContent = '00';
  appendSeconds.textContent = '00';
}

function scoreTimer() {
  tens++;
  if (tens <= 9) {
    appendTens.textContent = '0' + tens;
  }

  if (tens > 9) {
    appendTens.textContent = tens;
  }

  if (tens > 99) {
    seconds++;
    appendSeconds.textContent = '0' + seconds;
    tens = 0;
    appendTens.textContent = '0' + tens;
  }

  if (seconds > 9) {
    appendSeconds.textContent = seconds;
  }
}
