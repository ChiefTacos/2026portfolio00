import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { currentProjectAtom, projects } from "./Projects";

import styled from 'styled-components';
import {  useEffect, useRef, useState } from "react";
import { currentProjectAtom01 } from "./GoogleReviewsPage";


const StyledWrapper = styled.div`
  .card-wrapper {
    position: relative;
    width: 320px;
    height: 480px;
  }

  .mouse-position-tracker {
    position: absolute;
    width: 33.333%;
    height: 33.333%;
    z-index: 10;
  }

  .tr-1 {
    top: 0;
    left: 0;
  }
  .tr-2 {
    top: 0;
    left: 33.333%;
  }
  .tr-3 {
    top: 0;
    left: 66.666%;
  }
  .tr-4 {
    top: 33.333%;
    left: 0;
  }
  .tr-5 {
    top: 33.333%;
    left: 33.333%;
  }
  .tr-6 {
    top: 33.333%;
    left: 66.666%;
  }
  .tr-7 {
    top: 66.666%;
    left: 0;
  }
  .tr-8 {
    top: 66.666%;
    left: 33.333%;
  }
  .tr-9 {
    top: 66.666%;
    left: 66.666%;
  }

  .card {
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 10, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition:
      transform 0.2s ease-out,
      box-shadow 0.2s ease;
    transform-style: preserve-3d;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.5;
    mask-image: radial-gradient(circle at center, white, transparent 80%);
    z-index: 1;
    pointer-events: none;
  }

  .card::after {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 243, 255, 0.2),
      transparent 50%
    );
    top: -50%;
    left: -50%;
    opacity: 0;
    transition: 0.3s;
    z-index: 0;
    pointer-events: none;
  }

  .content {
    z-index: 5;
    transform: translateZ(40px);
    text-align: center;
    pointer-events: none;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    line-height: 1;
    position: relative;
    mix-blend-mode: lighten;
  }

  .subtitle {
    margin-top: 10px;
    color: var(--neon-blue);
    letter-spacing: 3px;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .hud-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid var(--neon-blue);
    transition: 0.3s;
    z-index: 4;
  }
  .tl {
    top: 20px;
    left: 20px;
    border-right: none;
    border-bottom: none;
  }
  .tr {
    top: 20px;
    right: 20px;
    border-left: none;
    border-bottom: none;
  }
  .bl {
    bottom: 20px;
    left: 20px;
    border-right: none;
    border-top: none;
  }
  .br {
    bottom: 20px;
    right: 20px;
    border-left: none;
    border-top: none;
  }

  .glitch {
    position: relative;
  }
  .glitch::before,
  .glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.8);
  }
  .glitch::before {
    left: 2px;
    text-shadow: -1px 0 #ff00c1;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }
  .glitch::after {
    left: -2px;
    text-shadow: -1px 0 #00fff9;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim {
    0% {
      clip: rect(15px, 9999px, 81px, 0);
    }
    5% {
      clip: rect(72px, 9999px, 24px, 0);
    }
    10% {
      clip: rect(4px, 9999px, 88px, 0);
    }
    15% {
      clip: rect(66px, 9999px, 14px, 0);
    }
    20% {
      clip: rect(25px, 9999px, 96px, 0);
    }
    100% {
      clip: rect(50px, 9999px, 50px, 0);
    }
  }
  @keyframes glitch-anim2 {
    0% {
      clip: rect(80px, 9999px, 4px, 0);
    }
    5% {
      clip: rect(30px, 9999px, 100px, 0);
    }
    10% {
      clip: rect(10px, 9999px, 20px, 0);
    }
    100% {
      clip: rect(90px, 9999px, 90px, 0);
    }
  }

  .tr-1:hover ~ .card {
    transform: rotateX(20deg) rotateY(-20deg);
  }
  .tr-1:hover ~ .card::after {
    opacity: 1;
    transform: translate(-20%, -20%);
  }

  .tr-2:hover ~ .card {
    transform: rotateX(20deg) rotateY(0deg);
  }
  .tr-2:hover ~ .card::after {
    opacity: 1;
    transform: translate(0%, -20%);
  }

  .tr-3:hover ~ .card {
    transform: rotateX(20deg) rotateY(20deg);
  }
  .tr-3:hover ~ .card::after {
    opacity: 1;
    transform: translate(20%, -20%);
  }

  .tr-4:hover ~ .card {
    transform: rotateX(0deg) rotateY(-20deg);
  }
  .tr-4:hover ~ .card::after {
    opacity: 1;
    transform: translate(-20%, 0%);
  }

  .tr-5:hover ~ .card {
    transform: rotateX(0deg) rotateY(0deg) scale(1.05);
    box-shadow: 0 0 30px var(--neon-blue);
  }
  .tr-5:hover ~ .card::after {
    opacity: 1;
    transform: translate(0%, 0%);
  }

  .tr-6:hover ~ .card {
    transform: rotateX(0deg) rotateY(20deg);
  }
  .tr-6:hover ~ .card::after {
    opacity: 1;
    transform: translate(20%, 0%);
  }

  .tr-7:hover ~ .card {
    transform: rotateX(-20deg) rotateY(-20deg);
  }
  .tr-7:hover ~ .card::after {
    opacity: 1;
    transform: translate(-20%, 20%);
  }

  .tr-8:hover ~ .card {
    transform: rotateX(-20deg) rotateY(0deg);
  }
  .tr-8:hover ~ .card::after {
    opacity: 1;
    transform: translate(0%, 20%);
  }

  .tr-9:hover ~ .card {
    transform: rotateX(-20deg) rotateY(20deg);
  }
  .tr-9:hover ~ .card::after {
    opacity: 1;
    transform: translate(20%, 20%);
  }

  .card-wrapper:hover .hud-corner {
    box-shadow: 0 0 10px var(--neon-blue);
    width: 30px;
    height: 30px;
  }`;


