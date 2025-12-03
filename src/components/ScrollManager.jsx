import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const ScrollManager = (props) => {
  const { section, onSectionChange } = props;

  const data = useScroll();
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);

  data.fill.classList.add("top-0");
  data.fill.classList.add("absolute");
gsap.to(data.el, {
  duration: 10,
  ease: "power2.inOut",
  onStart: () => { isAnimating.current = true },
  onComplete: () => { isAnimating.current = false },
});
  useEffect(() => {
    gsap.to(data.el, {
      duration: 1,
      scrollTop: section * data.el.clientHeight,
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [section]);

  // useFrame(() => {
  //   if (isAnimating.current) {
  //     lastScroll.current = data.scroll.current;
  //     return;
  //   }

  //   const curSection = Math.floor(data.scroll.current * data.pages);
  //   if (data.scroll.current > lastScroll.current && curSection === 0) {
  //     onSectionChange(1);
  //   }
  //   if (
  //     data.scroll.current < lastScroll.current &&
  //     data.scroll.current < 1 / (data.pages - 1)
  //   ) {
  //     onSectionChange(0);
  //   }
  //   lastScroll.current = data.scroll.current;
  // });



  useFrame(() => {
  if (isAnimating.current) {
    lastScroll.current = data.scroll.current;
    return;
  }

  let cur = data.scroll.current;

  // --- HARD LIMITS: Clamp scroll range ---
  if (cur <= 0) cur = 0;
  if (cur >= 0.999) cur = 0.999;

  const curSection = Math.floor(cur * 4); // FOR 4 pages = sections 0,1,2,3

  // --- SCROLL DOWN ---
  if (cur > lastScroll.current) {
    // If scrolling down from 0 → 1, 1 → 2, 2 → 3
    if (curSection !== section && curSection <= 3) {
      onSectionChange(curSection);
    }
  }

  // --- SCROLL UP ---
  if (cur < lastScroll.current) {
    // prevent wrap-around: do NOT allow scroll above section 0
    if (curSection !== section && curSection >= 0) {
      onSectionChange(curSection);
    }
  }

  lastScroll.current = cur;
});

  return null;
};