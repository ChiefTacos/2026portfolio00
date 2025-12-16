
import GoogleReviewsBox from './GoogleReviewsBox';


import { DayNightToggle } from "./DayNightToggle";




import styled from 'styled-components';
import { useEffect, useState } from 'react';




const StyledWrapper01 = styled.div`
  .keycap {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background: linear-gradient(180deg, #131313, #202020);
    box-shadow:
      inset -8px 0 8px rgba(0, 0, 0, 0.15),
      inset 0 -8px 8px rgba(0, 0, 0, 0.25),
      0 0 0 2px rgba(0, 0, 0, 0.75),
      10px 20px 25px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    transition:
      transform 0.1s ease-in-out,
      box-shadow 0.1s ease-in;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    .letter {
      position: absolute;
      left: 12px;
      top: 12px;
      color: #e9e9e9;
      font-size: 16px;
      transition: transform 0.1s ease-in-out;
    }

    &::before {
      content: "";
      position: absolute;
      top: 3px;
      left: 4px;
      bottom: 14px;
      right: 12px;
      background: linear-gradient(90deg, #232323, #4a4a4a);
      border-radius: 10px;
      box-shadow:
        -10px -10px 10px rgba(255, 255, 255, 0.25),
        10px 5px 10px rgba(0, 0, 0, 0.15);
      border-left: 1px solid #0004;
      border-bottom: 1px solid #0004;
      border-top: 1px solid #0009;
      transition: all 0.1s ease-in-out;
    }

    &:active {
      transform: translateY(2px);
      box-shadow:
        inset -4px 0 4px rgba(0, 0, 0, 0.1),
        inset 0 -4px 4px rgba(0, 0, 0, 0.15),
        0 0 0 2px rgba(0, 0, 0, 0.5),
        5px 10px 15px rgba(0, 0, 0, 0.3);

      &::before {
        top: 5px;
        left: 5px;
        bottom: 11px;
        right: 11px;
        box-shadow:
          -5px -5px 5px rgba(255, 255, 255, 0.15),
          5px 3px 5px rgba(0, 0, 0, 0.1);
      }

      .letter {
        transform: translateY(1px);
      }
    }
  }`;

const CyberWrapper = styled.div`
  .cyber-btn {
    position: relative;
    background: transparent;
    color: white;
    border: none;
    padding-x: 0px 25px 0px 25px;
    font-family: "Rajdhani", sans-serif;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
    margin: 0px;
  }

  .cyber-btn:hover {
    text-shadow: 0 0 12px rgba(0, 243, 255, 0.8);
    letter-spacing: 3px;
  }

  .cyber-btn::before,
  .cyber-btn::after {
    content: "";
    position: absolute;
    width: 0;
    height: 1px;
    background: #00f3ff;
    box-shadow: 0 0 5px #00f3ff;
    transition: all 0.3s;
  }

  .cyber-btn::before {
    top: 0;
    left: 0;
  }

  .cyber-btn::after {
    bottom: 0;
    right: 0;
  }

  .cyber-btn:hover::before,
  .cyber-btn:hover::after {
    width: 100%;
  }

  .cyber-tooltip {
    position: absolute;
    width: 220px;
    padding: 20px;
    background: rgba(15, 15, 35, 0.95);
    border: 1px solid rgba(0, 231, 255, 0.5);
    color: #00e7ff;
    font-size: 19px;
    line-height: 1.5;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    box-shadow: 0 0 30px rgba(0, 231, 255, 0.2);
    text-shadow: 0 0 8px rgba(0, 231, 255, 0.5);
    z-index: 10;

    clip-path: polygon(
      0% 20%,
      10% 0%,
      90% 0%,
      100% 20%,
      100% 80%,
      90% 100%,
      10% 100%,
      0% 80%
    );

    background-image: linear-gradient(rgba(0, 231, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 231, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;

    bottom: calc(100% + 20px);
    left: 50%;
    transform: translateX(-50%);
  }

  .cyber-btn:hover + .cyber-tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(-10px);
  }

  @keyframes scan {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    20%,
    80% {
      opacity: 0.7;
    }
    100% {
      transform: translateY(100%);
      opacity: 0;
    }
  }

  .cyber-tooltip::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00e7ff, transparent);
    box-shadow: 0 0 10px #00e7ff;
    animation: scan 2s infinite;
  }

  .cyber-tooltip .corner-tl {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 10px;
    height: 10px;
    border: 1px solid #00e7ff;
    box-shadow: 0 0 5px #00e7ff;
    border-right: none;
    border-bottom: none;
  }

  .cyber-tooltip .corner-tr {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    border: 1px solid #00e7ff;
    box-shadow: 0 0 5px #00e7ff;
    border-left: none;
    border-bottom: none;
  }

  .cyber-tooltip .corner-bl {
    position: absolute;
    bottom: 5px;
    left: 5px;
    width: 10px;
    height: 10px;
    border: 1px solid #00e7ff;
    box-shadow: 0 0 5px #00e7ff;
    border-right: none;
    border-top: none;
  }

  .cyber-tooltip .corner-br {
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 10px;
    height: 10px;
    border: 1px solid #00e7ff;
    box-shadow: 0 0 5px #00e7ff;
    border-left: none;
    border-top: none;
  }`;
