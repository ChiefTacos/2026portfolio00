
import GoogleReviewsBox from './GoogleReviewsBox';


import { DayNightToggle } from "./DayNightToggle";




import styled from 'styled-components';
import { useEffect } from 'react';





const StyledWrapper01 = styled.div`
  .keycap {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    background: linear-gradient(180deg, #282828, #202020);
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
    padding: 8px 25px;
    font-family: "Rajdhani", sans-serif;
    font-weight: 700;
    font-size: 16px;
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
    font-size: 14px;
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
    box-shadow: 0px 0px 15px #00000027;
    padding: 15px 10px;
    border-radius: 5em;
  }

  .social-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 70px;
    border-radius: 20%;
    margin: 0 10px;
    background-color: #2f2f2f;
    box-shadow: 0px 0px 4px #00000027;
    transition: 0.3s;
  }

  .social-button:hover {
    background-color: #f2f2f2;
    box-shadow: 0px 0px 6px 3px #00000027;
  }

  .social-buttons svg {
    transition: 0.3s;
    height: 20px;
  }

  .facebook {
    background-color: #3b5998;
  }

  .facebook svg {
    fill: #f2f2f2;
  }

  .facebook:hover svg {
    fill: #3b5998;
  }

  .github {
    background-color: #333;
  }

  .github svg {
    width: 25px;
    height: 25px;
    fill: #f2f2f2;
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
    background-color: #c13584;
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
  } = props;

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
  console.log('API Key:', apiKey);
  console.log('Place ID:', placeId);



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



  return (
    <>
     
 
      

      <div
        className={`
           z-[10001] fixed inset-y-0 right-0 transition-all overflow-y-auto
          flex flex-col bg-blue
        `}
        
        style={{
  width:
    window.innerWidth >= 1024
      ? "500px"          // Desktop: always open
      : menuOpened
        ? "100%"         // Mobile/tablet: open
        : "0px",         // Mobile/tablet: closed
}}
      >
<div className="flex-1 flex flex-col items-center justify-center gap-12 mt-4">



          



   

     
               <div className="relative drop-shadow-xl w-56 h-96 overflow-hidden rounded-xl bg-[#3d3c3d]" >
      <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132]">



         
      <div className="w-full flex flex-col items-center justify-start gap-6 pb-12">
        <CyberWrapper>
      <div style={{position: 'relative'}}>
        <button className="cyber-btn">Services</button>
        <div className="cyber-tooltip">
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
          {/* <strong> </strong><br /> */}
Reset Website to Home Page        </div>
      </div>
    </CyberWrapper>
<CyberWrapper>
      <div style={{position: 'relative'}}>
        <button className="cyber-btn">Free Quote</button>
        <div className="cyber-tooltip">
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />
          Customizable quote with file upload and date scheduling.
        </div>
      </div>
    </CyberWrapper>
    <CyberWrapper>
      <div style={{position: 'relative'}}>
        <button className="cyber-btn">Reviews</button>
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
              
          </div>

          
          
        
      </div>
      <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2" />
    </div>



  <div className="relative drop-shadow-xl w-56 h-64 overflow-hidden rounded-xl bg-[#3d3c3d]" >
      <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132]">



         
<div className="w-full flex flex-wrap justify-center items-center gap-4 py-6">
        
              
      
     <StyledWrapper01  onClick={(event) => {
    spawnCoin(event);
  }}>
      <article className="keycap">
        <aside className="letter">
          <svg class="w-[50px] h-[50px] fill-[#FFFFFF]" viewBox="0 0 482 552" xmlns="http://www.w3.org/2000/svg">

  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path>

</svg>
          </aside>
      </article>
    </StyledWrapper01>
          
          <StyledWrapper01  onClick={(event) => {
    spawnCoin(event);
    setMenuOpened(false);
    reset3D();
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
      </div>
      <div className="absolute w-16 h-24 bg-white blur-[50px] -left-1/2 -top-1/2" />
    </div>
          </div>


                 {/* {menuOpened && <GoogleReviewsBox placeId={placeId} apiKey={apiKey} />} */}

  

</div>

       

      

        <div className="mb-2 pb-0 text-center flex flex-col items-center">
               

          <h3 className="pb-1 pt-1 text-base text-center">Badger Surface Solutions LLC © 2025</h3>
        </div>
      </div> 


                <div className="fixed bottom-7 left-1/2 -translate-x-1/2 w-full px-4 lg:hidden z-[9999] mobile-fade-in">

            <div className="flex flex-col">
      <MobileWrapper >
      <div className="social-buttons">
        <a href="#" className="social-button instagram">
<svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path>

</svg>        
</a>
        <a href="#" className="social-button github" onClick={(event) => {
    spawnCoin(event);
    setMenuOpened(true);
  }}>
          <svg class=" fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"></path>

</svg>
        </a>
        
        <a href="#" className="social-button instagram" onClick={(e) => {
    e.preventDefault();
    spawnCoin(e);

    const next = (section + 1) % 4;  
    onSectionChange(next);
  }}>
          <svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"></path>

</svg>
        </a>
      </div>
    </MobileWrapper>
          </div>
                </div>

    </>
  );
};