const Section = (props) => {
  const { children, className = "" } = props;


  return (
    <motion.section

//      className={`
//   h-screen w-screen p-8 max-w-screen-2xl mx-auto
// flex flex-col items-center justify-center
//   `}
className={`
        h-screen w-screen p-8 max-w-screen-2xl mx-auto
        flex flex-col items-center justify-center
        ${className} 
      `}
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.6,
        },
      }}

    >
      {children}
    </motion.section>
  );
};



export const Interface = (props) => {
  const { setSection } = props;
  return (
    <div className="flex flex-col items-center w-screen ">
      <FirstSection setSection={setSection} />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
};















const FirstSection = (props) => {
 
  // ---- state to track which parts were clicked ----
//   const [clickedFree, setClickedFree] = useState(false);
//   const [clickedQuote, setClickedQuote] = useState(false);
// const [fullyOpen, setFullyOpen] = useState(false);

//    const revealed = clickedFree || clickedQuote;
 


  return (
    <Section>
       {/* <StyledWrapper>
      <div className="card-wrapper">
        <div className="mouse-position-tracker tr-1" />
        <div className="mouse-position-tracker tr-2" />
        <div className="mouse-position-tracker tr-3" />
        <div className="mouse-position-tracker tr-4" />
        <div className="mouse-position-tracker tr-5" />
        <div className="mouse-position-tracker tr-6" />
        <div className="mouse-position-tracker tr-7" />
        <div className="mouse-position-tracker tr-8" />
        <div className="mouse-position-tracker tr-9" />
        <div className="card">
          <div className="hud-corner tl" />
          <div className="hud-corner tr" />
          <div className="hud-corner bl" />
          <div className="hud-corner br" />
          <div className="content">
            <div className="title glitch" data-text="CYBER">CYBER</div>
            <div className="title glitch" data-text="CORE">CORE</div>
            <div className="subtitle">System Online</div>
          </div>
        </div>
      </div>
    </StyledWrapper> */}
      {/* <StyledWrapper>
          <div className="form-container
           lg:translate-x-[230px] md:translate-x-[230px]  translate-x-[-30px] 
            lg:translate-y-[-250px] md:translate-y-[-350px]  translate-y-[-320px]
            ">



                   <div
  className="title-button"
  onClick={() => {
    if (fullyOpen) {
      setClickedFree(false);
      setClickedQuote(false);
      setFullyOpen(false);
      return;
    }

    setClickedFree(true);
    setClickedQuote(true);
  }}
>

           
            <motion.div
              className={`title-2 ${clickedQuote ? 'clicked' : ''}`}
              whileTap={{ scale: 0.93 }}
            >
              FREE QUOTE
            </motion.div>
          </div>
                 
       <motion.div
  className="full-form"
  initial={{ height: 0, opacity: 0 }}
  animate={{ 
    height: revealed ? 620 : 0, 
    opacity: revealed ? 1 : 0 
  }}
  transition={{ duration: 0.8, ease: "easeOut" }}

  onUpdate={(latest) => {
    if (revealed && latest.height >= 600) {
      setFullyOpen(true);
    }
  }}

  onAnimationStart={() => {
    if (!revealed) setFullyOpen(false);
  }}

  style={{ overflow: "hidden" }}
>

            <div className="form-title"><span>Send a Custom Inquiry</span></div>

            <div className="input-container">
              <input className="input-mail" type="email" placeholder="Enter email" />
            </div>

            <section className="bg-stars">
              <span className="star" />
              <span className="star" />
              <span className="star" />
              <span className="star" />
            </section>

            <div className="input-container">
              <input className="input-pwd" type="password" placeholder="Enter password" />
            </div>

            <div className="input-container">
              <textarea placeholder="Enter your message" name="message" />
            </div>

            <button type="submit" className="submit">
              <span className="sign-text">Send Inquiry</span>
            </button>

            <p className="signup-link">I love cock</p>
          </motion.div>

          </div>
    </StyledWrapper> */}
          </Section>
  );
};








//////////
// og REVIEWS
//////////
// const SkillsSection = () => {


//   const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
//   const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;

//   const [currentProject, setCurrentProject] = useAtom(currentProjectAtom01);

//   const nextProject = () => {
//     setCurrentProject((currentProject + 1) % projects.length);
//   };

//   const previousProject = () => {
//     setCurrentProject((currentProject - 1 + projects.length) % projects.length);
//   };

//   return (
//     <Section>



//       <div className="relative -top-24 pb-48 mb-24 left-0 w-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
//         <button
//           className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
//           onClick={previousProject}
//         >
//           ← Previous
//         </button>
//         <h2 className="text-4xl lg:text-5xl font-bold text-center text-white">Badger Reviews</h2>
//         <button
//           className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
//           onClick={nextProject}
//         >
//           Next →
//         </button>
//       </div>
//     </Section>
//   );
// };

const SkillsSection = () => {
  const [showArrow, setShowArrow] = useState(true);
  const [showText, setShowText] = useState(false); // New state for the text
  const scrollRef = useRef(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMoreToScroll = scrollHeight > clientHeight + scrollTop + 10;
      setShowArrow(hasMoreToScroll);
      
      // If the user starts scrolling, we can also hide the text hint immediately
      if (scrollTop > 10) setShowText(false);
    }
  };

  useEffect(() => {
    // Check initial scroll state
    const scrollTimer = setTimeout(() => {
      checkScroll();
    }, 1000);

    // Show "Scroll Down" text after 5 seconds
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 4000);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(textTimer);
    };
  }, []);