const MobileWrapper = styled.div`
  .social-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000;
   box-shadow:
      inset -8px 0 8px rgba(0, 0, 0, 0.15),
      inset 0 -8px 8px rgba(0, 0, 0, 0.25),
      0 0 0 2px rgba(0, 0, 0, 0.75),
      10px 20px 25px rgba(0, 0, 0, 0.4);
          padding: 15px 10px;
    border-radius: 2em;
    border:none;
     transition:
      transform 0.1s ease-in-out,
      box-shadow 0.1s ease-in;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .social-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 90px;
    border-radius: 20%;
    
    margin: 0 10px;
    background-color: #f2f2f2;
    box-shadow: 0px 0px 4px #00000027;
    transition: 0.3s;
  }

  .social-button:hover {
    background-color: #f2f2f2;
    box-shadow: 0px 0px 6px 3px #00000027;
  }

  .social-buttons svg {
    transition: 0.3s;
    margin: 0px 0px;
    
    height: 0px;
  }

  .facebook {
      background-color: #44AD49;
  }

  .facebook svg {
    fill: #f2f2f2;

  }

  .facebook:hover svg {
    fill: #3b5998;
  }

  .github {
    background-color: #FFFFFF;
  }

  .github svg {
    width: 25px;
    height: 25px;
    fill: #000000;
  }

  .github:hover svg {
    fill: #333;
  }

  .linkedin {
    background-color: #0077b5;
  }

  .linkedin svg {
    fill: #f2f2f2;
  }

  .linkedin:hover svg {
    fill: #0077b5;
  }

  .instagram {
    background-color: #ab0b00;
  }

  .instagram svg {
    fill: #f2f2f2;
  }

  .instagram:hover svg {
    fill: #c13584;
  }`;

