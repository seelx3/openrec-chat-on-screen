export type ChatRecord = {
  text: string;
  width: number;
  life: number;
  left: number;
  speed: number;
  reveal: number;
  touch: number;
  top: number;
};

export type SiteInfo = {
  getScreen: () => HTMLElement | null;
  getBoard: () => HTMLElement | null;
  getComments: (node: HTMLElement) => HTMLElement | null;
  getPlay: () => HTMLElement | null;
};
