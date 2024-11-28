const curLines = document.getElementById("current-lines");
const curOpacity = document.getElementById("current-opacity");

let onOff = document.getElementById("onoff-btn") as HTMLInputElement;
let linesNum = document.getElementById("num-of-lines") as HTMLInputElement;
let opacityNum = document.getElementById("opacity") as HTMLInputElement;

const setCurrentLines = (val: string) => {
  if (!curLines) return;
  curLines.innerText = val;
};

const setCurrentOpacity = (val: string) => {
  if (!curOpacity) return;
  curOpacity.innerText = val;
};

// init state
chrome.storage.local.get({ isRunning: false }, (data) => {
  if (!onOff) return;
  if (data.isRunning) {
    onOff.checked = true;
  } else {
    onOff.checked = false;
  }
});
chrome.storage.local.get({ numOfLines: 14 }, (data) => {
  if (!linesNum) return;
  linesNum.value = data.numOfLines;
  setCurrentLines(data.numOfLines);
});
chrome.storage.local.get({ opacity: 50 }, (data) => {
  opacityNum.value = data.opacity;
  setCurrentOpacity(data.opacity);
});

// on/off
onOff.addEventListener("click", switchOnOffSender);

// num of lines
linesNum.addEventListener("change", changeNumOfLinesSender);

// opacity
opacityNum.addEventListener("change", changeOpacitySender);
