"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Cylinder, Sphere, Box } from "@react-three/drei"
import type * as THREE from "three"

interface EveAvatarProps {
  employee: {
    id: string
    name: string
    department: string
    position: [number, number, number]
    isAI?: boolean
    status?: string
    photoUrl?: string
  }
  onClick: (employee: any) => void
}

export default function EveAvatar({ employee, onClick }: EveAvatarProps) {
  const groupRef = useRef<THREE.Group>()
  const [hovered, setHovered] = useState(false)
  const [bobOffset] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing animation
      groupRef.current.position.y = employee.position[1] + Math.sin(state.clock.elapsedTime + bobOffset) * 0.05

      // Gentle rotation when hovered
      if (hovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#22C55E"
      case "away":
        return "#F59E0B"
      case "busy":
        return "#EF4444"
      case "inMeeting":
        return "#8B5CF6"
      default:
        return "#6B7280"
    }
  }

  const getAvatarColor = (isAI: boolean) => {
    return isAI ? "#3B82F6" : "#10B981"
  }

  return (
    <group
      ref={groupRef}
      position={[employee.position[0], employee.position[1], employee.position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(employee)}
    >
      {/* Main Avatar Body */}
      <Cylinder args={[0.2, 0.3, 1.2, 8]} position={[0, 0.6, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Cylinder>

      {/* Head */}
      <Sphere args={[0.25, 16, 16]} position={[0, 1.4, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Sphere>

      {/* Face (simple eyes and smile) */}
      <Sphere args={[0.03, 8, 8]} position={[-0.08, 1.45, 0.2]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.03, 8, 8]} position={[0.08, 1.45, 0.2]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>

      {/* Status Indicator */}
      <Sphere args={[0.08, 16, 16]} position={[0.3, 1.5, 0]}>
        <meshBasicMaterial color={getStatusColor(employee.status || "online")} />
      </Sphere>

      {/* AI Badge (if AI employee) */}
      {employee.isAI && (
        <Box args={[0.3, 0.1, 0.05]} position={[0, 0.2, 0.3]}>
          <meshBasicMaterial color="#FFD700" />
        </Box>
      )}

      {/* Name Label (appears when hovered) */}
      {hovered && (
        <group>
          <Text position={[0, 2, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle" billboard>
            {employee.name}
          </Text>
          <Text position={[0, 1.8, 0]} fontSize={0.1} color="#CCCCCC" anchorX="center" anchorY="middle" billboard>
            {employee.department}
          </Text>
          <Text
            position={[0, 1.6, 0]}
            fontSize={0.08}
            color={getStatusColor(employee.status || "online")}
            anchorX="center"
            anchorY="middle"
            billboard
          >
            {employee.isAI ? "AI Assistant" : "Human"} • {employee.status || "online"}
          </Text>
        </group>
      )}

      {/* Interaction Glow Effect */}
      {hovered && (
        <Cylinder args={[0.5, 0.5, 0.02, 16]} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
        </Cylinder>
      )}
    </group>
  )
}