return (
    <Section className="xl:mt-10">
    
    </Section>
  );
};

//   return (
//     <Section>

//   <div className="pb-72 mb-48 w-full h-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
//             <GoogleReviewsBox placeId={placeId} apiKey={apiKey} />

//       </div>


//           </Section>
//   );
// };


// og projects
// const ProjectsSection = () => {
//   const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

//   const nextProject = () => {
//     setCurrentProject((currentProject + 1) % projects.length);
//   };

//   const previousProject = () => {
//     setCurrentProject((currentProject - 1 + projects.length) % projects.length);
//   };

//   return (
//     <Section>
//       <div className="fixed left-0 w-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
//         <button
//           className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
//           onClick={previousProject}
//         >
//           ← Previous
//         </button>
//         <h2 className="text-4xl lg:text-5xl font-bold text-center text-white">Badger Services</h2>
//         <button
//           className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
//           onClick={nextProject}
//         >
//           Next →
//         </button>
//       </div>
//     </Section>
//   );
// };
const ProjectsSection = () => {
  const [showArrow, setShowArrow] = useState(true);
  const [showText, setShowText] = useState(false); // New state for the text
  const scrollRef = useRef(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMoreToScroll = scrollHeight > clientHeight + scrollTop + 10;
      setShowArrow(hasMoreToScroll);
      
      // If the user starts scrolling, we can also hide the text hint immediately
      if (scrollTop > 10) setShowText(false);
    }
  };

  useEffect(() => {
    // Check initial scroll state
    const scrollTimer = setTimeout(() => {
      checkScroll();
    }, 1000);

    // Show "Scroll Down" text after 5 seconds
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 4000);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(textTimer);
    };
  }, []);
