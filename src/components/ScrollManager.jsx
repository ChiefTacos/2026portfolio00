// import { useScroll } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { gsap } from "gsap";
// import { useEffect, useRef } from "react";

// export const ScrollManager = (props) => {
//   const { section, onSectionChange } = props;

//   const data = useScroll();
//   const lastScroll = useRef(0);
//   const isAnimating = useRef(false);
// const ignoreScrollRef = useRef(false);

//   // Initial classes
//   data.fill.classList.add("top-0", "absolute");

//   // Entrance animation (yours)
//   gsap.to(data.el, {
//     duration: 10,
//     ease: "power2.inOut",
//     onStart: () => { isAnimating.current = true },
//     onComplete: () => { isAnimating.current = false },
//   });

//   // ------------------------------------------------------------------
//   // 🔥 PROGRAMMATIC SECTION CHANGE — THIS IS THE FIX
//   // ------------------------------------------------------------------
//   useEffect(() => {
//     ignoreScrollRef.current = true;

//     const targetY = section / data.pages;

//     gsap.to(data.scroll, {
//       current: targetY,
//       duration: 1.0,
//       ease: "power3.out",
//       onUpdate: () => {
//         data.el.scrollTop = data.scroll.current * data.el.scrollHeight;
//       },
//       onComplete: () => {
//         setTimeout(() => {
//           ignoreScrollRef.current = false;
//         }, 200);
//       }
//     });
//   }, [section]);
//   // ------------------------------------------------------------------


//   // ------------------------------------------------------------------
//   // 🔥 SCROLL-DRIVEN SECTION CHANGES (your logic + ignore flag)
//   // ------------------------------------------------------------------
//   useFrame(() => {

//     // If user clicked button → ignore ALL scroll until animation finishes

// if (ignoreScrollRef.current) return;

// // If ScrollControls is performing a tween, ignore wheel
// if (isAnimating.current) {
//   lastScroll.current = data.scroll.current;
//   return;
// }

//     let cur = data.scroll.current;

//     // Clamp scroll range
//     if (cur <= 0) cur = 0;
//     if (cur >= 0.999) cur = 0.999;

//     // 4 pages → sections 0,1,2,3
//     const curSection = Math.floor(cur * 4);

//     // Scroll down
//     if (cur > lastScroll.current) {
//       if (curSection !== section && curSection <= 3) {
//         onSectionChange(curSection);
//       }
//     }

//     // Scroll up
//     if (cur < lastScroll.current) {
//       if (curSection !== section && curSection >= 0) {
//         onSectionChange(curSection);
//       }
//     }

//     lastScroll.current = cur;
//   });
//   // ------------------------------------------------------------------

//   return null;
// };

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const ScrollManager = (props) => {
  const { section, onSectionChange } = props;

  const data = useScroll();
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);
  const ignoreScrollRef = useRef(false);
  const lastWheelTime = useRef(0);

  // Initial classes
  data.fill.classList.add("top-0", "absolute");

  // Entrance animation
  gsap.to(data.el, {
    duration: 10,
    ease: "power2.inOut",
    onStart: () => { isAnimating.current = true },
    onComplete: () => { isAnimating.current = false },
  });

  // -------------------------------------------------------------
  // PROGRAMMATIC SECTION CHANGE (button-triggered)
  // -------------------------------------------------------------
  useEffect(() => {
    ignoreScrollRef.current = true;

    const targetY = section / data.pages;

    gsap.to(data.scroll, {
      current: targetY,
      duration: 1.0,
      ease: "power3.out",
      onUpdate: () => {
        data.el.scrollTop = data.scroll.current * data.el.scrollHeight;
      },
      onComplete: () => {
        setTimeout(() => {
          ignoreScrollRef.current = false;
        }, 200);
      }
    });
  }, [section]);

  
  // -------------------------------------------------------------
  // USER SCROLL → SECTION CHANGE (fixed & clamped)
  // -------------------------------------------------------------
  useFrame(() => {
    if (ignoreScrollRef.current) return;

    const now = Date.now();
    if (now - lastWheelTime.current < 600) return; // ← SCROLL DELAY
    lastWheelTime.current = now;

    if (isAnimating.current) {
      lastScroll.current = data.scroll.current;
      return;
    }

    let cur = data.scroll.current;

    // Clamp scroll range (pure safety)
    cur = Math.max(0, Math.min(cur, 0.999));

    // Convert scroll to CLEAN integer section
    const exactSection = Math.round(cur * (4.9 - 1)); // 4 sections → index 0–3

    // Don't allow updating to same section
    if (exactSection !== section) {
      onSectionChange(exactSection);
    }

    lastScroll.current = cur;
  });

  return null;
};
