"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Plane,
  Sphere,
  Cylinder,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Video, MonitorIcon, Coffee, MessageSquare } from "lucide-react";
import EveAvatar from "./eve-avatar";
import { useRouter } from "next/navigation";

// Office Desk Component
function Desk({ position, rotation = [0, 0, 0], color = "#8B4513" }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk surface */}
      <Box args={[2, 0.1, 1]} position={[0, 0.75, 0]}>
        <meshLambertMaterial color={color} />
      </Box>
      {/* Desk legs */}
      <Box args={[0.1, 0.7, 0.1]} position={[-0.9, 0.35, -0.4]}>
        <meshLambertMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.7, 0.1]} position={[0.9, 0.35, -0.4]}>
        <meshLambertMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.7, 0.1]} position={[-0.9, 0.35, 0.4]}>
        <meshLambertMaterial color={color} />
      </Box>
      <Box args={[0.1, 0.7, 0.1]} position={[0.9, 0.35, 0.4]}>
        <meshLambertMaterial color={color} />
      </Box>
    </group>
  );
}

// Office Chair Component
function Chair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0, 0.5, 0]}>
        <meshLambertMaterial color="#2C2C2C" />
      </Cylinder>
      {/* Backrest */}
      <Box args={[0.5, 0.6, 0.1]} position={[0, 0.8, -0.2]}>
        <meshLambertMaterial color="#2C2C2C" />
      </Box>
      {/* Base */}
      <Cylinder args={[0.4, 0.4, 0.05, 16]} position={[0, 0.1, 0]}>
        <meshLambertMaterial color="#1C1C1C" />
      </Cylinder>
      {/* Pole */}
      <Cylinder args={[0.05, 0.05, 0.4, 8]} position={[0, 0.3, 0]}>
        <meshLambertMaterial color="#1C1C1C" />
      </Cylinder>
    </group>
  );
}

// Computer Monitor Component
function ComputerMonitor({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Screen */}
      <Box args={[0.6, 0.4, 0.05]} position={[0, 0.2, 0]}>
        <meshLambertMaterial color="#000000" />
      </Box>
      {/* Screen content */}
      <Plane args={[0.55, 0.35]} position={[0, 0.2, 0.026]}>
        <meshBasicMaterial color="#1E40AF" />
      </Plane>
      {/* Stand */}
      <Box args={[0.1, 0.2, 0.1]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#2C2C2C" />
      </Box>
      {/* Base */}
      <Box args={[0.3, 0.02, 0.2]} position={[0, -0.1, 0]}>
        <meshLambertMaterial color="#2C2C2C" />
      </Box>
    </group>
  );
}

