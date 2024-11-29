import { Scroller } from "./scroller";
import { site } from "./site";

function main() {
  const scroller = new Scroller();

  // observer for new comments
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          const target = node as HTMLElement;
          let comment = site.getComments(target);
          if (!comment) return;
          scroller.modify();
          scroller.attachComment(comment);
        });
      }
    }
  });

  // initialization
  scroller.init(observer);

  chrome.storage.local.get({ isRunning: false }, (data) => {
    scroller.isRunning = data.isRunning;
  });
  chrome.storage.local.get({ numOfLines: 14 }, (data) => {
    scroller.maxLines = data.numOfLines;
  });
  chrome.storage.local.get({ opacity: 50 }, (data) => {
    scroller.opacity = data.opacity * 0.01;
    scroller.setOpacity();
  });

  // message listener
  chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
    if (request.message === "switchOnOff") {
      scroller.isRunning = request.isRunning;
    } else if (request.message === "changeNumOfLines") {
      scroller.maxLines = request.numOfLines;
      scroller.modify(true);
    } else if (request.message === "changeOpacity") {
      scroller.opacity = request.opacity * 0.01;
      scroller.setOpacity();
    }
  });
}

main();
