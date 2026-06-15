
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
     
 
      

      <div
        className={`
            
            z-[2147483636]
            fixed inset-y-0  right-[0px] xl:right-[0px] transition-all overflow-y-auto
          flex flex-col bg-blue
          w-[400px] opacity-100 pointer-events-none        `}

  
          style={{
              /* On mobile/tablet, if menuOpened is true (forced by our useEffect), it's 100% */
              width: menuOpened 
                ? "100%" 
                : (typeof window !== 'undefined' && window.innerWidth >= 1280) 
                  ? "400px" 
                  : "0px",

              /* Always visible on desktop OR if menuOpened is true */
              opacity: (menuOpened || (typeof window !== 'undefined' && window.innerWidth >= 1280)) ? 1 : 0,
              
              /* Allow clicks if menu is open or on desktop */
              pointerEvents:  "none",
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

      <div className="relative z-10">
        <div className="flex items-start gap-2">
          {/* Animated Icon */}
          <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 -mt-1.5 transition-transform ${isPlaying ? 'scale-110' : 'scale-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`${isPlaying ? 'text-primary animate-pulse' : 'text-zinc-500'}`}>
              <path d="M9 18V5l12-2v13" />
              <circle cx={6} cy={18} r={3} />
              <circle cx={18} cy={16} r={3} />
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
        
     

   <div className="xl:fixed xl:bottom-4 xl:left-1/3 relative drop-shadow-xl w-[300px] h-64 md:w-[800px] md:h-36 overflow-hidden rounded-xl dark:bg-[#3d3c3d] bg-[#3d3c3d] lg:mb-0 mb-[0] pointer-events-auto" >

   
      <div className="absolute flex items-center justify-center dark:text-white text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-neutral-950 dark:bg-neutral-950 ">

          {/* copy of music to test/try for new menu */}
          <div className="hidden md:block ">


          <div className="z-[2147483640] pointer-events-auto">

            <div className="w-full min-w-[250px] max-w-[250px] mx-10 ml-[-25px]">

              <div className="relative overflow-hidden rounded-lg transition-all duration-300 group bg-background/20  text-foreground backdrop-blur-[2px] p-2 bg-[#212121] hover:shadow-lg hover:shadow-primary/20">
                
                <div className="absolute inset-0 z-0 h-full w-full rounded-lg " />
                <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-lg glass-effect" />

                  <div className="flex items-start gap-2">
                    {/* <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 -mt-1.5 transition-transform ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`${isPlaying ? 'text-primary animate-pulse' : 'text-zinc-500'}`}>
                        <path d="M9 18V5l12-2v13" />
                        <circle cx={6} cy={18} r={3} />
                        <circle cx={18} cy={16} r={3} />
                      </svg>
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
                    </div> */}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold leading-none tracking-tight text-foreground dark:text-white flex items-center gap-2 pl-1">
                            {isPlaying ? "Now Playing" : "Paused"}
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-500 font-mono italic ">
                              {playingPlaylist}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground/80 dark:text-zinc-400 truncate max-w-[250px] pl-1 mr-12">
                            {currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : "No Track Selected"}
                          </p>
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
      class="relative  px-4 py-2 transition-all ease-in duration-75  bg-gradient-to-br from-purple-200 to-blue-50  group-hover:from-pink-800 group-hover:to-pink-500 rounded-md group-hover:bg-opacity-0"
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
        class={`group 
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${hasFadedIn ? 'animate-blink' : ''}
          transition-opacity duration-1000 ease-in-out

          absolute  top-[90px] left-[58px] z-50 flex -translate-x-1/2 flex-col items-center rounded-sm text-center text-sm text-slate-300 before:-top-2`}
      >
        <div class="h-0 w-0 border-l-8 border-r-8 border-b-4 border-l-transparent border-r-transparent border-b-black"></div>
        <div class="rounded-sm text-md bg-black py-1 px-2">
          <p class="whitespace-nowrap">Change Background</p>
        </div>
      
      </div>
    </div>
  </button>



      <button
    class="group relative  inline-flex items-center justify-center p-0.5 mb-0  text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br  from-white to-gray-100  hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800"
  >
    <span
      class="relative  px-4 py-2 transition-all ease-in duration-75  rounded-md bg-opacity-100 bg-gradient-to-br from-[rgb(0,200,255)] via-[#00aacc] to-[rgb(0,170,255)]"
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

            
            <svg class="w-[55px] h-[50px] fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
{section === 0 ? (
      /* SVG for Section 0 (The Power Icon) */
      <path transform="translate(25, 0)" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>

) : (
  /* SVG for NOT Section 0 (Home ICON) */
    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L416 100.7V64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V185l52.8 46.4c8 7 12 15 11 24zM248 192c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V216c0-13.3-10.7-24-24-24H248z"></path>

      /* ^ Replace that second path with whatever icon you want for Home */
    )}
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
          {section === 0 ? "Reset Page" : "Home Page"}
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
      class="relative  px-4 py-2 transition-all ease-in duration-75rounded-md group-hover:bg-opacity-100 bg-gradient-to-br from-green-500 to-green-700 "
    >
    
        <article className="keycap">
          <aside className="letter">

            <svg class="w-[50px] h-[50px] fill-[#ffffff]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">

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
               

          <h3 className="pb-1 pt-1 text-base text-center">SURMUR LLC © 2025</h3>
        </div>
      </div> 

{/* MOBILE WRAPPER BUTTON LOGIC */}
      {/* Hide this entire block if:
          1. Menu is already opened
          2. It's an XL screen (Desktop)
          3. We are in section 1 or 2 (where menu is forced open)
      */}

           
            <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-32 px-4 z-[2147483643] mobile-fade-in 
          ${(menuOpened ||  (typeof window !== 'undefined' && window.innerWidth >= 1280)) ? 'hidden' : 'block'}
      `}>
                {/* ${menuOpened ? 'hidden' : 'block'} */}
            
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



            <div className="flex flex-col">
      <MobileWrapper >
      <div className="social-buttons ">
        

        <a href="#" className="h-[60px] " onClick={(event) => {
event.preventDefault();
    spawnCoin(event);
    setMenuOpened(true);
    
    
  }}

  >
       
<svg xmlns="http://www.w3.org/2000/svg" width="80px"  className='' >
  <clipPath id="top-clip" clipPathUnits="objectBoundingBox">
  
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

<button className="start-menu-button ">
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
        
    
      </div>
    </MobileWrapper>
         



          </div>
                </div>

    </>
  );
};



