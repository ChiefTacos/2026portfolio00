
import { Image, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { motion } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { atom, useAtom } from "jotai";




export const projects = [

  {
    title: "Big Beaver Betty",
    url: "#",
    image: "projects/review00.jpg",
    description: "Spend lots of time in the crevices ",
  },
  {
    title: "Sal Vulcano",
    url: "#",
    image: "projects/review01.jpg",
    description: "Made high quality charcuterie boards for a summer",
  },
  {
    title: "Next Madison SS",
    url: "#",
    image: "projects/review02.png",
    description: "Gutter cleaning, snow removal, fall cleaning",
  },
  {
    title: "Me and Johnny",
    url: "#",
    image: "projects/review03.jpg",
    description: "Worked in numerous restaurants and gained experience on the line",
  },
];




const Project = (props) => {
  const { project, highlighted, isMobile} = props;

  const background = useRef();
  const bgOpacity = useMotionValue(0.4);

  useEffect(() => {
    animate(bgOpacity, highlighted ? 0.8 : 0.4);
  }, [highlighted]);

  useFrame(() => {
    background.current.material.opacity = bgOpacity.get();
  });

  const planeSize = isMobile ? [2.5, 3.5] : [2.4, 2.7];
  const meshZ = isMobile ? 0.5 : 0.795;
  const projectY = isMobile ? 0.5 : 0.55;






  return (
    <group {...props} 
        position-y={projectY}
    >


      <mesh
        // position-z={1}
        position-z={meshZ - .005}

        // onClick={() => window.open(project.url, "_blank")}
        ref={background}
      >
        {/* <planeGeometry args={[2.8, 3]} /> */}
        <planeGeometry args={planeSize}/>

      
        <meshBasicMaterial color="black" transparent opacity={0.4} />

      </mesh>
   
    {/* 2 — DOM Styled Wrapper Overlay */}

   <Image
        scale={[2, 1.2, 1]}
        url={project.image}
        toneMapped={false}
        position-z={meshZ}

        position-y={0.5}
      />
      <Text
        maxWidth={2}
        anchorX={"left"}
        anchorY={"top"}
        fontSize={0.2}
        position-z={meshZ}

        position={[-1, -0.2, 0]}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        maxWidth={2}
        anchorX="left"
        anchorY="top"
        fontSize={0.1}
        position-z={meshZ}

        position={[-1, -0.6, 0]}
      >
        {project.description}
      </Text>



          

   
    </group>
  );
};

export const currentProjectAtom01 = atom(Math.floor(projects.length / 2));


export const GoogleReviewsPage = ({ isMobile }) => {
  const { viewport } = useThree();
  const [currentProject] = useAtom(currentProjectAtom01);



if (viewport.width > 425) {
  activeScale = 2.5; // tablet
}
if (viewport.width > 1024) {
  activeScale = 3; // laptop / large screens
}

  // Positioning / scale logic overridden by isMobile
  let activeScale = isMobile ? 2.1 : 2.4;   

  return (
    
  // <group position={[0, 1, 7]} 
  <group position={[0, 1, 7]} 

   >

      {projects.map((project, index) => (
        <motion.group
          key={"project_" + index}
          position={[index * 2.5, 0, -3]}

          animate={{
            x: 0 + (index - currentProject) * 4.5,
            y: currentProject === index ? 0 : 1.1,
            z: currentProject === index ? -2 : -1,
            // rotateX: currentProject === index ? 0 : -Math.PI / 6,
            rotateX: currentProject === index ?  -Math.PI / 6.7 : -Math.PI / 6,   // +18° when active
            rotateZ: currentProject === index ? 0 : 0.01 * Math.PI,

           scale: currentProject === index ? activeScale : 1,

          }}
          
        >
          <Project project={project} highlighted={index === currentProject} isMobile={isMobile} />
        </motion.group>
      ))}
    </group>
  );
};
