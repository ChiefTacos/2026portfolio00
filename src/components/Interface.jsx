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
// REVIEWS
//////////

const SkillsSection = () => {


  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;

  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom01);

  const nextProject = () => {
    setCurrentProject((currentProject + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
  };

  return (
    <Section>

{/* <div className="relative inset-x-0 top-1 left-1/2 lg:left-24 -translate-x-1/2 w-full max-w-xs lg:max-w-xs z-[99999]">
  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

    
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <GoogleReviewsBox placeId={placeId} apiKey={apiKey} />
    </div>
  </div>
</div> */}

      <div className="relative -top-24 pb-48 mb-24 left-0 w-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
        <button
          className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
          onClick={previousProject}
        >
          ← Previous
        </button>
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-white">Badger Reviews</h2>
        <button
          className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
          onClick={nextProject}
        >
          Next →
        </button>
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

const ProjectsSection = () => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

  const nextProject = () => {
    setCurrentProject((currentProject + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
  };

  return (
    <Section>
      <div className="fixed left-0 w-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
        <button
          className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
          onClick={previousProject}
        >
          ← Previous
        </button>
        <h2 className="text-4xl lg:text-5xl font-bold text-center text-white">Badger Services</h2>
        <button
          className="hover:text-green-600 transition-colors text-white text-2xl lg:text-3xl"
          onClick={nextProject}
        >
          Next →
        </button>
      </div>
    </Section>
  );
};


// og contact
// const ContactSection = () => {
//   return (
//     <Section
//     >
//       <div className=" form-container
//   w-full
//   max-w-[500px]
//   md:max-w-[800px]

//   lg:max-w-[900px]
//   xl:max-w-[1200px]
//   h-full
//   max-h-[700px]
//    xl:mr-48
// ">
//         <div className="form">
//           <span className="heading text-5xl">Emphasis on Quality and Customer Satisfaction</span>
//           <div className="flex md:flex-row flex-col items-center gap-4 text-center">
//                     <div className="flex flex-col w-1/3 text-2xl text-white">
//                   <span  className="pb-2.5 pt-2 c3 text-2xl  border-slate-950 border-t-2 ">
//                   <span className="text-[#00eeff]">Badger Surface Solutions </span> provides Quality Service and Customer Satisfaction from people rooted in the Badger State. 
//                   </span>
//             <span className="pt-2.5 py-3.5 c2 text-2xl  border-slate-700 border-t-2 border-b-2">We Proudly Serve These Counties!</span>
//             <span className="c2 pb-6 text-xl border-slate-950 border-b-2">Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.</span>
//           </div>

          
//               <div className="flex flex-col w-1/3 text-4xl text-white">
//                         <span  className="pb-3 pt-2 c3 text-3xl  border-slate-950  border-t-2">
//                         Hours of Operation to Call and Schedule an Appointment are
//                                                 </span>
//                   <span className="pt-3 py-5 c2 text-4xl  border-slate-700 border-t-2 border-b-2"><span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am- 
//                   <span className="text-[#00eeff]">5</span>:<span className="text-[#00eeff]">00</span>pm CST <br  /><span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span></span>
//                   <span className="c2 pb-6 text-3xl border-slate-950 border-b-2">Our Number to  <span className="text-[#00eeff]">Call</span> is <br /> <span className="text-4xl font-bold">+1-
//                     <span className="text-[#00eeff]">262</span>
//                     -<span className="text-[#00eeff]">230</span>-
//                     <span className="text-[#00eeff]">5182</span>
//                   </span></span>
//                 </div>

//               <div className="w-1/3">
//           <img className="w-full h-full" src="/textures/counties.png" alt="" />

//              </div>
//            </div>
         
//        {/* <div className="section-banner w-1/3">
//         <div id="star-1">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-2">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-3">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-4">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-5">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-6">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         <div id="star-7">
//           <div className="curved-corner-star">
//             <div id="curved-corner-bottomright" />
//             <div id="curved-corner-bottomleft" />
//           </div>
//           <div className="curved-corner-star">
//             <div id="curved-corner-topright" />
//             <div id="curved-corner-topleft" />
//           </div>
//         </div>
//         </div> */}

//           <div className="button-container mt-4">
//             <div className="send-button">Customize a Quote</div>
//             <div className="reset-button-container">
//               <div className="reset-button" id="reset-btn">Contact Us</div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//          </Section>
//   );
// };

const ContactSection = () => {
  const [showArrow, setShowArrow] = useState(true);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If we are within 10px of the bottom, hide the arrow
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    }
  };
  // Optional: Check on load. If the content fits without scrolling, hide arrow immediately.
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight <= clientHeight) {
        setShowArrow(false);
      }
    }
  }, []);

  return (
    <Section>
      <div
        className="form-container
          relative
          w-full
          max-w-full
          md:max-w-[800px]
          lg:max-w-[900px]
          xl:max-w-[1200px]
          h-full
          max-h-[85vh]
          md:max-h-[700px]
          xl:mr-48
          overflow-hidden
        "
      >
        {/* SCROLLABLE WRAPPER 
           - Added ref={scrollRef} to track height
           - Added onScroll={handleScroll} to detect movement
        */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-y-auto md:overflow-visible p-4 pb-24 md:p-0 scroll-smooth"
        >
          <div className="form h-full">
            <span className="heading block text-center text-3xl md:text-4xl lg:text-5xl mb-6">
              Emphasis on <span className="text-[#00eeff]">Quality</span> and <span className="text-[#00eeff]">Customer Satisfaction</span> 

            </span>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-4 text-center">
              
              {/* COLUMN 1 */}
              {/* <div className="flex flex-col w-full md:w-1/3 text-white">
                <span className="pb-2.5 pt-2 c3 text-lg md:text-xl lg:text-2xl border-slate-950 border-t-2">
                  <span className="text-[#00eeff] font-semibold">Badger Surface Solutions </span>
                  provides Quality Service and Customer Satisfaction from people rooted in the <span className="text-[#C5050C] font-semibold">Badger</span> State.
                </span>
                <span className="pt-2.5 py-3.5 c2 text-lg md:text-xl lg:text-2xl border-slate-700 border-t-2 border-b-2">
                  We Proudly Serve These Counties!
                </span>
                <span className="c2 pb-6 text-base md:text-lg lg:text-xl border-slate-950 border-b-2">
                  Kenosha, Racine, Walworth, Waukesha, Jefferson, Washington, Ozaukee and Milwaukee.
                </span>
              </div> */}
                <div className="flex flex-col w-full md:w-1/3 text-white">
                <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-4">
                  Hours of Operation to Call and Schedule an Appointment are
                </span>
                <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-950 border-t-2 border-b-2">
                  <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
                  <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
                  <br />
                  <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
                </span>
                <span className="c2 pt-3 md:pb-3 text-xl md:text-2xl lg:text-3xl md:border-slate-950 md:border-b-4">
                  Our Number to <span className="text-[#00eeff]">Call</span> is <br />
                  <span className="text-3xl md:text-3xl lg:text-4xl font-bold">
                    +1-<span className="text-[#00eeff]">262</span>-
                    <span className="text-[#00eeff]">230</span>-
                    <span className="text-[#00eeff]">5182</span>
                  </span>
                </span>
              </div>
              {/* COLUMN 2 */}
              <div className="flex flex-col w-full md:w-1/3 text-white">
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
              {/* <div className="flex flex-col w-full md:w-1/3 text-white">
                <span className="pb-3 pt-2 c3 text-xl md:text-2xl lg:text-3xl border-slate-950 border-t-2">
                  Hours of Operation to Call and Schedule an Appointment are
                </span>
                <span className="pt-3 py-5 c2 text-2xl md:text-3xl lg:text-4xl border-slate-700 border-t-2 border-b-2">
                  <span className="text-[#00eeff]">9</span>:<span className="text-[#00eeff]">00</span>am-
                  <span className="text-[#00eeff]"> 5</span>:<span className="text-[#00eeff]">00</span>pm CST
                  <br />
                  <span className="text-[#00eeff]">Monday</span> thru <span className="text-[#00eeff]">Friday</span>
                </span>
                <span className="c2 pb-6 text-xl md:text-2xl lg:text-3xl border-slate-950 border-b-2">
                  Our Number to <span className="text-[#00eeff]">Call</span> is <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    +1-<span className="text-[#00eeff]">262</span>-
                    <span className="text-[#00eeff]">230</span>-
                    <span className="text-[#00eeff]">5182</span>
                  </span>
                </span>
              </div> */}

              {/* COLUMN 3 */}
              <div className="w-full md:w-1/3">
                <img className="w-full h-auto object-contain" src="/textures/counties.png" alt="Counties Map" />
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

        {/* SCROLL INDICATOR ARROW 
           - Logic: opacity is controlled by showArrow state
           - Added transition-opacity duration-300 for smooth fade
        */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-24 flex items-end justify-center pb-4 
            bg-gradient-to-t from-black/80 to-transparent 
            md:hidden pointer-events-none 
            transition-opacity duration-300 
            ${showArrow ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="animate-bounce text-[#00eeff]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-10 h-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

      </div>
    </Section>
  );
};