import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PageFlip } from "page-flip";
import { categories, TOTAL_PAGES, type Currency } from "@/data/menu";
import { haptic } from "@/utils/haptics";
import { cn } from "@/utils/cn";
import { CoverPage } from "./book/CoverPage";
import { ChapterPage } from "./book/ChapterPage";
import { DishesPage } from "./book/DishesPage";
import { BackCoverPage } from "./book/BackCoverPage";

export interface BookPosition {
  /** index of the first visible page of the current spread */
  index: number;
  total: number;
  orientation: "portrait" | "landscape";
}

export interface MenuBookHandle {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

interface MenuBookProps {
  onPositionChange?: (position: BookPosition) => void;
  onPhotoOpen?: (photoId: number) => void;
  onReady?: () => void;
  currency: Currency;
  /** Page index to open on — used to restore the reader's place. */
  initialPage?: number;
}

/**
 * A bound book of pages rendered with StPageFlip.
 * Desktop shows a two page spread, mobile falls back to a single page book.
 */
export const MenuBook = forwardRef<MenuBookHandle, MenuBookProps>(function MenuBook(
  { onPositionChange, onPhotoOpen, onReady, currency, initialPage = 0 },
  ref,
) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flipRef = useRef<PageFlip | null>(null);
  const positionCb = useRef(onPositionChange);
  const photoCb = useRef(onPhotoOpen);
  const readyCb = useRef(onReady);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    positionCb.current = onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    photoCb.current = onPhotoOpen;
  }, [onPhotoOpen]);

  useEffect(() => {
    readyCb.current = onReady;
  }, [onReady]);

  /* The printed pages never change, so they are created once and kept
     referentially stable — React then never touches the DOM nodes that
     StPageFlip has taken over. `currency` is the one legitimate
     dependency: updating it re-renders the price labels in place (keys
     are stable, so no DOM node is recreated). */
  const pages = useMemo<ReactNode[]>(() => {
    const content: ReactNode[] = [<CoverPage key="cover" />];

    categories.forEach((category, i) => {
      content.push(
        <ChapterPage
          key={`plate-${category.id}`}
          category={category}
          folio={String(i * 2 + 2).padStart(2, "0")}
          showKey={i === 0}
        />,
      );
      content.push(
        <DishesPage
          key={`dishes-${category.id}`}
          category={category}
          folio={String(i * 2 + 3).padStart(2, "0")}
          currency={currency}
        />,
      );
    });

    content.push(<BackCoverPage key="back" />);

    return content.map((page, index) => (
      <div
        key={index}
        ref={(el) => {
          pageRefs.current[index] = el;
        }}
        className="h-full w-full"
      >
        {page}
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => flipRef.current?.flipNext("bottom"),
      prev: () => flipRef.current?.flipPrev("bottom"),
      goTo: (index: number) => {
        const flip = flipRef.current;
        if (!flip) return;
        try {
          flip.flip(index, "bottom");
        } catch {
          flip.turnToPage(index);
        }
      },
    }),
    [],
  );

  /* Initialise the flip book */
  useEffect(() => {
    const element = bookRef.current;
    if (!element) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startPage = Math.min(
      Math.max(Math.trunc(initialPage) || 0, 0),
      Math.max(TOTAL_PAGES - 1, 0),
    );

    const flip = new PageFlip(element, {
      width: 550,
      height: 800,
      size: "stretch",
      minWidth: 240,
      maxWidth: 520,
      minHeight: 200,
      maxHeight: 820,
      drawShadow: true,
      flippingTime: reduceMotion ? 0 : 950,
      usePortrait: true,
      startZIndex: 20,
      startPage,
      autoSize: true,
      maxShadowOpacity: 0.42,
      showCover: true,
      mobileScrollSupport: true,
      swipeDistance: 22,
      clickEventForward: true,
      useMouseEvents: true,
      disableFlipByClick: false,
      showPageCorners: true,
    });

    flipRef.current = flip;

    const publish = () => {
      positionCb.current?.({
        index: flip.getCurrentPageIndex(),
        total: flip.getPageCount(),
        orientation: flip.getOrientation(),
      });
    };

    flip.on("init", () => {
      setReady(true);
      readyCb.current?.();
      publish();
    });
    flip.on("flip", (event) => {
      if (typeof event?.data === "number") haptic(10);
      publish();
    });
    flip.on("changeOrientation", publish);

    const items = pageRefs.current.filter(Boolean) as HTMLElement[];
    flip.loadFromHTML(items);
    publish();

    return () => {
      flipRef.current = null;
      const printed = pageRefs.current.filter(Boolean) as HTMLElement[];
      const parent = element.parentNode;
      const sibling = element.nextSibling;

      try {
        flip.destroy();
      } catch {
        /* the library is already gone */
      }

      /* Hand the printed pages and the container back to React so the
         effect is safe to run again (React StrictMode double invoke). */
      printed.forEach((page) => {
        if (page.parentNode !== element) element.appendChild(page);
      });
      element
        .querySelectorAll(
          ".stf__outerShadow, .stf__innerShadow, .stf__hardShadow, .stf__hardInnerShadow",
        )
        .forEach((node) => node.remove());
      if (parent && element.parentNode !== parent) {
        parent.insertBefore(element, sibling);
      }
    };
  }, []);

  /* Delegate interactions that live inside the printed pages. Native
     listeners are used because StPageFlip clones pages while turning and
     cloned nodes sit outside of React's tree. */
  useEffect(() => {
    const element = bookRef.current;
    if (!element) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest) return;

      const opener = target.closest("[data-action='open-menu']");
      if (opener) {
        event.preventDefault();
        flipRef.current?.flipNext("bottom");
        return;
      }

      const photo = target.closest("[data-photo-id]");
      if (photo) {
        event.preventDefault();
        event.stopPropagation();
        const id = Number(photo.getAttribute("data-photo-id"));
        if (id) photoCb.current?.(id);
      }
    };

    element.addEventListener("click", handleClick);
    return () => element.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      aria-hidden={!ready}
      className={cn(
        "h-full w-full transition-opacity duration-700 ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      {/* This div is handed over to StPageFlip on mount. Its className and
          attributes must stay byte-identical across React renders — the
          library adds its own class (`stf__parent`) and inline styles,
          and any change would silently wipe them. */}
      <div ref={bookRef} className="h-full w-full">
        {pages}
      </div>
    </div>
  );
});
