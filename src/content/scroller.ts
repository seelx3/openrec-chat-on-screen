import { ChatRecord } from "./types";
import { site } from "./site";
import { COLER, DURATION, FPS, LINEHEIGHT, OWIDTH, OCOLER } from "./settings";

const SCRIPTNAME = "OpenrecChatOnScreen";

export class Scroller {
  private display: HTMLElement | null;
  private _board: HTMLElement | null;
  private play: HTMLElement | null;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;
  private lines: ChatRecord[][] = [];
  private fontsize: number;
  private _isRunning = false;
  private _opacity = 0.5;
  private _maxLines = 14;

  constructor() {
    this.display = site.getScreen();
    this._board = site.getBoard();
    this.play = site.getPlay();
    this.canvas = document.createElement("canvas");
    this.canvas.id = SCRIPTNAME;
    this.context = this.canvas.getContext("2d");
    this.fontsize = (this.canvas.height / this._maxLines) * LINEHEIGHT;
  }

  init(obserber: MutationObserver): void {
    // console.log(SCRIPTNAME, "init");
    this.display = site.getScreen();
    this._board = site.getBoard();
    this.play = site.getPlay();
    if (!this.display || !this._board || !this.play) {
      window.setTimeout(() => this.init(obserber), 1000);
      return;
    }

    this.canvas = document.createElement("canvas");
    this.canvas.id = SCRIPTNAME;
    this.display.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");

    this.addStyle();
    obserber.observe(this._board, { childList: true });
    this.scrollComments();
  }

  addStyle(): void {
    // console.log(SCRIPTNAME, "addStyle");
    const head = document.getElementsByTagName("head")[0];
    if (!head) return;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
    canvas#${SCRIPTNAME} {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: ${this._opacity};
      z-index: 10000;
    }
    `;
    head.appendChild(style);
  }

  modify(flag = false): void {
    // console.log(SCRIPTNAME, "modify");
    if (!this.display || !this.context) return;
    if (this.canvas.width == this.display.offsetWidth && !flag) return;
    this.canvas.width = this.display.offsetWidth;
    this.canvas.height = this.display.offsetHeight;
    this.fontsize = (this.canvas.height / this._maxLines) * LINEHEIGHT;
    this.context.font = "bold " + this.fontsize + "px sans-serif";
    this.context.fillStyle = COLER;
    this.context.strokeStyle = OCOLER;
    this.context.lineWidth = this.fontsize * OWIDTH;
  }

  attachComment(comment: HTMLElement): void {
    // console.log(SCRIPTNAME, "attachComment");
    if (!this._isRunning || !this.context) return;
    const chatText = comment.textContent;
    if (!chatText) return;
    const chatWidth = this.context.measureText(chatText).width;
    const chatLife = DURATION * FPS;
    const chatSpeed = (this.canvas.width + chatWidth) / chatLife;

    const newRecord: ChatRecord = {
      text: chatText,
      width: chatWidth,
      life: chatLife,
      left: this.canvas.width,
      speed: chatSpeed,
      reveal: chatWidth / chatSpeed,
      top: 0,
    };

    const addNewRecordToLine = (i: number) => {
      newRecord.top = (this.canvas.height / this._maxLines) * i + this.fontsize;
      this.lines[i].push(newRecord);
    };

    for (let i = 0; i < this._maxLines; i++) {
      const len = this.lines[i] ? this.lines[i].length : 0;
      if (!this.lines[i] || !len) {
        this.lines[i] = [];
        addNewRecordToLine(i);
      } else if (
        (this.lines[i][len - 1].speed > newRecord.speed &&
          this.lines[i][len - 1].reveal < 0) ||
        (this.lines[i][len - 1].speed < newRecord.speed &&
          this.lines[i][len - 1].life < newRecord.reveal)
      ) {
        addNewRecordToLine(i);
      } else {
        continue;
      }
      break;
    }
  }

  scrollComments(): void {
    // console.log(SCRIPTNAME, "scrollComments");
    window.setInterval(() => {
      if (!site.getPlay()) return;
      if (!this.context) return;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; this.lines[i]; i++) {
        for (let j = 0; this.lines[i][j]; j++) {
          this.context.strokeText(
            this.lines[i][j].text,
            this.lines[i][j].left,
            this.lines[i][j].top
          );
          this.context.fillText(
            this.lines[i][j].text,
            this.lines[i][j].left,
            this.lines[i][j].top
          );
          this.lines[i][j].life--;
          this.lines[i][j].reveal--;
          this.lines[i][j].left -= this.lines[i][j].speed;
        }
        if (this.lines[i][0] && this.lines[i][0].life == 0) {
          this.lines[i].shift();
        }
      }
    }, 1000 / FPS);
  }

  setDisplayedOpacity(): void {
    // console.log(SCRIPTNAME, "setOpacity");
    const canvas = document.getElementById(SCRIPTNAME);
    if (canvas) canvas.style.opacity = this._opacity.toString();
  }

  board(): HTMLElement | null {
    return this._board;
  }

  setIsRunning(isRunning: boolean): void {
    this._isRunning = isRunning;
  }

  setMaxLines(numOfLines: number): void {
    this._maxLines = numOfLines;
  }

  setOpacity(opacity: number): void {
    this._opacity = opacity;
  }
}
