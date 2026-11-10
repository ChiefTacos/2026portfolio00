
import GoogleReviewsBox from './GoogleReviewsBox';


import { DayNightToggle } from "./DayNightToggle";




import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore.jsx'; // Adjust path to your useStore file

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
  // 1. Keep your standard UI props from the parent
  const {
    onSectionChange,
    menuOpened,
    setMenuOpened,
    setIsDay,
    reset3D,
    section,
    setActiveOverlay,
  } = props;
// 2. Pull Music State directly from Zustand
const { 
  isPlaying, 
  playlists, 
  playingPlaylist, 
  currentTrackIndex, 
  currentTime, 
  duration, 
  togglePlay, 
  prevTrack, 
  nextTrack 
} = useStore();
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID;
  console.log('API Key:', apiKey);
  console.log('Place ID:', placeId);

const [isVisible, setIsVisible] = useState(false);
const [hasFadedIn, setHasFadedIn] = useState(false);


  // desktop cyber tooltip and wrapper animation
const [activeIndex, setActiveIndex] = useState(-1);
const [rounds, setRounds] = useState(0);

useEffect(() => {
  if (section === 1 || section === 2) {
    setMenuOpened(true);
  }
}, [section, setMenuOpened]);
useEffect(() => {
  if (window.innerWidth <= 1280) return;

  const startTimer = setTimeout(() => {
    setActiveIndex(0);
    setRounds(1); // Start first round
  }, 4000);

  return () => clearTimeout(startTimer);
}, []);

useEffect(() => {
  if (activeIndex >= 0 && rounds <= 2) {
    const nextTimer = setTimeout(() => {
      if (activeIndex < 2) {
        setActiveIndex(prev => prev + 1);
      } else {
        // End of a round
        if (rounds < 2) {
          setActiveIndex(0); // Reset to first button
          setRounds(prev => prev + 1);
        } else {
          setActiveIndex(-1); // Finished 2 rounds, hide highlights
        }
      }
    }, 3000);
    
    return () => clearTimeout(nextTimer);
  }
}, [activeIndex, rounds]);



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
  const isDesktop = window.innerWidth >= 1280;
  const delay = isDesktop ? 300 : 3000; // Quick on desktop, delayed on mobile

  const timer = setTimeout(() => {
    // Force browser to recognize initial state before changing
    void document.body.offsetHeight;

    setIsVisible(true);
    setTimeout(() => setHasFadedIn(true), 1000);
  }, delay);

  return () => clearTimeout(timer);
}, []);

// Logic: Identify exactly what is playing globally
const currentPlayingList = playlists[playingPlaylist] || [];
const currentTrack = currentPlayingList[currentTrackIndex];

