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
      setIsMobile(window.innerWidth < 1024);
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
      <ambientLight intensity={isDay ? 1.1: 1.8} />


      <motion.group
        position={[8, 1, -2]}
        scale={[1, 1, 1]}
        

        animate={{
  x: section === 3 ? 2 : (section === 1 || section === 2 ? -4.59 : 8),
  y: section === 3 ? -1.8 : (section === 1 || section === 2 ? 2.85 : 1),
  // y: section === 3 ? -1.8 : (section === 1 || section === 2 ? -.08 : 1),
  
  z:
    section === 3
      ? -6
      : (section === 1 || section === 2
          // ? (isMobile ? 0.4 : 0.2)   
          ? (isMobile ? 5.4 : 6.9)   

          : -2),
          
  rotateY: section === 3 ? Math.PI / 3.75 : (section === 1 || section === 2 ? Math.PI / 1.17  : 0),
  rotateX: section === 3 ? Math.PI / -10 : (section === 1 || section === 2 ? Math.PI / -6.29 : 0),
}}
          transition={{
          duration: 1.1,
        }}


      >
        <Office setSection={setSection} section={section}  jumpToSection={jumpToSection} menuOpened={menuOpened} isDay={isDay} setIsAnimating={setIsAnimating} setCameraTarget={setCameraTarget}
          registerOverlayReset={registerOverlayReset}
          activeOverlay={activeOverlay}
  setActiveOverlay={setActiveOverlay}
   />
        {/* <MuscleCar /> */}
         {/* <RVmodel />  */}
         {isMobile ? <MuscleCar /> : <RVmodel />}
        {/* <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[10.07, 0.16, -0.57]}
          rotation={[-Math.PI, 0.42, -Math.PI]}
        ></group> */}
        
      </motion.group>


       {section === 1 && (
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

    </>
  );
};
