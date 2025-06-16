"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Video, MonitorIcon, Coffee, MessageSquare } from "lucide-react";
import EveAvatar from "./eve-avatar-pixel";
import { useRouter } from "next/navigation";

// Pixel-style colors matching the reference image
const COLORS = {
  floor: "#D4C4A8", // Beige tile color
  wall: "#B8A888",
  desk: "#8B4513", // Brown desk color
  deskAlt: "#CD853F", // Orange desk color
  chair: "#654321",
  computer: "#2F2F2F",
  screen: "#4169E1",
  plant: "#228B22",
  pot: "#8B4513",
  meeting: "#A0522D",
  equipment: "#696969",
};

// Floor Tile Component (matching pixel art style)
function FloorTile({ position, size = [1, 0.1, 1] }) {
  return (
    <Box args={size} position={position}>
      <meshLambertMaterial color={COLORS.floor} />
    </Box>
  );
}

// Pixel-style Desk Component
function PixelDesk({
  position,
  rotation = [0, 0, 0],
  color = COLORS.desk,
  type = "standard",
}) {
  const deskColor = type === "orange" ? COLORS.deskAlt : color;

  return (
    <group position={position} rotation={rotation}>
      {/* Main desk surface */}
      <Box args={[2, 0.15, 1.2]} position={[0, 0.75, 0]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
      {/* Desk support */}
      <Box args={[1.8, 0.6, 1]} position={[0, 0.4, 0]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
      {/* Desk legs */}
      <Box args={[0.15, 0.7, 0.15]} position={[-0.8, 0.35, -0.4]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
      <Box args={[0.15, 0.7, 0.15]} position={[0.8, 0.35, -0.4]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
      <Box args={[0.15, 0.7, 0.15]} position={[-0.8, 0.35, 0.4]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
      <Box args={[0.15, 0.7, 0.15]} position={[0.8, 0.35, 0.4]}>
        <meshLambertMaterial color={deskColor} />
      </Box>
    </group>
  );
}

// Pixel-style Chair Component
function PixelChair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.5, 0]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
      {/* Backrest */}
      <Box args={[0.5, 0.6, 0.1]} position={[0, 0.8, -0.2]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
      {/* Chair legs */}
      <Box args={[0.1, 0.5, 0.1]} position={[-0.2, 0.25, -0.2]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[0.2, 0.25, -0.2]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[-0.2, 0.25, 0.2]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} position={[0.2, 0.25, 0.2]}>
        <meshLambertMaterial color={COLORS.chair} />
      </Box>
    </group>
  );
}

// Pixel-style Computer Monitor
function PixelMonitor({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Monitor frame */}
      <Box args={[0.7, 0.5, 0.1]} position={[0, 0.25, 0]}>
        <meshLambertMaterial color={COLORS.computer} />
      </Box>
      {/* Screen */}
      <Box args={[0.6, 0.4, 0.05]} position={[0, 0.25, 0.05]}>
        <meshBasicMaterial color={COLORS.screen} />
      </Box>
      {/* Stand */}
      <Box args={[0.15, 0.3, 0.15]} position={[0, -0.05, 0]}>
        <meshLambertMaterial color={COLORS.computer} />
      </Box>
      {/* Base */}
      <Box args={[0.4, 0.05, 0.3]} position={[0, -0.2, 0]}>
        <meshLambertMaterial color={COLORS.computer} />
      </Box>
    </group>
  );
}

// Pixel-style Plant
function PixelPlant({ position, size = "small" }) {
  const plantSize = size === "large" ? 0.4 : 0.25;
  const potSize = size === "large" ? [0.2, 0.3, 0.2] : [0.15, 0.2, 0.15];

  return (
    <group position={position}>
      {/* Pot */}
      <Box args={potSize} position={[0, potSize[1] / 2, 0]}>
        <meshLambertMaterial color={COLORS.pot} />
      </Box>
      {/* Plant leaves */}
      <Box
        args={[plantSize, plantSize, plantSize]}
        position={[0, potSize[1] + plantSize / 2, 0]}
      >
        <meshLambertMaterial color={COLORS.plant} />
      </Box>
    </group>
  );
}

// Meeting Table (rectangular, pixel style)
function PixelMeetingTable({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Table surface */}
      <Box args={[3, 0.15, 2]} position={[0, 0.75, 0]}>
        <meshLambertMaterial color={COLORS.meeting} />
      </Box>
      {/* Table legs */}
      <Box args={[0.2, 0.7, 0.2]} position={[-1.2, 0.35, -0.8]}>
        <meshLambertMaterial color={COLORS.meeting} />
      </Box>
      <Box args={[0.2, 0.7, 0.2]} position={[1.2, 0.35, -0.8]}>
        <meshLambertMaterial color={COLORS.meeting} />
      </Box>
      <Box args={[0.2, 0.7, 0.2]} position={[-1.2, 0.35, 0.8]}>
        <meshLambertMaterial color={COLORS.meeting} />
      </Box>
      <Box args={[0.2, 0.7, 0.2]} position={[1.2, 0.35, 0.8]}>
        <meshLambertMaterial color={COLORS.meeting} />
      </Box>
    </group>
  );
}

// Office Equipment (printer, etc.)
function OfficeEquipment({ position, type = "printer" }) {
  if (type === "printer") {
    return (
      <group position={position}>
        <Box args={[0.6, 0.4, 0.5]} position={[0, 0.2, 0]}>
          <meshLambertMaterial color={COLORS.equipment} />
        </Box>
        <Box args={[0.5, 0.1, 0.4]} position={[0, 0.42, 0]}>
          <meshLambertMaterial color="#FFFFFF" />
        </Box>
      </group>
    );
  }

  // Coffee machine
  return (
    <group position={position}>
      <Box args={[0.4, 0.7, 0.4]} position={[0, 0.35, 0]}>
        <meshLambertMaterial color={COLORS.equipment} />
      </Box>
      <Box args={[0.2, 0.15, 0.15]} position={[0, 0.5, 0.2]}>
        <meshLambertMaterial color="#000000" />
      </Box>
    </group>
  );
}

// Water Cooler
function WaterCooler({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <Box args={[0.4, 0.8, 0.4]} position={[0, 0.4, 0]}>
        <meshLambertMaterial color="#FFFFFF" />
      </Box>
      {/* Water bottle */}
      <Cylinder args={[0.15, 0.15, 0.4, 8]} position={[0, 1, 0]}>
        <meshLambertMaterial color="#87CEEB" />
      </Cylinder>
    </group>
  );
}

// Interactive Hotspot (smaller, more subtle)
function PixelHotspot({ position, label, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.15, 0.15, 0.15]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshBasicMaterial
          color={hovered ? "#FFD700" : "#00BFFF"}
          transparent
          opacity={0.7}
        />
      </Box>
      {hovered && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          billboard
        >
          {label}
        </Text>
      )}
    </group>
  );
}

