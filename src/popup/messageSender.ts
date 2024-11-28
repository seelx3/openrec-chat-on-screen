// on/off
async function switchOnOffSender() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, {
    message: "switchOnOff",
    isRunning: onOff.checked,
  });
  chrome.storage.local.set({ isRunning: onOff.checked });
}

// num of lines
const changeNumOfLinesSender = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  setCurrentLines(target.value);
  chrome.storage.local.set({ numOfLines: target.value });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, {
    message: "changeNumOfLines",
    numOfLines: target.value,
  });
  // console.log("send message: changeNumOfLines", target.value);
};

// opacity
const changeOpacitySender = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  setCurrentOpacity(target.value);
  chrome.storage.local.set({ opacity: target.value });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, {
    message: "changeOpacity",
    opacity: target.value,
  });
  // console.log("send message: changeOpacity", target.value);
};
