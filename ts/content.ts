interface ChatRecord {
  text: string;
  width: number;
  life: number;
  left: number;
  speed: number;
  reveal: number;
  touch: number;
  top: number;
}

interface SiteInfo {
  getScreen: () => HTMLElement | null;
  getBoard: () => HTMLElement | null;
  getComments: (node: HTMLElement) => HTMLElement | null;
  getPlay: () => HTMLElement | null;
}

let isRunning = false;

// customize
const SCRIPTNAME = "OpenrecChatOnScreen";
const COLER = '#ffffff';
const OCOLER = '#000000';
const OWIDTH = 1 / 10;
const LINEHEIGHT = 0.75;
const DURATION = 5;
const FPS = 60;

// temporary value
let opacity = 0.5;
let maxLines = 14;

const url = location.href;

// site info
let site: SiteInfo = url.indexOf("live") != -1 ? {
  // live
  getScreen: () => document.querySelector('.video-player-wrapper'),
  getBoard: () => document.querySelector('.chat-list-content'),
  getComments: (node: HTMLElement) => node.querySelector('.chat-content'),
  getPlay: () => document.querySelector('[class^="MovieToolbar"] [class^="TextLabel__Wrapper"]'),
} : {
  // capture
  getScreen: () => document.querySelector('[class^="Component__PlayerWrapper"]'),
  getBoard: () => document.querySelector('[class^="ChatList__Content"]'),
  getComments: (node: HTMLElement) => node.querySelector('.chat-content'),
  getPlay: () => document.querySelector('[class^="ControlBar__Wrapper"]'),
};

// process
let display: HTMLElement | null;
let board: HTMLElement | null;
let play: HTMLElement | null;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D | null;
let lines: ChatRecord[][] = [];
let fontsize: number;

let core = {
  init: () => {
    // console.log(SCRIPTNAME, "init");
    display = site.getScreen();
    board = site.getBoard();
    play = site.getPlay();
    if (!display || !board || !play) {
      window.setTimeout(() => core.init(), 1000);
      return;
    }

    canvas = document.createElement('canvas');
    canvas.id = SCRIPTNAME;
    display.appendChild(canvas);
    context = canvas.getContext('2d');

    core.addStyle();
    core.listenComments();
    core.scrollComments();
  },
  addStyle: () => {
    // console.log(SCRIPTNAME, "addStyle");
    let head = document.getElementsByTagName('head')[0];
    if (!head) return;
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = '' +
      'canvas#' + SCRIPTNAME + '{' +
      ' pointer-events: none;' +
      ' position: absolute;' +
      ' top: 0;' +
      ' left: 0;' +
      ' width: 100%;' +
      ' height: 100%;' +
      ' opacity: ' + opacity + ';' +
      ' z-index: 10000;' +
      '}' +
      '';
    head.appendChild(style);
  },
  listenComments: () => {
    // console.log(SCRIPTNAME, "listenComments");
    if (!board) return;
    board.addEventListener('DOMNodeInserted', (e) => {
      const target = e.target as HTMLElement;
      let comment = site.getComments(target);
      if (!comment) return;
      core.modify();
      core.attachComment(comment);
    });
  },
  modify: (flag = false) => {
    // console.log(SCRIPTNAME, "modify");
    if (!display || !context) return;
    if (canvas.width == display.offsetWidth && !flag) return;
    canvas.width = display.offsetWidth;
    canvas.height = display.offsetHeight;
    fontsize = (canvas.height / maxLines) * LINEHEIGHT;
    context.font = 'bold ' + fontsize + 'px sans-serif';
    context.fillStyle = COLER;
    context.strokeStyle = OCOLER;
    context.lineWidth = fontsize * OWIDTH;
  },
  attachComment: (comment: HTMLElement) => {
    // console.log(SCRIPTNAME, "attachComment");
    if (!isRunning || !context) return;
    let chatText = comment.textContent;
    if (!chatText) return;
    let chatWidth = context.measureText(chatText).width;
    let chatLife = DURATION * FPS;
    let chatSpeed = (canvas.width + chatWidth) / chatLife;

    let newRecord: ChatRecord = {
      text: chatText,
      width: chatWidth,
      life: chatLife,
      left: canvas.width,
      speed: chatSpeed,
      reveal: chatWidth / chatSpeed,
      touch: chatWidth / chatSpeed,
      top: 0
    };

    for (let i = 0; i < maxLines; i++) {
      let len = lines[i] ? lines[i].length : 0;
      if (!lines[i] || !len) {
        lines[i] = [];
      } else if (lines[i][len - 1].speed > newRecord.speed && lines[i][len - 1].reveal < 0) {
        ;
      } else if (lines[i][len - 1].speed < newRecord.speed && lines[i][len - 1].life < newRecord.touch) {
        ;
      } else {
        continue;
      }
      newRecord.top = ((canvas.height / maxLines) * i) + fontsize;
      lines[i].push(newRecord);
      break;
    }
  },
  scrollComments: () => {
    // console.log(SCRIPTNAME, "scrollComments");
    window.setInterval(() => {
      if (!site.getPlay()) return;
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; lines[i]; i++) {
        for (let j = 0; lines[i][j]; j++) {
          context.strokeText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
          context.fillText(lines[i][j].text, lines[i][j].left, lines[i][j].top);
          lines[i][j].life--;
          lines[i][j].reveal--;
          lines[i][j].touch--;
          lines[i][j].left -= lines[i][j].speed;
        }
        if (lines[i][0] && lines[i][0].life == 0) {
          lines[i].shift();
        }
      }
    }, 1000 / FPS);
  },
  setOpacity: () => {
    // console.log(SCRIPTNAME, "setOpacity");
    let canvas = document.getElementById(SCRIPTNAME);
    if (canvas) canvas.style.opacity = opacity.toString();
  },
};

// init state
core.init();
chrome.storage.local.get({ isRunning: false }, (data) => {
  isRunning = data.isRunning;
})
chrome.storage.local.get({ numOfLines: 14 }, (data) => {
  maxLines = data.numOfLines;
})
chrome.storage.local.get({ opacity: 50 }, (data) => {
  opacity = data.opacity * 0.01;
  core.setOpacity();
})

// change state
chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  if (request.message === 'switchOnOff') {
    isRunning = !isRunning;
  } else if (request.message === 'changeNumOfLines') {
    maxLines = request.numOfLines;
    core.modify(true);
  } else if (request.message === 'changeOpacity') {
    opacity = request.opacity * 0.01;
    core.setOpacity();
  }
});