import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Home, Maximize, Box, Loader2 } from "lucide-react";
import type { Plant } from "@shared/schema";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Plant3DViewerProps {
  plant: Plant;
}

export default function Plant3DViewer({ plant }: Plant3DViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const plantModelRef = useRef<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load 3D plant model from GLB file
  const loadPlantModel = async (plant: Plant): Promise<THREE.Group> => {
    const loader = new GLTFLoader();
    const group = new THREE.Group();
    
    try {
      if (plant.modelUrl) {
        const gltf = await loader.loadAsync(plant.modelUrl);
        const model = gltf.scene;
        
        // Scale and position the model appropriately
        model.scale.setScalar(1);
        model.position.set(0, 0, 0);
        
        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        group.add(model);
      } else {
        // Fallback to procedural model if no GLB file
        createFallbackModel(group, plant);
      }
    } catch (error) {
      console.warn(`Failed to load 3D model for ${plant.commonName}:`, error);
      // Create fallback procedural model
      createFallbackModel(group, plant);
    }
    
    return group;
  };

  // Fallback procedural model creation
  const createFallbackModel = (group: THREE.Group, plant: Plant) => {
    if (plant.category === "Sacred" || plant.commonName.toLowerCase().includes("tulsi")) {
      createLeafyHerbModel(group);
    } else if (plant.category === "Healing" || plant.commonName.toLowerCase().includes("aloe")) {
      createSucculentModel(group);
    } else if (plant.category === "Anti-inflammatory" || plant.commonName.toLowerCase().includes("turmeric")) {
      createRootModel(group);
    } else if (plant.category === "Antibacterial" || plant.commonName.toLowerCase().includes("neem")) {
      createTreeModel(group);
    } else {
      createGenericHerbModel(group);
    }
  };

  const createLeafyHerbModel = (group: THREE.Group) => {
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
    
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.08, 2, 8);
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0;
    group.add(stem);
    
    // Create leaves
    for (let i = 0; i < 12; i++) {
      const leafGeometry = new THREE.PlaneGeometry(0.3, 0.15);
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      const angle = (i / 12) * Math.PI * 2;
      const height = 0.3 + (i * 0.15);
      
      leaf.position.x = Math.cos(angle) * 0.4;
      leaf.position.z = Math.sin(angle) * 0.4;
      leaf.position.y = height;
      leaf.rotation.y = angle;
      leaf.rotation.x = Math.PI / 2;
      
      group.add(leaf);
    }
  };

  const createSucculentModel = (group: THREE.Group) => {
    const succulentMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    
    // Create base
    const baseGeometry = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 8);
    const base = new THREE.Mesh(baseGeometry, succulentMaterial);
    base.position.y = 0.15;
    group.add(base);
    
    // Create aloe leaves
    for (let i = 0; i < 8; i++) {
      const leafGeometry = new THREE.ConeGeometry(0.15, 1.5, 6);
      const leaf = new THREE.Mesh(leafGeometry, succulentMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      leaf.position.x = Math.cos(angle) * 0.3;
      leaf.position.z = Math.sin(angle) * 0.3;
      leaf.position.y = 0.75;
      leaf.rotation.z = Math.PI / 6;
      leaf.rotation.y = angle;
      
      group.add(leaf);
    }
  };

  const createRootModel = (group: THREE.Group) => {
    const rootMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    
    // Create main root
    const rootGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8);
    const root = new THREE.Mesh(rootGeometry, rootMaterial);
    root.position.y = 0.4;
    group.add(root);
    
    // Create smaller roots
    for (let i = 0; i < 4; i++) {
      const smallRootGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.6, 6);
      const smallRoot = new THREE.Mesh(smallRootGeometry, rootMaterial);
      
      const angle = (i / 4) * Math.PI * 2;
      smallRoot.position.x = Math.cos(angle) * 0.25;
      smallRoot.position.z = Math.sin(angle) * 0.25;
      smallRoot.position.y = 0.3;
      smallRoot.rotation.z = Math.PI / 8;
      
      group.add(smallRoot);
    }
    
    // Create leaves above ground
    for (let i = 0; i < 6; i++) {
      const leafGeometry = new THREE.PlaneGeometry(0.25, 0.1);
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      const angle = (i / 6) * Math.PI * 2;
      leaf.position.x = Math.cos(angle) * 0.3;
      leaf.position.z = Math.sin(angle) * 0.3;
      leaf.position.y = 0.9;
      leaf.rotation.y = angle;
      leaf.rotation.x = Math.PI / 2;
      
      group.add(leaf);
    }
  };

  const createTreeModel = (group: THREE.Group) => {
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    
    // Create trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.75;
    group.add(trunk);
    
    // Create canopy
    const canopyGeometry = new THREE.SphereGeometry(0.8, 12, 8);
    const canopy = new THREE.Mesh(canopyGeometry, leafMaterial);
    canopy.position.y = 1.8;
    canopy.scale.y = 0.8;
    group.add(canopy);
    
    // Create branches
    for (let i = 0; i < 5; i++) {
      const branchGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.4, 6);
      const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
      
      const angle = (i / 5) * Math.PI * 2;
      branch.position.x = Math.cos(angle) * 0.4;
      branch.position.z = Math.sin(angle) * 0.4;
      branch.position.y = 1.4;
      branch.rotation.z = Math.PI / 6;
      branch.rotation.y = angle;
      
      group.add(branch);
    }
  };

  const createGenericHerbModel = (group: THREE.Group) => {
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    
    // Create main stem
    const stemGeometry = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8);
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.6;
    group.add(stem);
    
    // Create compound leaves
    for (let i = 0; i < 8; i++) {
      const leafGeometry = new THREE.PlaneGeometry(0.2, 0.08);
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const height = 0.4 + (i * 0.1);
      
      leaf.position.x = Math.cos(angle) * 0.35;
      leaf.position.z = Math.sin(angle) * 0.35;
      leaf.position.y = height;
      leaf.rotation.y = angle;
      leaf.rotation.x = Math.PI / 2;
      
      group.add(leaf);
    }
  };

  useEffect(() => {
    if (!viewerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      viewerRef.current.clientWidth / viewerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 2);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewerRef.current.clientWidth, viewerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    viewerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load plant model asynchronously
    loadPlantModel(plant).then((plantModel) => {
      plantModelRef.current = plantModel;
      scene.add(plantModel);
      setIsLoading(false);
    });

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(4, 4);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Auto-rotate the plant
      if (plantModelRef.current) {
        plantModelRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      if (plantModelRef.current) {
        plantModelRef.current.rotation.y += deltaX * 0.01;
        plantModelRef.current.rotation.x += deltaY * 0.01;
      }
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(1, Math.min(5, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (viewerRef.current && renderer.domElement) {
        viewerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [plant]);

  const handleReset = () => {
    if (plantModelRef.current && cameraRef.current) {
      plantModelRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(2, 2, 2);
    }
  };

  const handleCenter = () => {
    if (plantModelRef.current) {
      plantModelRef.current.position.set(0, 0, 0);
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen && viewerRef.current) {
      viewerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="w-full h-96 bg-gray-100 rounded-xl relative overflow-hidden">
      <div ref={viewerRef} className="w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-fresh-green mx-auto mb-2" />
              <p className="text-gray-600">Loading 3D model...</p>
            </div>
          </div>
        )}
      </div>

      {/* 3D Controls */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          className="bg-white/90 hover:bg-white shadow-lg"
          title="Reset view"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleCenter}
          className="bg-white/90 hover:bg-white shadow-lg"
          title="Center model"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleFullscreen}
          className="bg-white/90 hover:bg-white shadow-lg"
          title="Fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Model Info */}
      <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">3D Model</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg">
        <p className="text-xs text-gray-600">
          Click & drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
