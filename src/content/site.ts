import { SiteInfo } from "./types";

const url = location.href;

// site info
export const site: SiteInfo =
  url.indexOf("live") != -1
    ? {
        // live
        getScreen: () => document.querySelector(".video-player-wrapper"),
        getBoard: () => document.querySelector(".chat-list-content"),
        getComments: (node: HTMLElement) => node.querySelector(".chat-content"),
        getPlay: () =>
          document.querySelector(
            '[class^="MovieToolbar"] [class^="TextLabel__Wrapper"]'
          ),
      }
    : {
        // capture
        getScreen: () =>
          document.querySelector('[class^="Component__PlayerWrapper"]'),
        getBoard: () => document.querySelector('[class^="ChatList__Content"]'),
        getComments: (node: HTMLElement) => node.querySelector(".chat-content"),
        getPlay: () => document.querySelector('[class^="ControlBar__Wrapper"]'),
      };
