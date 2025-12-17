import { ScrollControls, Scroll } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MotionConfig } from "framer-motion";
import { Leva } from "leva";
import { useEffect, useState, useRef } from "react";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { Interface } from "./components/Interface";
import { Menu } from "./components/Menu";
import { ScrollManager } from "./components/ScrollManager";
import { framerMotionConfig } from "./config";
import { LoadingScreen } from "./components/LoadingScreen";
import { DayNightSky } from "./components/DayNightSky";
import { MobileFOV } from "./components/MobileFOV";

function App() {
  const [section, setSection] = useState(0);
  const [started, setStarted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [isDay, setIsDay] = useState(true); // true = day, false = night
  const [isAnimating, setIsAnimating] = useState(false); // New state
  const [canvasKey, setCanvasKey] = useState(0);
   const reset3D = () => setCanvasKey(k => k + 1);


const resetCameraRef =  useRef(() => {});//home button camera reset
const resetOverlaysRef = useRef(() => {});   // ← NEW with other one
const [activeOverlay, setActiveOverlay] = useState([]); // ← always array


const triggerFreeQuote = () => {
    setSection(0); // Go to home
    setActiveOverlay(["freeQ"]); // Force open freeQ overlay
  };


const openOverlay = (id) => {
  setActiveOverlay([id]);  
};


      useEffect(() => {
        setMenuOpened(false);
      }, [section]);
      
      useEffect(() => {
        const isMobile = window.innerWidth < 1024;

        if (isMobile && section === 0) {
          // Lock all scroll + touchmove
          document.body.style.overflow = "hidden";
          document.body.style.touchAction = "none"; // disable pan, pinch, swipe
        } else {
          // Restore
          document.body.style.overflow = "";
          document.body.style.touchAction = "";
        }

        return () => {
          document.body.style.overflow = "";
          document.body.style.touchAction = "";
        };
      }, [section]);

const jumpToSection = (index) => {
  setSection(index);

  // Reset scroll instantly inside ScrollControls virtual scroll
  requestAnimationFrame(() => {
    const scroller = document.querySelector(".scroll"); // Drei creates this div

    if (scroller) {
      scroller.scrollTop = scroller.clientHeight * index;
    }
  });
};


  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
<div 
  id="overlay-portals-root" 
  style={{ 
    position: "fixed",
    inset: 0,
     zIndex: "2147483639",
    pointerEvents: "none",
    
  }}
>
  </div>  
  <div 
  id="contact-portals-root" 
  style={{ 
    position: "fixed",
    inset: 0,
     zIndex: "2147483637",
    pointerEvents: "none",
    
  }}
></div>
<div id="freeq-portal-root" style={{ 
    position: "fixed",
    inset: 0,
     zIndex: "2147483638",
    pointerEvents: "none",
    
  }}></div>
  <MotionConfig transition={{ ...framerMotionConfig }}>
        <Canvas
          key={canvasKey}
          shadows
          camera={{ position: [0, 3, 10], fov: 59 }}
          gl={{ preserveDrawingBuffer: true }}
          clear={false} // Ensures sky renders first

          className="fixed inset-0" // cleaner than inline styles for positioning
  style={{
    touchAction: "none",
    WebkitTapHighlightColor: "transparent",
  }}
          onContextMenu={(e) => e.preventDefault()}        // blocks right-click menu
  onSelectStart={(e) => e.preventDefault()}        // blocks selection
  onPointerDown={(e) => e.stopPropagation()}       // helps with event conflicts
  tabIndex={-1}
        >
          <MobileFOV />
          <DayNightSky debugForceDay={isDay} />
          <ScrollControls 
          pages={4} 
          damping={0.1} 
          // enabled={!(window.innerWidth < 1024 && section === 0)}
          >
            <ScrollManager section={section} onSectionChange={setSection} />
            <Experience section={section} jumpToSection={jumpToSection} menuOpened={menuOpened} isDay={isDay} setIsAnimating={setIsAnimating} 
              onResetCamera={(fn) => { resetCameraRef.current = fn }}
              onResetOverlays={(fn) => { resetOverlaysRef.current = fn }} activeOverlay={activeOverlay}
  setActiveOverlay={setActiveOverlay}
              />
            <Scroll html>
              <Interface setSection={setSection} />
            </Scroll>
          </ScrollControls>
        </Canvas>





                          
                          
        <Menu
          onSectionChange={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
          isDay={isDay}
          setIsDay={setIsDay}
          reset3D={reset3D}
          section={section}
          resetCamera={resetCameraRef.current}   
          resetOverlays={resetOverlaysRef.current}   
              openOverlay={openOverlay}  
              triggerFreeQuote={triggerFreeQuote}   

        />
        <Cursor />
      </MotionConfig>
      <Leva hidden />
    </>
  );
}

export default App;