export const Menu = (props) => {
  const {
    onSectionChange,
    menuOpened,
    setMenuOpened,
    isDay,
    setIsDay,
    reset3D,
    section,
    resetCamera,
    resetOverlays,
    openOverlay,
  } = props;

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
  console.log('API Key:', apiKey);
  console.log('Place ID:', placeId);

const [isVisible, setIsVisible] = useState(false);
const [hasFadedIn, setHasFadedIn] = useState(false);
  useEffect(() => {
  function handleResize() {
    if (window.innerWidth >= 1024) {
      setMenuOpened(true);     // Always open on LG+
    }
  }

  handleResize();              // Run on first render
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  function spawnCoin(e) {
  const coin = document.createElement("div");
  coin.className = "mario-coin";

  // Position coin above the button
  const rect = e.currentTarget.getBoundingClientRect();
  coin.style.left = rect.left + rect.width / 2 + "px";
  coin.style.top = rect.top + "px";

  document.body.appendChild(coin);

  // Remove after animation
  setTimeout(() => coin.remove(), 800);
}

useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);        // Start the fade-in
      // Mark fade-in complete after the transition ends (1 second)
      const fadeTimer = setTimeout(() => {
        setHasFadedIn(true);
      }, 1000);

      return () => clearTimeout(fadeTimer);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <>
     
 
      

      <div
        className={`
            z-[2147483642]
            lg:z-[2147483635]

            fixed inset-y-0 md:right-[-80px] lg:right-[-80px] transition-all overflow-y-auto
          flex flex-col bg-blue
        `}
        
        style={{
  width:
    window.innerWidth >= 1024
      ? "570px"          // Desktop: always open
      : menuOpened
        ? "100%"         // Mobile/tablet: open
        : "0px",         // Mobile/tablet: closed
}}
      >
<div className="flex-1 flex flex-col items-center justify-center gap-6 lg:gap-4 mt-4 lg:mt-64  ">



          



   

     
               <div className="relative drop-shadow-xl lg:w-64 lg:h-80 w-72 h-80 overflow-hidden rounded-xl bg-[#3d3c3d] dark:bg-[#3d3c3d] lg:text-[36px] text-[40px]" >
      <div className="absolute  flex items-center justify-center text-white dark:text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-neutral-950 dark:bg-neutral-950 pt-4">



         
      <div className="w-full flex flex-col items-center justify-start gap-8 lg:pb-8 pb-8 px-1 ">
        <CyberWrapper onClick={() => {
    setMenuOpened(false);
        onSectionChange(2); 

  }}>
      <div style={{position: 'relative', marginTop: '30px', }}>
        <button className="cyber-btn py-0">Reviews</button>
        <div className="cyber-tooltip">
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
          {/* <strong> </strong><br /> */}
          Check out our some of our personal and online reviews. 
       </div>
      </div>
    </CyberWrapper>
<CyberWrapper onClick={() => {
    setMenuOpened(false);
        onSectionChange(1); 

  }}>
      <div style={{position: 'relative'}}>
        <button className="cyber-btn py-0">services</button>
        <div className="cyber-tooltip">
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
          Detailed look at our services.
        </div>
      </div>
    </CyberWrapper>
   
    <CyberWrapper  onClick={() => {
    setMenuOpened(false);
props.triggerFreeQuote();  // ← This does everything!
  }}>
      <div style={{position: 'relative', paddingBottom: '20px',}}>
        <button className="cyber-btn py-0">Customize quote</button>
        <div className="cyber-tooltip">
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
          {/* <strong> </strong><br /> */}
          Jump to your custom quote. 
        </div>
      </div>

    </CyberWrapper>
    
              

          </div>

          
          
        
      </div>
      <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2 " />
    </div>



  <div className="relative drop-shadow-xl w-64 h-64 overflow-hidden rounded-xl dark:bg-[#3d3c3d] bg-[#3d3c3d] lg:mb-0 mb-[-10]" >
      <div className="absolute flex items-center justify-center dark:text-white text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-neutral-950 dark:bg-neutral-950 ">



         
<div className="w-full flex flex-wrap justify-center items-center gap-4 py-6">
        
              
       <button
  class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-black to-grey-900 group-hover:from-black group-hover:to-black hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-neutral-700"
>
  {/* <span
    class="relative  px-4 py-2 transition-all ease-in duration-75 bg-neutral-950  rounded-md group-hover:bg-opacity-0"
  >
     <StyledWrapper01  onClick={() => {
    setMenuOpened(false);
    openOverlay("serviceWindow"); 
        onSectionChange(0); 

  }}> */}
       <span
    class="relative  px-4 py-2 transition-all ease-in duration-75 bg-neutral-950  rounded-md group-hover:bg-opacity-0"
  >
     <StyledWrapper01  onClick={(event) => {
    spawnCoin(event);
        onSectionChange(4); 
            setMenuOpened(false);


  }}>
      <article className="keycap">
        <aside className="letter">
          <svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M512 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H512zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM208 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H304c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H176zM376 144c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376z"></path>

</svg>
          </aside>
      </article>
    </StyledWrapper01>
            </span>
  <div class="block">
    <div
      class="group absolute -top-[13px] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2"
    >
      <div class="rounded-sm text-md bg-black py-1 px-2">
        <p class="whitespace-nowrap">Contact Page</p>
      </div>
      <div
        class="h-0 w-fit border-l-8 border-r-8 border-t-4 border-transparent border-t-black"
      ></div>
    </div>
  </div>
</button>




          <button
  class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-black to-grey-900 group-hover:from-black group-hover:to-black hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-neutral-700"
>
  <span
    class="relative  px-4 py-2 transition-all ease-in duration-75 bg-neutral-950 rounded-md group-hover:bg-opacity-0"
  >
          <StyledWrapper01  onClick={(event) => {
    spawnCoin(event);
        setIsDay((prev) => !prev);  

  }}>
      <article className="keycap">
        <aside className="letter">
          <svg class="w-[50px] h-[50px] fill-[#FFFFFF]" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M495.8 0c5.5 0 10.9 .2 16.3 .7c7 .6 12.8 5.7 14.3 12.5s-1.6 13.9-7.7 17.3c-44.4 25.2-74.4 73-74.4 127.8c0 81 65.5 146.6 146.2 146.6c8.6 0 17-.7 25.1-2.1c6.9-1.2 13.8 2.2 17 8.5s1.9 13.8-3.1 18.7c-34.5 33.6-81.7 54.4-133.6 54.4c-9.3 0-18.4-.7-27.4-1.9c-11.2-22.6-29.8-40.9-52.6-51.7c-2.7-58.5-50.3-105.3-109.2-106.7c-1.7-10.4-2.6-21-2.6-31.8C304 86.1 389.8 0 495.8 0zM447.9 431.9c0 44.2-35.8 80-80 80H96c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"></path>

</svg>
          </aside>
      </article>
      
    </StyledWrapper01>
     </span>
  <div class="block">
    <div
      class="group absolute -top-[13px] left-[52px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2"
    >
      <div class="rounded-sm text-md bg-black py-1 px-2">
        <p class="whitespace-nowrap">Change Background</p>
      </div>
      <div
        class="h-0 w-fit border-l-8 border-r-8 border-t-4 border-transparent border-t-black"
      ></div>
    </div>
  </div>
</button>



    <button
  class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[rgb(0,200,255)] via-[#00aacc] to-[rgb(0,170,255)] group-hover:from-black-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800"
>
  <span
    class="relative  px-4 py-2 transition-all ease-in duration-75  rounded-md bg-opacity-0"
  >
    <StyledWrapper01  onClick={() => {
    setMenuOpened(false);

      if (section === 0 ) {
      reset3D();
    } 
    
    else {
      onSectionChange(0);
    }
  }}
  className='zIndex[99980]'>
      <article className="keycap">
        <aside className="letter">
          <svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L416 100.7V64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V185l52.8 46.4c8 7 12 15 11 24zM248 192c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V216c0-13.3-10.7-24-24-24H248z"></path>

</svg>
          </aside>
      </article>
    </StyledWrapper01>
  </span>
  <div className="block ">
    <div 
      className="group absolute -top-[33px] left-[62px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
    >
      <div className="rounded-sm bg-black py-1 px-2">
        <p className="whitespace-nowrap">
                
                <span className='text-base'>
                8am-5pm Mon-Fri
                </span>
                </p>
      </div>
      <div
        class="h-0 w-fit border-l-8 border-r-8 border-b-0 border-transparent border-t-black"
      ></div>
    </div>
  </div>
  <div class="block">
    <div
      class="group absolute top-[88px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2"
    >
      <div class="rounded-sm text-md bg-black py-1 px-2">
        <p class="whitespace-nowrap">
          {section === 0 ? "Reset Page" : "Home Page"}</p>
      </div>
      <div
        class="h-0 w-fit border-l-8 border-r-8 border-b-8 border-transparent border-t-black"
      ></div>
    </div>
  </div>
</button>
  <StyledWrapper01  onClick={() => {
window.location.href = 'tel:+12622305182';     
  }} 
  className='zIndex[99980]'>
       <button
  class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-500 to-green-700  group-hover:from-black-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-800 dark:focus:ring-green-800"
>
  <span
    class="relative  px-4 py-2 transition-all ease-in duration-75rounded-md group-hover:bg-opacity-0"
  >
  
      <article className="keycap">
        <aside className="letter">
         <svg className="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M347.1 24.6c7.7-18.6 28-28.5 47.4-23.2l88 24C499.9 30.2 512 46 512 64c0 247.4-200.6 448-448 448c-18 0-33.8-12.1-38.6-29.5l-24-88c-5.3-19.4 4.6-39.7 23.2-47.4l96-40c16.3-6.8 35.2-2.1 46.3 11.6L207.3 368c70.4-33.3 127.4-90.3 160.7-160.7L318.7 167c-13.7-11.2-18.4-30-11.6-46.3l40-96z"></path>

</svg>
          </aside>
      </article>
  </span>
  <div className="block ">
    <div 
      className="group absolute -top-[35px] left-[59px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
    >
      <div className="rounded-sm bg-black py-1 px-2">
        <p className="whitespace-nowrap">
                
                <span className='text-lg'>
                262-230-5182 
                </span>
                </p>
      </div>
      <div
        class="h-0 w-fit border-l-8 border-r-8 border-t-4 border-transparent border-t-black"
      ></div>
    </div>
  </div>
</button>
    </StyledWrapper01>


      </div>
      <div className="absolute w-16 h-24 bg-white blur-[50px] -left-1/2 -top-1/2" />
    </div>
          </div>


                 {/* {menuOpened && <GoogleReviewsBox placeId={placeId} apiKey={apiKey} />} */}

  

</div>

       

      

        <div className="mb-2 pb-0 text-center flex flex-col items-center">
               

          <h3 className="pb-1 pt-1 text-base text-center">SURMUR LLC © 2025</h3>
        </div>
      </div> 


               <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-36  px-4 lg:hidden z-[2147483642] mobile-fade-in ${menuOpened ? 'hidden' : 'block'}`}>
<div
      className={`
        flex flex-col items-center
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${hasFadedIn ? 'animate-blink' : ''}
        transition-opacity duration-1000 ease-in-out
      `}
    >
              <div className="rounded-sm bg-black py-0.5 px-2 text-md">
                <p className="whitespace-nowrap text-white">Tap Here to Navigate our App</p>
              </div>
              <div className="h-0 w-fit border-l-8 border-r-8 border-t-8 border-t-black border-transparent" />
            </div>
            <div className="flex flex-col">
      <MobileWrapper >
      <div className="social-buttons ">
        
        {/* <a href="#" className="social-button facebook" onClick={(event) => {
    spawnCoin(event);
  }}>
<svg class="w-[80px] h-[80px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path>

</svg>        
</a> */}
        {/* <a href="#" className="social-button github" onClick={(event) => { */}
        <a href="#" className="h-[80px] " onClick={(event) => {
event.preventDefault();
    spawnCoin(event);
    setMenuOpened(true);
    
    
  }}
  // onTouchStart={(e) => e.currentTarget.classList.add('tapped')}
  // onTouchEnd={(e) => {
  //   e.currentTarget.classList.remove('tapped');
  //   // Optional: trigger click programmatically if you want the onClick to fire on touch too
  //   e.currentTarget.click();
  // }}
  >
          {/* <svg class="w-[80px] h-[80px] fill-[#000000]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"></path>

</svg> */}
<svg xmlns="http://www.w3.org/2000/svg" width="80px"  className='' >
  <clipPath id="top-clip" clipPathUnits="objectBoundingBox">
    {/* <path
      d="m 0,0 v 0.04496528 0.35210937 a 0.16917447,0.23564182 0 0 0 0.11164713,0.0599002 0.16917447,0.23564182 0 0 0 0.12351562,-0.0751997 h 9.3967e-4 A 0.32874868,0.28074741 0 0 1 0.507398,0.25882161 0.32874868,0.28074741 0 0 1 0.8074935,0.42504775 0.13619505,0.18305407 0 0 0 0.91526908,0.49652342 0.13619505,0.18305407 0 0 0 1,0.45674263 V 0.17021485 0 H 0.16957248 0.05458116 Z"
    ></path>
     */}
       <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>

  </clipPath>

  <filter id="red-filter">
    <feColorMatrix
      values="0 0 0 0 1
                0 0 0 0 0.05
                0 0 0 0 0
                0 2 0 0 0"
      type="matrix"
      in="SourceGraphic"
    ></feColorMatrix>
  </filter>
  <filter id="green-filter">
    <feColorMatrix
      values="0 0 0 0 0
                0 0 0 0 1
                0 0 0 0 0
                0 2.5 0 0 0"
      type="matrix"
      in="SourceGraphic"
    ></feColorMatrix>
  </filter>
  <filter id="blue-filter">
    <feColorMatrix
      values="0 0 0 0 0
                0 0 0 0 0.7
                0 0 0 0 1
                0 2 0 0 0"
      type="matrix"
      in="SourceGraphic"
    ></feColorMatrix>
  </filter>
  <filter id="yellow-filter">
    <feColorMatrix
      values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 0
                0 2.5 0 0 0"
      type="matrix"
      in="SourceGraphic"
    ></feColorMatrix>
  </filter>
</svg>

<button className="start-menu-button">
  <div className="start-menu-inner">
    <div className="top-white"></div>
    <div className="win7"></div>
    <div className="colors">
      <div className="red"></div>
      <div className="green"></div>
      <div className="blue"></div>
      <div className="yellow"></div>
    </div>
  </div>
</button>


        </a>
        
        {/* <a href="#" className="social-button instagram" onClick={(e) => {
    e.preventDefault();
    spawnCoin(e);

    const next = (section + 1) % 4;  
    onSectionChange(next);
  }}>
          <svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"></path>

</svg>
        </a> */}
      </div>
    </MobileWrapper>
         



          </div>
                </div>

    </>
  );
};