// Helper to format seconds into MM:SS
const formatTime = (time) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Calculate progress percentage
const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <>
     
 
      {/* app screen and music player */}

      <div
        className={`
            
            z-[2147483636]
            fixed inset-y-0  right-[0px] xl:right-[0px] transition-all overflow-y-auto
          flex flex-col bg-blue
          w-[400px] opacity-100 pointer-events-none        `}

  
          // style={{
          //     /* On mobile/tablet, if menuOpened is true (forced by our useEffect), it's 100% */
          //     width: menuOpened 
          //       ? "100%" 
          //       : (typeof window !== 'undefined' && window.innerWidth >= 1280) 
          //         ? "400px" 
          //         : "0px",

          //     /* Always visible on desktop OR if menuOpened is true */
          //     opacity: (menuOpened || (typeof window !== 'undefined' && window.innerWidth >= 1280)) ? 1 : 0,
              
          //     /* Allow clicks if menu is open or on desktop */
          //     pointerEvents:  "none",
          //   }}
          style={{
      /* Width: 400px on desktop (>=1280px), 100% on mobile when open. 0px everywhere when closed. */
      width: menuOpened 
        ? ((typeof window !== 'undefined' && window.innerWidth >= 1280) ? "400px" : "100%")
        : "0px",

      /* Opacity follows menuOpened (1 when open, 0 when closed) */
      opacity: menuOpened ? 1 : 0,
      
      /* Allow clicks only when the menu is actually open */
      pointerEvents: menuOpened ? "auto" : "none",
  }}
          >
       
        {/* <div 
          className="flex-1 flex flex-col items-center justify-center lg:gap-4 mt-4 gap-1 lg:mt-[0px]"
            
        > */}
   <div className="flex-1 flex flex-col justify-end pb-2 items-center pointer-events-none">



          



   {/* <div className="xl:fixed xl:bottom-4 xl:right-4 z-[2147483640] pointer-events-auto"> */}

   {/* music for mobile */}
   <div className="block md:hidden">

   <div className="z-[2147483640] pointer-events-auto">

  <div className="w-full min-w-[350px] max-w-[350px] p-4">

    {/* music miniplayer */}
    <div className="relative overflow-hidden rounded-lg transition-all duration-300 group bg-background/20 hover:scale-[1.02] text-foreground backdrop-blur-[2px] p-6 bg-black hover:shadow-lg hover:shadow-primary/20">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 h-full w-full rounded-lg" />
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-lg glass-effect" />
          
          {/* tooltip ///// */}

          <div className='scale-75'>
            <div className="block ">
                  <div 
                    className="group absolute -top-[33px] left-[54px] lg:-top-[50px] lg:left-[52px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
                  >
                  
                    <div
                      class="h-0 w-fit border-l-8 border-r-8 border-b-0 border-transparent border-t-black"
                    ></div>
                  </div>
                </div>
                <div className="block">
                <div className={`group 
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                      ${hasFadedIn ? 'animate-blink' : ''}
                      transition-opacity duration-1000 ease-in-out

                  absolute top-[70px] left-[0px] z-50 flex -translate-x-1/2 flex-col items-center`}>
                
                  <div className="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black" />

                  <div className="rounded-sm bg-black py-1 px-2 text-md">
                    <p className="whitespace-nowrap text-white">
                        Music App
                    </p>
                  </div>
                </div>
              </div>
            </div>
               {/* tooltip end */}
        
        
        <div className="relative z-10">
          <div className="flex items-start gap-2">
          {/* Animated Icon */}
          <div  
                  onClick={(e) => {
                e.stopPropagation();
                setMenuOpened(false); // Closes navigation menu dropdown

                // 1. Force state to Section 1 if not already there
                if (section !== 1) {
                  onSectionChange(1);
                }

                // 2. Inject "contactWindow" into active overlays array securely aka music app
                if (typeof setActiveOverlay === 'function') {
                  setActiveOverlay((prev) => {
                    if (Array.isArray(prev)) {
                      return prev.includes("contactWindow") ? prev : [...prev, "contactWindow"];
                    }
                    return ["contactWindow"];
                  });
                }
              }}
          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl flex items-center pointer-events-auto justify-center bg-zinc-200 dark:bg-zinc-800 -mt-1.5 transition-transform ${isPlaying ? 'scale-110' : 'scale-100'}`}
          >
      
            
<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" className={`${isPlaying ? 'text-primary animate-pulse' : 'text-purple-500'}`}>
  <defs>
    <radialGradient id="rainbow" cx="50%" cy="50%" r="80%" fx="40%" fy="40%">
      <stop offset="0%" stopColor="#3b82f6">
        <animate attributeName="stopColor" values="#3b82f6;#8b5cf6;#ec4899;#f43f5e;#eab308;#22c55e;#3b82f6" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stopColor="#1e3a8a">
        <animate attributeName="stopColor" values="#1e3a8a;#6b21a8;#be185d;#9f1239;#ca8a04;#15803d;#1e3a8a" dur="3s" repeatCount="indefinite"/>
      </stop>
    </radialGradient>
  </defs>
  <path d="M9 18V5l12-2v13" stroke="url(#rainbow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="6" cy="18" r="3" stroke="url(#rainbow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <circle cx="18" cy="16" r="3" stroke="url(#rainbow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="font-semibold leading-none tracking-tight text-foreground dark:text-white flex items-center gap-2 pl-1">
                  {isPlaying ? "Now Playing" : "Paused"}
                  {/* Small badge showing source playlist */}
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-500 font-mono italic ">
                    {playingPlaylist}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground/80 dark:text-zinc-400 truncate max-w-[220px] pl-1 mr-12">
                  {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : "No Track Selected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-6 text-foreground dark:text-white">
          <div className="space-y-2">
            <div 
              className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 cursor-pointer" 
              role="presentation"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const clickedValue = (x / rect.width) * duration;
                window.__AUDIO_ENGINE__?.seek(clickedValue);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-300/20 via-zinc-300/30 to-zinc-300/20 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
              <div 
                className="absolute inset-y-0 left-0 flex bg-foreground dark:bg-white transition-all duration-200 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/5" />
              </div>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{formatTime(currentTime)}</span>
              <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <button 
              onClick={prevTrack}
              className="relative inline-flex items-center transition-all justify-center cursor-pointer h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
              aria-label="Previous track"
            >
              <div className="absolute inset-0 z-0 rounded-full border border-white/10 bg-white/5" />
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="z-10">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button 
              onClick={togglePlay}
              className="relative inline-flex items-center transition-all justify-center cursor-pointer h-12 w-12 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
            >
              <div className="absolute inset-0 z-0 rounded-full border border-white/20 bg-white/10 shadow-lg" />
              <div className="z-10">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect width={4} height={16} x={6} y={4} />
                    <rect width={4} height={16} x={14} y={4} />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </div>
            </button>

            <button 
              onClick={nextTrack}
              className="relative inline-flex items-center transition-all justify-center cursor-pointer h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
              aria-label="Next track"
            >
              <div className="absolute inset-0 z-0 rounded-full border border-white/10 bg-white/5" />
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="z-10">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  </div>
        
     

   <div className="xl:fixed xl:bottom-4 xl:left-1/3 relative drop-shadow-xl w-[300px] h-64 md:w-[920px] md:h-36 overflow-hidden rounded-xl dark:bg-[#3d3c3d] bg-[#3d3c3d] lg:mb-0 mb-[0] pointer-events-auto" >

   
      <div className="absolute flex items-center justify-center dark:text-white text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-neutral-950 dark:bg-neutral-950 ">

          {/* copy of music to test/try for new menu */}
          <div className="hidden md:block ">


          <div className="z-[2147483640] pointer-events-auto">

            <div className="w-full min-w-[250px] max-w-[250px] mx-5 ml-[-25px]">

              <div className="relative overflow-hidden rounded-lg transition-all duration-300 group bg-background/20  text-foreground backdrop-blur-[2px] p-2 bg-[#212121] hover:shadow-lg hover:shadow-primary/20">
                
                <div className="absolute inset-0 z-0 h-full w-full rounded-lg " />
                <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-lg glass-effect" />

                  <div className="flex items-start gap-2">
                  
 {/* tooltip ///// */}

          <div className='scale-75'>
            <div className="block ">
                  <div 
                    className="group absolute -top-[33px] left-[54px] lg:-top-[40px] lg:left-[42px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
                  >
                  
                    <div
                      class="h-0 w-fit border-l-8 border-r-8 border-b-0 border-transparent border-t-black"
                    ></div>
                  </div>
                </div>
                <div className="block">
                <div className={`group 
                  ${isVisible ? 'opacity-50' : 'opacity-0'}
                      ${hasFadedIn ? 'animate-blink' : ''}
                      transition-opacity duration-900 ease-out

                  absolute top-[118px] left-[155px] z-50 flex -translate-x-1/2 flex-col items-center`}>
                
                  <div className="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black" />

                  <div className="rounded-sm bg-black py-1 px-2 text-md">
                    <p className="whitespace-nowrap text-white">
Click on Song Title for Music App                    </p>
                  </div>
                </div>
              </div>
            </div>
               {/* tooltip end */}
                    <div className="flex-1">
                      <div
                      className="flex items-start justify-between gap-4">
                        <div
                         className="space-y-0.5">
                        
                          
                          <div onClick={(e) => {
                e.stopPropagation();
                    spawnCoin(e);
                setMenuOpened(false); // Closes navigation menu dropdown

                // 1. Force state to Section 1 if not already there
                if (section !== 1) {
                  onSectionChange(1);
                }

                // 2. Inject "contactWindow" into active overlays array securely
                if (typeof setActiveOverlay === 'function') {
                  setActiveOverlay((prev) => {
                    if (Array.isArray(prev)) {
                      return prev.includes("contactWindow") ? prev : [...prev, "contactWindow"];
                    }
                    return ["contactWindow"];
                  });
                }
              }} className='relative pointer-events-auto cursor-pointer  
             hover:bg-zinc-100 dark:hover:bg-zinc-800 
             hover:text-foreground dark:hover:text-white transition-colors rounded px-1 -mx-1'>
                              <p className="text-sm text-muted-foreground/80 dark:text-zinc-400 truncate max-w-[250px] pl-0 mr-12">
                                {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : "No Track Selected"}
                              </p>

                              
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 text-foreground dark:text-white">
                    <div className="space-y-2">
                      <div 
                        className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 cursor-pointer" 
                        role="presentation"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const clickedValue = (x / rect.width) * duration;
                          window.__AUDIO_ENGINE__?.seek(clickedValue);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-300/20 via-zinc-300/30 to-zinc-300/20 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
                        <div 
                          className="absolute inset-y-0 left-0 flex bg-foreground dark:bg-white transition-all duration-200 ease-out" 
                          style={{ width: `${progressPercentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/5" />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{formatTime(currentTime)}</span>
                        <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="mt-[-10px] flex items-center justify-center gap-6">
                      <button 
                        onClick={prevTrack}
                        className="relative inline-flex items-center transition-all justify-center cursor-pointer h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
                        aria-label="Previous track"
                      >
                        <div className="absolute inset-0 z-0 rounded-full border border-white/10 bg-white/5" />
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="z-10">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>

                      <button 
                        onClick={togglePlay}
                        className="relative inline-flex items-center transition-all justify-center cursor-pointer h-12 w-12 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
                      >
                        <div className="absolute inset-0 z-0 rounded-full border border-white/20 bg-white/10 shadow-lg" />
                        <div className="z-10">
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <rect width={4} height={16} x={6} y={4} />
                              <rect width={4} height={16} x={14} y={4} />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="ml-1">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          )}
                        </div>
                      </button>

                      <button 
                        onClick={nextTrack}
                        className="relative inline-flex items-center transition-all justify-center cursor-pointer h-9 w-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:scale-110" 
                        aria-label="Next track"
                      >
                        <div className="absolute inset-0 z-0 rounded-full border border-white/10 bg-white/5" />
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="z-10">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          </div>

         
<div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-6 lg:gap-12">
                
      


            <button
    class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-white to-gray-100 group-hover:from-black group-hover:to-black hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-neutral-700"
  >
    <span
      class="relative  px-4 py-2 transition-all ease-in duration-75 bg-gradient-to-br from-[rgb(176,0,0)] via-[#16c6e5] to-[rgb(0,185,86)]  group-hover:from-blue-800 group-hover:to-blue-950 rounded-md group-hover:bg-opacity-0"
    >
            <StyledWrapper01  onClick={(event) => {
      spawnCoin(event);
          setMenuOpened(false); // Closes navigation menu dropdown

                // 1. Force state to Section 1 if not already there
                if (section !== 1) {
                  onSectionChange(1);
                }

                // 2. Inject "contactWindow" into active overlays array securely aka music app
                if (typeof setActiveOverlay === 'function') {
                  setActiveOverlay((prev) => {
                    if (Array.isArray(prev)) {
                      return prev.includes("freeQ") ? prev : [...prev, "freeQ"];
                    }
                    return ["freeQ"];
                  });
                }
    }}>
        <article className="keycap">
          <aside className="letter">
            <svg className="w-[85px] h-[90px] fill-[#ffffff]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 512">
  <g transform="translate(30.08 -20.08) scale(12.16)">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="none" stroke="#fafafa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0z" fill="none" stroke="#fafafa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
            </aside>
        </article>
        
      </StyledWrapper01>
      </span>
    <div class="block">
      <div
        class={`group 
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${hasFadedIn ? 'animate-blink' : ''}
          transition-opacity duration-1000 ease-in-out

          absolute  top-[90px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2`}
      >
        <div class="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black"></div>
        <div class="rounded-sm text-md bg-black py-1 px-2">
          <p class="whitespace-nowrap">Home Page</p>
        </div>
      
      </div>
    </div>
  </button>

 <button
    class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-white to-gray-100 group-hover:from-black group-hover:to-black hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-neutral-700"
  >
    <span
      class="relative  px-4 py-2 transition-all ease-in duration-75  bg-gradient-to-br from-purple-600 to-blue-500  group-hover:from-purple-800 group-hover:to-purple-700 rounded-md group-hover:bg-opacity-0"
    >
            <StyledWrapper01  onClick={(e) => {
                e.stopPropagation();
                      spawnCoin(e);

                setMenuOpened(false); // Closes navigation menu dropdown

                // 1. Force state to Section 1 if not already there
                if (section !== 1) {
                  onSectionChange(1);
                }

                // 2. Inject "contactWindow" into active overlays array securely
                if (typeof setActiveOverlay === 'function') {
                  setActiveOverlay((prev) => {
                    if (Array.isArray(prev)) {
                      return prev.includes("notes") ? prev : [...prev, "notes"];
                    }
                    return ["notes"];
                  });
                }
              }} >
        <article className="keycap">
          <aside className="letter">
            <svg className="w-[56px] h-[55px] text-gray-800 dark:text-white translate-x-[0px] -translate-y-[4px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"/>
