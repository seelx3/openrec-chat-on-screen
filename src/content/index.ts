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
          const comment = site.getComments(target);
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
    scroller.setIsRunning(data.isRunning);
  });
  chrome.storage.local.get({ numOfLines: 14 }, (data) => {
    scroller.setMaxLines(data.numOfLines);
  });
  chrome.storage.local.get({ opacity: 50 }, (data) => {
    scroller.setOpacity(data.opacity * 0.01);
    scroller.setDisplayedOpacity();
  });

  // message listener
  chrome.runtime.onMessage.addListener((request) => {
    if (request.message === "switchOnOff") {
      scroller.setIsRunning(request.isRunning);
    } else if (request.message === "changeNumOfLines") {
      scroller.setMaxLines(request.numOfLines);
      scroller.modify(true);
    } else if (request.message === "changeOpacity") {
      scroller.setOpacity(request.opacity * 0.01);
      scroller.setDisplayedOpacity();
    }
  });
}

main();