return (
    <Section className="xl:-mt-20 ">
      <div
        className="form-container opacity-0
          relative
          lg:w-[950px] 
          lg:h-[1050px]
           xl:w-[1100px]
          xl:h-[800px]
          2xl:w-[1300px]
          2xl:h-[800px]
          xl:-ml-[300px]
          2xl:-ml-[255px]
          overflow-hidden
          w-full 
          max-h-[85vh]
        "
      >
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="h-full w-full overflow-y-auto p-4 xl:p-6 pb-2 scroll-smooth"
        >
          <div className="form h-full">
            <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6 pb-2">
             <span className="text-[#00eeff]">services page work in progress</span> 
                             <img className="w-full max-w-[500px] 2xl:max-w-[1000px] h-auto object-contain" src="/textures/logo.png" alt="BadgerSSLogo" />

            </span>

          </div>
          
        </div>
 
        <div 
          className={`absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-4 
            bg-gradient-to-t from-black/80 to-transparent 
            pointer-events-none 
            transition-opacity duration-500 
            ${showArrow ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Fading Text Hint */}
          <span 
            className={`text-[#ffffff] text-sm uppercase tracking-widest mb-2 transition-opacity duration-1000
              ${showText ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Scroll Down
          </span>

          {/* Bobbing Arrow */}
          <div className="animate-bounce text-[#00eeff]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
};

// og contact

// const ContactSection = () => {
//   const [showArrow, setShowArrow] = useState(true);
//   const scrollRef = useRef(null);

//   const checkScroll = () => {
//     if (scrollRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
//       const hasMoreToScroll = scrollHeight > clientHeight + scrollTop + 10;
//       setShowArrow(hasMoreToScroll);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       checkScroll();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Section>
//       <div
//         className="form-container
//           relative
//           lg:w-[950px] 
//           lg:h-[750px]
//            xl:w-[1100px]
//           xl:h-[800px]
//           2xl:w-[1300px]
//           2xl:h-[800px]
//           xl:-ml-[300px]
//           2xl:-ml-[255px]
//           overflow-hidden
//           xl:overflow-visible

//           w-full 
//           max-h-[90vh]
//         "
//       >
//         <div 
//           ref={scrollRef}
//           onScroll={checkScroll}
//           className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth"
//         >
//           <div className="form h-full">
//             <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6 pb-2">
//               Emphasis on <span className="text-[#00eeff]">Quality</span> and <br /><span className="text-[#00eeff]">100% Customer Satisfaction</span> 
//             </span>

//             {/* Grid is often cleaner for "locked" column counts.
//                - default: 1 col
//                - lg (1024px+): 2 cols
//                - 2xl (or your widest breakpoint): 3 cols
//             */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-4 items-start text-center">
              
//               {/* COLUMN 1 */}
//               <div className="flex flex-col text-white">
//                 <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-4">
//                   Hours of Operation to Call and Schedule an Appointment are
//                 </span>
//                 <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-950 border-t-2 border-b-2">
//                   <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
//                   <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
//                   <br />
//                   <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
//                 </span>
//                 <span className="c2 pt-3 md:pb-3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-b-4">
//                   Our Number to <span className="text-[#00eeff]">Call</span> is <br />
//                   <span className="text-3xl md:text-3xl lg:text-4xl font-bold">
//                     +1-<span className="text-[#00eeff]">262</span>-
//                     <span className="text-[#00eeff]">230</span>-
//                     <span className="text-[#00eeff]">5182</span>
//                   </span>
//                 </span>
//               </div>

//               {/* COLUMN 2 */}
//               <div className="flex flex-col text-white">
//                 <span className="pb-2.5 pt-2 c3 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-4">
//                   <span className="text-[#00eeff] font-semibold">Badger Surface Solutions </span>
//                   provides Quality Service and Customer Satisfaction from people rooted in the <span className="text-[#C5050C] font-semibold">Badger</span> State.
//                 </span>
//                 <span className="pt-2.5 py-3.5 c2 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-2 border-b-2">
//                   We Proudly Serve These Counties!
//                 </span>
//                 <span className="c2 pb-6 text-base md:text-lg lg:text-xl border-slate-950 border-b-4">
//                   Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.
//                 </span>
//               </div>

//               {/* COLUMN 3 
//                   - lg:col-span-2 makes it take full width of the 2-col layout 
//                   - 2xl:col-span-1 puts it back into its own slot in 3-col layout
//               */}
//               <div className="lg:col-span-2 2xl:col-span-1 flex justify-center">
//                 <img className="w-full max-w-[400px] 2xl:max-w-full h-auto object-contain" src="/textures/counties.png" alt="Counties Map" />
//               </div>
//             </div>

//             <div className="button-container mt-8">
//               <div className="send-button">Customize a Quote</div>
//               <div className="reset-button-container">
//                 <div className="reset-button" id="reset-btn">
//                   Contact Us
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div 
//           className={`absolute bottom-0 left-0 w-full h-24 flex items-end justify-center pb-4 
//             bg-gradient-to-t from-black/80 to-transparent 
//             pointer-events-none 
//             transition-opacity duration-300 
//             ${showArrow ? 'opacity-100' : 'opacity-0'}
//           `}
//         >
//           <div className="animate-bounce text-[#00eeff]">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </Section>
//   );
// };

// const ContactSection = () => {
//   const [showArrow, setShowArrow] = useState(true);
//   const [showText, setShowText] = useState(false); // New state for the text
// // State for the new introductory owner screen
//   const [showOwnerIntro, setShowOwnerIntro] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
// const [showSecondSet, setShowSecondSet] = useState(false);
// const [animationPhase, setAnimationPhase] = useState("idle");
// const [slideDirection, setSlideDirection] = useState("right");


//   const scrollRef = useRef(null);

//   const checkScroll = () => {
//     if (scrollRef.current) {
//       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
//       const hasMoreToScroll = scrollHeight > clientHeight + scrollTop + 10;
//       setShowArrow(hasMoreToScroll);
      
//       // If the user starts scrolling, we can also hide the text hint immediately
//       if (scrollTop > 10) setShowText(false);
//     }
//   };

//   useEffect(() => {
//     // Check initial scroll state
//     const scrollTimer = setTimeout(() => {
//       checkScroll();
//     }, 1000);

//     // Show "Scroll Down" text after 5 seconds
//     const textTimer = setTimeout(() => {
//       setShowText(true);
//     }, 4000);

//     return () => {
//       clearTimeout(scrollTimer);
//       clearTimeout(textTimer);
//     };
//   }, []);

// const handleCardSwitch = () => {
//   if (animationPhase !== "idle") return;

//   // Direction the current cards should exit
//   setSlideDirection(showSecondSet ? "left" : "right");

//   // Start fading out the CURRENT cards
//   setAnimationPhase("exit");
// };
// const handleGridAnimationEnd = (event) => {
//   // Ignore animation events bubbling up from child elements
//   if (event.target !== event.currentTarget) return;

//   if (animationPhase === "exit") {
//     // Only switch the cards AFTER the old cards have exited
//     setShowSecondSet((prev) => !prev);

//     // New cards enter from the opposite direction
//     setSlideDirection((prev) =>
//       prev === "right" ? "left" : "right"
//     );

//     setAnimationPhase("enter");
//   } else if (animationPhase === "enter") {
//     setAnimationPhase("idle");
//   }
// };
// return (
//     <Section className="xl:mt-30 ">
//       <div
//         className="form-container
//           relative
//           lg:w-[950px] 
//           lg:h-[1050px]
//            xl:w-[1100px]
//           xl:h-[800px]
//           2xl:w-[1300px]
//           2xl:h-[800px]
//           overflow-hidden
//           w-full 
//           max-h-[85vh]
//           opacity-95
//           bg-cover
//           bg-center
//           bg-no-repeat
//         "
//       style={{ backgroundImage: `url('/textures/contactBanner.jpg')`,
//         opacity:`10%`
//        }}
//       >

        
//         <div 
//           ref={scrollRef}
//           onScroll={checkScroll}
//           className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth"
//         >
// <br />
// <br />
// <br />
// <br />
// <br />
// <br />
// <br />
// <br />
// <h4>
//   I am a 24 year old male from the Chicago area
// Work experience is 6 years in hospitality mainly
// as a line cook for various types of places
// Went to Culinary School and have a few 
// culinary certifcations. I always appreciated 
// learning new recipes and learning different
// cultures.
// Although I enjoy my life as a cook and I'd like
// to move up in the culinary world, I am
// currently looking for a entry level IT position.
// My IT background was cultivated from years of
// passion projects learning graphic design and 
// web development with a heavy interest in
// networking and the Internet.


// </h4>
// <br />
// <br />
// {/* Feature Cards */}
// <div className="mx-auto mt-12 w-full max-w-5xl">

//   {/* Card Grid */}
//             <div
//         key={showSecondSet ? "second-set" : "first-set"}
//         onAnimationEnd={handleGridAnimationEnd}
//         className={`grid grid-cols-1 gap-6 md:grid-cols-3 ${
//           animationPhase === "exit"
//             ? slideDirection === "right"
//               ? "animate-[cardsExitRight_350ms_ease-in_both]"
//               : "animate-[cardsExitLeft_350ms_ease-in_both]"
//             : animationPhase === "enter"
//               ? slideDirection === "left"
//                 ? "animate-[cardsEnterLeft_500ms_ease-out_both]"
//                 : "animate-[cardsEnterRight_500ms_ease-out_both]"
//               : ""
//         }`}
//       >
//     {(!showSecondSet
//       ? [
//           {
//             number: "01",
//             title: "Experience",
//             description: "Crafting an effortless journey with a user-first approach.",
//             image: "https://i.pinimg.com/736x/2b/74/7b/2b747b71b782a8833f2b3ad9b0e37cd1.jpg",
//             color: "group-hover:text-orange-500",
//           },
//           {
//             number: "02",
//             title: "Interaction",
//             description: "Our platform is designed for simplicity and ease.",
//             image: "https://i.pinimg.com/564x/3c/c2/6c/3cc26c0140c2f0dc70d8aa48416c41dc.jpg",
//             color: "group-hover:text-indigo-400",
//           },
//           {
//             number: "03",
//             title: "Design",
//             description: "Our design philosophy centers around the user.",
//             image: "https://i.pinimg.com/564x/fa/4f/cf/fa4fcfd2db636f98eb0f2b5aecce0c28.jpg",
//             color: "group-hover:text-cyan-400",
//           },
//         ]
//       : [
//           {
//             number: "04",
//             title: "Innovation",
//             description: "Exploring new possibilities through creative thinking.",
//             image: "https://i.pinimg.com/736x/2b/74/7b/2b747b71b782a8833f2b3ad9b0e37cd1.jpg",
//             color: "group-hover:text-emerald-400",
//           },
//           {
//             number: "05",
//             title: "Development",
//             description: "Turning ambitious ideas into thoughtful solutions.",
//             image: "https://i.pinimg.com/564x/3c/c2/6c/3cc26c0140c2f0dc70d8aa48416c41dc.jpg",
//             color: "group-hover:text-purple-400",
//           },
//           {
//             number: "06",
//             title: "Creativity",
//             description: "Bringing bold ideas to life through design.",
//             image: "https://i.pinimg.com/564x/fa/4f/cf/fa4fcfd2db636f98eb0f2b5aecce0c28.jpg",
//             color: "group-hover:text-pink-400",
//           },
//         ]
//     ).map((card) => (
//       <article
//         key={card.number}
//         className="group relative mx-auto min-h-[500px] w-full overflow-hidden border-4 border-black bg-cover bg-center shadow-xl animate-[cardReveal_700ms_ease-out_both] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_25px_rgba(0,238,255,0.12)]"
//         style={{ backgroundImage: `url('${card.image}')` }}
//       >
//         <div className="flex min-h-[500px] flex-col justify-end bg-black/70 transition-colors duration-500 group-hover:bg-black/20">
//           <div className="flex flex-1 flex-col justify-end bg-black/50 p-6">
//             <h2
//               className={`mb-4 mt-2 translate-y-8 text-xl font-bold uppercase text-white transition-all duration-300 group-hover:translate-y-0 ${card.color}`}
//             >
//               {card.number} — {card.title}
//             </h2>

//             <p className="translate-y-2 text-base text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
//               {card.description}
//             </p>
//           </div>
//         </div>
//       </article>
//     ))}

//   </div>

//   {/* Small Toggle Button */}
//   <div className="mt-8 flex justify-center">
//     <button
//       type="button"
//       onClick={handleCardSwitch}
//       aria-label={showSecondSet ? "Show cards 1 through 3" : "Show cards 4 through 6"}
//       className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-[#00eeff] transition-all duration-300 hover:border-[#00eeff] hover:bg-[#00eeff]/10 hover:shadow-[0_0_15px_rgba(0,238,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00eeff]"
//     >
      
// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   fill="none"
//   viewBox="0 0 24 24"
//   strokeWidth={1.8}
//   stroke="currentColor"
//   className={`h-5 w-5 transition-transform duration-500 ease-in-out ${
//     showSecondSet ? "rotate-180" : "rotate-0"
//   }`}
// >
//   <path
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
//   />
// </svg>

//     </button>
//   </div>

// </div>


//         </div>
//           {/* Fading Text Hint */}
//         <div 
//           className={`absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-4 
//             bg-gradient-to-t from-black/80 to-transparent 
//             pointer-events-none 
//             transition-opacity duration-500 
//             ${showArrow ? 'opacity-100' : 'opacity-0'}
//           `}
//         >
//           <span 
//             className={`text-[#ffffff] text-sm uppercase tracking-widest mb-2 transition-opacity duration-1000
//               ${showText ? 'opacity-100' : 'opacity-0'}
//             `}
//           >
//             Scroll Down
//           </span>

//           {/* Bobbing Arrow */}
//           <div className="animate-bounce text-[#00eeff]">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//             </svg>
//           </div>
//         </div>
//       </div>
//     </Section>
//   );
// };
const ContactSection = () => {
  const [showArrow, setShowArrow] = useState(true);
  const [showText, setShowText] = useState(false); // New state for the text

  const [showSecondSet, setShowSecondSet] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("idle");
  const [slideDirection, setSlideDirection] = useState("right");

  // State for the new introductory owner screen
  const [showOwnerIntro, setShowOwnerIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isAnimating = animationPhase !== "idle";

  const scrollRef = useRef(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasMoreToScroll = scrollHeight > clientHeight + scrollTop + 10;
      setShowArrow(hasMoreToScroll);
      
      // If the user starts scrolling, we can also hide the text hint immediately
      if (scrollTop > 10) setShowText(false);
    }
  };

  useEffect(() => {
    // Check initial scroll state
    const scrollTimer = setTimeout(() => {
      checkScroll();
    }, 1000);

    // Show "Scroll Down" text after 5 seconds
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 4000);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(textTimer);
    };
  }, []);

  const handleCardSwitch = () => {
    if (animationPhase !== "idle") return;

    // Direction the current cards should exit
    setSlideDirection(showSecondSet ? "left" : "right");

    // Start fading out the CURRENT cards
    setAnimationPhase("exit");
  };

  const handleGridAnimationEnd = (event) => {
    // Ignore animation events bubbling up from child elements
    if (event.target !== event.currentTarget) return;

    if (animationPhase === "exit") {
      // Only switch the cards AFTER the old cards have exited
      setShowSecondSet((prev) => !prev);

      // New cards enter from the opposite direction
      setSlideDirection((prev) =>
        prev === "right" ? "left" : "right"
      );

      setAnimationPhase("enter");
    } else if (animationPhase === "enter") {
      setAnimationPhase("idle");
    }
  };

  const handleLearnMore = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowOwnerIntro(false);
    }, 500); // Matches the 500ms transition duration
  };
