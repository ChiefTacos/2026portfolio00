
import { useGLTF, useTexture, useVideoTexture, useAnimations, MeshTransmissionMaterial, Html  } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";



function GlassComponent({ geometry, position, rotation, scale }) {

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={scale}>
      {/* The black frame overlay */}

      {/* <MeshTransmissionMaterial
        color="#e0f7ff"
        transmission={1}
        roughness={0.1}
        thickness={0.4}
        chromaticAberration={0.02}
      /> */}
            {/* The black frame overlay */}

       <MeshTransmissionMaterial
          color="#444444"               // dark gray-blue tone (lighter than #222)
          transmission={0.9}            // more light passes through (less opaque)
          roughness={0.55}              // moderate softness
          thickness={0.5}               // still has density
          ior={1.3}                     // slightly softer reflections
          anisotropy={0.05}
          chromaticAberration={0.005}
        />
    </mesh>
  );
}

export function RVmodel(props) {
   const { section } = props;
   const group = useRef();
   const { nodes, materials, animations } = useGLTF("models/rv.glb");
   const texture = useTexture("textures/scene.jpg");
   const textureVSCode = useVideoTexture("textures/vscode.mp4");
   const { actions, mixer } = useAnimations(animations, group);
 
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
     console.log(actions);
  
    }, [section]);
 
 
 
   useFrame(() => {
     textureMaterial.opacity = textureOpacity.get();
     textureGlassMaterial.opacity = glassTextureOpacity.get();
   });
 const ZoomCamera = ({ isFirstSlide }) => {
   const { camera } = useThree();
 
   useFrame(() => {
     camera.position.z = isFirstSlide ? 34 : 10;
     camera.updateProjectionMatrix();
   });
 
   return null;
 };
   return (
        <group {...props} dispose={null} position={[-5, -3.9, 11.4]}  rotation={[0, 20.4, 0.02]} scale={1.27}>

       <group position={[2.776, 1.636, -1.041]} rotation={[-Math.PI / 2, 0, 0.456]} scale={[82.042, 84.582, 82.042]}>
       <GlassComponent
        geometry={nodes.Cube016_3.geometry}
        scale={1}
       />
        <mesh geometry={nodes.Cube016_1.geometry} material={materials['Material.018']} />
        <mesh geometry={nodes.Cube016_2.geometry} material={materials['Material.012']} />
        {/* <mesh geometry={nodes.Cube016_3.geometry} material={materials['Material.013']} /> */}
        <mesh geometry={nodes.Cube016_4.geometry} material={materials['Material.021']} />
        <mesh geometry={nodes.Cube016_5.geometry} material={materials['Material.014']} />
        <mesh geometry={nodes.Cube016_6.geometry} material={materials['Material.020']} />
        <mesh geometry={nodes.Cube016_7.geometry} material={materials['Material.015']} />
        <mesh geometry={nodes.Cube016_8.geometry} material={materials['Material.017']} />
    </group>
    </group>

  )
}

useGLTF.preload('models/rv.glb')
