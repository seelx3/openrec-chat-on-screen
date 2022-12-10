let onOff = document.getElementById('onoff-btn') as HTMLInputElement;
let linesNum = document.getElementById('num-of-lines') as HTMLInputElement;
let opacityNum = document.getElementById('opacity') as HTMLInputElement;

// init state
chrome.storage.local.get({ isRunning: false }, (ele) => {
  if (!onOff) return;
  if (ele.isRunning) {
    onOff.checked = true;
  } else {
    onOff.checked = false;
  }
});
chrome.storage.local.get({ numOfLines: 14 }, (ele) => {
  if (!linesNum) return;
  linesNum.value = ele.numOfLines;
  setCurrentLines(ele.numOfLines);
})
chrome.storage.local.get({ opacity: 50 }, (ele) => {
  opacityNum.value = ele.opacity;
  setCurrentOpacity(ele.opacity);
})

// on/off
async function switchOnOff() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, { message: 'switchOnOff' });

  chrome.storage.local.set({ isRunning: onOff.checked });
};
onOff.addEventListener('click', switchOnOff);

// num of lines
const curLines = document.getElementById('current-lines');
const setCurrentLines = (val: string) => {
  if (!curLines) return;
  curLines.innerText = val;
}
const rangeOnChangeLines = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  setCurrentLines(target.value);
  chrome.storage.local.set({ numOfLines: target.value });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, { message: 'changeNumOfLines', numOfLines: target.value });
  console.log("send message: changeNumOfLines", target.value);
}
linesNum.addEventListener('change', rangeOnChangeLines);

// opacity
const curOpacity = document.getElementById('current-opacity');
const setCurrentOpacity = (val: string) => {
  if (!curOpacity) return;
  curOpacity.innerText = val;
}
const rangeOnChangeOpacity = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  setCurrentOpacity(target.value);
  chrome.storage.local.set({ opacity: target.value });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, { message: 'changeOpacity', opacity: target.value });
  console.log("send message: changeOpacity", target.value);
}
opacityNum.addEventListener('change', rangeOnChangeOpacity);