</svg>


            </aside>
        </article>
        
      </StyledWrapper01>
      </span>
    <div class="block">
      <div
        class={`group 
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${hasFadedIn ? 'animate-blink' : ''}
          transition-opacity duration-1000 ease-in-out

          absolute  top-[90px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2`}
      >
        <div class="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black"></div>
        <div class="rounded-sm text-md bg-black py-1 px-2">
          <p class="whitespace-nowrap">NOTES App</p>
        </div>
      
      </div>
    </div>
  </button>

      <button
    class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br  from-white to-gray-100  hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800"
  >
    <span
      class="relative  px-4 py-2 transition-all ease-in duration-75  rounded-md bg-opacity-100 bg-gradient-to-br from-[rgb(176,0,0)] via-[#e71212] to-[rgb(185,34,0)]"
    >
      <StyledWrapper01  onClick={() => {
      setMenuOpened(false);
        reset3D();

      //   if (section === 0 ) {
      //   reset3D();
      // } 
      
      // else {
      //   onSectionChange(0);
      // }
    }}
    className='zIndex[99980]'>
        <article className="keycap">
          <aside className="letter">

            
            <svg class="w-[51px] h-[50px] fill-[#ffffff]" viewBox="0 0 556 512" xmlns="http://www.w3.org/2000/svg">
{/* {section === 0 ? (
      <path transform="translate(25, 0)" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>

) : (
    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L416 100.7V64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V185l52.8 46.4c8 7 12 15 11 24zM248 192c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V216c0-13.3-10.7-24-24-24H248z"></path>

    )} */}
          <path transform="translate(25, 0)" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>

  </svg>
            </aside>
        </article>
      </StyledWrapper01>
    </span>
    <div className="block ">
      <div 
        className="group absolute -top-[33px] left-[54px] lg:-top-[50px] lg:left-[52px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
      >
       
        <div
          class="h-0 w-fit border-l-8 border-r-8 border-b-0 border-transparent border-t-black"
        ></div>
      </div>
    </div>
    <div className="block">
    <div className={`group 
      ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${hasFadedIn ? 'animate-blink' : ''}
          transition-opacity duration-1000 ease-in-out

      absolute top-[90px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center`}>
     
      <div className="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black" />

      <div className="rounded-sm bg-black py-1 px-2 text-md">
        <p className="whitespace-nowrap text-white">
          {/* {section === 0 ? "Reset Page" : "Home Page"} */}
          {"Reset Page"} 
          
        </p>
      </div>
    </div>
  </div>
  </button>
    <StyledWrapper01  onClick={() => {
      setMenuOpened(false);

        if (section === 1 ) {
        null   
         } 
      
      else {
        onSectionChange(1.3);
      }
    }}
    className='zIndex[99980]'>
        <button
    class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-white to-gray-100 group-hover:from-black-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-800 dark:focus:ring-green-800"
  >
    <span
      class="relative  px-4 py-2 transition-all ease-in duration-75rounded-md group-hover:bg-opacity-100 bg-gradient-to-br from-green-600 to-green-700 "
    >
    
        <article className="keycap">
          <aside className="letter">

            <svg class="w-[50px] h-[50px] fill-[#ffffff] translate-x-[2px] -translate-y-[0px]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">

  <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"></path>

