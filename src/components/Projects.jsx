import { Image, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";

import styled from 'styled-components';

const StyledWrapper = styled.div`
  .bgblue {
    background: linear-gradient(135deg, #fffffff5, #3a4b8a, #ffffff98);
    padding: 1px;
    border-radius: 1.2rem;
    box-shadow: 0px 1rem 1.5rem -0.9rem #000000e1;
    max-width: 300px;
  }

  .card {
    font-size: 1rem;
    color: #bec4cf;
    background: linear-gradient(135deg, #0d1120 0%, #3a4b8a 43%, #0d1120 100%);
    padding: 1.5rem;
        min-height: 400px;

    border-radius: 1.2rem;
  }`;





export const projects = [

  {
    title: "Auto/RV Cleaning",
    url: "#",
    image: "projects/transfer00.jpg",
    description: "Spent some time in blender creating virtual spaces",
  },
  {
    title: "House Soft Wash",
    url: "#",
    image: "projects/charcutie.jpg",
    description: "Made high quality charcuterie boards for a summer",
  },
  {
    title: "Seasonal Cleaning",
    url: "#",
    image: "projects/IMG_2889.jpg",
    description: "Gutter cleaning, snow removal, fall cleaning",
  },
  {
    title: "Driveway Restoration",
    url: "#",
    image: "projects/fancyGreenPlate.jpg",
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

export const currentProjectAtom = atom(Math.floor(projects.length / 2));

export const Projects = ({ isMobile }) => {
  const { viewport } = useThree();
  const [currentProject] = useAtom(currentProjectAtom);



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
