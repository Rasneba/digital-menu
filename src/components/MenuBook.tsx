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
import { categories, type Currency } from "@/data/menu";
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
  currency: Currency;
}

/**
 * A bound book of pages rendered with StPageFlip.
 * Desktop shows a two page spread, mobile falls back to a single page book.
 */
export const MenuBook = forwardRef<MenuBookHandle, MenuBookProps>(function MenuBook(
  { onPositionChange, onPhotoOpen, currency },
  ref,
) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flipRef = useRef<PageFlip | null>(null);
  const positionCb = useRef(onPositionChange);
  const photoCb = useRef(onPhotoOpen);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    positionCb.current = onPositionChange;
  }, [onPositionChange]);

  useEffect(() => {
    photoCb.current = onPhotoOpen;
  }, [onPhotoOpen]);

  /* The printed pages never change, so they are created once and kept
     referentially stable — React then never touches the DOM nodes that
     StPageFlip has taken over. */
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
  }, []);

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

    const flip = new PageFlip(element, {
      width: 550,
      height: 800,
      size: "stretch",
      minWidth: 240,
      maxWidth: 520,
      minHeight: 200,
      maxHeight: 820,
      drawShadow: true,
      flippingTime: reduceMotion ? 0 : 1150,
      usePortrait: true,
      startZIndex: 20,
      startPage: 0,
      autoSize: true,
      maxShadowOpacity: 0.42,
      showCover: true,
      mobileScrollSupport: true,
      swipeDistance: 22,
      clickEventForward: true,
      useMouseEvents: true,
      disableFlipByClick: false,
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
      publish();
    });
    flip.on("flip", publish);
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
      ref={bookRef}
      className={cn(
        "h-full w-full transition-opacity duration-700 ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      {pages}
    </div>
  );
});
