import { useGLTF, useTexture, useVideoTexture, useAnimations, MeshTransmissionMaterial, Html  } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, } from "react";
import * as THREE from "three";
import { useSetAtom } from "jotai";
import { currentProjectAtom } from "./Projects";
import { useStore } from '../store/useStore' // Adjust path if needed
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../firebase";
import jsmediatags from "jsmediatags/dist/jsmediatags.min.js";



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
  distanceFactor = 0.4,        // ← new prop, default 0.4
  parentGroupRef, 
  registerOverlayReset,
  section,
  id,                    
  activeOverlay,
  setActiveOverlay,
  setSection,
  jumpToSection,
  projectIndex = null,
  goToSection = 1,    // <— DEFAULT: go to section 1

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
const isVisible = section !== 3;
const friction = 0.92; // momentum decay
const user = useStore((state) => state.user);


//notes
const { notes: notesMap, boardList, addBoard, removeBoard, addNote, removeNote, renameBoard } = useStore();
  const [inputs, setInputs] = useState({});
const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const handleInputChange = (id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleFileNotesUpload = async (e, containerId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Compression Stream API
      const stream = new Blob([text]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(compressedStream).blob();
      
      // Decompress for display
      const decompressedStream = compressedBlob.stream().pipeThrough(new DecompressionStream('gzip'));
      const finalResult = await new Response(decompressedStream).text();

      await addNote(containerId, finalResult);
      alert(`Compressed file (${compressedBlob.size} bytes) imported!`);
    } catch (err) {
      console.error("Compression failed:", err);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Unknown User";



// music
const { 
  volume, setVolume, 
  isShuffled, toggleShuffle, 
  repeatMode, toggleRepeat,
  isPlaying, togglePlay,
  currentTime, duration,
  playingPlaylist,
toggleMute,
} = useStore();


// Formatting helper: 0:00
const formatTime = (time) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};


// Music Upload
const [isUploading, setIsUploading] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);
const fileInputRef = useRef(null);



const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const user = useStore.getState().user;

  if (!user || !file) return;

  // 1. Size Validation (30MB Limit)
  const MAX_SIZE_MB = 30;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (file.size > MAX_SIZE_BYTES) {
    alert(`File is too large! Maximum size allowed is ${MAX_SIZE_MB}MB.`);
    event.target.value = null; 
    return;
  }

  // 2. Extract Metadata (Bypass Prompts)
  // Wrap jsmediatags in a Promise so we can use 'await'
const metadata = await new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        resolve({
          title: tag.tags.title || "",
          artist: tag.tags.artist || ""
        });
      },
      onError: () => resolve({ title: "", artist: "" })
    });
  });

  // 3. Smart Naming Logic
  // Priority: 1. Metadata Title -> 2. Filename (no extension) -> 3. "Unknown Title"
  const fileNameCleaned = decodeURI(file.name).replace(/\.[^/.]+$/, "").replace(/_/g, " "); // Removes .mp3, .wav, etc.
  
  const songTitle = metadata.title || fileNameCleaned || "Unknown Title";
  const artistName = metadata.artist || "Unknown Artist";

  
  if (!songTitle || !artistName) {
    alert("Title and Artist are required!");
    return;
  }
  setIsUploading(true);
  console.log(`Uploading: ${songTitle} by ${artistName}`);


  try {
    // 2. Create Storage Reference (Using your specific user path)
    const fileRef = ref(storage, `users/${user.uid}/music/${Date.now()}_${file.name}`);
    
    // 3. Upload to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);
    
    setIsUploading(false);
    setIsProcessing(true); // Switch to "Optimizing Bitrate" mode

const checkStatus = setInterval(async () => {
  try {
    const freshRef = ref(storage, snapshot.ref.fullPath);
    
    // THE FIX: Adding a custom 'cacheControl' request or using a fresh fetch
    // Firebase doesn't have a 'force-refresh' flag on getMetadata, 
    // but re-creating the ref and checking customMetadata usually works.
    // debug
      const metadata = await getMetadata(freshRef);
      console.log("FULL METADATA OBJECT:", metadata); // Add this!

    console.log("Checking Metadata for:", freshRef.name);
    console.log("Custom Metadata Found:", metadata.customMetadata);

    if (metadata.customMetadata?.isCompressed === "true") {
      console.log("SUCCESS: Metadata detected!");
      clearInterval(checkStatus);
      
      // Get the final URL
      const permanentUrl = await getDownloadURL(freshRef);
      
      const newTrack = {
        title: songTitle,
        artist: artistName,
        url: permanentUrl,
      };

      // Update Zustand
      const activePlaylist = useStore.getState().activePlaylist;
      await useStore.getState().addTrackToPlaylist(activePlaylist, newTrack);

      setIsProcessing(false);
      alert("Success! File optimized and added to library.");
    }
  } catch (e) {
    console.log("Metadata not ready yet...");
  }
}, 3000);
    // Timeout safety: if server takes longer than 90s
    setTimeout(() => {
      if (isProcessing) {
        clearInterval(checkStatus);
        setIsProcessing(false);
        alert("Server is taking longer than usual. Check your library in a minute.");
      }
    }, 90000);

  } catch (error) {
    console.error("Upload error:", error);
    setIsUploading(false);
    setIsProcessing(false);
    alert("Upload failed. Check console for details.");
  }
};


//login page
const [view, setView] = useState("login"); // "login" or "reset", or "signup"
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [showTermsModal, setShowTermsModal] = useState(false);
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9!@#$%^&*]/.test(pw)) score++;
  return score; // Returns 0, 1, 2, or 3
};
const strength = getStrength(signupPassword);

const login = useStore((state) => state.login);
const signup = useStore((state) => state.signup);
const resetPassword = useStore((state) => state.resetPassword);
const logout = useStore((state) => state.logout);
const [showPassword, setShowPassword] = useState(false);

const onLoginSubmit = async (e) => {
  e.preventDefault();
  await login(email.trim(), password);
};

const onSignupSubmit = async (e) => {
  e.preventDefault();
  if (strength < 3) return alert("Please meet all password requirements");
  await signup(email, signupPassword);
};

const onResetSubmit = async (e) => {
  e.preventDefault();
  await resetPassword(email);
  setView("login");
};