// Coffee Machine Component
function CoffeeMachine({ position }) {
  return (
    <group position={position}>
      <Box args={[0.4, 0.6, 0.3]} position={[0, 0.3, 0]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      <Box args={[0.2, 0.1, 0.1]} position={[0, 0.4, 0.2]}>
        <meshLambertMaterial color="#000000" />
      </Box>
    </group>
  );
}

// Printer Component
function PrinterModel({ position }) {
  return (
    <group position={position}>
      <Box args={[0.5, 0.3, 0.4]} position={[0, 0.15, 0]}>
        <meshLambertMaterial color="#E5E5E5" />
      </Box>
      <Box args={[0.4, 0.05, 0.3]} position={[0, 0.32, 0]}>
        <meshLambertMaterial color="#000000" />
      </Box>
    </group>
  );
}

// Meeting Table Component
function MeetingTable({ position }) {
  return (
    <group position={position}>
      {/* Table surface */}
      <Cylinder args={[1.5, 1.5, 0.1, 16]} position={[0, 0.75, 0]}>
        <meshLambertMaterial color="#654321" />
      </Cylinder>
      {/* Table leg */}
      <Cylinder args={[0.2, 0.2, 0.7, 8]} position={[0, 0.35, 0]}>
        <meshLambertMaterial color="#654321" />
      </Cylinder>
    </group>
  );
}

// Plant Component
function Plant({ position }) {
  return (
    <group position={position}>
      {/* Pot */}
      <Cylinder args={[0.15, 0.2, 0.3, 8]} position={[0, 0.15, 0]}>
        <meshLambertMaterial color="#8B4513" />
      </Cylinder>
      {/* Plant */}
      <Sphere args={[0.3, 8, 6]} position={[0, 0.5, 0]}>
        <meshLambertMaterial color="#228B22" />
      </Sphere>
    </group>
  );
}

// Interactive Hotspot Component
function InteractiveHotspot({ position, label, icon, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.1, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshBasicMaterial
          color={hovered ? "#FFD700" : "#00BFFF"}
          transparent
          opacity={0.8}
        />
      </Sphere>
      {hovered && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.1}
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

// Department position mapping
const getDepartmentPosition = (
  department: string
): [number, number, number] => {
  const positions = {
    HR: [-4, 0, -5.5],
    IT: [0, 0, -5.5],
    QA: [4, 0, -5.5],
    Engineering: [-4, 0, -5.5],
    Marketing: [0, 0, -5.5],
    Sales: [4, 0, -5.5],
    "Human Resources": [-4, 0, -5.5],
    "F&A": [-6, 0, 1],
    GMDSO: [-6, 0, -1],
    "HS&E": [6, 0, 1],
    "Line-10": [6, 0, -1],
    "P&E CFS ENG": [-2, 0, 1],
    "Shave Care Operations": [2, 0, 1],
    "CF PS HR MFG & Purchases": [-2, 0, -1],
  };

  return (
    positions[department] || [Math.random() * 8 - 4, 0, Math.random() * 6 - 3]
  );
};

// Main Office Scene Component
function OfficeScene({ onInteraction, onEmployeeClick, employees }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 3, 8);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 4, 0]} intensity={0.6} />

      {/* Floor */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshLambertMaterial color="#F5F5F5" />
      </Plane>

      {/* Walls */}
      <Plane args={[20, 4]} position={[0, 2, -10]}>
        <meshLambertMaterial color="#E8E8E8" />
      </Plane>
      <Plane
        args={[20, 4]}
        position={[-10, 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshLambertMaterial color="#E8E8E8" />
      </Plane>

      {/* Reception Area */}
      <group>
        <Desk position={[-8, 0, -8]} rotation={[0, Math.PI / 4, 0]} />
        <Chair position={[-7.5, 0, -7.5]} rotation={[0, Math.PI / 4, 0]} />
        <ComputerMonitor
          position={[-8, 0.8, -8]}
          rotation={[0, Math.PI / 4, 0]}
        />
        <InteractiveHotspot
          position={[-8, 1.5, -8]}
          label="Reception Desk"
          icon="desk"
          onClick={() => onInteraction("reception")}
        />
      </group>

      {/* Workstation Area 1 */}
      <group>
        <Desk position={[-4, 0, -6]} />
        <Chair position={[-4, 0, -5]} />
        <ComputerMonitor position={[-4, 0.8, -6.3]} />
        <InteractiveHotspot
          position={[-4, 1.5, -6]}
          label="Development Team"
          icon="computer"
          onClick={() => onInteraction("workstation1")}
        />
      </group>

      {/* Workstation Area 2 */}
      <group>
        <Desk position={[0, 0, -6]} />
        <Chair position={[0, 0, -5]} />
        <ComputerMonitor position={[0, 0.8, -6.3]} />
        <InteractiveHotspot
          position={[0, 1.5, -6]}
          label="Design Team"
          icon="computer"
          onClick={() => onInteraction("workstation2")}
        />
      </group>

      {/* Workstation Area 3 */}
      <group>
        <Desk position={[4, 0, -6]} />
        <Chair position={[4, 0, -5]} />
        <ComputerMonitor position={[4, 0.8, -6.3]} />
        <InteractiveHotspot
          position={[4, 1.5, -6]}
          label="QA Team"
          icon="computer"
          onClick={() => onInteraction("workstation3")}
        />
      </group>

      {/* Meeting Room */}
      <group>
        <MeetingTable position={[-6, 0, 0]} />
        {/* Meeting chairs */}
        <Chair position={[-7.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        <Chair position={[-4.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Chair position={[-6, 0, 1.5]} rotation={[0, Math.PI, 0]} />
        <Chair position={[-6, 0, -1.5]} />
        <InteractiveHotspot
          position={[-6, 1.5, 0]}
          label="Meeting Room"
          icon="meeting"
          onClick={() => onInteraction("meeting")}
        />
      </group>

      {/* Break Area */}
      <group>
        <CoffeeMachine position={[6, 0, -8]} />
        <PrinterModel position={[7, 0, -8]} />
        <InteractiveHotspot
          position={[6.5, 1.5, -8]}
          label="Break Area"
          icon="coffee"
          onClick={() => onInteraction("break")}
        />
      </group>

      {/* Manager's Office */}
      <group>
        <Desk position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Chair position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <ComputerMonitor
          position={[6.3, 0.8, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        <InteractiveHotspot
          position={[6, 1.5, 0]}
          label="Manager's Office"
          icon="office"
          onClick={() => onInteraction("manager")}
        />
      </group>

      {/* EVE Employees */}
      {employees.map((employee) => {
        const position = getDepartmentPosition(employee.department);
        // Add some randomness to avoid overlapping
        const randomOffset = [
          (Math.random() - 0.5) * 2,
          0,
          (Math.random() - 0.5) * 2,
        ];
        const finalPosition: [number, number, number] = [
          position[0] + randomOffset[0],
          position[1] + randomOffset[1],
          position[2] + randomOffset[2],
        ];

        return (
          <EveAvatar
            key={employee.id}
            employee={{
              ...employee,
              position: finalPosition,
            }}
            onClick={onEmployeeClick}
          />
        );
      })}

      {/* Decorative Elements */}
      <Plant position={[-2, 0, -8]} />
      <Plant position={[2, 0, -8]} />
      <Plant position={[-8, 0, 2]} />
      <Plant position={[8, 0, 2]} />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={0.1}
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
        <p>Loading 3D Office Environment...</p>
      </div>
    </div>
  );
}

// Main Office 3D Component
export default function Office3D({ employees = [] }) {
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
    // Store the selected employee for chat
    localStorage.setItem("selectedEveForChat", JSON.stringify(employee));
    router.push("/chat-with-eve");
  };

  const getAreaInfo = (area) => {
    const areas = {
      reception: {
        title: "Reception Desk",
        description: "Main entrance and visitor check-in area",
        icon: <Users className="h-5 w-5" />,
        actions: ["Check In Visitors", "Directory", "Information"],
      },
      workstation1: {
        title: "Development Team",
        description: "Software development workstation",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Projects", "Code Review"],
      },
      workstation2: {
        title: "Design Team",
        description: "UI/UX design workstation",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Designs", "Collaborate"],
      },
      workstation3: {
        title: "QA Team",
        description: "Quality assurance workstation",
        icon: <MonitorIcon className="h-5 w-5" />,
        actions: ["Join Team", "View Tests", "Report Issues"],
      },
      meeting: {
        title: "Conference Room",
        description: "Team meetings and presentations",
        icon: <Video className="h-5 w-5" />,
        actions: ["Join Meeting", "Schedule Meeting", "View Calendar"],
      },
      break: {
        title: "Break Area",
        description: "Coffee, snacks, and casual conversations",
        icon: <Coffee className="h-5 w-5" />,
        actions: ["Get Coffee", "Chat", "Relax"],
      },
      manager: {
        title: "Manager's Office",
        description: "Private office for management meetings",
        icon: <Users className="h-5 w-5" />,
        actions: ["Schedule 1:1", "Request Meeting", "View Reports"],
      },
    };
    return areas[area] || null;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-blue-900 to-purple-900 rounded-lg overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <OfficeScene
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
          <h3 className="font-bold mb-2">Navigation Controls</h3>
          <ul className="text-sm space-y-1">
            <li>• Left click + drag: Rotate view</li>
            <li>• Right click + drag: Pan</li>
            <li>• Scroll: Zoom in/out</li>
            <li>• Click blue orbs: Interact with areas</li>
            <li>• Click avatars: Chat with EVE employees</li>
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
          className="absolute top-4 left-4 text-white hover:bg-white/20"
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
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">
                    {selectedEmployee.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-300">
                    {selectedEmployee.department}
                  </p>
                  <Badge
                    variant={selectedEmployee.isAI ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {selectedEmployee.isAI ? "AI Assistant" : "Human"}
                  </Badge>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (selectedEmployee?.id) {
                      router.push(`/chat?employeeId=${selectedEmployee.id}`);
                    } else {
                      toast({
                        title: "Please select an employee first",
                        variant: "destructive",
                      });
                    }
                  }}
                >
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

      {/* Employee Count Display */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white">
        <h4 className="text-sm font-bold mb-2">Office Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Total Employees:</span>
            <span>{employees.length}</span>
          </div>
          <div className="flex justify-between">
            <span>AI Assistants:</span>
            <span>{employees.filter((emp) => emp.isAI).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Human Staff:</span>
            <span>{employees.filter((emp) => !emp.isAI).length}</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          {employees.length} Online
        </Badge>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          Virtual Office
        </Badge>
      </div>
    </div>
  );
}
