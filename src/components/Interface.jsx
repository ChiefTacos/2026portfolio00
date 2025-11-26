import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { currentProjectAtom, projects } from "./Projects";

import styled from 'styled-components';
import { useState } from "react";



const StyledWrapper = styled.div`


@media (max-height: 788px) {
 .full-form {
    width: 320px !important;     
    padding: 1.2rem;
    height: 420px !important;     
  }
  .input-container textarea {
    min-height: 80px;
  }
}


@media (max-width: 768px) {
  .form-container {
    
    transform-origin: top left;  /* keep position stable */
  }

  .title-button {
    padding: 1rem 0.2rem;
    transform: scale(0.5);     
  }

  .title-2 {
    font-size: 1.6rem;
    -webkit-text-stroke: 0.07rem #fff;
  }

  .full-form {
    width: 320px !important;     /* instead of 500px */
    padding: 1.2rem;
        height: 420px !important;     

  }

  .input-container input {
    width: 200px;
    font-size: 0.75rem;
  }

  .input-container textarea {
    min-height: 90px;
  }


}
.form-container {
    position: relative;
    display: inline-block;          
  }

  /* The small button that shows at first */
  .title-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 2rem;
    background: linear-gradient(14deg, rgba(2,0,36,0.9), rgba(24,24,65,0.8), rgb(20,76,99));
    border: 2px solid #fff;
    box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    cursor: pointer;
    user-select: none;
    transform: scale(0.85);      /* shrink whole component */

  }

  .title-2 {
    margin: 0;
    font-size: 2.4rem;
    font-weight: 800;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-text-stroke: 0.1rem #fff;
    letter-spacing: 0.25rem;
    color: transparent;
    text-shadow: 0px 0px 16px #CECECE;
    transition: all 0.4s ease;
  }

  .title-2 span::before,
  .title-2 span::after { content: '—'; }

  .title-2.clicked {
    color: #fff !important;
    text-shadow: 0 0 20px #fff, 0 0 40px #00ffff;
  }

  /* Full form that expands */
  .full-form {
    position: absolute;
    top: 100%;
    right: 0;
    width: 500px;
    padding: 2.2rem;
    background: linear-gradient(14deg, rgba(2,0,36,0.8), rgba(24,24,65,0.7), rgb(20,76,99)),
                radial-gradient(circle, rgba(2,0,36,0.5), rgba(32,15,53,0.2), rgba(14,29,28,0.9));
    border: 2px solid #fff;
    box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    z-index: 10;
  }




  .form {
    position: relative;
    display: block;
    padding: 2.2rem;
    max-width: 500px;
    background: linear-gradient(14deg, rgba(2,0,36, 0.8) 0%, rgba(24, 24, 65, 0.7) 66%, 
   rgb(20, 76, 99) 100%), radial-gradient(circle, rgba(2,0,36, 0.5) 0%, 
   rgba(32, 15, 53, 0.2) 65%, rgba(14, 29, 28, 0.9) 100%);
    border: 2px solid #fff;
    -webkit-box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    box-shadow: rgba(0,212,255) 0px 0px 50px -15px;
    overflow: hidden;
    z-index: +1;
  }

  /*------input and submit section-------*/

  .input-container {
  position: relative;
  }

 .input-container input, 
.input-container textarea, 
.form button {
  outline: none;
  border: 2px solid #ffffff;
  margin: 2px 0;
  font-family: monospace;
}
  .input-container input
   {
    background-color: #fff;
    padding: 6px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 250px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

.input-container textarea {
  resize: vertical;           
  min-height: 120px;
  height: auto;
}

.input-container input:focus::placeholder,
.input-container textarea:focus::placeholder {
  opacity: 0;
  transition: opacity .9s;
}
  .submit {
    position: relative;
    display: block;
    padding: 8px;
    background-color: #c0c0c0;
    color: #ffffff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: 100%;
    text-transform: uppercase;
    overflow: hidden;
  }

  .submit:hover {
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
    border-radius: 3.9px;
    box-shadow: 4px 5px 17px -4px #ffffff;
    cursor: pointer;
  }

  .submit:hover::before {
    -webkit-animation: sh02 0.5s 0s linear;
    -moz-animation: sh02 0.5s 0s linear;
    animation: sh02 .5s 0s linear;
  }

  .submit::before {
    content: '';
    display: block;
    width: 0px;
    height: 85%;
    position: absolute;
    top: 50%;
    left: 0%;
    opacity: 0;
    background: #fff;
    box-shadow: 0 0 50px 30px #fff;
    -webkit-transform: skewX(-20deg);
    -moz-transform: skewX(-20deg);
    -ms-transform: skewX(-20deg);
    -o-transform: skewX(-20deg);
    transform: skewX(-20deg);
  }

  @keyframes sh02 {
    from {
      opacity: 0;
      left: 0%;
    }

    50% {
      opacity: 1;
    }

    to {
      opacity: 0;
      left: 100%;
    }
  }

  /*--------signup section---------*/

  .signup-link {
    color: #c0c0c0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
    font-family: monospace;
  }

  .signup-link a {
    color: #fff;
    text-decoration: none;
  }

  .up:hover {
    text-decoration: underline;
  }


  /*--------header section-----------*/

  .form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-family: monospace;
    font-weight: 600;
    text-align: center;
    color: #fff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
    animation-duration: 1.5s;
    overflow: hidden;
    transition: .12s;
  }

  .form-title span {
    animation: flickering 2s linear infinite both;
  }

  @keyframes flickering {
    0%,
    100% {
      opacity: 1;
    }

    41.99% {
      opacity: 1;
    }

    42% {
      opacity: 0;
    }

    43% {
      opacity: 0;
    }

    43.01% {
      opacity: 1;
    }

    47.99% {
      opacity: 1;
    }

    48% {
      opacity: 0;
    }

    49% {
      opacity: 0;
    }

    49.01% {
      opacity: 1;
    }
  }

  /*---------shooting stars-----------*/


  .bg-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-size: cover;
    animation: animateBg 50s linear infinite;
  }

  @keyframes animateBg {
    0%,100% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.2);
    }
  }

  .star {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255,255,255,0.1),0 0 0 8px rgba(255,255,255,0.1),0 0 20px rgba(255,255,255,0.1);
    animation: animate 3s linear infinite;
  }

  .star::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg,#fff,transparent);
  }

  @keyframes animate {
    0% {
      transform: rotate(315deg) translateX(0);
      opacity: 1;
    }

    70% {
      opacity: 1;
    }

    100% {
      transform: rotate(315deg) translateX(-1000px);
      opacity: 0;
    }
  }

  .star:nth-child(1) {
    top: 0;
    right: 0;
    left: initial;
    animation-delay: 0s;
    animation-duration: 1s;
  }

  .star:nth-child(2) {
    top: 0;
    right: 100px;
    left: initial;
    animation-delay: 0.2s;
    animation-duration: 3s;
  }

  .star:nth-child(3) {
    top: 0;
    right: 220px;
    left: initial;
    animation-delay: 2.75s;
    animation-duration: 2.75s;
  }

  .star:nth-child(4) {
    top: 0;
    right: -220px;
    left: initial;
    animation-delay: 1.6s;
    animation-duration: 1.6s;

  }



  `;


