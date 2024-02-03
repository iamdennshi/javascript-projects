let timerID = null;
let lastSetTime = { hours: 0, minutes: 0, seconds: 0 };
const COLORS = {
  red: "#F48771",
  green: "#89D185",
};

const normalizeTime = (value, max) => {
  const number = Number(value);

  if (number >= 0 && number <= 9) {
    return "0" + number;
  } else if (number > max) {
    return max;
  } else {
    return number;
  }
};

const handleInputTimer = (e) => {
  const target = e.currentTarget;
  target.value = normalizeTime(target.value, target.max);
};

const handleStart = () => {
  let h = Number(hours.value);
  let m = Number(minutes.value);
  let s = Number(seconds.value);

  if (h == 0 && m == 0 && s == 0) return;
  if (task.value == "") return;

  lastSetTime.hours = normalizeTime(h);
  lastSetTime.minutes = normalizeTime(m);
  lastSetTime.seconds = normalizeTime(s);

  [hours, minutes, seconds, task].forEach((input) => (input.disabled = true));

  timerID = setInterval(() => {
    if (s > 0) {
      --s;
      seconds.value = normalizeTime(s);
    } else if (m > 0) {
      --m;
      s = 59;
      minutes.value = normalizeTime(m);
      seconds.value = 59;
    } else if (h > 0) {
      --h;
      m = 59;
      s = 59;
      hours.value = normalizeTime(h);
      minutes.value = 59;
      seconds.value = 59;
    } else {
      clearInterval(timerID);
      new Audio("./assets/beep.mp3").play();
      plus.hidden = false;

      timerID = setInterval(() => {
        ++s;
        if (s == 60) {
          s = 0;
          ++m;
          minutes.value = normalizeTime(m);
          if (m == 60) {
            m = 0;
            ++h;
            hours.value = normalizeTime(h);
          }
        }
        seconds.value = normalizeTime(s);
      }, 1000);
    }
  }, 1000);

  start.hidden = true;
  done.hidden = false;
  pass.hidden = false;
};

const resetToDefault = () => {
  hours.disabled = false;
  minutes.disabled = false;
  seconds.disabled = false;
  task.disabled = false;
  start.hidden = false;
  done.hidden = true;
  pass.hidden = true;
  plus.hidden = true;

  hours.value = lastSetTime.hours;
  minutes.value = lastSetTime.minutes;
  seconds.value = lastSetTime.seconds;

  clearInterval(timerID);
};

const handleDone = () => {
  addTaskToTable(true);
  resetToDefault();
};

const handlePass = () => {
  addTaskToTable(false);
  resetToDefault();
};

const addTaskToTable = (status) => {
  const clone = document.importNode(template.content, true);
  const elements = clone.querySelectorAll("td");

  const spendTimeString = !plus.hidden
    ? `${lastSetTime.hours}:${lastSetTime.minutes}:${lastSetTime.seconds} (+${hours.value}:${minutes.value}:${seconds.value})`
    : "00:00:00";

  elements[0].textContent = task.value;
  elements[1].textContent = spendTimeString;
  elements[2].textContent = new Date().toLocaleString();
  elements[3].style.fill = status ? COLORS.green : COLORS.red;

  table.appendChild(clone);
};

hours.oninput = handleInputTimer;
minutes.oninput = handleInputTimer;
seconds.oninput = handleInputTimer;
start.onclick = handleStart;
done.onclick = handleDone;
pass.onclick = handlePass;
