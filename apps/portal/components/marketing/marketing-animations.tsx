"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MarketingAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    // Top-level section content: direct children of .mkt-inner and hero children
    const topLevel = document.querySelectorAll(".mkt-inner > *");
    topLevel.forEach((el) => el.classList.add("mkt-reveal"));

    // Grid / flex children get staggered delays
    const gridParents = document.querySelectorAll(
      ".mkt-g2, .mkt-g3, .mkt-g4, .mkt-split",
    );
    gridParents.forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
        child.classList.add("mkt-reveal");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mkt-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    // Double rAF: let the browser paint the hidden (opacity:0) state
    // before we start observing, so in-viewport elements animate properly.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .querySelectorAll(".mkt-reveal")
          .forEach((el) => observer.observe(el));
      });
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