// Main Office Scene matching the pixel art layout
function PixelOfficeScene({ onInteraction, onEmployeeClick, employees }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 8, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting setup for pixel art style */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.4} />

      {/* Floor tiles in a grid pattern */}
      {Array.from({ length: 20 }, (_, x) =>
        Array.from({ length: 20 }, (_, z) => (
          <FloorTile key={`${x}-${z}`} position={[x - 10, 0, z - 10]} />
        ))
      )}

      {/* Walls */}
      <Box args={[20, 3, 0.2]} position={[0, 1.5, -10]}>
        <meshLambertMaterial color={COLORS.wall} />
      </Box>
      <Box args={[0.2, 3, 20]} position={[-10, 1.5, 0]}>
        <meshLambertMaterial color={COLORS.wall} />
      </Box>
      <Box args={[20, 3, 0.2]} position={[0, 1.5, 10]}>
        <meshLambertMaterial color={COLORS.wall} />
      </Box>
      <Box args={[0.2, 3, 20]} position={[10, 1.5, 0]}>
        <meshLambertMaterial color={COLORS.wall} />
      </Box>

      {/* Main work area - Left side desks (brown) */}
      <PixelDesk position={[-6, 0, -4]} rotation={[0, 0, 0]} />
      <PixelChair position={[-6, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[-6, 0.9, -4.3]} />

      <PixelDesk position={[-3, 0, -4]} rotation={[0, 0, 0]} />
      <PixelChair position={[-3, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[-3, 0.9, -4.3]} />

      {/* Center work area - Orange desks */}
      <PixelDesk position={[0, 0, -4]} rotation={[0, 0, 0]} type="orange" />
      <PixelChair position={[0, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[0, 0.9, -4.3]} />

      <PixelDesk position={[3, 0, -4]} rotation={[0, 0, 0]} type="orange" />
      <PixelChair position={[3, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[3, 0.9, -4.3]} />

      {/* Right side desk */}
      <PixelDesk position={[6, 0, -4]} rotation={[0, 0, 0]} />
      <PixelChair position={[6, 0, -2.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[6, 0.9, -4.3]} />

      {/* Meeting room area (bottom right) */}
      <PixelMeetingTable position={[5, 0, 4]} />
      <PixelChair position={[3.5, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
      <PixelChair position={[6.5, 0, 3]} rotation={[0, -Math.PI / 2, 0]} />
      <PixelChair position={[3.5, 0, 5]} rotation={[0, Math.PI / 2, 0]} />
      <PixelChair position={[6.5, 0, 5]} rotation={[0, -Math.PI / 2, 0]} />
      <PixelChair position={[5, 0, 2.2]} rotation={[0, 0, 0]} />
      <PixelChair position={[5, 0, 5.8]} rotation={[0, Math.PI, 0]} />

      {/* Break area (top right) */}
      <OfficeEquipment position={[7, 0, -7]} type="coffee" />
      <OfficeEquipment position={[8, 0, -6]} type="printer" />
      <WaterCooler position={[8, 0, -8]} />

      {/* Reception area (top left) */}
      <PixelDesk position={[-7, 0, -7]} rotation={[0, Math.PI / 4, 0]} />
      <PixelChair position={[-6.3, 0, -6.3]} rotation={[0, Math.PI / 4, 0]} />
      <PixelMonitor
        position={[-7.3, 0.9, -7.3]}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* Additional workstations */}
      <PixelDesk position={[-6, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
      <PixelChair position={[-4.5, 0, 2]} rotation={[0, -Math.PI / 2, 0]} />
      <PixelMonitor position={[-6.3, 0.9, 2]} rotation={[0, Math.PI / 2, 0]} />

      <PixelDesk position={[-2, 0, 6]} rotation={[0, 0, 0]} />
      <PixelChair position={[-2, 0, 7.5]} rotation={[0, Math.PI, 0]} />
      <PixelMonitor position={[-2, 0.9, 5.7]} />

      {/* Plants and decorations */}
      <PixelPlant position={[-8, 0, -2]} size="large" />
      <PixelPlant position={[8, 0, -2]} size="large" />
      <PixelPlant position={[-1, 0, -7]} size="small" />
      <PixelPlant position={[1, 0, -7]} size="small" />
      <PixelPlant position={[-4, 0, 8]} size="small" />
      <PixelPlant position={[2, 0, 8]} size="small" />

      {/* Interactive hotspots */}
      <PixelHotspot
        position={[-6, 1.5, -4]}
        label="Development Team"
        onClick={() => onInteraction("dev")}
      />
      <PixelHotspot
        position={[0, 1.5, -4]}
        label="Design Team"
        onClick={() => onInteraction("design")}
      />
      <PixelHotspot
        position={[6, 1.5, -4]}
        label="QA Team"
        onClick={() => onInteraction("qa")}
      />
      <PixelHotspot
        position={[5, 1.5, 4]}
        label="Meeting Room"
        onClick={() => onInteraction("meeting")}
      />
      <PixelHotspot
        position={[7.5, 1.5, -7]}
        label="Break Area"
        onClick={() => onInteraction("break")}
      />
      <PixelHotspot
        position={[-7, 1.5, -7]}
        label="Reception"
        onClick={() => onInteraction("reception")}
      />

      {/* EVE Employees positioned throughout the office */}
      {employees.map((employee, index) => {
        // Position employees at different workstations based on their department
        const positions = [
          [-6, 0, -2], // Dev area
          [-3, 0, -2], // Dev area
          [0, 0, -2], // Design area
          [3, 0, -2], // Design area
          [6, 0, -2], // QA area
          [-4.5, 0, 2], // Side workstation
          [-2, 0, 7.5], // Back workstation
          [4, 0, 3], // Meeting area
          [6, 0, 5], // Meeting area
          [-6.3, 0, -6.3], // Reception
        ];

        const position = positions[index % positions.length] || [0, 0, 0];

        return (
          <EveAvatar
            key={employee.id}
            employee={{
              ...employee,
              position: [position[0], position[1], position[2]],
            }}
            onClick={onEmployeeClick}
          />
        );
      })}

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={0.2}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Loading Component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading Pixel Office Environment...</p>
      </div>
    </div>
  );
}

// Main Office 3D Component
export default function Office3DRedesigned({ employees = [] }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const router = useRouter();

  const handleInteraction = (area) => {
    setSelectedArea(area);
    setSelectedEmployee(null);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedArea(null);
  };

  const handleChatWithEmployee = (employee) => {
    localStorage.setItem("selectedEveForChat", JSON.stringify(employee));
    router.push("/chat-with-eve");
  };

  const getAreaInfo = (area) => {
    const areas = {
      dev: {
        title: "Development Team",
        description: "Software development workstations with brown desks",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Projects", "Code Review"],
      },
      design: {
        title: "Design Team",
        description: "UI/UX design workstations with orange desks",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Designs", "Collaborate"],
      },
      qa: {
        title: "QA Team",
        description: "Quality assurance workstation",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Tests", "Report Issues"],
      },
      meeting: {
        title: "Meeting Room",
        description: "Conference room for team meetings",
        // icon: <Video className="h-5 w-5" />,
        actions: ["Join Meeting", "Schedule Meeting", "View Calendar"],
      },
      break: {
        title: "Break Area",
        description: "Coffee, water cooler, and printer area",
        icon: <Coffee className="h-5 w-5" />,
        actions: ["Get Coffee", "Print Documents", "Take a Break"],
      },
      reception: {
        title: "Reception",
        description: "Main entrance and information desk",
        icon: <Users className="h-5 w-5" />,
        actions: ["Check In", "Get Information", "Directory"],
      },
    };
    return areas[area] || null;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-amber-100 to-orange-200 rounded-lg overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 8], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <PixelOfficeScene
            onInteraction={handleInteraction}
            onEmployeeClick={handleEmployeeClick}
            employees={employees}
          />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      <Suspense fallback={<LoadingScreen />}>
        <div />
      </Suspense>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
          <h3 className="font-bold mb-2">Pixel Office Controls</h3>
          <ul className="text-sm space-y-1">
            <li>• Left click + drag: Rotate view</li>
            <li>• Right click + drag: Pan around</li>
            <li>• Scroll: Zoom in/out</li>
            <li>• Click blue cubes: Interact with areas</li>
            <li>• Click employees: Start conversation</li>
          </ul>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 text-white hover:bg-white/20"
            onClick={() => setShowControls(false)}
          >
            Hide Controls
          </Button>
        </div>
      )}

      {/* Show Controls Button */}
      {!showControls && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-4 left-4 text-white hover:bg-white/20 bg-black/50"
          onClick={() => setShowControls(true)}
        >
          Show Controls
        </Button>
      )}

      {/* Employee Information Panel */}
      {selectedEmployee && (
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white max-w-sm">
          <Card className="bg-transparent border-none">
            <CardContent className="p-0">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {selectedEmployee.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-300">
                    {selectedEmployee.department}
                  </p>
                </div>
              </div>

              {selectedEmployee.introduction && (
                <p className="text-sm text-gray-300 mb-3">
                  {selectedEmployee.introduction}
                </p>
              )}
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  onClick={() => {
                    if (selectedEmployee?.id) {
                      router.push(`/chat?employeeId=${selectedEmployee.id}`);
                    } else {
                      toast({
                        title: "No employee selected",
                        description:
                          "Please choose an employee to start a chat.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="mt-2 text-gray-400 hover:bg-white/20"
                onClick={() => setSelectedEmployee(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Area Information Panel */}
      {selectedArea && (
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white max-w-sm">
          <Card className="bg-transparent border-none">
            <CardContent className="p-0">
              <div className="flex items-center mb-2">
                {getAreaInfo(selectedArea)?.icon}
                <h3 className="font-bold ml-2">
                  {getAreaInfo(selectedArea)?.title}
                </h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                {getAreaInfo(selectedArea)?.description}
              </p>
              <div className="space-y-2">
                {getAreaInfo(selectedArea)?.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="w-full text-white border-white/30 hover:bg-white/20"
                  >
                    {action}
                  </Button>
                ))}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 text-gray-400 hover:bg-white/20"
                onClick={() => setSelectedArea(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Office Map Legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white">
        <h4 className="text-sm font-bold mb-2">Office Layout</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-600 rounded mr-2"></div>
            <span>Brown Desks - Dev Team</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span>Orange Desks - Design Team</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Plants & Decoration</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Interactive Areas</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="text-xs">Employees: {employees.length}</div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
          Pixel Office Active
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          {employees.length} Employees Online
        </Badge>
      </div>
    </div>
  );
}
