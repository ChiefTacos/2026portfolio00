import {

  useScroll,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { framerMotionConfig } from "../config";
import { Office } from "./Office";
import { Projects } from "./Projects";
import { MuscleCar } from "./MuscleCar";
import { RVmodel } from "./Rv";
import { GoogleReviewsPage } from "./GoogleReviewsPage";
import { useStore } from '../store/useStore'


      export function AudioEngine() {
  const {
    isPlaying,
    tracks,
    currentTrackIndex,
    nextTrack,
    setCurrentTime,
    setDuration
  } = useStore();

  const trackUrl = tracks[currentTrackIndex]?.url;
  const audioRef = useRef(null);

  // Create audio once
  useEffect(() => {
    const audio = new Audio(trackUrl);
    audioRef.current = audio;

    audio.onended = () => nextTrack();

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    // Global API (your existing pattern, just extended)
    window.__AUDIO_ENGINE__ = {
      getCurrentTime: () => audio.currentTime || 0,
      restart: () => (audio.currentTime = 0),
      seek: (time) => {
        audio.currentTime = time;
        setCurrentTime(time);
      }
    };

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Play / Pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  // Track change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = trackUrl;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  }, [trackUrl]);

  return null;
}
export const Experience = (props) => {
  const { menuOpened, isDay,  setIsAnimating,  activeOverlay, setActiveOverlay, jumpToSection} = props;
  const { viewport, camera } = useThree();
  const data = useScroll();

  const [section, setSection] = useState(0);
  const [cameraTarget, setCameraTarget] = useState(null); // Store OverlayItem camera target

// Detect mobile ONCE on mount (you can also listen to resize if needed)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    checkMobile(); // Run on mount
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  
  // Pass down a way for OverlayItem to register its reset function
  const registerOverlayReset = (resetFn) => {
    overlayResetFns.current.push(resetFn);
  };


  
  

  useFrame((state) => {
    let curSection = Math.floor(data.scroll.current * data.pages);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

   
  });

  return (
    <>
      <ambientLight intensity={isDay ? 1.1: 1.6} />


                  {/* <motion.group
                position={[8, 1, -2]} // Initial/Default position
                scale={[1, 1, 1]}
                animate={{
                  // Set these to whatever specific numbers you want for ALL sections
                  x: 6.4, 
                  y: 2,
                  z: isMobile ? -4.4 : -4.9, // Kept the mobile check, but it's now consistent across sections
                }}
                transition={{
                  duration: 1.1,
                }}
              > */}
              <motion.group
                position={[8, 1, -2]} // Default/Initial position
                scale={[1, 1, 1]}
                // rotateX={0}
                // rotateY={0}
                animate={{
                  // X Logic: Section 3 is 2, Sections 1 & 2 are -4.59, Section 0 is 6
                  x: section === 3 ? 6.4 : (section === 1 || section === 2 ? 6.304  : (isMobile ? 6.3 : 6.3)),

                  // Y Logic: Section 1, 2, and 3 are all 1 unit higher than Section 0 (1 + 1 = 2)
                  // y: section === 0 ? 3.2 : 4.1,
                  y: section === 3 
                    ? 9.4
                    : (section === 1 || section === 2 
                        ? (isMobile ? 3.28 : 3.32) 
                        : 3.52),
                  // Z Logic
                  z: section === 3 
                    ? -20.4
                    : (section === 1 || section === 2 
                        ? (isMobile ? -3.39 : -3.25) 
                        : -3.4),

                
                }}
                transition={{
                  duration: 1.1,
                }}
              >
{/*                     // Rotation Logic            
  // rotateY: section === 3 ? Math.PI / 3.75 : (section === 1 || section === 2 ? Math.PI / 1.17 : 0),
                  // rotateX: section === 3 ? Math.PI / -10 : (section === 1 || section === 2 ? Math.PI / -6.29 : 0), */}
                    <Office setSection={setSection} section={section}  jumpToSection={jumpToSection} menuOpened={menuOpened} isDay={isDay} setIsAnimating={setIsAnimating} setCameraTarget={setCameraTarget}
                      registerOverlayReset={registerOverlayReset}
                      activeOverlay={activeOverlay}
                    setActiveOverlay={setActiveOverlay}
                    />
        
        {/* <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[10.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group> */}
        
      </motion.group>
<AudioEngine />

       {/* {section === 1 && (
        <motion.group
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,     // fade-in speed
          }}
        >
          <Projects isMobile={isMobile} />
        </motion.group>

        
      )}

            {section === 2 && (
        <motion.group
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,     // fade-in speed
          }}
        >
          <GoogleReviewsPage isMobile={isMobile} />
        </motion.group>

        
      )} */}

    </>
  );
};