const resetFormFields = () => {
  setFullName("");
  setContactMethod("");
  setServiceType("");
  setCityState("");
  setZipCode("");
  setEmail("");
  setPhone("");
  setErrors({});
};






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
// If they submitted before, show confirmation instead of form

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
    <div className="relative group scale-100 lg:scale-90" style={{ pointerEvents: isClickable ? "auto" : "none", opacity: isClickable ? 1 : 0.5 }}>
      <button
        className="relative inline-block p-px font-bold text-white rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 ease-in-out lg:hover:scale-105 lg:active:scale-100
        hover:scale-110 active:scale-105 
                   bg-gradient-to-r  from-cyan-400 via-blue-500 to-teal-600
                   hover:from-cyan-500 hover:via-blue-400 hover:to-teal-500
                   shadow-blue-700 hover:shadow-teal-500"
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation() }
        
        style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r  from-cyan-400 via-blue-500 to-teal-600 p-[3px] -m-px opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></span>

        <span className="relative  block px-3 lg:px-3 py-3 pb-5 lg:py-3 lg:pb-5 rounded-2xlbg-gradient-to-r from-orange-600 via-neutral-500 to-neutral-600
                   hover:from-neutral-500 hover:via-neutral-400 hover:to-neutral-500
                   shadow-neutral-700 hover:shadow-neutral-500">
          <div className="flex items-center justify-center space-x-4">
            <svg className="w-24 h-24 md:h-36 md:w-36 lg:w-48 lg:h-48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 8L38 24H54L40 34L46 50L32 40L18 50L24 34L10 24H26L32 8Z" 
                    fill="#fbbf24" stroke="#f59e0b" strokeWidth="3"
                    className="transition-all duration-500 group-hover:fill-nuetral- group-hover:scale-110"/>
              <path d="M20 44C22 40, 26 40, 28 44" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round"/>
              <path d="M36 44C38 40, 42 40, 44 44" stroke="#fcd34d" strokeWidth="4" strokeLinecap="round"/>
            </svg>

            <span className="text-6xl md:text-7xl lg:text-8xl font-bold lg:pb-4 lg:pt-1 md:pb-5 md:pt-2 pb-2 pt-1  px-1 tracking-wider text-white
           
                            ">
             Explore
            </span>
          </div>
        </span>
      </button>
    </div>
  );
};
const ServiceWindowButton = ({ onClick, isClickable }) => {
  return (
    <div
      className="
             
              relative group scale-100 lg:scale-90  "
      style={{ pointerEvents: isClickable ? "auto" : "none", opacity: isClickable ? 1 : 0.5 }}
    >
      <button
        className="relative inline-block p-px font-bold text-white rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-100 active:scale-90
                   bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600
                   hover:from-blue-500 hover:via-cyan-400 hover:to-teal-500
                   shadow-cyan-700 hover:shadow-cyan-500"
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
      >
        {/* Glow effect (kept exactly the same) */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-600 p-[3px] -m-px opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></span>

        {/* Inner button content container */}
        <span className="relative block px-1 lg:px-3 py-1 pb-1 lg:py-3 lg:pb-3 rounded-2xl bg-transparent overflow-hidden ">
          <div className="relative lg:w-[600px] lg:h-[370px] w-[370px] h-[230px]  flex items-center justify-center">
            {/* Full-cover video */}
            <img src="./textures/turntable.png" alt="" srcset="" />

            {/* Optional subtle dark overlay to improve contrast if needed */}
            <div className="absolute inset-0 bg-black opacity-20 rounded-2xl pointer-events-none"></div>
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
    pointerEvents: "auto",   
          }}
          transform={false}
          center
          distanceFactor={distanceFactor}
          occlude={false}
            className={className}   

          // portal={{ current: document.getElementById("overlay-portals-root") }}
          portal={{ 
  current: id === "freeQ" 
    ? document.getElementById("freeq-portal-root") 
    : id === "contactWindow" 
      ? document.getElementById("contact-portals-root") 
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
                className={`overlay-window ${className} bg-white rounded-lg shadow-2xl border border-gray-700 
                overflow-y-auto custom-scrollbar 
  min-h-[220vh]  lg:min-h-[90vh] lg:max-h-[100vh]
  w-[240vw] h-[240vw] md:h-[200vw] max-w-[1000px] md:max-w-[1200px] lg:w-[70vw] lg:max-w-[1800px]`}

                  onPointerDown={isVisible ? handleDragStart : undefined}


                    style={{
                    position: "absolute",
                    left: windowPos.x,
                    top: windowPos.y,
                      
  width: isFullscreen ? "120vw" : undefined,
  height: isFullscreen ? "110vh" : undefined,
  maxWidth: isFullscreen ? "110vw" : undefined,
  maxHeight: isFullscreen ? "120vh" : undefined,
  borderRadius: isFullscreen ? "8px" : "12px",
                    transition: isDragging.current ? "none" : "transform 0.2s ease",
                    cursor: "default",
                    pointerEvents: isVisible ? "auto" : "none",  
                     userSelect: "none",
                     WebkitUserSelect: "none",
            }}
          >


        <div className="flex p-4 lg:p-3 gap-2 bg-[#2a2a2a] overflow-hidden">
          <div className="flex gap-2 flex-shrink-0">
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
                    <h1 className="lg:text-5xl md:text-3xl text-xl font-bold lg:ml-20 lg:mb-2 md:ml-10 md:mb-1 mt-1 ml-5 ">{title}</h1>
                    <p className="lg:text-2xl text-lg text-gray-700 lg:mt-4 lg:ml-12 md:ml-4 md:mt-3 mt-1 line-clamp-3">{description}</p>
          
        </div>

        <div className="p-10 flex flex-col items-center justify-center gap-10 pt-1">
          


          <div className="card__content w-full">
            {id === "freeQ" ?
            
            (
                  // Special simple overlay for login and reset pass
                  
                                        <div className="flex flex-col justify-center items-center h-full w-full max-w-2xl mx-auto p-6">

  
    {user ? (
        <div className="w-full flex flex-col items-center space-y-6 bg-black/70 p-10 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl text-center ">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
            <p className="text-gray-300 mt-1">{user.email}</p>
          </div>
          
          <button 
            onClick={() => useStore.getState().logout()} // Assuming logout is in your store
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Logout from SirMurOS
          </button>
        </div>
      ) : (
        /* 2. IF NOT LOGGED IN, SHOW YOUR EXISTING FORMS */
        <>
  
                                  {view === "login" && (
                                    /* LOGIN FORM */
                                    <form 
                                     onSubmit={onLoginSubmit}
                                      className="w-full space-y-4 mb-4 bg-black/70 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                                    >
                                      <h2 className="text-2xl font-bold text-white text-center mb-4">Member Login</h2>
                                      <input 
                                        type="email" 
                                        placeholder="Email Address"
                                        value={email} // Add this
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                        required
                                      />
                                      <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password} // Add this
                                        onChange={(e) => setPassword(e.target.value)} // Add this
                                        className="w-full p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                        required
                                      />
                                      <button 
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-12 bottom-1/3 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-bold"
                                    >
                                      {showPassword ? "HIDE" : "SHOW"}
                                    </button>
                                      <button 
                                        type="submit"
                                        className="w-full py-4 bg-yellow-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
                                      >
                                        Sign In
                                      </button>
                                    </form>
                                  )}

                                  {view === "signup" && (
                                    <form 
                                      onSubmit={onSignupSubmit}
                                      className="w-full grid grid-cols-2 gap-4 mb-4 bg-black/80 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                                    >
                                      <h2 className="col-span-2 text-2xl font-bold text-white text-center mb-2">Create Account</h2>
                                      <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        className="col-span-1 p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                        required
                                      />
                                      <input 
                                        type="tel" 
                                        placeholder="Phone (Optional)"
                                        className="col-span-1 p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                      />
                                      <input 
                                        type="email" 
                                        placeholder="Email Address"
                                        className="col-span-2 p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                        required
                                      />
                                      <div className="col-span-2 space-y-2">
                                        
                                      <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create Password"
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800 large-dots"
                                        required
                                      />
                                      <button 
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-12 top-[248px] -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-bold"
                                    >
                                      {showPassword ? "HIDE" : "SHOW"}
                                    </button>
                                      
                                      {/* PASSWORD STRENGTH METER */}
                                      <div className="flex gap-1 h-1.5 w-full mt-1">
                                        <div className={`h-full flex-1 rounded-full transition-all duration-500 ${strength >= 1 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                                        <div className={`h-full flex-1 rounded-full transition-all duration-500 ${strength >= 2 ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
                                        <div className={`h-full flex-1 rounded-full transition-all duration-500 ${strength >= 3 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                      </div>
                                      
                                      {/* REQUIREMENTS LIST */}
                                      <div className="text-[10px] text-gray-300 flex justify-between px-1">
                                        <span className={signupPassword.length >= 8 ? "text-green-400" : ""}>8+ Chars</span>
                                        <span className={/[A-Z]/.test(signupPassword) ? "text-green-400" : ""}>1 Uppercase</span>
                                        <span className={/[0-9!@#$%^&*]/.test(signupPassword) ? "text-green-400" : ""}>1 Num/Spec</span>
                                      </div>
                                    </div>

                                    <div className="col-span-2 flex items-center gap-2 py-2">
                                    <input type="checkbox" id="terms" className="w-5 h-5 accent-yellow-500" required />
                                    <label htmlFor="terms" className="text-gray-200 text-sm">
                                      Accept{" "}
                                      <span 
                                        onClick={() => setShowTermsModal(true)}
                                        className="text-yellow-400 underline cursor-pointer hover:text-yellow-300 transition-colors"
                                      >
                                        Terms & Conditions
                                      </span>
                                    </label>
                                  </div>

                                    <button 
                                      type="submit"
                                      disabled={strength < 3}
                                      className="col-span-2 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all"
                                    >
                                      {strength < 3 ? "Fix Password to Continue" : "Register Now"}
                                    </button>
                                    
                                    <button type="button" onClick={() => setView("login")} className="col-span-2 text-sm text-gray-300 underline">
                                      Already have an account? Login
                                    </button>
                                  </form>
                                )}
                                   {showTermsModal && (
  /* The Overlay Layer */
  <div className="block inset-0   items-center justify-center  backdrop-blur-md">
    
    <div 
      className="relative  w-[450px] h-[760px] bg-[#1a1a1a] border border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()} // Prevents clicking the modal from closing it
    >
      
      {/* Header */}
      <div className="w-full p-6 border-b border-gray-800 flex justify-between items-center bg-[#222]">
        <h3 className="text-xl font-bold text-white">Terms of Service</h3>
        <button 
          onClick={() => setShowTermsModal(false)}
          className="text-gray-400 hover:text-white text-2xl leading-none"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Body - Added w-full */}
      <div className="w-full flex-grow p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed">
        <p className="mb-4 text-center">
          <strong>No Data Storage & Privacy</strong><br />This application is a client-side productivity tool. We do not host, store, or have access to any files, media, or data you upload or interact with. All processing occurs locally on your device. Consequently, we cannot retrieve, delete, or manage any content you use within the app.
        </p>
        <p className="mb-4 text-center">
          <strong>User Responsibility & Conduct</strong> You are solely responsible for the content you upload. By using this app, you agree:
          <br />Not to engage in any illegal or criminal activity.
          <br />To comply with all applicable laws of the United States of America.
          <br />That you own or have the necessary rights to the media you are using.

        </p>
        <p className="mb-4 text-center">
          <strong>Limitation of Liability</strong> Since we do not have control over user-uploaded content, we are not liable for any copyright infringement, damages, or legal repercussions resulting from your use of the application. The tool is provided "as-is" for research and productivity purposes.
        </p>
        <p className="mb-4 text-center">
          <strong>DMCA Notice</strong> While we do not host content, we comply with the Digital Millennium Copyright Act. Because all content is local to the user's browser, there is no content on our servers for us to "take down."
        </p>
      </div>

      {/* Footer */}
      
    </div>
  </div>
)}
                                  {view === "reset" && (
                                    /* RESET PASSWORD FORM */
                                    <form 
                                     onSubmit={onResetSubmit}
                                      className="w-full space-y-4 mb-4 bg-black/90 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
                                    >
                                      <h2 className="text-2xl font-bold text-white text-center mb-4">Reset Password</h2>
                                      <input 
                                        type="email" 
                                        placeholder="Email Address"
                                        className="w-full p-4 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-yellow-500 text-gray-800"
                                        required
                                      />
                                      <button className="w-full py-4 bg-yellow-600 text-white rounded-xl font-bold">Send Link</button>
                                      <button type="button" onClick={() => setView("login")} className="w-full text-sm text-gray-300">Back</button>
                                    </form>
                                  )}

                                  {/* INTERMEDIATE LINKS (Between form and Explore button) */}
                                  {view === "login" && (
                                    <div className="flex flex-col items-center gap-3 mb-8">
                                      <button 
                                        onClick={() => setView("signup")}
                                        className="px-6 py-2 bg-black/20 hover:bg-black/10 text-black border border-white/40 rounded-full font-semibold transition-all"
                                      >
                                        Create an Account
                                      </button>
                                      <button 
                                        onClick={() => setView("reset")}
                                        className="text-gray-400 hover:text-gray-300 underline text-sm font-medium transition-colors"
                                      >
                                        Forgot Password?
                                      </button>
                                    </div>
                                  )}
                        </>
                              )}
                                  {/* ORIGINAL EXPLORE BUTTON */}
                                  <button
                                    onClick={(e) => {
                                      jumpToSection(goToSection);
                                      handleResetClick(e); 
                                      
                                    }}
                                    className="px-12 py-6 bg-yellow-600 hover:bg-yellow-700 text-white text-3xl lg:text-5xl rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
                                  >
                                    Explore SirMurOS NOW
                                  </button>
                                </div>






                ) : id === "contactWindow" ? (
                  // NEW SPECIAL OVERLAY FOR NEWmusicWINDOW
  <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 p-6 lg:h-[70vh] h-auto overflow-y-auto  lg:overflow-hidden text-white">
  
  {/* SIDEBAR: LIBRARY & PLAYLIST NAV (Col 1-3) */}
  <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 border-r border-gray-800 pr-4  min-h-[220px] overflow-y-visible lg:overflow-hidden">
    <div className="flex items-center justify-between px-2">
      <h3 className="text-xs font-bold uppercase text-gray-500 tracking-widest">Library</h3>
      <span className="text-[10px] text-gray-600">{Object.keys(useStore.getState().playlists).length} / 10</span>
    </div>

    <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
      {Object.keys(useStore.getState().playlists).map((name) => {
        const isBrowsing = useStore.getState().activePlaylist === name;
        const isCurrentlyPlayingList = useStore.getState().playingPlaylist === name;
        
        return (
          <button
            key={name}
            onClick={() => useStore.getState().setActivePlaylist(name)}
            className={`text-left px-4 py-3 rounded-xl transition-all group ${
              isBrowsing 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-gray-400 hover:bg-neutral-800 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate font-medium">{name}</span>
              {isCurrentlyPlayingList && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 bg-current animate-bounce" style={{animationDuration: '0.4s'}}></div>
                  <div className="w-0.5 bg-current animate-bounce" style={{animationDuration: '0.7s'}}></div>
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* ADD PLAYLIST BUTTON (Max 10 total) */}
      {Object.keys(useStore.getState().playlists).length < 10 && (
        <button 
          onClick={() => {
            const name = prompt("Enter new playlist name:");
            if (name) useStore.getState().addPlaylist(name);
          }}
          className="mt-2 border border-dashed border-gray-700 hover:border-blue-500 hover:text-blue-500 p-3 rounded-xl text-sm text-gray-500 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          New Playlist
        </button>
      )}
    </div>
  </div>

  {/* MAIN CONTENT AREA (Col 4-12) */}
  <div className=" lg:col-span-9 grid lg:grid-cols-2 gap-8 h-[160vh] lg:h-auto overflow-hidden">
    
    {/* LMIDDLE: CURRENTLY PLAYING PLAYER */}
    {/* <div className="bg-neutral-900 p-8 rounded-3xl border border-gray-700 flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden">
      <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Playing from: {useStore.getState().playingPlaylist}
      </div>

      <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </div>
      
      
      <div className="flex items-center gap-8">
        <button 
          onClick={() => {
            const time = window.__AUDIO_ENGINE__?.getCurrentTime() || 0;
            if (time > 3) window.__AUDIO_ENGINE__.restart();
            else useStore.getState().prevTrack();
          }}
          className="text-white hover:text-blue-400 transition-colors"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <button
          onClick={togglePlay}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isPlaying ? (
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button 
          onClick={() => useStore.getState().nextTrack()}
          className="text-white hover:text-blue-400 transition-colors"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>
      
      <div className="w-full flex flex-col gap-2 px-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onInput={(e) => window.__AUDIO_ENGINE__?.seek(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div> */}
    
<div className="bg-neutral-900 p-8 rounded-3xl border border-gray-700 flex flex-col items-center justify-center gap-8 shadow-inner relative overflow-hidden h-full">
  
  {/* 1. RESTORED: TOP BADGE */}
  <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'}`}></span>
    Playing from: {playingPlaylist}
  </div>

  {/* 2. RESTORED: DYNAMIC VINYL / MUSIC ICON */}
  <div className={`w-44 h-44 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl transition-transform duration-500 ${isPlaying ? 'animate-spin-slow scale-105' : 'scale-100'}`}>
    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  </div>
  
  <div className="w-full flex flex-col gap-6">
    
    {/* 3. POSITION BAR */}
    <div className="w-full flex flex-col gap-2">
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onInput={(e) => window.__AUDIO_ENGINE__?.seek(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-[10px] text-gray-500 font-mono">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>

    {/* 4. EXPANSIVE CONTROLS ROW */}
    <div className="flex items-center w-full gap-4">
      
      {/* LEFT: Shuffle & Repeat (Fills space to the left) */}
      <div className="flex-1 flex items-center justify-start gap-6">
        <button 
          onClick={toggleShuffle}
          className={`transition-all hover:scale-110 ${isShuffled ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <button 
          onClick={toggleRepeat}
          className={`relative transition-all hover:scale-110 ${repeatMode !== 'off' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {repeatMode === 'one' && <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">1</span>}
        </button>
      </div>

      {/* CENTER: Fixed Playback Controls */}
      <div className="flex items-center gap-6 shrink-0">
        <button 
          onClick={() => {
            const time = window.__AUDIO_ENGINE__?.getCurrentTime() || 0;
            if (time > 3) window.__AUDIO_ENGINE__.restart();
            else useStore.getState().prevTrack();
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-200'}`}
        >
          {isPlaying ? (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button 
          onClick={() => useStore.getState().nextTrack()}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      {/* RIGHT: Volume (Expansive with Mute Toggle) */}
              <div className="flex-1 flex items-center justify-end gap-3 group">
                <button 
                  onClick={toggleMute}
                  className="text-gray-600 hover:text-blue-500 transition-colors p-1"
                  title={volume === 0 ? "Unmute" : "Mute"}
                >
                  {/* Dynamic Volume Icon */}
                  {volume === 0 ? (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : volume < 0.5 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 9v6h4l5 5V4L7 9zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume || 0}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full max-w-[120px] h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

    </div>
  </div>
</div>





    {/* RIGHT SIDE: DYNAMIC PLAYLIST VIEW (UP NEXT / BROWSE) */}
    <div className="bg-neutral-900 p-6 rounded-3xl border border-gray-800 flex flex-col shadow-lg  overflow-hidden">
                <div className="flex items-center gap-2">
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept=".mp3" 
                        className="hidden" 
                      />
                      
                      <button 
                        disabled={isUploading || isProcessing}
                        onClick={() => fileInputRef.current.click()}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs text-white ${
                          isProcessing ? "bg-amber-600 animate-pulse" : "bg-blue-600 hover:bg-blue-500"
                        }`}
                      >
                        {isUploading && "Uploading to Cloud..."}
                        {isProcessing && (
                          <>
                            <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Optimizing Bitrate (128kbps)...
                          </>
                        )}
                        {!isUploading && !isProcessing && "+ Upload MP3"}
                      </button>
                      <p className="text-[10px] text-gray-500 italic">
                        Files &gt; 128kbps are automatically compressed to save storage.
                      </p>
                </div>
                
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {useStore.getState().playlists[useStore.getState().activePlaylist]?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-sm">Playlist is empty</p>
          </div>
        )}

        {useStore.getState().playlists[useStore.getState().activePlaylist]?.map((track, index) => {
          const isActuallyPlaying = (useStore.getState().playingPlaylist === useStore.getState().activePlaylist && useStore.getState().currentTrackIndex === index);
          
          return (
            <div 
              key={index}
              onClick={() => useStore.getState().selectTrack(useStore.getState().activePlaylist, index)}
              className={`p-4 rounded-xl cursor-pointer transition-all border group flex items-center justify-between ${
                isActuallyPlaying 
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg' 
                  : 'bg-neutral-800/40 border-transparent hover:bg-neutral-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-mono w-4 ${isActuallyPlaying ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className={`font-medium text-sm ${isActuallyPlaying ? 'text-white' : 'text-gray-300'}`}>
                    {track.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Stop the song from playing when clicking delete
                      if(window.confirm(`Are you sure you want to delete "${track.title}"?`)) {
                        useStore.getState().deleteTrack(useStore.getState().activePlaylist, track);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                    title="Delete track"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
        </div>
              {isActuallyPlaying && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>

  </div>
</div>
                ) : (
                 
              <div className="text-center">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 p-6 h-full overflow-y-auto">
                  

{boardList.map((board, index) => {
        const boardId = board.id || board;
        const currentNotes = notesMap[boardId] || [];
        const currentInputValue = inputs[boardId] || "";

        // Hook was removed from here!

        return (
          <div key={boardId} className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col shadow-lg h-full">
            <div className="flex justify-between items-start mb-4 border-b pb-2">
              <div className="relative group flex-1">
                <span className="text-[12px] uppercase text-blue-500 font-bold tracking-widest block mb-1">
                  {displayName}'s Workspace
                </span>
                
                <div className="flex items-center gap-2">
                  <h2 
                    id={`title-${boardId}`}
                    contentEditable
                    spellCheck="false" 
                    suppressContentEditableWarning
                    className={` text-2xl font-bold text-gray-800 outline-none rounded px-1 transition-all ${newlyCreatedId === boardId ? 'bg-blue-50 ring-2 ring-blue-400' : 'hover:bg-gray-100'}`}
                    onFocus={(e) => {
                      const range = document.createRange();
                      range.selectNodeContents(e.target);
                      window.getSelection().removeAllRanges();
                      window.getSelection().addRange(range);
                    }}
                    onBlur={(e) => {
                      const newName = e.target.innerText.trim();
                      if (newName) renameBoard(boardId, newName);
                      setNewlyCreatedId(null); 
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                      }
                    }}
                  >
                    {board.name || `Board ${index + 1}`}
                  </h2>

                  {/* Tooltip logic remains the same, but references the single state above */}
                  {newlyCreatedId === boardId && (
                    <div className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded-lg shadow-lg animate-bounce duration-700">
                      <span className="text-[10px] font-bold whitespace-nowrap">Rename & Enter?</span>
                      <button 
                        onMouseDown={(e) => e.preventDefault()} 
                        onClick={() => setNewlyCreatedId(null)}
                        className="bg-white text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                      >
                        ✓
                      </button>
                    </div>
                  )}
                </div>
                
                {!newlyCreatedId && (
                  <p className="absolute -bottom-6 left-1 text-[15px] !text-black opacity-0 group-hover:opacity-90 transition-opacity">
                    Click to rename
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <input type="file" id={`file-${boardId}`} className="hidden" accept=".txt" onChange={(e) => handleFileNotesUpload(e, boardId)} />
                <button onClick={() => document.getElementById(`file-${boardId}`).click()} className="text-[9px] bg-gray-100 p-2 rounded-lg hover:bg-blue-50 transition-colors">IMPORT TXT</button>
                <button onClick={() => window.confirm("Delete Board?") && removeBoard(boardId)} className="text-[9px] bg-gray-100 p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">DELETE</button>
              </div>
            </div>

            {/* Notes display and Input area remain exactly as you had them... */}
            {/* <div className="flex-grow overflow-y-auto min-h-[250px] max-h-[350px] mb-4 space-y-3 pr-2 select-text custom-scrollbar">
               {currentNotes.map((note, noteIdx) => (
                 <div key={noteIdx} className=" group relative p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-gray-700 shadow-sm text-left">
                   {note}
                   <button onClick={() => removeNote(boardId, noteIdx)} className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">✕</button>
                 </div>
               ))}
            </div> */}
                  <div className="flex-grow overflow-y-auto min-h-[250px] max-h-[350px] mb-4 space-y-3 pr-2 select-text custom-scrollbar">
                    {currentNotes.map((note, noteIdx) => (
                      <NoteItem 
                        key={`${boardId}-${noteIdx}`} 
                        note={note} 
                        onRemove={() => removeNote(boardId, noteIdx)} 
                      />
                    ))}
                  </div>




            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={currentInputValue} 
                onChange={(e) => handleInputChange(boardId, e.target.value)}
                placeholder="New note..."
                className="w-full p-4 bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
              />
              <button onClick={() => { addNote(boardId, currentInputValue); handleInputChange(boardId, ""); }} disabled={!currentInputValue.trim()} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
                Save Note
              </button>
            </div>
          </div>
        );
      })}

      {/* Add Board button remains at the bottom, using the same setNewlyCreatedId */}
      {boardList.length < 10 && (
        <button onClick={async () => {
          const newId = `board-${Date.now()}`;
          await addBoard(newId);
          setNewlyCreatedId(newId);
          setTimeout(() => {
            const el = document.getElementById(`title-${newId}`);
            if (el) el.focus();
          }, 50);
        }} className="flex items-center justify-center bg-gray-50 border-4 border-dashed border-gray-300 rounded-3xl min-h-[400px] hover:border-blue-400 transition-all group">
           <div className="flex flex-col items-center gap-2">
             <span className="text-6xl text-gray-300 group-hover:text-blue-500">+</span>
             <p className="text-gray-400 group-hover:text-blue-500 font-medium">Add New Board</p>
           </div>
        </button>
      )}

               
                </div>
              </div>
                )}

         
        </div>

          
        </div>
      </div>
  )}
 
     {!hideTriggerButton && showViewButton && (
      <div className="flex items-center justify-center" style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none", 
      zIndex:1,
      }}>
    <div 
      className="relative group"
      style={{
        pointerEvents: isVisible && isClickable ? "auto" : "none",  
        opacity: isClickable ? 1 : 0.4,
        transition: "opacity 0.4s ease",
        position: "relative",
        zIndex: "auto"  ,
      }}
    >

     {id === "freeQ" ? (
        <FreeQuoteButton onClick={handleButtonClick} isClickable={isClickable} />
      ) : id === "contactWindow" ? (
        <ServiceWindowButton onClick={handleButtonClick} isClickable={isClickable} />
      ) : (

       <div
      className="
             
              relative group scale-100 lg:scale-90  "
      style={{ pointerEvents: isClickable ? "auto" : "none", opacity: isClickable ? 1 : 0.5 }}
    >
      <button
        className="relative inline-block p-px font-bold text-white rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-100 active:scale-90
                   bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600
                   hover:from-blue-500 hover:via-cyan-400 hover:to-teal-500
                   shadow-cyan-700 hover:shadow-cyan-500"
        onClick={handleButtonClick}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
      >
        {/* Glow effect (kept exactly the same) */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-600 p-[3px] -m-px opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></span>

        {/* Inner button content container */}
        <span className="relative block px-1 lg:px-3 py-1 pb-1 lg:py-3 lg:pb-3 rounded-2xl bg-transparent overflow-hidden ">
          <div className="relative lg:w-[600px] lg:h-[370px] w-[370px] h-[230px]  flex items-center justify-center">
            {/* Full-cover video */}
            <img src={src} alt="" srcset="" />

            {/* Optional subtle dark overlay to improve contrast if needed */}
            <div className="absolute inset-0 bg-black opacity-20 rounded-2xl pointer-events-none"></div>
          </div>
        </span>
      </button>
    </div>
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












export function Office({ section, menuOpened, isDay, setIsAnimating, setCameraTarget, activeOverlay, setActiveOverlay, jumpToSection, ...props }) {
  const group = useRef();
  const balconyRailGroupRef = useRef();
  const deckFloorGroupRef = useRef();
  const drivewayGroupRef = useRef();
  const { nodes, materials, animations } = useGLTF("models/scene.glb");
  const texture = useTexture("textures/sceneNight.jpg");
  const nightTexture = useTexture("textures/scene.jpg"); 
  const textureVSCode = useVideoTexture("textures/vscode.mp4");
  const { actions, mixer } = useAnimations(animations, group);

  const freeQOverlayRef = useRef(null);

[texture, nightTexture].forEach((t) => {
  t.flipY = false;
  t.encoding = THREE.sRGBEncoding;
});
  texture.flipY = false;
  texture.encoding = THREE.sRGBEncoding;

useEffect(() => {
    animate(textureOpacity, section !== 3 ? 1 : 0);
    animate(glassTextureOpacity, section !== 3 ? 0.42 : 0);
    // Check the names of available animations
  console.log("Available animations:", Object.keys(actions));
    // 1. Move loopCounts and startAnimations definition to the TOP of useEffect
  const startAnimations = () => {
      Object.keys(actions).forEach((key) => {
        const action = actions[key];
        
        if (action) {
          action.reset();
          action.setLoop(THREE.LoopRepeat, 3);
          
          action.clampWhenFinished = true; 
          
          action.play();
        }
      });
    };

    if (section === 3) {
      startAnimations();
    }

    return () => {
      Object.keys(actions).forEach((key) => actions[key]?.stop());
    };
  }, [section, actions]);


const textureMaterial = new THREE.MeshStandardMaterial({
  map: isDay ? texture : nightTexture, // Toggle based on prop
  transparent: true,
  opacity: 1,
});

const textureGlassMaterial = new THREE.MeshStandardMaterial({
  map: isDay ? texture : nightTexture, // Toggle based on prop
  transparent: true,
  opacity: 0.32,
});

  const textureOpacity = useMotionValue(0);
  const glassTextureOpacity = useMotionValue(0);



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
    
    //roof
    balcony: {
      distanceFactor: { desktop: 19, tablet: 25, mobile: 18 },
      position: {
        
        
        desktop: [-626.128, 554.8, -72],
        tablet: [-413.128, 610.8, -72],
        
         mobile:  [-118.128, 827.5, 285.314],

      },
    },
    //seasonal
     house: {
      distanceFactor: { desktop: 15, tablet: 20, mobile: 18 },
      position: {
        
        
        desktop: [-608.128, 143.8, 322],
        tablet: [-444.128, 178.8, 322],
         mobile:  [400.128, 836, 505.314],

      },
    },
    driveway: {
      distanceFactor: { desktop: 0.4, tablet: 0.4, mobile: 0.4 },
      position: {
        
        // desktop: [-610.128, 328.8, 172],
        desktop: [0.128, 0.8, 0],
        tablet: [0.128, 0.8, 0],
        mobile: [0.128, 0.8, 0],


      },
    },
    car: {
      distanceFactor: { desktop: 13, tablet: 19, mobile: 22 }, 
      position: {
        desktop: [-592.128, 20.8, 482],
        
        tablet: [-324.128, -18.8, 462],
   
         mobile:  [540.128, 81, 445.314],

      },
    },
    // music
    contact: {
      distanceFactor: { desktop: 0.4, tablet: 0.4, mobile: 0.4 },
      position: {
        // desktop: [103.2, 600.1, 1077.2],
        desktop: [-2.2 ,2, 0],

        tablet: [-2.2 ,2, 0],
        // tablet: [461.2, 200.1, 507.2],
        
        //  mobile:  [-40.128, 0, 805.314],
        mobile: [-2.2 ,2, 0],
      },
    },
    freeQ: {
      distanceFactor: { desktop: 1, tablet: 1, mobile: 1 },
      position: {
        desktop: [0, 5, 0],
        // tablet: [461.2, 880.1, 707.2],

        tablet: [0, 5, 0],
        mobile: [0, 5, 0],
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
    ? [-6.5,  -7,  17.5]   // mobile + tablet
     : [-6.5, -7, 17.5];     // desktop
    // : [-9, -3, 0];    

const currentXRotation = (section === 3) ? 0.29 : (section === 0) ? -0.29 : -0.2;
const modelRotation = (section === 3) 
    ? [currentXRotation, 4.2, 0.0]   // Unique Y and Z for Section 3
    : [currentXRotation, 0.00, 0.003];

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
rotation={modelRotation}  scale={1} frustumCulled={false}>
    <group name="Scene">
        <group name="Cylinder004" position={[-3.693, -4.155, -4.282]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder111" geometry={nodes.Cylinder111.geometry} material={textureMaterial} />
          <mesh name="Cylinder111_1" geometry={nodes.Cylinder111_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder111_2" geometry={nodes.Cylinder111_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder007" position={[-3.693, -4.155, -4.349]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder168" geometry={nodes.Cylinder168.geometry} material={textureMaterial} />
          <mesh name="Cylinder168_1" geometry={nodes.Cylinder168_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder168_2" geometry={nodes.Cylinder168_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder057" position={[-3.693, -4.155, -4.416]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder169" geometry={nodes.Cylinder169.geometry} material={textureMaterial} />
          <mesh name="Cylinder169_1" geometry={nodes.Cylinder169_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder169_2" geometry={nodes.Cylinder169_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder058" position={[-3.693, -4.155, -4.484]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder170" geometry={nodes.Cylinder170.geometry} material={textureMaterial} />
          <mesh name="Cylinder170_1" geometry={nodes.Cylinder170_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder170_2" geometry={nodes.Cylinder170_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder059" position={[-3.693, -4.155, -4.551]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder171" geometry={nodes.Cylinder171.geometry} material={textureMaterial} />
          <mesh name="Cylinder171_1" geometry={nodes.Cylinder171_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder171_2" geometry={nodes.Cylinder171_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder060" position={[-3.693, -4.155, -4.618]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder172" geometry={nodes.Cylinder172.geometry} material={textureMaterial} />
          <mesh name="Cylinder172_1" geometry={nodes.Cylinder172_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder172_2" geometry={nodes.Cylinder172_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder061" position={[-3.693, -4.155, -4.685]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder173" geometry={nodes.Cylinder173.geometry} material={textureMaterial} />
          <mesh name="Cylinder173_1" geometry={nodes.Cylinder173_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder173_2" geometry={nodes.Cylinder173_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder062" position={[-3.693, -4.155, -4.753]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder174" geometry={nodes.Cylinder174.geometry} material={textureMaterial} />
          <mesh name="Cylinder174_1" geometry={nodes.Cylinder174_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder174_2" geometry={nodes.Cylinder174_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder063" position={[-3.693, -4.155, -4.82]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder175" geometry={nodes.Cylinder175.geometry} material={textureMaterial} />
          <mesh name="Cylinder175_1" geometry={nodes.Cylinder175_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder175_2" geometry={nodes.Cylinder175_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder064" position={[-3.693, -4.155, -4.887]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder176" geometry={nodes.Cylinder176.geometry} material={textureMaterial} />
          <mesh name="Cylinder176_1" geometry={nodes.Cylinder176_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder176_2" geometry={nodes.Cylinder176_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder065" position={[-3.693, -4.155, -4.954]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder177" geometry={nodes.Cylinder177.geometry} material={textureMaterial} />
          <mesh name="Cylinder177_1" geometry={nodes.Cylinder177_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder177_2" geometry={nodes.Cylinder177_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder066" position={[-3.693, -4.155, -5.022]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder178" geometry={nodes.Cylinder178.geometry} material={textureMaterial} />
          <mesh name="Cylinder178_1" geometry={nodes.Cylinder178_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder178_2" geometry={nodes.Cylinder178_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder067" position={[-3.693, -4.155, -5.089]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder179" geometry={nodes.Cylinder179.geometry} material={textureMaterial} />
          <mesh name="Cylinder179_1" geometry={nodes.Cylinder179_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder179_2" geometry={nodes.Cylinder179_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder068" position={[-3.693, -4.155, -5.156]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder180" geometry={nodes.Cylinder180.geometry} material={textureMaterial} />
          <mesh name="Cylinder180_1" geometry={nodes.Cylinder180_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder180_2" geometry={nodes.Cylinder180_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder069" position={[-3.693, -4.155, -5.223]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder181" geometry={nodes.Cylinder181.geometry} material={textureMaterial} />
          <mesh name="Cylinder181_1" geometry={nodes.Cylinder181_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder181_2" geometry={nodes.Cylinder181_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder070" position={[-3.693, -4.155, -5.291]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder182" geometry={nodes.Cylinder182.geometry} material={textureMaterial} />
          <mesh name="Cylinder182_1" geometry={nodes.Cylinder182_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder182_2" geometry={nodes.Cylinder182_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder071" position={[-3.693, -4.155, -5.358]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder183" geometry={nodes.Cylinder183.geometry} material={textureMaterial} />
          <mesh name="Cylinder183_1" geometry={nodes.Cylinder183_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder183_2" geometry={nodes.Cylinder183_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder072" position={[-3.693, -4.155, -5.425]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder184" geometry={nodes.Cylinder184.geometry} material={textureMaterial} />
          <mesh name="Cylinder184_1" geometry={nodes.Cylinder184_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder184_2" geometry={nodes.Cylinder184_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder073" position={[-3.693, -4.155, -5.492]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder185" geometry={nodes.Cylinder185.geometry} material={textureMaterial} />
          <mesh name="Cylinder185_1" geometry={nodes.Cylinder185_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder185_2" geometry={nodes.Cylinder185_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder074" position={[-3.693, -4.155, -5.56]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder186" geometry={nodes.Cylinder186.geometry} material={textureMaterial} />
          <mesh name="Cylinder186_1" geometry={nodes.Cylinder186_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder186_2" geometry={nodes.Cylinder186_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder075" position={[-3.693, -4.155, -5.627]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder187" geometry={nodes.Cylinder187.geometry} material={textureMaterial} />
          <mesh name="Cylinder187_1" geometry={nodes.Cylinder187_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder187_2" geometry={nodes.Cylinder187_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder076" position={[-3.693, -4.155, -5.694]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder188" geometry={nodes.Cylinder188.geometry} material={textureMaterial} />
          <mesh name="Cylinder188_1" geometry={nodes.Cylinder188_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder188_2" geometry={nodes.Cylinder188_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder077" position={[-3.693, -4.155, -5.761]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder189" geometry={nodes.Cylinder189.geometry} material={textureMaterial} />
          <mesh name="Cylinder189_1" geometry={nodes.Cylinder189_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder189_2" geometry={nodes.Cylinder189_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder078" position={[-3.693, -4.155, -5.829]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder190" geometry={nodes.Cylinder190.geometry} material={textureMaterial} />
          <mesh name="Cylinder190_1" geometry={nodes.Cylinder190_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder190_2" geometry={nodes.Cylinder190_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder079" position={[-3.693, -4.155, -5.896]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder191" geometry={nodes.Cylinder191.geometry} material={textureMaterial} />
          <mesh name="Cylinder191_1" geometry={nodes.Cylinder191_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder191_2" geometry={nodes.Cylinder191_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder080" position={[-3.693, -4.155, -5.963]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder192" geometry={nodes.Cylinder192.geometry} material={textureMaterial} />
          <mesh name="Cylinder192_1" geometry={nodes.Cylinder192_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder192_2" geometry={nodes.Cylinder192_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder081" position={[-3.693, -4.155, -6.03]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder193" geometry={nodes.Cylinder193.geometry} material={textureMaterial} />
          <mesh name="Cylinder193_1" geometry={nodes.Cylinder193_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder193_2" geometry={nodes.Cylinder193_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder082" position={[-3.693, -4.155, -6.098]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder194" geometry={nodes.Cylinder194.geometry} material={textureMaterial} />
          <mesh name="Cylinder194_1" geometry={nodes.Cylinder194_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder194_2" geometry={nodes.Cylinder194_2.geometry} material={textureMaterial} />
        </group>
        <group name="Cylinder083" position={[-3.693, -4.155, -6.165]} scale={[0.037, 0.532, 0.037]}>
          <mesh name="Cylinder195" geometry={nodes.Cylinder195.geometry} material={textureMaterial} />
          <mesh name="Cylinder195_1" geometry={nodes.Cylinder195_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder195_2" geometry={nodes.Cylinder195_2.geometry} material={textureMaterial} />
        </group>
        <mesh name="Vert" geometry={nodes.Vert.geometry} material={textureMaterial} position={[-0.051, -5.859, -5.203]} />
        <mesh name="Cube005" geometry={nodes.Cube005.geometry} material={textureMaterial} position={[-3.694, -4.155, -5.223]} scale={[0.077, 1.024, 1.011]} />
        <mesh name="deckrailing00001" geometry={nodes.deckrailing00001.geometry} material={textureMaterial} />
        <mesh name="deckrailing00002" geometry={nodes.deckrailing00002.geometry} material={textureMaterial} />
        <mesh name="deckrailing00003" geometry={nodes.deckrailing00003.geometry} material={textureMaterial} />
        <mesh name="deckrailing00004" geometry={nodes.deckrailing00004.geometry} material={textureMaterial} />
        <mesh name="deckrailing00005" geometry={nodes.deckrailing00005.geometry} material={textureMaterial} />
        <mesh name="deckrailing00006" geometry={nodes.deckrailing00006.geometry} material={textureMaterial} />
        <mesh name="deck001" geometry={nodes.deck001.geometry} material={textureMaterial} />
        <mesh name="deckrailing00" geometry={nodes.deckrailing00.geometry} material={textureMaterial} />
        <mesh name="deckrailing001" geometry={nodes.deckrailing001.geometry} material={textureMaterial} />
        <mesh name="topRail000" geometry={nodes.topRail000.geometry} material={textureMaterial} />
        <mesh name="topRail001" geometry={nodes.topRail001.geometry} material={textureMaterial} />
        <mesh name="topRail002" geometry={nodes.topRail002.geometry} material={textureMaterial} />
        <mesh name="topRail006" geometry={nodes.topRail006.geometry} material={textureMaterial} position={[0.025, 0, -0.015]} />
        <mesh name="stairs" geometry={nodes.stairs.geometry} material={textureMaterial} />
        <mesh name="topRail001001" geometry={nodes.topRail001001.geometry} material={textureMaterial} position={[-3.604, 6.463, -0.862]} />
        <mesh name="Plane005" geometry={nodes.Plane005.geometry} material={textureMaterial} position={[0.751, -5.959, -5.203]} scale={[1, 1, 0.997]} />
        <mesh name="Plane006" geometry={nodes.Plane006.geometry} material={textureMaterial} />
        <mesh name="Plane007" geometry={nodes.Plane007.geometry} material={textureMaterial} position={[-1.276, -5.959, -5.205]} scale={[2.215, 1.038, 1.038]} />
        <mesh name="Plane013" geometry={nodes.Plane013.geometry} material={textureMaterial} position={[-3.587, -5.326, -6.307]} />
        <mesh name="Plane016" geometry={nodes.Plane016.geometry} material={textureMaterial} position={[-1.276, -5.499, -5.097]} scale={[2.032, 0.961, 1.038]} />
        <mesh name="Plane017" geometry={nodes.Plane017.geometry} material={textureMaterial} position={[-3.568, -5.863, -5.205]} scale={[2.215, 1.038, 0.931]} />
        <mesh name="Plane008" geometry={nodes.Plane008.geometry} material={textureMaterial} position={[-3.602, -5.305, -5.205]} scale={[2.215, 1.038, 0.931]} />
        <group name="building">
          <mesh name="Cube009" geometry={nodes.Cube009.geometry} material={textureMaterial} />
          <mesh name="Cube009_1" geometry={nodes.Cube009_1.geometry} material={textureMaterial} />
          <mesh name="Cube009_2" geometry={nodes.Cube009_2.geometry} material={textureMaterial} />
          <mesh name="Cube009_3" geometry={nodes.Cube009_3.geometry} material={textureMaterial} />
          <mesh name="Cube009_4" geometry={nodes.Cube009_4.geometry} material={textureMaterial} />
        </group>
        <mesh name="door" geometry={nodes.door.geometry} material={textureMaterial} />
        <group name="cielingBuilding">
          <mesh name="Cube012" geometry={nodes.Cube012.geometry} material={textureMaterial} />
          <mesh name="Cube012_1" geometry={nodes.Cube012_1.geometry} material={textureMaterial} />
          <mesh name="Cube012_2" geometry={nodes.Cube012_2.geometry} material={textureMaterial} />
          <mesh name="Cube012_3" geometry={nodes.Cube012_3.geometry} material={textureMaterial} />
        </group>
        <mesh name="doorHandle" geometry={nodes.doorHandle.geometry} material={textureMaterial} />
        <mesh name="Plane" geometry={nodes.Plane.geometry} material={textureMaterial} position={[0.275, 0, -0.446]} scale={[1, 1, 0.999]} />
        <mesh name="Plane001" geometry={nodes.Plane001.geometry} material={textureMaterial} position={[0.275, 0, -0.441]} />
        <mesh name="building001" geometry={nodes.building001.geometry} material={textureMaterial} />
        <mesh name="cover001" geometry={nodes.cover001.geometry} material={textureMaterial} />
        <mesh name="cover004" geometry={nodes.cover004.geometry} material={textureMaterial} />
        <mesh name="Cube" geometry={nodes.Cube.geometry} material={textureMaterial} />
        <mesh name="Cube001" geometry={nodes.Cube001.geometry} material={textureMaterial} />
        <mesh name="Cube002" geometry={nodes.Cube002.geometry} material={textureMaterial} />
        <mesh name="Cylinder" geometry={nodes.Cylinder.geometry} material={textureMaterial} />
        <mesh name="Cylinder001" geometry={nodes.Cylinder001.geometry} material={textureMaterial} />
        <mesh name="cielinVernt00001" geometry={nodes.cielinVernt00001.geometry} material={textureMaterial} position={[-2.585, 6.467, -1.355]} rotation={[0, -Math.PI / 2, 0]} scale={[1.097, 0.902, 0.788]} />
        <mesh name="Cube004" geometry={nodes.Cube004.geometry} material={textureMaterial} position={[-0.531, 0, 0.464]} />
        <group name="Cylinder003" position={[-0.531, 0, 0.464]}>
          <mesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={textureMaterial} />
          <mesh name="Cylinder004_2" geometry={nodes.Cylinder004_2.geometry} material={textureMaterial} />
        </group>
        <mesh name="Cylinder006" geometry={nodes.Cylinder006.geometry} material={textureMaterial} position={[-0.623, 0, 0]} />
        <mesh name="Cylinder010" geometry={nodes.Cylinder010.geometry} material={textureMaterial} position={[-2.76, 7.024, -1.759]} rotation={[0, -Math.PI / 2, 0]} scale={[0.072, 0.035, 0.072]} />
        <group name="Plane002" position={[0, 0, 0.064]}>
          <mesh name="Plane004_1" geometry={nodes.Plane004_1.geometry} material={textureMaterial} />
          <mesh name="Plane004_2" geometry={nodes.Plane004_2.geometry} material={textureMaterial} />
        </group>
        <mesh name="Plane003" geometry={nodes.Plane003.geometry} material={textureMaterial} position={[0, 0, 0.064]} />
        <mesh name="Plane004" geometry={nodes.Plane004.geometry} material={textureMaterial} position={[0, 0, 0.064]} />
        <mesh name="cover006" geometry={nodes.cover006.geometry} material={textureMaterial} />
        <group name="group1646369301006" position={[2.685, -0.772, -2.356]} rotation={[2.887, 0.231, 3.046]} scale={0.261}>
          <mesh name="mesh1646369301007" geometry={nodes.mesh1646369301007.geometry} material={textureMaterial} />
          <mesh name="mesh1646369301007_1" geometry={nodes.mesh1646369301007_1.geometry} material={textureMaterial} />
          <mesh name="mesh1646369301007_2" geometry={nodes.mesh1646369301007_2.geometry} material={textureMaterial} />
          <mesh name="mesh1646369301007_3" geometry={nodes.mesh1646369301007_3.geometry} material={textureMaterial} />
        </group>
        <mesh name="Orchid_mesh" geometry={nodes.Orchid_mesh.geometry} material={textureMaterial} position={[1.575, -5.954, -3.786]} rotation={[-Math.PI, 1.039, -Math.PI]} scale={0.098} />
        <mesh name="tavble" geometry={nodes.tavble.geometry} material={textureMaterial} position={[0.26, 6.808, -2.908]} scale={[0.829, 1.098, 0.829]} />

        {/* <mesh name="monitor" geometry={nodes.monitor.geometry} material={textureMaterial} position={[0.217, 7.15, -3.135]} scale={[0.081, 0.161, 0.024]} /> */}
        
        <mesh name="mouseKeyboard" geometry={nodes.mouseKeyboard.geometry} material={textureMaterial} position={[0.255, 7.022, -2.714]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={[0.081, 0.119, 0.084]} />
        <group name="couch" position={[1.569, 6.375, 2.226]} scale={1.918}>
          <mesh name="mesh198131767" geometry={nodes.mesh198131767.geometry} material={textureMaterial} />
          <mesh name="mesh198131767_1" geometry={nodes.mesh198131767_1.geometry} material={textureMaterial} />
          <mesh name="mesh198131767_2" geometry={nodes.mesh198131767_2.geometry} material={textureMaterial} />
          <mesh name="mesh198131767_3" geometry={nodes.mesh198131767_3.geometry} material={textureMaterial} />
          <mesh name="mesh198131767_4" geometry={nodes.mesh198131767_4.geometry} material={textureMaterial} />
          <mesh name="mesh198131767_5" geometry={nodes.mesh198131767_5.geometry} material={textureMaterial} />
        </group>
        <group name="Box003" position={[4.13, -5.92, -2.078]} rotation={[-Math.PI, 0.441, -Math.PI]} scale={0.017}>
          <mesh name="Box003_1" geometry={nodes.Box003_1.geometry} material={textureMaterial} />
          <mesh name="Box003_1_1" geometry={nodes.Box003_1_1.geometry} material={textureMaterial} />
          <mesh name="Box003_1_2" geometry={nodes.Box003_1_2.geometry} material={textureMaterial} />
          <mesh name="Box003_1_3" geometry={nodes.Box003_1_3.geometry} material={textureMaterial} />
        </group>
        <group name="FlowerPot2" position={[3.986, 1.181, -0.723]} rotation={[0, 0.635, 0]}>
          <mesh name="FlowerPot2_1" geometry={nodes.FlowerPot2_1.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2_2" geometry={nodes.FlowerPot2_2.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2_3" geometry={nodes.FlowerPot2_3.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2_4" geometry={nodes.FlowerPot2_4.geometry} material={textureMaterial} />
        </group>
        <group name="FlowerPot4001" position={[4.04, -4.869, -1.468]} rotation={[0, 1.286, 0]}>
          <mesh name="FlowerPot4004" geometry={nodes.FlowerPot4004.geometry} material={textureMaterial} />
          <mesh name="FlowerPot4004_1" geometry={nodes.FlowerPot4004_1.geometry} material={textureMaterial} />
          <mesh name="FlowerPot4004_2" geometry={nodes.FlowerPot4004_2.geometry} material={textureMaterial} />
        </group>
        <group name="FlowerPot4003" position={[-2.757, 7.038, -2.937]} rotation={[-Math.PI, 0.856, -Math.PI]}>
          <mesh name="FlowerPot4003_1" geometry={nodes.FlowerPot4003_1.geometry} material={textureMaterial} />
          <mesh name="FlowerPot4003_2" geometry={nodes.FlowerPot4003_2.geometry} material={textureMaterial} />
          <mesh name="FlowerPot4003_3" geometry={nodes.FlowerPot4003_3.geometry} material={textureMaterial} />
        </group>
        <group name="FlowerPot6" position={[2.282, -4.736, -3.95]} rotation={[-Math.PI, 0.867, -Math.PI]} scale={1.365}>
          <mesh name="FlowerPot6_1" geometry={nodes.FlowerPot6_1.geometry} material={textureMaterial} />
          <mesh name="FlowerPot6_2" geometry={nodes.FlowerPot6_2.geometry} material={textureMaterial} />
          <mesh name="FlowerPot6_3" geometry={nodes.FlowerPot6_3.geometry} material={textureMaterial} />
          <mesh name="FlowerPot6_4" geometry={nodes.FlowerPot6_4.geometry} material={textureMaterial} />
        </group>
        <group name="GeoSphere001" position={[4.147, -5.92, -2.042]} rotation={[-Math.PI, 1.109, -Math.PI]} scale={0.015}>
          <mesh name="GeoSphere001_1" geometry={nodes.GeoSphere001_1.geometry} material={textureMaterial} />
          <mesh name="GeoSphere001_1_1" geometry={nodes.GeoSphere001_1_1.geometry} material={textureMaterial} />
        </group>
        <group name="GeoSphere001001" position={[4.518, -4.894, 0.971]} rotation={[-Math.PI, 0.469, -Math.PI]} scale={0.007}>
          <mesh name="GeoSphere001_1001" geometry={nodes.GeoSphere001_1001.geometry} material={textureMaterial} />
          <mesh name="GeoSphere001_1001_1" geometry={nodes.GeoSphere001_1001_1.geometry} material={textureMaterial} />
        </group>
        <mesh name="HibiscusFlower_mesh001" geometry={nodes.HibiscusFlower_mesh001.geometry} material={textureMaterial} position={[4.518, -4.734, 0.971]} scale={0.024} />
        <mesh name="Plane010" geometry={nodes.Plane010.geometry} material={textureMaterial} position={[4.313, -4.597, 3.923]} rotation={[-0.487, -1.25, -1.128]} scale={0.165} />
        <mesh name="Plane011" geometry={nodes.Plane011.geometry} material={textureMaterial} position={[-3.759, -4.597, -2.913]} rotation={[-0.487, -1.25, -1.128]} scale={0.165} />
        <group name="FlowerPot2001" position={[-1.734, -3.647, -3.952]} rotation={[0, 0.635, 0]}>
          <mesh name="FlowerPot2001_1" geometry={nodes.FlowerPot2001_1.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2001_2" geometry={nodes.FlowerPot2001_2.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2001_3" geometry={nodes.FlowerPot2001_3.geometry} material={textureMaterial} />
          <mesh name="FlowerPot2001_4" geometry={nodes.FlowerPot2001_4.geometry} material={textureMaterial} />
        </group>



                    <mesh name="monitor" geometry={nodes.monitor.geometry} material={textureMaterial} position={[0.217, 7.15, -3.135]} scale={[0.081, 0.161, 0.024]} >
                  
                                        {/* <mesh position={freeQ.position} visible={false}   name="freeQ-overlay-anchor"
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
                                         jumpToSection={jumpToSection}
                                              goToSection={1.3}
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
                                          title="Free Cock Suck"
                                          description="Customize your sucking and recieve a call or email from us!"
                                          price="150-300"
                                          bgColor="bg-yellow-500"
                                src="/textures/sexyCleaning.jpeg"
                                        /></mesh> */}
{section === 0 && (
  <mesh 
    position={freeQ.position} 
    visible={true}  // Now controlled by the condition
    name="freeQ-overlay-anchor"
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
      jumpToSection={jumpToSection}
      goToSection={1.3}
      ref={freeQOverlayRef}
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
      title="Free Boopy  Suck"
      description="Customize your sucking and recieve a call or email from us!"
      price="150-300"
      bgColor="bg-yellow-500"
      src="/textures/sexyCleaning.jpeg"
    />
  </mesh>
)}
                                    <mesh
                                        position={driveway.position}  
                                        visible={false} 
                                        name="driveway-overlay-anchor"
                                      >
                                        <OverlayItem
                                          section={section}
                                              jumpToSection={jumpToSection}
                                                projectIndex={3}
                                              goToSection={1.3}

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
                                          title="Notetaking App"
                                          description="Prepare some of the deadliest notes known to mankind."
                                          price="300-600"
                                          bgColor="bg-blue-500"
                                      src="/textures/sexyCleaning.jpeg"
                                        />
                                  </mesh>
                                  <mesh position={contact.position} visible={false}   name="contact-overlay-anchor"
                                                              >
                                                                    
                                      <OverlayItem
                                        section={section}
                                        jumpToSection={jumpToSection}
                                        goToSection={3.9}    
                                        id="contactWindow"                    
                                        key="contactWindow"
                                        setActiveOverlay={setActiveOverlay}
                                        activeOverlay={activeOverlay}
                                        openOverlay={openOverlay}
                                        closeOverlay={closeOverlay}
                                        device={device}  
                                        rotation={[Math.PI / 2, -Math.PI / 2, 0]}
                                        position={[0, 0, 0]}
                                        distanceFactor={contact.distanceFactor}
                                        title="Introseduction"
                                        description="Michael Murray"
                                        price="ssn 3938 2938 298"
                                        bgColor="bg-yellow-500"
                                        src="/textures/sirmur2025.png"
                                      />

                                            </mesh>
                    </mesh>


                                                              <mesh position={balcony.position} visible={false}   name="balcony-overlay-anchor"
                                                              >
                                                                {/* [1.2, -900.1, 257.2] */}
                                                                    <OverlayItem
                                                                      section={section}
                                                                      jumpToSection={jumpToSection}
                                                                        projectIndex={2}
                                                                      goToSection={1.3}

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
                                                                        title="Gutter Cleaning"
                                                                        description="Big Fat Ass scrub"
                                                                        price="75-200"
                                                                        bgColor="bg-yellow-500"
                                                              src="/textures/sexyCleaning.jpeg"
                                                                      />
                                                                      </mesh>

                                                                      {/* INVISIBLE ANCHOR FOR DRIVEWAY OVERLAY — this is the magic */}
                                                              <mesh
                                                                position={driveway.position}  
                                                                visible={false} 
                                                                name="driveway-overlay-anchor"
                                                              >
                                                                <OverlayItem
                                                                  section={section}
                                                                      jumpToSection={jumpToSection}
                                                                        projectIndex={3}
                                                                      goToSection={1.3}

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
                                                                  title="Roof Soft Washing"
                                                                  description="Oil stains soft washed and algae removed."
                                                                  price="300-600"
                                                                  bgColor="bg-blue-500"
                                                              src="/textures/sexyCleaning.jpeg"
                                                                />
                                                              </mesh>
                                                              <mesh position={house.position} visible={false}   name="house-overlay-anchor"
                                                              >
                                                                    <OverlayItem
                                                                      section={section}
                                                                      jumpToSection={jumpToSection}
                                                                        projectIndex={1}
                                                                        goToSection={1.3}

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
                                                                        title="Seasonal Maitenance"
                                                                        description="Raking Leaves, picking cotton"
                                                                        price="250-500"
                                                                        bgColor="bg-yellow-500"
                                                              src="/textures/sexyCleaning.jpeg"
                                                                      /></mesh>
                                                                      <mesh position={car.position} visible={false}   name="car-overlay-anchor"
                                                              >
                                                                    <OverlayItem
                                                                      section={section}
                                                                      jumpToSection={jumpToSection}
                                                                        projectIndex={0}
                                                                        goToSection={1.3}

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
                                                                        title="Home Soft-Washing"
                                                                        description="We love cleaning big boy homes boi"
                                                                        price="50-300"
                                                                        bgColor="bg-yellow-500"
                                                              src="/textures/sexyCleaning.jpeg"
                                                                      /></mesh>
                                                                      
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
                                                                        title="Free Quote"
                                                                        description="Customize your quote and recieve a call or email from us!"
                                                                        price="150-300"
                                                                        bgColor="bg-yellow-500"
                                                              src="/textures/sexyCleaning.jpeg"
                                                                      /></mesh>
                          
      </group>
      </group>
    
  );
}

useGLTF.preload("models/scene.glb");




// --- PLACE AT THE VERY BOTTOM OF YOUR FILE ---
const NoteItem = ({ note, onRemove }) => {
  const [sizeLevel, setSizeLevel] = useState(0); // 0 to 3
const sizeClasses = [
    "text-lg",   // Base (Level 0)
    "text-xl",  // Level 1
    "text-2xl",  // Level 2
    "text-4xl"   // Level 3
  ];
  return (
    <div className="group relative p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-gray-700 shadow-sm text-left">
      <div className={`${sizeClasses[sizeLevel]} transition-all duration-200 break-words pr-8`}>
        {note}
      </div>

      {/* Font Size Controls */}
      <div className="absolute  flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ top: "50px", right: "5px" }}>
        {sizeLevel < 3 && (
          <button 
            onClick={() => setSizeLevel(prev => prev + 1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-yellow-400 rounded-full text-yellow-600 hover:bg-yellow-400 hover:text-white font-bold text-lg leading-none"
          >
            +
          </button>
        )}
        {sizeLevel > 0 && (
          <button 
            onClick={() => setSizeLevel(prev => prev - 1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-yellow-400 rounded-full text-yellow-600 hover:bg-yellow-400 hover:text-white font-bold text-lg leading-none"
          >
            −
          </button>
        )}
      </div>

      <button onClick={onRemove} className="text-2xl absolute top-2 right-4 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600">✕</button>
    </div>
  );
};