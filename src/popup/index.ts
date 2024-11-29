import {
  switchOnOffSender,
  changeNumOfLinesSender,
  changeOpacitySender,
} from "./messageSender";

const curLines = document.getElementById("current-lines");
const curOpacity = document.getElementById("current-opacity");

const onOff = document.getElementById("onoff-btn") as HTMLInputElement;
const linesNum = document.getElementById("num-of-lines") as HTMLInputElement;
const opacityNum = document.getElementById("opacity") as HTMLInputElement;

const setDisplayedCurrentLines = (val: string) => {
  if (!curLines) return;
  curLines.innerText = val;
};

const setDisplayedCurrentOpacity = (val: string) => {
  if (!curOpacity) return;
  curOpacity.innerText = val;
};

function initializeStates() {
  // Use first argument as the default value if the key is not found
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
    setDisplayedCurrentLines(data.numOfLines);
  });
  chrome.storage.local.get({ opacity: 50 }, (data) => {
    opacityNum.value = data.opacity;
    setDisplayedCurrentOpacity(data.opacity);
  });
}

function addEventListeners() {
  // on/off
  onOff.addEventListener("click", async () => {
    await switchOnOffSender(onOff);
  });

  // num of lines
  linesNum.addEventListener("change", async (e: Event) => {
    await changeNumOfLinesSender(e, setDisplayedCurrentLines);
  });

  // opacity
  opacityNum.addEventListener("change", async (e: Event) => {
    await changeOpacitySender(e, setDisplayedCurrentOpacity);
  });
}

function main() {
  initializeStates();
  addEventListeners();
}
main();