</svg>

            </aside>
        </article>
    </span>
    <div className="block  ">
      <div 
        className="group absolute  -top-[32px] left-[60px] lg:-top-[50px] lg:left-[57px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2 overflow-visible"
      >
       
        <div
          class="h-0 w-fit border-l-8 border-r-8 border-b-8 border-transparent border-t-black"
        ></div>
      </div>
    </div>
    <div className="block">
    <div className={`group
      ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${hasFadedIn ? 'animate-blink' : ''}
          transition-opacity duration-1000 ease-in-out

      absolute top-[90px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center`}>
      <div className="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black" />

      <div className="rounded-sm bg-black py-1 px-2 text-md">
        <p className="whitespace-nowrap text-white">
  Full Screen  </p>
      </div>
      </div>
    </div>
  </button>
      </StyledWrapper01>


        </div>
        <div className="absolute w-16 h-24 bg-white blur-[50px] -left-1/2 -top-1/2" />
      </div>
          </div> 



  

</div>

       

      

        <div className="mb-2 pb-0 text-center flex flex-col items-center">
               

          <h3 className="pb-1 pt-1 text-base text-center">SURMUR LLC © 2026</h3>
        </div>
      </div> 

{/* MOBILE WRAPPER BUTTON LOGIC */}
      {/* Hide this entire block if:
          1. Menu is already opened
          2. It's an XL screen (Desktop)
          3. We are in section 1 or 2 (where menu is forced open)
      */}

           
            {/* <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-32 px-4 z-[2147483643] mobile-fade-in 
          ${(menuOpened ||  (typeof window !== 'undefined' && window.innerWidth >= 1280)) ? 'hidden' : 'block'}
      `}> */}
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-32 px-4 z-[2147483643] mobile-fade-in 
          ${menuOpened ? 'hidden' : 'block'}
      `}> 
            
               {(section === 0 && !menuOpened) && (
              <div
                className={`
                  flex flex-col items-center
                  ${isVisible ? 'opacity-100' : 'opacity-0'}
                  ${hasFadedIn ? 'animate-blink' : ''}
                  transition-opacity duration-1000 ease-in-out
                `}
              >
              <div className="rounded-sm bg-black py-0.5 px-2 text-md">
                <p className="whitespace-nowrap text-white">Tap Down Here to Navigate our App</p>
              </div>
              <div className="h-0 w-fit border-l-8 border-r-8 border-t-8 border-t-black border-transparent" />
            </div>
            )}



            <div className="flex flex-col items-center">
                   <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-32 px-4 z-[2147483643] mobile-fade-in block">
      <div className="flex flex-col items-center">
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 px-4 pb-4 z-[2147483643] mobile-fade-in block">
      <div className="flex flex-col items-center">

        
        <div className="dock-stage">
          <div className="dock" role="toolbar" aria-label="Portfolio navigation">
            <div className="dock__row">
              


              {/* Projects Item */}

                          <div className='px-4 pr-10'>
                              <a href="#" className=" " onClick={(event) => {
            event.preventDefault();
                spawnCoin(event);
                setMenuOpened(true);
                
                setMenuOpened(false); // Closes navigation menu dropdown

                // 1. Force state to Section 1 if not already there
                if (section !== 1) {
                  onSectionChange(1);
                }

                // 2. Inject "contactWindow" into active overlays array securely aka music app
                if (typeof setActiveOverlay === 'function') {
                  setActiveOverlay((prev) => {
                    if (Array.isArray(prev)) {
                      return prev.includes("contactWindow") ? prev : [...prev, "contactWindow"];
                    }
                    return ["contactWindow"];
                  });
                }
              
                
              }}

              >
              <label className="dock__item">
                <input type="radio" name="dock-navigation" />
                <svg viewBox="0 0 64 64" role="img" aria-label="Projects">
                  <defs>
                    <linearGradient id="dock-projects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffd86b" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="14" fill="url(#dock-projects)" />
                  <path d="M9 20a5 5 0 0 1 5-5h14l5 6h21a4 4 0 0 1 4 4v4H9z" fill="#ffe8a3" />
                  <path d="M9 27h49l-4 23a5 5 0 0 1-4.9 4H14a5 5 0 0 1-4.9-4z" fill="#fff5cf" />
                  <rect x="18" y="34" width="11" height="10" rx="2" fill="#f5ad17" />
                  <rect x="34" y="34" width="11" height="10" rx="2" fill="#f5ad17" />
                  <rect x="18" y="47" width="27" height="3" rx="1.5" fill="#e7b94d" />
                </svg>
                <span className="dock__tooltip">MP3 files</span>
                <span className="dock__dot"></span>
              </label>
              </a>
              </div>
              {/* Home Item */}
                   <a href="#" className=" " onClick={(event) => {
event.preventDefault();
    spawnCoin(event);
    setMenuOpened(true);
    
    
  }}

  >
              <label className="dock__item">
                <input type="radio" name="dock-navigation" defaultChecked />
                {/* <svg viewBox="0 0 64 64" role="img" aria-label="Home">
                  <defs>
                    <linearGradient id="dock-home" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#5ec8ff" />
                      <stop offset="1" stopColor="#2878f0" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="14" fill="url(#dock-home)" />
                  <path
                    d="M14 31.5L32 16l18 15.5v19a3.5 3.5 0 0 1-3.5 3.5h-29A3.5 3.5 0 0 1 14 50.5z"
                    fill="#ffffff"
                  />
                  <path
                    d="M10.5 31.5L30 14.8a3 3 0 0 1 4 0l19.5 16.7"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="27"
                    y="37"
                    width="10"
                    height="17"
                    rx="2"
                    fill="#2878f0"
                  />
                  <circle cx="34.5" cy="45.5" r="1.2" fill="#ffffff" />
                </svg> */}
                {/* <img src="textures/circleGlassCHI.png" alt="" srcset="" /> */}
<div className=""> 
                     <div className="loader">
        <svg width={100} height={100} viewBox="0 0 100 100">
          <defs>
            <mask id="clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="50,25 75,75 25,75" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
            </mask>
          </defs>
        </svg>
        <div className="box" />
      </div>
     </div>
                {/* <span className="dock__tooltip">Home</span> */}
                <span className="dock__dot"></span>
              </label>

</a>




              {/* Projects Item */}
              {/* <label className="dock__item">
                <input type="radio" name="dock-navigation" />
                <svg viewBox="0 0 64 64" role="img" aria-label="Projects">
                  <defs>
                    <linearGradient id="dock-projects" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffd86b" />
                      <stop offset="1" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="14" fill="url(#dock-projects)" />
                  <path d="M9 20a5 5 0 0 1 5-5h14l5 6h21a4 4 0 0 1 4 4v4H9z" fill="#ffe8a3" />
                  <path d="M9 27h49l-4 23a5 5 0 0 1-4.9 4H14a5 5 0 0 1-4.9-4z" fill="#fff5cf" />
                  <rect x="18" y="34" width="11" height="10" rx="2" fill="#f5ad17" />
                  <rect x="34" y="34" width="11" height="10" rx="2" fill="#f5ad17" />
                  <rect x="18" y="47" width="27" height="3" rx="1.5" fill="#e7b94d" />
                </svg>
                <span className="dock__tooltip">Projects</span>
                <span className="dock__dot"></span>
              </label> */}

              {/* GitHub Item */}
              {/* <label className="dock__item">
                <input type="radio" name="dock-navigation" />
                <svg viewBox="0 0 64 64" role="img" aria-label="GitHub">
                  <rect width="64" height="64" rx="14" fill="#18181b" />
                  <path
                    d="M32 11 C20.4 11 11 20.4 11 32 C11 41.35 17.05 49.27 25.43 52.06 C26.48 52.25 26.86 51.61 26.86 51.06 C26.86 50.55 26.84 49.08 26.81 47.13 C20.1 48.58 18.82 43.9 18.82 43.9 C17.87 41.49 16.49 40.86 16.49 40.86 C14.3 39.36 16.66 39.39 16.66 39.39 C19.08 39.56 20.35 41.88 20.35 41.88 C22.51 45.56 25.96 44.54 27.05 43.84 C27.27 42.31 27.89 41.24 28.57 40.63 C23.22 40.02 17.57 37.95 17.57 31.12 C17.57 29.17 18.27 27.55 19.43 26.28 C19.23 25.77 18.62 23.74 19.66 21.1 C19.66 21.1 21.59 20.48 25.95 23.42 C27.79 22.92 29.76 22.66 31.71 22.65 C33.66 22.66 35.63 22.92 37.47 23.42 C41.83 20.48 43.76 21.1 43.76 21.1 C44.8 23.74 44.19 25.77 43.99 26.28 C45.15 27.55 45.85 29.17 45.85 31.12 C45.85 37.97 40.19 40 34.83 40.61 C35.57 41.25 36.24 42.51 36.24 44.47 C36.24 47.28 36.22 49.54 36.22 50.14 C36.22 50.73 36.6 51.38 37.68 51.14 C46.04 48.34 52.99 40.39 52.99 32 C52.99 20.4 43.6 11 32 11Z"
                    fill="#ffffff"
                  />
                </svg>
                <span className="dock__tooltip">GitHub</span>
                <span className="dock__dot"></span>
              </label> */}

              {/* Contact Item */}
<div className='px-3 pl-10'>
               <a href="#" className=" " onClick={(event) => {
event.preventDefault();
    spawnCoin(event);
     setIsDay((prev) => !prev);  
        if (section !== 4 ) {
                          onSectionChange(4);
                        }; 
    
  }}

  >
              <label className="dock__item">
                <input type="radio" name="dock-navigation" />
                <svg viewBox="0 0 64 64" role="img" aria-label="Contact">
                  <defs>
                    <linearGradient id="dock-contact" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#5de0ff" />
                      <stop offset="1" stopColor="#2774e8" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="14" fill="url(#dock-contact)" />
                  <rect x="9" y="17" width="46" height="32" rx="5" fill="#ffffff" />
                  <path
                    d="M10 21l22 17 22-17"
                    fill="none"
                    stroke="#b9d9f8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M11 46l14-11" fill="none" stroke="#d7e9fa" strokeWidth="2" strokeLinecap="round" />
                  <path d="M53 46L39 35" fill="none" stroke="#d7e9fa" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="dock__tooltip">Contact</span>
                <span className="dock__dot"></span>
              </label>
    </a>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
</div>
                </div>

    </>
  );
};



