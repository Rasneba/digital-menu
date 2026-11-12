declare module "page-flip" {
  export type SizeType = "fixed" | "stretch";
  export type FlipCorner = "top" | "bottom";
  export type Orientation = "portrait" | "landscape";

  export interface FlipSetting {
    /** Base page width (required) */
    width: number;
    /** Base page height (required) */
    height: number;
    /** "fixed" | "stretch" — stretch the book to fit the parent element */
    size?: SizeType;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    /** Draw a shadow while the page is turning */
    drawShadow?: boolean;
    /** Page turning animation duration in ms */
    flippingTime?: number;
    /** Switch to single page mode on narrow screens */
    usePortrait?: boolean;
    startZIndex?: number;
    startPage?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    /** Render the first and last pages as a hard cover */
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    disableFlipByClick?: boolean;
    showPageCorners?: boolean;
  }

  export interface FlipEvent {
    data: number | string;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSetting);
    on(event: string, callback: (e: FlipEvent) => void): void;
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    updateFromHtml(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): Orientation;
    getState(): string;
    turnToPage(pageNum: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    flip(pageNum: number, corner?: FlipCorner): void;
    destroy(): void;
  }
}
