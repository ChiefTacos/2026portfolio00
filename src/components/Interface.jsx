import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { currentProjectAtom, projects } from "./Projects";

import styled from 'styled-components';
import { useState, useEffect } from "react";
import GoogleReviewsBox from "./GoogleReviewsBox";




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



const languages = [
  {
    title: "🇺🇸 English",
    level: 100,
  },
  {
    title: "es Espanol",
    level: 50,
  },
  {
    title: "de Deutch",
    level: 20,
  },
];

const SkillsSection = () => {


  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;


  return (
    <Section>

  <div className="pb-72 mb-48 w-full h-full  flex gap-2 lg:gap-12 items-center justify-center pr-4">
            <GoogleReviewsBox placeId={placeId} apiKey={apiKey} />

      </div>


          </Section>
  );
};

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

const ContactSection = () => {
  return (
    <Section>
      <h2 className="text-7xl text-slate-50 font-bold bg-slate-950">Let's get crackin'</h2>
      <div className="mt-8 p-2 rounded-md  w-96 md:text-left max-w-full text-center">
        {/* <form>
          <label for="name" className="font-medium text-gray-900 block mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <label
            for="email"
            className="font-medium text-gray-900 block mb-1 mt-8"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <label
            for="email"
            className="font-medium text-gray-900 block mb-1 mt-8"
          >
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="h-32 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <button className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16 ">
            Submit
          </button>
        </form> */}
        <form>
<motion.label
  htmlFor="name"
  className="font-medium text-3xl text-white drop-shadow-2xl block mb-1 cursor-none"
  whileHover={{ scale: 1.15 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>            Michael Murray <br></br><br></br> Age 23
          </motion.label>
          <br></br>


<label for="name" className="font-medium text-lg text-slate-50 drop-shadow-xl   mb-1 cursor-text ">
Born in Chicago IL. Interested in carpentry and electrical apprenticeship programs or construction work. I'm a dual citizen of the USA and Germany.          </label>

<a
href="mailto:amurraymichael@gmail.com?subject=Hello&body=I%20wanted%20to%20reach%20out..."
  target="_blank"
  rel="noopener noreferrer"
>
<section
  class="relative group flex flex-col items-center justify-center w-full h-full"
>
  <div
    class="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50"
  >
    <div
      class="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]"
    ></div>
    <div
      class="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]"
    ></div>
    <div
      class="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]"
    ></div>
    <div
      class="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]"
    ></div>
    <div
      class="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]"
    ></div>
  </div>
  <p class="text-3xl pt-4 opacity-20">Hover over</p>
</section>

          <motion.label
            htmlFor="email"
            className="font-medium text-xl  text-slate-50 drop-shadow-lg  block mb-1 mt-8 cursor-pointer"
             whileHover={{ scale: 1.1 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Email Me
          </motion.label>
          </a>

          <motion.label
            for="email"
            className="font-medium text-gray-900 block mb-1 mt-8 "
           
          >
            
          </motion.label>
         
        </form>
      </div>
    </Section>
  );
};
