import { useGLTF, useTexture, useVideoTexture, useAnimations, MeshTransmissionMaterial, Html  } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, } from "react";
import * as THREE from "three";






const OverlayItem = ({
  className = "",
  title,
  description,
  price,
  bgColor,
  positionX = 0,
  positionY = 0,
  positionZ = 0,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  distanceFactor = 25,        // ← new prop, default 20
  parentGroupRef, 
  registerOverlayReset,
  section,
  id,                    
  activeOverlay,
  setActiveOverlay,
  device,
  src,
  hideTriggerButton = false,   // ← NEW PROP hides view service button for contact page
  ...props
}) => {
  const { camera, gl } = useThree();
const groupRef = useRef(); // Ref for the THREE.Group
const initialCameraState = useRef({ position: null, quaternion: null });
const [showContent, setShowContent] = useState(false); // State to control visibility
const [isClickable, setIsClickable] = useState(true); //prevent bug when going reseting while animation runs

const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
const overlayRef = useRef(null); 

 const isMobileOrTablet = device === "mobile" || device === "tablet";

const isActive = activeOverlay.includes(id);
const isAnyOpen = activeOverlay.length > 0;
const [isFullscreen, setIsFullscreen] = useState(false);


const htmlOffset = useRef({ x: 0, y: 0 });
const dragOffset = useRef({ x: 0, y: 0 });
const isDragging = useRef(false);
const lastPos = useRef({ x: 0, y: 0 });
const velocity = useRef({ x: 0, y: 0 });
const lastTimestamp = useRef(0);
const isVisible = section === 0;
const friction = 0.92; // momentum decay
const minVelocity = 0.1; // stop threshold

const portalRoot = useRef(null);








  const originalCameraState = useRef({
    position: null,
    quaternion: null
  });

  // Capture the original camera position/rotation exactly once
  useEffect(() => {
    if (!originalCameraState.current.position) {
      originalCameraState.current = {
        position: camera.position.clone(),
        quaternion: camera.quaternion.clone(),
      };
      console.log("Original scene camera saved:", originalCameraState.current.position.toArray());
    }
  }, [camera]);
useEffect(() => {
  if (props.registerOverlayReset) {
    props.registerOverlayReset(() => {
      setShowContent(false);
      setIsClickable(true);
      setCameraTarget(null);
      // Also run the local smooth reset if needed
      handleResetClick({ stopPropagation: () => {} });
    });
  }
}, [props.registerOverlayReset]);



const handleButtonClick = (e) => {
  if (!isClickable) return;
  e.stopPropagation();

  if (isMobileOrTablet) {
    // Mobile: only one at a time
    setActiveOverlay([id]);
  } else {
    // Desktop: allow multiple
    setActiveOverlay(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  setShowContent(true);
  setIsClickable(false);
};
const handleResetClick = (e) => {
  e.stopPropagation();

  setActiveOverlay(prev => prev.filter(openId => openId !== id));

  setShowContent(false);
  setTimeout(() => setIsClickable(true), 300); // re-enable after animation
};
const handleDragStart = (e) => {
  e.stopPropagation();
  isDragging.current = true;

  lastPos.current = { x: e.clientX, y: e.clientY };
  velocity.current = { x: 0, y: 0 };
  lastTimestamp.current = performance.now();

  document.addEventListener("pointermove", handleDragMove);
  document.addEventListener("pointerup", handleDragEnd);
};
const handleDragMove = (e) => {
  if (!isDragging.current) return;

  const now = performance.now();
  const dt = now - lastTimestamp.current;

  const dx = e.clientX - lastPos.current.x;
  const dy = e.clientY - lastPos.current.y;

  setWindowPos((prev) => ({
    x: prev.x + dx,
    y: prev.y + dy,
  }));

  velocity.current = {
    x: dx / dt,
    y: dy / dt,
  };

  lastPos.current = { x: e.clientX, y: e.clientY };
  lastTimestamp.current = now;
};
const handleDragEnd = () => {
  isDragging.current = false;

  document.removeEventListener("pointermove", handleDragMove);
  document.removeEventListener("pointerup", handleDragEnd);

  requestAnimationFrame(mobileMomentum);
};


const mobileMomentum = () => {
  if (isDragging.current) return;

  const speed = Math.abs(velocity.current.x) + Math.abs(velocity.current.y);

  if (speed > 0.5) {
    setWindowPos(prev => ({
      x: prev.x + velocity.current.x * 16,
      y: prev.y + velocity.current.y * 16,
    }));

    velocity.current.x *= friction;
    velocity.current.y *= friction;

    requestAnimationFrame(mobileMomentum);
  } else {
    snapBackIntoBounds();
  }
};

const snapBackIntoBounds = () => {
  if (!overlayRef.current) return;

  const el = overlayRef.current;
  const rect = el.getBoundingClientRect();
  const padding = 20;

  setWindowPos(prev => {
    let x = prev.x;
    let y = prev.y;

    if (rect.left < padding) x += padding - rect.left;
    if (rect.right > window.innerWidth - padding) x -= rect.right - (window.innerWidth - padding);
    if (rect.top < padding) y += padding - rect.top;
    if (rect.bottom > window.innerHeight - padding) y -= rect.bottom - (window.innerHeight - padding);

    return { x, y };
  });

};


useEffect(() => {
  const handleResize = () => {
    if (showContent) snapBackIntoBounds();
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [showContent]);


const showViewButton = hideTriggerButton 
    ? false 
    : (isMobileOrTablet ? !isAnyOpen : !isActive);


    const FreeQuoteButton = ({ onClick, isClickable }) => {
  return (
    <div className="relative group" style={{ pointerEvents: isClickable ? "auto" : "none", opacity: isClickable ? 1 : 0.5 }}>
      <button
        className="relative inline-block p-px font-bold text-white rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 z-[50]
                   bg-gradient-to-r from-orange-600 via-yellow-500 to-amber-600
                   hover:from-orange-500 hover:via-yellow-400 hover:to-amber-500
                   shadow-amber-700 hover:shadow-amber-500"
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
      >
        {/* Animated glowing border */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 p-[3px] -m-px opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></span>

        <span className="relative z-10 block px-8 py-4 rounded-2xl bg-neutral-950">
          <div className="flex items-center justify-center space-x-4">
            {/* New SVG: Sparkle + Quote Icon */}
            <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8L38 24H54L40 34L46 50L32 40L18 50L24 34L10 24H26L32 8Z" 
                    fill="#fbbf24" stroke="#f59e0b" strokeWidth="3"
                    className="transition-all duration-500 group-hover:fill-yellow-400 group-hover:scale-110"/>
              <path d="M20 44C22 40, 26 40, 28 44" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round"/>
              <path d="M36 44C38 40, 42 40, 44 44" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round"/>
            </svg>

            <span className="text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300
                            group-hover:from-yellow-300 group-hover:to-orange-200 transition-all duration-500">
              Free Quote
            </span>
          </div>
        </span>
      </button>
    </div>
  );
};



  return (
    <group
      ref={groupRef}
      position={[positionX, positionY, positionZ]}
      rotation={[rotationX, rotationY, rotationZ]}
    >
     
     
     
        <Html
            style={{
           
            width: "100%",
            height: "100%",
          pointerEvents: "none",   // ← Html never blocks anything
          }}
          transform={false}
          center
          distanceFactor={distanceFactor}
          occlude={false}
            className={className}   // ← now works!

          // portal={{ current: document.getElementById("overlay-portals-root") }}
          portal={{ 
  current: id === "freeQ" 
    ? document.getElementById("freeq-portal-root") 
    : document.getElementById("overlay-portals-root") 
}}
        > 


        <div
        style={{
          
          pointerEvents: isVisible ? "auto" : "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
          transitionDelay: isVisible ? "0s" : "0.2s",
          // width: "100vw",
          // height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          
        }}
      >

          <div className="text-sm w-full relative" style={{ pointerEvents: isVisible ? "auto" : "none" }}>
              {isActive && (
                <div
                ref={overlayRef}
                // className="bg-white  rounded-lg shadow-2xl border border-gray-200 overflow-hidden
                //   min-h[130vh] max-h-[130vh]
                //    lg:min-h[80vh]lg:max-h-[110vh]

                //     w-[100vw] max-w-[1000px]
                //     md:w-[90vw] md:max-w-[1200px]
                //     lg:w-[70vw] lg:max-w-[1400px]

                // "
                className={`overlay-window ${className} bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden 
  min-h-[130vh] max-h-[130vh] lg:min-h-[80vh] lg:max-h-[110vh]
  w-[100vw] max-w-[1000px] md:w-[90vw] md:max-w-[1200px] lg:w-[70vw] lg:max-w-[1400px]`}

                  onPointerDown={isVisible ? handleDragStart : undefined}


                    style={{
                    position: "absolute",
                    left: windowPos.x,
                    top: windowPos.y,
                      
  width: isFullscreen ? "130vw" : undefined,
  height: isFullscreen ? "130vh" : undefined,
  maxWidth: isFullscreen ? "140vw" : undefined,
  maxHeight: isFullscreen ? "140vh" : undefined,
  borderRadius: isFullscreen ? "8px" : "12px",
                    
                    transition: isDragging.current ? "none" : "transform 0.2s ease",
                    cursor: "default",
                    pointerEvents: isVisible ? "auto" : "none",  
                     userSelect: "none",
                     WebkitUserSelect: "none",
            }}
          >

        <div className="flex p-4 lg:p-3 gap-2 bg-gray-100">
          <button onClick={handleResetClick} style={{ pointerEvents: "auto" }} alt="CLOSE" title="CLOSE">
            <span className="bg-red-500 inline-block lg:w-9 lg:h-9 w-11 h-11 rounded-full hover:bg-red-600 transition"></span>
          
          </button>
          <button onClick={handleResetClick} style={{ pointerEvents: "auto" }} alt="CLOSE" title="CLOSE">
            <span className="bg-yellow-500 inline-block lg:w-9 lg:h-9 w-11 h-11 rounded-full hover:bg-red-600 transition"></span>
          
          </button>
          <button
            onClick={() => {
              setIsFullscreen(prev => !prev);
              setTimeout(() => snapBackIntoBounds(), 50); // keep inside screen
            }}
            style={{ pointerEvents: "auto" }}
            alt="MAX WINDOW"
            title="Adjust Window Size"
          >
            <span className="bg-green-500 inline-block lg:w-9 lg:h-9 w-11 h-11 rounded-full hover:bg-green-600 transition"></span>
          </button>
        </div>

        <div className="p-10 flex flex-col items-center justify-center gap-10 pt-1">
          


          <div className="card__content text-center">
            <h1 className="lg:text-7xl text-6xl font-bold m-6">{title}</h1>
            <p className="lg:text-4xl text-3xl text-gray-700 mb-4">{description}</p>
            <img src={src} alt=""    className="max-h-[250px] lg:max-h-[500px]"  
             style={{ pointerEvents: "none" , touchAction: "none", }}
/>
            

 


          </div>
          
        </div>
      </div>
  )}
 
     {!hideTriggerButton && showViewButton && (
      <div className="flex items-center justify-center">
    <div 
      className="relative group"
      style={{
        pointerEvents: isVisible && isClickable ? "auto" : "none",  
        opacity: isClickable ? 1 : 0.4,
        transition: "opacity 0.4s ease",
        position: "relative",
        zIndex: id === "freeQ" ? 999999 : "auto"  ,
      }}
    >

      {/* Special Free Quote Button */}
      {id === "freeQ" ? (
        <FreeQuoteButton 
          onClick={handleButtonClick} 
          isClickable={isClickable} 
        />
      ) : (

      <button
        className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-200 shadow-2xl cursor-pointer rounded-2xl shadow-emerald-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-emerald-600 z-[50]"
        type="button"
        onClick={handleButtonClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          cursor: isClickable ? "pointer" : "not-allowed",
        }}
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

        <span className="relative z-10  block pr-4 lg:px-6  py-3 rounded-2xl bg-neutral-950">
          <div className="relative z-10 flex items-center space-x-3 ">
                <div className="hidden lg:inline ">

                  <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-emerald-300 lg:text-2xl text-xl font-medium pointer-events-none">
                    View 
                    <br /> Service
                  </span>
                </div>

         

<svg
  className="w-16 h-16 transition-all duration-300
             stroke-white fill-white
             group-hover:fill-emerald-300
             group-hover:stroke-emerald-300"
  viewBox="0 0 448 512"
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Vertical bar */}
   <rect
    x="236"      // centered
    y="48"
    width="40"   // halfway thickness
    height="416" // halfway length
    
  />

  {/* Horizontal bar */}
  <rect
    x="48"
    y="236"
    width="416"  // halfway length
    height="40"  // halfway thickness
  />
</svg>
          </div>
        </span>
      </button>
      )}
    </div>
  </div>
)}
  </div>
</div>

</Html>
    </group>
  );
};


export default OverlayItem;















//glass baby

function GlassComponent({ geometry, position, rotation, scale }) {

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={scale}>

             <MeshTransmissionMaterial
          color="#444444"               // dark gray-blue tone (lighter than #222)
          transmission={0.8}            // more light passes through (less opaque)
          roughness={0.45}              // moderate softness
          thickness={0.5}               // still has density
          ior={1.3}                     // slightly softer reflections
          anisotropy={0.05}
          chromaticAberration={0.005}
        />
    </mesh>
  );
}

//white floor baby

function SquareComponent({ position, rotation, scale }) {
  return (
    <mesh
      geometry={new THREE.PlaneGeometry(1050, 900)} // Large width and length
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <meshStandardMaterial color="white" side={THREE.DoubleSide} />
    </mesh>
  );
}
export function Office({ section, menuOpened, isDay, setIsAnimating, setCameraTarget, activeOverlay, setActiveOverlay, ...props }) {
  const group = useRef();
  const balconyRailGroupRef = useRef();
  const deckFloorGroupRef = useRef();
  const drivewayGroupRef = useRef();
  const { nodes, materials, animations } = useGLTF("models/scene.glb");
  const texture = useTexture("textures/scene.jpg");
  const textureVSCode = useVideoTexture("textures/vscode.mp4");
  const { actions, mixer } = useAnimations(animations, group);

  const freeQOverlayRef = useRef(null);


  texture.flipY = false;
  texture.encoding = THREE.sRGBEncoding;

  const textureMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
  });

  const textureGlassMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    opacity: 0.32,
  });

  const textureOpacity = useMotionValue(0);
  const glassTextureOpacity = useMotionValue(0);

  useEffect(() => {
    animate(textureOpacity, section === 0 ? 1 : 0);
    animate(glassTextureOpacity, section === 0 ? 0.32 : 0);
  }, [section]);

  useFrame(() => {
    textureMaterial.opacity = textureOpacity.get();
    textureGlassMaterial.opacity = glassTextureOpacity.get();
  });


  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w <= 768) setDevice("mobile");
      else if (w <= 1024) setDevice("tablet");
      else setDevice("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);




  const overlayConfig = {
    balcony: {
      distanceFactor: { desktop: 15, tablet: 22, mobile: 22 },
      position: {
        desktop: [-204.128, 928.8, 292],
        tablet:  [-228.117, 406.956, 1.194],   
        mobile:  [-228.117, 406.956, 1.194],   
      },
    },
    driveway: {
      distanceFactor: { desktop: 22, tablet: 20, mobile: 20 },
      position: {
        desktop: [-561.2, -600.1, 257.2],
        tablet:  [-4.128, 0, 305.314],
        mobile:  [-4.128, 0, 305.314],
      },
    },
    house: {
      distanceFactor: { desktop: 24, tablet: 24, mobile: 22 },
      position: {
        desktop: [701.2, 20.1, 107.2],
        tablet:  [204.128, 100, 205.314],
        mobile:  [204.128, 100, 205.314],
      },
    },
    car: {
      distanceFactor: { desktop: 18, tablet: 24, mobile: 24 },
      position: {
        desktop: [-201.2, 200.1, 7.2],
        tablet:  [40.128, 100, -205.314],
        mobile:  [640.128, 100, 205.314],
      },
    },
    contact: {
      distanceFactor: { desktop: 20, tablet: 22, mobile: 22 },
      position: {
        desktop: [-201.2, 1000.1, 7.2],
        tablet:  [-140.128, 1000, -25.314],
        mobile:  [-140.128, 1000, 25.314],
      },
    },
    freeQ: {
      distanceFactor: { desktop: 18, tablet: 22, mobile: 22 },
      position: {
        desktop: [-201.2, 1000.1, 7.2],
        tablet:  [-140.128, 1000, -25.314],
        mobile:  [-140.128, 1000, 25.314],
      },
    },
  };


  const getOverlayProps = (id) => {
    const cfg = overlayConfig[id] || {
      distanceFactor: { desktop: 15, tablet: 25, mobile: 25 },
      position: { desktop: [0, 0, 0], tablet: [0, 0, 0], mobile: [0, 0, 0] },
    };

    return {
      distanceFactor:
        device === "mobile" || device === "tablet"
          ? cfg.distanceFactor[device]
          : cfg.distanceFactor.desktop,
      position:
        device === "mobile" || device === "tablet"
          ? cfg.position[device]
          : cfg.position.desktop,
    };
  };

  const balcony = getOverlayProps("balcony");
  const driveway = getOverlayProps("driveway");
  const house = getOverlayProps("house");
  const car = getOverlayProps("car");
  const contact = getOverlayProps("contact");
  const freeQ = getOverlayProps("freeQ");



  const isMobileOrTablet = device === "mobile" || device === "tablet";


  const modelPosition =
  device === "mobile" || device === "tablet"
    ? [-11, -4, -1]   // mobile + tablet
    : [-10, -3, 0];    // desktop


  const openOverlay = (id) => {
    if (isMobileOrTablet) {
      setActiveOverlay([id]);
    } else {
      setActiveOverlay((prev) => {
        if (!Array.isArray(prev)) prev = [];
        return prev.includes(id) ? prev : [...prev, id];
      });
    }
  };

  const closeOverlay = (id) => {
    if (isMobileOrTablet) {
      setActiveOverlay([]);
    } else {
      setActiveOverlay((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((o) => o !== id);
      });
    }
  };





    const [clickedFree, setClickedFree] = useState(false);
  const [clickedQuote, setClickedQuote] = useState(false);
const [fullyOpen, setFullyOpen] = useState(false);

   const revealed = clickedFree || clickedQuote;
 




  return (
    <group ref={group} {...props} dispose={null}     position={modelPosition}
 rotation={[0, 0.45, 0]} scale={0.01}>

      {/* <group scale={0.01}> */}
        <SquareComponent
          position={[420, 14, -260]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={1}
        />
        <GlassComponent
          geometry={nodes.Door_Front_House_material_0001.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Window_front_2nd_floor001_House_material_0001.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Window_front_2nd_floor_House_material_0001.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Window_front_1st_floor_House_material_0001.geometry}
          position={[400, 200, 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Door_side_House_material_0001.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Garage_door_House_material_0001.geometry}
          position={[0, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <group position={[950.267, 199.77, -398.613]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Balcony_Glass_door_Upper004_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[950.267, 199.77, -28.613]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={100}>
          <mesh geometry={nodes.Balcony_Glass_door_Upper005_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[0.488, 406.956, 204.005]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Balcony_rail_glass_House_material_0.geometry} material={materials.House_material} />
        </group>
       {/* === BALCONY RAIL GROUP === */}
      <group
        position={[-228.117, 406.956, 1.194]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        scale={100}
        ref={balconyRailGroupRef}
      >
        <mesh geometry={nodes.Balcony_rail_glass001_House_material_0.geometry} material={materials.House_material} />
        
      </group>
      <mesh position={balcony.position} visible={false}   name="balcony-overlay-anchor"
>
  {/* [1.2, -900.1, 257.2] */}
      <OverlayItem
        section={section}
        id="balcony"                    
          key="balcony"
    setActiveOverlay={setActiveOverlay}
    activeOverlay={activeOverlay}
 openOverlay={openOverlay}
          closeOverlay={closeOverlay}
          device={device}  
          rotation={[Math.PI / 2, -Math.PI / 2, 0]}
         position={[0, 0, 0]}
         distanceFactor={balcony.distanceFactor}
          title="Balcony Rail Cleaning"
          description="Glass + frame scrub"
          price="250-500"
          bgColor="bg-yellow-500"
src="/textures/sexyCleaning.jpeg"
        /></mesh>
        <group position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Door_Front_House_material_0.geometry} material={materials.House_material} />
          <mesh geometry={nodes.Door_Front_House_material_0001.geometry} material={materials.House_material} />
        </group>
        <group position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Door_side_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[0, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Garage_door_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[400, 200, 8.401]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Window_front_1st_floor_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Window_front_2nd_floor_House_material_0.geometry} material={materials.House_material} />
        </group>
        <group position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh geometry={nodes.Window_front_2nd_floor001_House_material_0.geometry} material={materials.House_material} />
        </group>
        <mesh geometry={nodes._Roof_Main_House_material_0.geometry} material={materials.newRoof} position={[450, 709.989, -200]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Back_wall_2nd_floor_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <GlassComponent
          geometry={nodes.Balcony_Glass_door_House_material_0.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Balcony_Glass_door_2_House_material_0.geometry}
          position={[402.152, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Balcony_Glass_door_2_Upper_House_material_0.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Balcony_Glass_door_2001_House_material_0.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <GlassComponent
          geometry={nodes.Balcony_Glass_door_Upper_House_material_0.geometry}
          position={[400, 200, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh geometry={nodes.Balcony_Glass_door_Upper001_House_material_0.geometry} material={materials.House_material} position={[454.801, 182.653, -597.463]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_Glass_door_Upper002_House_material_0.geometry} material={materials.House_material} position={[-3.284, 499.399, -602.541]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_Glass_door_Upper003_House_material_0.geometry} material={materials.House_material} position={[-1.15, 199.77, -600.006]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_House_material_0.geometry} material={materials.House_material} position={[3.947, 350.037, 204.274]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_1_House_material_0.geometry} material={materials.House_material} position={[149.634, 350.037, 204.274]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_2_House_material_0.geometry} material={materials.House_material} position={[-149.213, 350.037, 204.274]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_3_House_material_0.geometry} material={materials.House_material} position={[-227.303, 350.037, 1.188]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_4_House_material_0.geometry} material={materials.House_material} position={[-227.303, 350.037, 170.973]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_rail_5_House_material_0.geometry} material={materials.House_material} position={[-227.303, 350.037, -172.734]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_trim_House_material_0.geometry} material={materials.House_material} position={[0, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_wall_1_House_material_0.geometry} material={materials.House_material} position={[0, 545.015, -200]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Balcony_wall_2_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        {/* deck not doing the deck persay we are doing the bacony rail as deck */}

        <group
        position={[0, 200, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        scale={100}
        ref={deckFloorGroupRef}
      >
        <mesh geometry={nodes.Balcony_wood_floor_House_material_0.geometry} material={materials.House_material} />
       
      </group>

        {/* <mesh geometry={nodes.Balcony_wood_floor_House_material_0.geometry} material={materials.House_material} position={[0, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} /> old deck */}

        {/* car //driveway */}
  <group
        position={[-4.128, 0, 305.314]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
        ref={drivewayGroupRef}
      >
        <mesh geometry={nodes.Driveway_House_material_0.geometry} material={materials.House_material} />
        
      </group>
      {/* INVISIBLE ANCHOR FOR DRIVEWAY OVERLAY — this is the magic */}
<mesh
  position={driveway.position}  
  visible={false} 
  name="driveway-overlay-anchor"
>
  <OverlayItem
    section={section}
    id="driveway"
    key="driveway"
    position={[0, 0, 0]}       
    rotation={[Math.PI / 2, -Math.PI / 2, 0]}
    setActiveOverlay={setActiveOverlay}
    distanceFactor={driveway.distanceFactor}          
    activeOverlay={activeOverlay}
    openOverlay={openOverlay}
    closeOverlay={closeOverlay}
    device={device} 
    title="Driveway Cleaning"
    description="Oil stains + power wash"
    price="300-600"
    bgColor="bg-blue-500"
src="/textures/sexyCleaning.jpeg"
  />
</mesh>
      {/* <OverlayItem
        section={section}
        id="driveway"                     // ← give each one a unique string
          key="driveway"
          rotationX={Math.PI / 2}
          rotationY={-Math.PI / 2}
          rotationZ={0}
          positionX={0.2}
          positionY={3}          // ← was -900.1
          positionZ={15}         // ← was 500.4
          distanceFactor={16}
          title="Driveway Cleaning"
          description="Oil stains + power wash"
          price="300-600"
          bgColor="bg-blue-500"
          parentGroupRef={drivewayGroupRef}
          
          activeOverlayId={activeOverlayId}
        setActiveOverlayId={setActiveOverlayId}
        /> */}


        <group position={[-4.128, 0, 305.314]} rotation={[-Math.PI / 2, 0, 0]} scale={100} ref={balconyRailGroupRef}>
          <mesh geometry={nodes.Driveway_House_material_0.geometry} material={materials.House_material} />
          
        </group>
        


        <mesh geometry={nodes.Driveway001_House_material_0.geometry} material={materials.House_material} position={[-162.113, -13.119, 752.987]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Driveway002_House_material_0.geometry} material={materials.House_material} position={[206.757, -13.119, 752.987]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Fence_House_material_0.geometry} material={materials.House_material} position={[-814.541, 174.924, 1.036]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Fence_poles_House_material_0.geometry} material={materials.House_material} position={[-814.53, 210.163, 1091.849]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Fence_poles001_House_material_0.geometry} material={materials.House_material} position={[1257.63, 137.628, 86.034]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Fence_poles002_House_material_0.geometry} material={materials.House_material} position={[224.22, 137.628, -919.778]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
        <mesh geometry={nodes.Fence001_House_material_0.geometry} material={materials.House_material} position={[1257.619, 95.703, 86.354]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Fence002_House_material_0.geometry} material={materials.House_material} position={[224.209, 95.703, -919.458]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
        <mesh geometry={nodes.Front_fence_House_material_0.geometry} material={materials.House_material} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Front_fence_2_House_material_0.geometry} material={materials.House_material} position={[535.435, 27.254, 1130.915]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        <mesh geometry={nodes.Front_lawn_design_House_material_0.geometry} material={materials.House_material} position={[575.645, 3.672, 789.029]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />


        <mesh geometry={nodes.Garden_Ground_Material_0.geometry} material={materials.Ground_Material} position={[-227.216, -3.571, -56.219]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Garden001_Ground_Material_0.geometry} material={materials.Ground_Material} position={[527.892, -3.677, 429.819]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Grage_wall__House_material_0.geometry} material={materials.House_material} position={[0, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Grass_Grass_Material_0.geometry} material={materials.Grass_Material} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Gutter_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Gutter_drain_big_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Gutter_drain_small_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.House_main_bottom_House_material_0.geometry} material={materials.House_material} position={[400, 200, 8.401]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.House_main_top_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        <mesh geometry={nodes.Path_House_material_0.geometry} material={materials.House_material} position={[-308.445, 0, -458.168]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      
        <mesh geometry={nodes.Path001_House_material_0.geometry} material={materials.House_material} position={[-308.445, 0, -458.168]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        <mesh geometry={nodes.Path002_House_material_0.geometry} material={materials.House_material} position={[-308.445, 0, -458.168]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine_Bush_texture_0.geometry} material={materials.Bush_texture} position={[-273.902, 88.13, -284.533]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine_2_Bush_texture_0.geometry} material={materials.Bush_texture} position={[-195.675, 17.79, 1117.777]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine_3_Bush_texture_0.geometry} material={materials.Bush_texture} position={[241.193, 17.79, 1117.777]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine001_Bush_texture_0.geometry} material={materials.Bush_texture} position={[-693.076, 185.116, 128.914]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine002_Bush_texture_0.geometry} material={materials.Bush_texture} position={[938.995, 185.116, -810.432]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine003_Bush_texture_0.geometry} material={materials.Bush_texture} position={[1119.298, 214.967, 1002.216]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Pine004_Bush_texture_0.geometry} material={materials.Bush_texture} position={[-519.526, 214.967, 983.236]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plant_1_Plant3_0.geometry} material={materials.Plant3} position={[-193.577, -6.586, 1045.817]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plant_2_Plant3_0.geometry} material={materials.Plant3} position={[243.292, -6.586, 1045.817]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plant_3_Plant3_0.geometry} material={materials.Plant3} position={[279.711, 30.6, 399.54]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plant_4_Plant3_0.geometry} material={materials.Plant3} position={[-253.745, 35.451, 260.801]} rotation={[-Math.PI / 2, 0, -0.306]} scale={100} />
        <mesh geometry={nodes.Plant_4001_Plant3_0.geometry} material={materials.Plant3} position={[-683.364, 103.647, -785.771]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Plant_4002_Plant3_0.geometry} material={materials.Plant3} position={[929.224, 64.978, 1043.531]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh pointerEvents="none" geometry={nodes.Plant_4003_Plant3_0.geometry} material={materials.Plant3} position={[-721.595, 64.978, 988.766]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh pointerEvents="none" geometry={nodes.Plant_4004_Plant3_0.geometry} material={materials.Plant3} position={[-625.912, 64.978, 838.016]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh pointerEvents="none" geometry={nodes.Plant_4005_Plant3_0.geometry} material={materials.Plant3} position={[1161.17, 52.84, 801.259]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house001_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house002_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house003_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house004_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house005_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house006_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Ref_house007_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.rocks_Rock_texture_0.geometry} material={materials.Rock_texture} position={[840.75, -4.967, 412.407]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.rocks001_Rock_texture_0.geometry} material={materials.Rock_texture} position={[-590.829, 12.965, 434.988]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.rocks002_Rock_texture_0.geometry} material={materials.Rock_texture} position={[-231.549, 1.286, -349.319]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.rocks003_Rock_texture_0.geometry} material={materials.Rock_texture} position={[-173.386, 12.965, 247.555]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.rocks004_Rock_texture_0.geometry} material={materials.Rock_texture} position={[1172.839, 12.965, -771.341]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Roof_2_House_material_0.geometry} material={materials.newRoof} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Roof_3_House_material_0.geometry} material={materials.newRoof} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        {/* gutters */}
        <mesh geometry={nodes.Roof_3001_House_material_0.geometry} material={materials.House_material} position={[400, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />

        <mesh geometry={nodes.Stone_pillar_House_material_0.geometry} material={materials.House_material} position={[-199.478, 46, 198.253]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Stone_pillar_gate_House_material_0.geometry} material={materials.House_material} position={[-338.502, 43.966, 1129.598]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Stone_pillar_gate001_House_material_0.geometry} material={materials.House_material} position={[404.712, 43.966, 1129.598]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Stone_pillar001_House_material_0.geometry} material={materials.House_material} position={[200, 46, 198.253]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Stone_pillar002_House_material_0.geometry} material={materials.House_material} position={[-199.478, 46, -200]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Stone_pillar003_House_material_0.geometry} material={materials.House_material} position={[686.116, 46, 198.253]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Window_front_2nd_floor002_House_material_0.geometry} material={materials.House_material} position={[450, 477.255, -595.358]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh geometry={nodes.Wood_panel_top_G_House_material_0.geometry} material={materials.House_material} position={[0, 200, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
        <mesh position={house.position} visible={false}   name="house-overlay-anchor"
>
      <OverlayItem
        section={section}
        id="house"                    
          key="house"
    setActiveOverlay={setActiveOverlay}
    activeOverlay={activeOverlay}
 openOverlay={openOverlay}
          closeOverlay={closeOverlay}
          device={device}  
          rotation={[Math.PI / 2, -Math.PI / 2, 0]}
         position={[0, 0, 0]}
         distanceFactor={house.distanceFactor}
          title="House Cleaning"
          description="Glass + frame scrub"
          price="250-500"
          bgColor="bg-yellow-500"
src="/textures/sexyCleaning.jpeg"
        /></mesh>
        <mesh position={car.position} visible={false}   name="car-overlay-anchor"
>
      <OverlayItem
        section={section}
        id="car"                    
          key="car"
    setActiveOverlay={setActiveOverlay}
    activeOverlay={activeOverlay}
 openOverlay={openOverlay}
          closeOverlay={closeOverlay}
          device={device}  
          rotation={[Math.PI / 2, -Math.PI / 2, 0]}
         position={[0, 0, 0]}
         distanceFactor={car.distanceFactor}
          title="Car Cleaning"
          description="Glass + frame scrub"
          price="150-300"
          bgColor="bg-yellow-500"
src="/textures/sexyCleaning.jpeg"
        /></mesh>
        <mesh position={contact.position} visible={false}   name="contact-overlay-anchor"
>
      
  <OverlayItem
    section={section}
    id="serviceWindow"                    
    key="serviceWindow"
    setActiveOverlay={setActiveOverlay}
    activeOverlay={activeOverlay}
    openOverlay={openOverlay}
    closeOverlay={closeOverlay}
    device={device}  
    rotation={[Math.PI / 2, -Math.PI / 2, 0]}
    position={[0, 0, 0]}
    distanceFactor={contact.distanceFactor}
    title="I like big booties"
    description="Michael Murray"
    price="ssn 3938 2938 298"
    bgColor="bg-yellow-500"
    src="/textures/sirmur2025.png"
hideTriggerButton={true}   
  />

        </mesh>
        <mesh position={freeQ.position} visible={false}   name="freeQ-overlay-anchor"
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
      <OverlayItem
        section={section}
        ref={freeQOverlayRef}  // ← For menu button linkinkg
        id="freeQ"                    
          key="freeQ"
  className="freeQ-overlay"
    setActiveOverlay={setActiveOverlay}
    activeOverlay={activeOverlay}
 openOverlay={openOverlay}
          closeOverlay={closeOverlay}
          device={device}  
          rotation={[Math.PI / 2, -Math.PI / 2, 0]}
         position={[0, 0, 0]}
         distanceFactor={freeQ.distanceFactor}
          title="freeQ Cleaning"
          description="Glass + frame scrub"
          price="150-300"
          bgColor="bg-yellow-500"
src="/textures/sexyCleaning.jpeg"
        /></mesh>
      </group>
    
  );
}

useGLTF.preload("models/scene.glb");




