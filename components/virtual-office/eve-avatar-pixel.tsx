"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Box } from "@react-three/drei"
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

export default function EveAvatarPixel({ employee, onClick }: EveAvatarProps) {
  const groupRef = useRef<THREE.Group>()
  const [hovered, setHovered] = useState(false)
  const [bobOffset] = useState(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing animation
      groupRef.current.position.y = employee.position[1] + Math.sin(state.clock.elapsedTime + bobOffset) * 0.02

      // Gentle rotation when hovered
      if (hovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
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
        return "#22C55E"
    }
  }

  const getAvatarColor = (isAI: boolean) => {
    return isAI ? "#3B82F6" : "#10B981"
  }

  return (
    <group
      ref={groupRef}
      position={[employee.position[0], employee.position[1] + 0.5, employee.position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(employee)}
    >
      {/* Pixel-style body */}
      <Box args={[0.3, 0.6, 0.2]} position={[0, 0.3, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Box>

      {/* Pixel-style head */}
      <Box args={[0.25, 0.25, 0.2]} position={[0, 0.7, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Box>

      {/* Simple pixel eyes */}
      <Box args={[0.04, 0.04, 0.05]} position={[-0.06, 0.72, 0.1]}>
        <meshBasicMaterial color="#000000" />
      </Box>
      <Box args={[0.04, 0.04, 0.05]} position={[0.06, 0.72, 0.1]}>
        <meshBasicMaterial color="#000000" />
      </Box>

      {/* Pixel-style legs */}
      <Box args={[0.1, 0.3, 0.1]} position={[-0.08, 0.05, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Box>
      <Box args={[0.1, 0.3, 0.1]} position={[0.08, 0.05, 0]}>
        <meshLambertMaterial color={getAvatarColor(employee.isAI)} />
      </Box>

      {/* Status indicator */}
      <Box args={[0.08, 0.08, 0.05]} position={[0.2, 0.8, 0]}>
        <meshBasicMaterial color={getStatusColor(employee.status || "online")} />
      </Box>

      {/* AI Badge (if AI employee) */}
      {employee.isAI && (
        <Box args={[0.15, 0.05, 0.02]} position={[0, 0.1, 0.15]}>
          <meshBasicMaterial color="#FFD700" />
        </Box>
      )}

      {/* Name Label (appears when hovered) */}
      {hovered && (
        <group>
          <Text position={[0, 1.2, 0]} fontSize={0.12} color="white" anchorX="center" anchorY="middle" billboard>
            {employee.name}
          </Text>
          <Text position={[0, 1.05, 0]} fontSize={0.08} color="#CCCCCC" anchorX="center" anchorY="middle" billboard>
            {employee.department}
          </Text>
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.06}
            color={getStatusColor(employee.status || "online")}
            anchorX="center"
            anchorY="middle"
            billboard
          >
            {employee.isAI ? "AI" : "Human"} • {employee.status || "online"}
          </Text>
        </group>
      )}

      {/* Interaction Glow Effect */}
      {hovered && (
        <Box args={[0.6, 0.02, 0.6]} position={[0, 0.01, 0]}>
          <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
        </Box>
      )}
    </group>
  )
}
