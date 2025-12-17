import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { currentProjectAtom, projects } from "./Projects";

import styled from 'styled-components';
import {  useEffect, useRef, useState } from "react";
import { currentProjectAtom01 } from "./GoogleReviewsPage";




const Section = (props) => {
  const { children } = props;

  return (
    <motion.section
  //     className={`
  // h-screen w-screen p-8 max-w-screen-2xl mx-auto
  // flex flex-col items-start justify-center
  // `}
     className={`
  h-screen w-screen p-8 max-w-screen-2xl mx-auto
flex flex-col items-center justify-center
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
    <Section>
      <div
        className="form-container
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
          className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth "
        >
          <div className="form h-full">
            <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6 pb-2">
              Emphasis on <span className="text-[#00eeff]">Quality</span> and <br /><span className="text-[#00eeff]">100% Customer Satisfaction</span> 
            </span>

            {/* Grid is often cleaner for "locked" column counts.
               - default: 1 col
               - lg (1024px+): 2 cols
               - 2xl (or your widest breakpoint): 3 cols
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-4 items-start text-center">
              
              {/* COLUMN 1 */}
              <div className="flex flex-col text-white">
                <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-4">
                  Hours of Operation to Call and Schedule an Appointment are
                </span>
                <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-950 border-t-2 border-b-2">
                  <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
                  <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
                  <br />
                  <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
                </span>
                <span className="c2 pt-3 md:pb-3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-b-4">
                  Our Number to <span className="text-[#00eeff]">Call</span> is <br />
                  <span className="text-3xl md:text-3xl lg:text-4xl font-bold">
                    +1-<span className="text-[#00eeff]">262</span>-
                    <span className="text-[#00eeff]">230</span>-
                    <span className="text-[#00eeff]">5182</span>
                  </span>
                </span>
              </div>

              {/* COLUMN 2 */}
              <div className="flex flex-col text-white">
                <span className="pb-2.5 pt-2 c3 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-4">
                  <span className="text-[#00eeff] font-semibold">Badger Surface Solutions </span>
                  provides Quality Service and Customer Satisfaction from people rooted in the <span className="text-[#C5050C] font-semibold">Badger</span> State.
                </span>
                <span className="pt-2.5 py-3.5 c2 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-2 border-b-2">
                  We Proudly Serve These Counties!
                </span>
                <span className="c2 pb-6 text-base md:text-lg lg:text-xl border-slate-950 border-b-4">
                  Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.
                </span>
              </div>

              {/* COLUMN 3 
                  - lg:col-span-2 makes it take full width of the 2-col layout 
                  - 2xl:col-span-1 puts it back into its own slot in 3-col layout
              */}
              <div className="lg:col-span-2 2xl:col-span-1 flex justify-center">
                <img className="w-full max-w-[400px] 2xl:max-w-full h-auto object-contain" src="/textures/counties.png" alt="Counties Map" />
              </div>
            </div>

            <div className="button-container mt-8">
              <div className="send-button">Customize a Quote</div>
              <div className="reset-button-container">
                <div className="reset-button" id="reset-btn">
                  Contact Us
                </div>
              </div>
            </div>
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
    <Section>
      <div
        className="form-container
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
          className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth"
        >
          <div className="form h-full">
            <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6 pb-2">
              Emphasis on <span className="text-[#00eeff]">Quality</span> and <br /><span className="text-[#00eeff]">100% Customer Satisfaction</span> 
            </span>

            {/* Grid is often cleaner for "locked" column counts.
               - default: 1 col
               - lg (1024px+): 2 cols
               - 2xl (or your widest breakpoint): 3 cols
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-4 items-start text-center">
              
              {/* COLUMN 1 */}
              <div className="flex flex-col text-white">
                <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-4">
                  Hours of Operation to Call and Schedule an Appointment are
                </span>
                <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-950 border-t-2 border-b-2">
                  <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
                  <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
                  <br />
                  <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
                </span>
                <span className="c2 pt-3 md:pb-3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-b-4">
                  Our Number to <span className="text-[#00eeff]">Call</span> is <br />
                  <span className="text-3xl md:text-3xl lg:text-4xl font-bold">
                    +1-<span className="text-[#00eeff]">262</span>-
                    <span className="text-[#00eeff]">230</span>-
                    <span className="text-[#00eeff]">5182</span>
                  </span>
                </span>
              </div>

              {/* COLUMN 2 */}
              <div className="flex flex-col text-white">
                <span className="pb-2.5 pt-2 c3 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-4">
                  <span className="text-[#00eeff] font-semibold">Badger Surface Solutions </span>
                  provides Quality Service and Customer Satisfaction from people rooted in the <span className="text-[#C5050C] font-semibold">Badger</span> State.
                </span>
                <span className="pt-2.5 py-3.5 c2 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-2 border-b-2">
                  We Proudly Serve These Counties!
                </span>
                <span className="c2 pb-6 text-base md:text-lg lg:text-xl border-slate-950 border-b-4">
                  Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.
                </span>
              </div>

              {/* COLUMN 3 
                  - lg:col-span-2 makes it take full width of the 2-col layout 
                  - 2xl:col-span-1 puts it back into its own slot in 3-col layout
              */}
              <div className="lg:col-span-2 2xl:col-span-1 flex justify-center">
                <img className="w-full max-w-[400px] 2xl:max-w-full h-auto object-contain" src="/textures/counties.png" alt="Counties Map" />
              </div>
            </div>

            <div className="button-container mt-8">
              <div className="send-button">Customize a Quote</div>
              <div className="reset-button-container">
                <div className="reset-button" id="reset-btn">
                  Contact Us
                </div>
              </div>
            </div>
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

const ContactSection = () => {
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
    <Section>
      <div
        className="form-container
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
          className="h-full w-full overflow-y-auto p-4 pb-24 scroll-smooth"
        >
          <div className="form h-full">
            <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6 pb-2">
              Emphasis on <span className="text-[#00eeff]">Quality</span> and <br /><span className="text-[#00eeff]">100% Customer Satisfaction</span> 
            </span>

            {/* Grid is often cleaner for "locked" column counts.
               - default: 1 col
               - lg (1024px+): 2 cols
               - 2xl (or your widest breakpoint): 3 cols
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-4 items-start text-center">
              
              {/* COLUMN 1 */}
              <div className="flex flex-col text-white">
                <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-4">
                  Hours of Operation to Call and Schedule an Appointment are
                </span>
                <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-950 border-t-2 border-b-2">
                  <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
                  <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
                  <br />
                  <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
                </span>
                <span className="c2 pt-3 md:pb-3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-b-4">
                  Our Number to <span className="text-[#00eeff]">Call</span> is <br />
                  <span className="text-3xl md:text-3xl lg:text-4xl font-bold">
                    +1-<span className="text-[#00eeff]">262</span>-
                    <span className="text-[#00eeff]">230</span>-
                    <span className="text-[#00eeff]">5182</span>
                  </span>
                </span>
              </div>

              {/* COLUMN 2 */}
              <div className="flex flex-col text-white">
                <span className="pb-2.5 pt-2 c3 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-4">
                  <span className="text-[#00eeff] font-semibold">Badger Surface Solutions </span>
                  provides Quality Service and Customer Satisfaction from people rooted in the <span className="text-[#C5050C] font-semibold">Badger</span> State.
                </span>
                <span className="pt-2.5 py-3.5 c2 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-2 border-b-2">
                  We Proudly Serve These Counties!
                </span>
                <span className="c2 pb-6 text-base md:text-lg lg:text-xl border-slate-950 border-b-4">
                  Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.
                </span>
              </div>

              {/* COLUMN 3 
                  - lg:col-span-2 makes it take full width of the 2-col layout 
                  - 2xl:col-span-1 puts it back into its own slot in 3-col layout
              */}
              <div className="lg:col-span-2 2xl:col-span-1 flex justify-center">
                <img className="w-full max-w-[400px] 2xl:max-w-full h-auto object-contain" src="/textures/counties.png" alt="Counties Map" />
              </div>
            </div>

            <div className="button-container mt-8">
              <div className="send-button">Customize a Quote</div>
              <div className="reset-button-container">
                <div className="reset-button" id="reset-btn">
                  Contact Us
                </div>
              </div>
            </div>
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