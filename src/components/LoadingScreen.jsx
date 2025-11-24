import React, { useEffect } from "react";
import styled from "styled-components";
import { useProgress } from "@react-three/drei";

export const LoadingScreen = ({ started, setStarted }) => {
  const { progress, total, loaded, item } = useProgress();

  useEffect(() => {
    console.log(progress, total, loaded, item);
    if (progress === 100) {
      setTimeout(() => setStarted(true), 500);
    }
  }, [progress, total, loaded, item]);

  return (
    <StyledWrapper
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-900 pointer-events-none flex items-center justify-center
      ${started ? "opacity-0" : "opacity-100"}`}
    >
      {/* LOGO FADES IN BASED ON LOADING PROGRESS */}
      <div className="absolute w-full h-full flex items-center justify-center">
        <img
          src="/logo.png"
          alt="SIRMUR Logo"
          className="w-full h-full object-contain transition-opacity duration-800"
          style={{ opacity: progress / 100 }}
        />
      </div>

      {/* NEW 3D RING LOADER (CENTERED) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="loader">
          <div className="load-inner load-one" />
          <div className="load-inner load-two" />
          <div className="load-inner load-three" />
          <span className="text">Loading...</span>
        </div>
      </div>

      {/* BOTTOM TEXT AREA */}
      <div
        className="
          text-white md:text-2xl text-xl font-medium tracking-wider 
          pointer-events-auto absolute bottom-0 left-0 right-0 
          flex justify-center mb-4
        "
      >
        <span className="pr-6">Hours of Operation = 8am - 6pm</span>
        <a href="tel:1-262-230-5182">Reach us @ +1 262-230-5182</a>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  background-color: #000;

  .loader {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    perspective: 780px;
  }

  .text {
    font-size: 20px;
    font-weight: 700;
    color: #cecece;
    z-index: 10;
  }

  .load-inner {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .load-inner.load-one {
    border-bottom: 3px solid #5c5edc;
    animation: rotate1 1.15s linear infinite;
  }

  .load-inner.load-two {
    border-right: 3px solid #9147ff;
    animation: rotate2 1.15s 0.1s linear infinite;
  }

  .load-inner.load-three {
    border-top: 3px solid #3b82f6;
    animation: rotate3 1.15s 0.15s linear infinite;
  }

  @keyframes rotate1 {
    0% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg); }
    100% { transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg); }
  }
  @keyframes rotate2 {
    0% { transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg); }
    100% { transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg); }
  }
  @keyframes rotate3 {
    0% { transform: rotateX(-60deg) rotateY(0deg) rotateZ(0deg); }
    100% { transform: rotateX(-60deg) rotateY(0deg) rotateZ(360deg); }
  }
`;


// import { useProgress } from "@react-three/drei";
// import { useEffect } from "react";

// export const LoadingScreen = ({ started, setStarted }) => {
//   const { progress, total, loaded, item } = useProgress();

//   useEffect(() => {
//     console.log(progress, total, loaded, item);
//     if (progress === 100) {
//       setTimeout(() => {
//         setStarted(true);
//       }, 500);
//     }
//   }, [progress, total, loaded, item]);

//   return (
//     <div
//       className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-900 pointer-events-none flex items-center justify-center
//     ${started ? "opacity-0" : "opacity-100"}`}
//       style={{
//         backgroundColor: "#000000",
//       }}
//     >
//       {/* Logo Container */}
//       <div className="absolute w-full h-full flex items-center justify-center">
//         <img
//           src="/logo.png" // <-- replace with your actual image path
//           alt="SIRMUR Logo"
//           className="w-full h-full  object-contain transition-opacity duration-800 mb-10 "
//           style={{
//             opacity: progress / 100, // fades in smoothly
//           }}
//         />
              
//       </div>
//       <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-[120px]"> 
       
//              {/* 💬 Dot-dot-dot loading text */}
//             <div className=" text-white md:text-4xl text-3xl font-medium tracking-wider">
//                loading
//               <span className="text-4xl inline-block animate-dots">.</span>
//             </div>
            
//         </div>
//         <div 
//             className="
//               text-white md:text-2xl text-xl font-medium tracking-wider 
//               pointer-events-auto absolute bottom-0 left-0 right-0 
//               flex justify-center mb-4
//             "
//             >
//                     <span className="pr-6">                Hours of Operation = 8am - 6pm  </span>
//               <a href="tel:1-262-230-5182">
//                 Reach us @ +1 262-230-5182
//               </a>
              
//         </div>
//            {/* Dot animation styles */}
//       <style>{`
//         @keyframes dots {
//           0%, 20% { content: ".."; }
//           40% { content: "..."; }
//           60% { content: "..."; }
//           80%, 100% { content: "...."; }
//         }
//         .animate-dots::after {
//           content: ".....";
//           animation: dots 3s steps(1, end) 2;
//         }
//       `}</style>
//     </div>
//   );
// };