const Section = (props) => {
  const { children } = props;

  return (
    <motion.section
      className={`
  h-screen w-screen p-8 max-w-screen-2xl mx-auto
  flex flex-col items-start justify-center
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
      <AboutSection setSection={setSection} />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};

const AboutSection = (props) => {
  const { setSection } = props;
  return (
    <Section>
    
      <motion.p
        className="text-lg text-gray-600 mt-4"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1.5,
        }}
      >
        <br />
      </motion.p>
      
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

  // ---- state to track which parts were clicked ----
  const [clickedFree, setClickedFree] = useState(false);
  const [clickedQuote, setClickedQuote] = useState(false);
const [fullyOpen, setFullyOpen] = useState(false);

   const revealed = clickedFree || clickedQuote;
 


  return (
    <Section>
      <StyledWrapper>
          <div className="form-container
           lg:translate-x-[230px] md:translate-x-[230px]  translate-x-[90px] 
            lg:translate-y-[-250px] md:translate-y-[-350px]  translate-y-[-260px]
            ">

                    {/* ========== Small "FREE QUOTE" button ========== */}
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
              className={`title-2 ${clickedFree ? 'clicked' : ''}`}
              whileTap={{ scale: 0.93 }}
            >
              FREE
            </motion.div>
            <motion.div
              className={`title-2 ${clickedQuote ? 'clicked' : ''}`}
              whileTap={{ scale: 0.93 }}
            >
              QUOTE
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
    </StyledWrapper>
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
      <div className="flex w-full h-full gap-8 items-center justify-center">
        <button
          className="hover:text-indigo-600 transition-colors"
          onClick={previousProject}
        >
          ← Previous
        </button>
        <h2 className="text-5xl font-bold">my work...</h2>
        <button
          className="hover:text-indigo-600 transition-colors"
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
