"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import type * as THREE from "three";

interface EveAvatarProps {
  employee: {
    id: string;
    name: string;
    department: string;
    position: [number, number, number];
    isAI?: boolean;
    status?: string;
    photoUrl?: string;
  };
  onClick: (employee: any) => void;
}

export default function EveAvatarPixel({ employee, onClick }: EveAvatarProps) {
  const groupRef = useRef<THREE.Group>();
  const labelRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);
  const [bobOffset] = useState(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.elapsedTime + bobOffset;
    if (groupRef.current) {
      groupRef.current.position.y =
        employee.position[1] + Math.sin(time) * 0.02;
      if (hovered) {
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.1;
      }
    }
    if (labelRef.current) {
      labelRef.current.position.y =
        employee.position[1] + 1.3 + Math.sin(time) * 0.02;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22C55E";
      case "away":
        return "#F59E0B";
      case "busy":
        return "#EF4444";
      case "inMeeting":
        return "#8B5CF6";
      default:
        return "#22C55E";
    }
  };

  const getAvatarColor = (isAI: boolean) => {
    return isAI ? "#3B82F6" : "#10B981";
  };

  return (
    <>
      {/* شخصية الموظف */}
      <group
        ref={groupRef}
        position={[
          employee.position[0],
          employee.position[1] + 0.5,
          employee.position[2],
        ]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(employee)}
      >
        {/* الجسم */}
        <Box args={[0.3, 0.6, 0.2]} position={[0, 0.3, 0]}>
          <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
        </Box>

        {/* الرأس */}
        <Box args={[0.25, 0.25, 0.2]} position={[0, 0.7, 0]}>
          <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
        </Box>

        {/* العيون */}
        <Box args={[0.04, 0.04, 0.05]} position={[-0.06, 0.72, 0.1]}>
          <meshBasicMaterial color="#000000" />
        </Box>
        <Box args={[0.04, 0.04, 0.05]} position={[0.06, 0.72, 0.1]}>
          <meshBasicMaterial color="#000000" />
        </Box>

        {/* الأرجل */}
        <Box args={[0.1, 0.3, 0.1]} position={[-0.08, 0.05, 0]}>
          <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
        </Box>
        <Box args={[0.1, 0.3, 0.1]} position={[0.08, 0.05, 0]}>
          <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
        </Box>

        {/* مؤشر الحالة */}
        <Box args={[0.08, 0.08, 0.05]} position={[0.2, 0.8, 0]}>
          <meshBasicMaterial
            color={getStatusColor(employee.status || "online")}
          />
        </Box>

        {/* شارة AI */}
        {employee.isAI && (
          <Box args={[0.15, 0.05, 0.02]} position={[0, 0.1, 0.15]}>
            <meshBasicMaterial color="#FFD700" />
          </Box>
        )}

        {/* تأثير اللمعة */}
        {hovered && (
          <Box args={[0.6, 0.02, 0.6]} position={[0, 0.01, 0]}>
            <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
          </Box>
        )}
      </group>

      {/* بيانات الموظف عند الـ Hover */}
      {hovered && (
        <group
          ref={labelRef}
          position={[
            employee.position[0],
            employee.position[1] + 1.5,
            employee.position[2],
          ]}
        >
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.14}
            maxWidth={1}
            lineHeight={1}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.004}
            outlineColor="black"
          >
            {employee.name}
          </Text>
          <Text
            position={[0, 0.2, 0]}
            fontSize={0.09}
            maxWidth={1}
            lineHeight={1}
            color="#CCCCCC"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.003}
            outlineColor="black"
          >
            {employee.department}
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.07}
            color={getStatusColor(employee.status || "online")}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="black"
          >
            {employee.isAI ? "AI" : "Human"} • {employee.status || "online"}
          </Text>
        </group>
      )}
    </>
  );
}