function CopyableText({ text }) {
  const [sparkle, setSparkle] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setSparkle(true);
    setTimeout(() => setSparkle(false), 800);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleCopy}
        className="group relative px-3 py-1 rounded transition-all duration-500 hover:shadow-[0_8px_20px_rgba(0,238,255,0.35)] hover:-translate-y-1 active:translate-y-0"
      >
        {text}
        {sparkle && (
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full pointer-events-none animate-sparkle">
            📝
          </span>
        )}
      </button>
    </div>
  );
}


  
  return (
    <Section className="xl:mt-30 ">
      <div
        className="form-container
          relative
          lg:w-[950px] 
          lg:h-[1050px]
          xl:w-[1100px]
          xl:h-[800px]
          2xl:w-[1300px]
          2xl:h-[800px]
          overflow-hidden
          w-[405px] 
          md:w-auto
          max-h-[85vh]
         bg-transparent
         opacity-100
        "
      >
        {/* New Owner Intro Splash Page Overlay */}
        {/* New Owner Intro Splash Page Overlay */}
        {showOwnerIntro && (
          <div
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black  p-8 text-center transition-opacity duration-500 ${
              isFadingOut ? "opacity-0 pointer-events-none" : "opacity-90"
            }`}
          >
            <div className="max-w-xl space-y-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                If you have any questions my contact info is
              </h2>
              <div className="text-xl font-medium space-y-1">
                <p className="pb-1">Michael Murray</p>
               <CopyableText text="+1 (262) 230-5182" />
               <br />
               <CopyableText text="murraymichael004@gmail.com" />
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleLearnMore}
                  className="rounded-lg bg-[#00eeff] px-6 py-3 text-lg font-semibold text-black shadow-lg transition-all duration-300 hover:bg-[#00eeff]/80 hover:shadow-[0_0_20px_rgba(0,238,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

<div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 -z-10"
    style={{ backgroundImage: `url('/textures/contactBanner.jpg')` }}
  />
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth "
        >
<br />
<br />
<div className="w-full overflow-visible">
    <h1 className="masked-text  xl:text-right"> 
        Portfolio
    </h1>
</div>
{/* <div className=" xl:left-0 bg-black/60 p-6 md:p-8 rounded-l-2xl">
<h2 className="text-fuchsia-50 text-right text-2xl "> 
  My Portfolio</h2>
</div> */}

<br />
<br />
{/* Feature Cards */}
<div className="mx-auto mt-12 w-full max-w-5xl">

  {/* Card Grid */}
            <div
        key={showSecondSet ? "second-set" : "first-set"}
        onAnimationEnd={handleGridAnimationEnd}
        className={`grid grid-cols-1 gap-6 md:grid-cols-3 ${
          animationPhase === "exit"
            ? slideDirection === "right"
              ? "animate-[cardsExitRight_350ms_ease-in_both]"
              : "animate-[cardsExitLeft_350ms_ease-in_both]"
            : animationPhase === "enter"
              ? slideDirection === "left"
                ? "animate-[cardsEnterLeft_500ms_ease-out_both]"
                : "animate-[cardsEnterRight_500ms_ease-out_both]"
              : ""
        }`}
      >
    {(!showSecondSet
      ? [
          {
            number: "01",
            title: "Startup Business Template",
            description: "Exciting and polished website for real professionals.",
            image: "/textures/projects/badgerss.png", // Linked from public folder
            url: "https://www.badgerss.com/",
            color: "group-hover:text-orange-500",
          },
          {
            number: "02",
            title: "MurBurger",
            description: "Simple template for a restaurant website.",
            image: "/textures/projects/murburger.png",
            url: "https://murburger-proto.vercel.app/",
            color: "group-hover:text-red-400",
          },
          {
            number: "03",
            title: "3D Billboard App",
            description: "First portfolio I made that I incorporated React with 3D modeling.",
            image: "/textures/projects/billboard.png",
            url: "https://office-dun.vercel.app/",
            color: "group-hover:text-cyan-400",
          },
        ]
      : [
          {
            number: "04",
            title: "First 3D Website",
            description: "Learned how to upload my custom 3D files and Bake the textures.",
            image: "/textures/projects/first3d.png",
            url: "https://portfolio-six-pi-54.vercel.app/",
            color: "group-hover:text-emerald-400",
          },
          {
            number: "05",
            title: "First Full Stack App",
            description: "Made over 4 years ago. The app used to feature a login user feature and a upload recipe feature.",
            image: "/textures/projects/recipe.png",
            url: "https://recipe-app-seven-beta.vercel.app/",
            color: "group-hover:text-purple-400",
          },
          {
            number: "06",
            title: "Creativity",
            description: "Bold ideas to life through 3D web design.",
            image: "/textures/projects/office2026.png",
            url: "https://www.sirmur.com/",
            color: "group-hover:text-pink-400",
          },
        ]
    ).map((card) => (
      <a
        key={card.number}
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto block min-h-[500px] w-full overflow-hidden border-4 border-black bg-cover bg-center shadow-xl animate-[cardReveal_700ms_ease-out_both] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_25px_rgba(0,238,255,0.12)] cursor-pointer"
        style={{ backgroundImage: `url('${card.image}')` }}
      >
      <article
        key={card.number}
        className="group relative mx-auto min-h-[500px] w-full overflow-hidden border-4 border-black bg-cover bg-center shadow-xl animate-[cardReveal_700ms_ease-out_both] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_25px_rgba(0,238,255,0.12)]"
        style={{ backgroundImage: `url('${card.image}')` }}
      >
        <div className="flex min-h-[500px] flex-col justify-end bg-black/70 transition-colors duration-500 group-hover:bg-black/20">
          <div className="flex flex-1 flex-col justify-end bg-black/50 p-6">
            <h2
              className={`mb-4 mt-2 translate-y-8 text-xl font-bold uppercase text-white transition-all duration-300 group-hover:translate-y-0 ${card.color}`}
            >
              {card.number} — {card.title}
            </h2>

            <p className="translate-y-2 text-base text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {card.description}
            </p>
          </div>
        </div>
      </article>
      </a>
    ))}

  </div>

  {/* Small Toggle Button */}
  <div className="mt-8 flex justify-center">
    <button
      type="button"
      onClick={handleCardSwitch}
      aria-label={showSecondSet ? "Show cards 1 through 3" : "Show cards 4 through 6"}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-[#00eeff] transition-all duration-300 hover:border-[#00eeff] hover:bg-[#00eeff]/10 hover:shadow-[0_0_15px_rgba(0,238,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00eeff]"
    >
      
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.8}
  stroke="currentColor"
  className={`h-5 w-5 transition-transform duration-500 ease-in-out ${
    showSecondSet ? "rotate-180" : "rotate-0"
  }`}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
  />
</svg>

    </button>
  </div>

</div>
<br /><br /><br />
<h4 className=" text-white bg-black/80  text-3xl lg:text-2xl  lg:mx-20   p-1 md:p-2 lg:p-4 rounded-l-2xl" >
  I am a 24 year old male from Chicago, IL.
8+ years in hospitality mainly
as a Line Cook for various types of restaurants.
Went to Culinary School and have a few 
culinary certifcations. I always appreciated 
learning new recipes and learning different
cultures.
<br />
<br />
Although I enjoy my life as a cook and I'd like
to move up in the culinary world, I am
currently looking for a entry level IT position.
<br />
<br />
My IT background was cultivated from years of
passion projects learning graphic design and 
web development with a heavy interest in
networking and the Internet.

<br />
<br />
<span className="block text-center w-full">
  <a href="public/resume.pdf" target="_blank" >
Here is my formal resume</a>
</span>

</h4>


        </div>
        
          {/* Fading Text Hint */}
        <div 
          className={`absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-8 
            bg-gradient-to-t from-black/80 to-transparent 
            pointer-events-none 
            transition-opacity duration-500 
            ${showArrow ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span 
            className={`text-[#ffffff] text-sm uppercase tracking-widest mb-2 transition-opacity duration-1000
              ${showText ? 'opacity-100' : 'opacity-0'}
            `}
          >
            Scroll Down
          </span>



          {/* Bobbing Arrow */}
          <div className="animate-bounce text-[#00eeff]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
};