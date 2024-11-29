// Send "switchOnOff" message to the content script to turn on/off the chat overlay
export async function switchOnOffSender(onOff: HTMLInputElement) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, {
    message: "switchOnOff",
    isRunning: onOff.checked,
  });
  chrome.storage.local.set({ isRunning: onOff.checked });
}

// Send "changeNumOfLines" message to the content script to change the number of lines in the chat overlay
export async function changeNumOfLinesSender(e: Event, setCurrentLines: (val: string) => void) {
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

// Send "changeOpacity" message to the content script to change the opacity of the chat overlay
export async function changeOpacitySender (e: Event, setCurrentOpacity: (val: string) => void) {
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
