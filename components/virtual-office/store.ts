import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: string
  name: string
  department: string
  position: [number, number, number]
  isAI?: boolean
  photoUrl?: string
  introduction?: string
  createdBy?: string
}

type VirtualOfficeState = {
  users: User[]
  addUser: (user: User) => void
  removeUser: (id: string) => void
  updateUserPosition: (id: string, position: [number, number, number]) => void
  fetchEveEmployees: () => Promise<void>
}

const getDepartmentPosition = (department: string): [number, number, number] => {
  switch (department) {
    case "HR":
      return [-6, 1.75, -6]
    case "IT":
      return [-2, 1.75, -6]
    case "QA":
      return [2, 1.75, -6]
    case "Line-10":
      return [6, 1.75, -6]
    case "F&A":
      return [-6, 1.75, -2]
    case "P&E CFS ENG":
      return [-2, 1.75, -2]
    case "Shave Care Operations":
      return [2, 1.75, -2]
    case "CF PS HR MFG & Purchases":
      return [6, 1.75, -2]
    case "GMDSO":
      return [-6, 1.75, 2]
    case "HS&E":
      return [-2, 1.75, 2]
    default:
      return [0, 0, 0]
  }
}

export const useVirtualOfficeStore = create<VirtualOfficeState>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      updateUserPosition: (id, position) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, position } : user)),
        })),
      fetchEveEmployees: async () => {
        // First, check localStorage for the user's created EVE
        try {
          const storedEve = localStorage.getItem("eveEmployee")
          if (storedEve) {
            try {
              const parsedEve = JSON.parse(storedEve)
              const eveId = `user-eve-${Math.random().toString(36).substring(2, 7)}`
              const position = getDepartmentPosition(parsedEve.department)

              // Add some randomness to position
              const randomOffset = [(Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2]

              const eveUser: User = {
                id: eveId,
                name: parsedEve.name,
                department: parsedEve.department,
                position: [
                  position[0] + randomOffset[0],
                  position[1] + randomOffset[1],
                  position[2] + randomOffset[2],
                ] as [number, number, number],
                isAI: true,
                photoUrl: parsedEve.photoUrl || "/placeholder.svg?height=80&width=80",
                introduction: parsedEve.introduction,
                createdBy: "current-user",
              }

              // Add the user's EVE employee to the store
              get().addUser(eveUser)
            } catch (error) {
              console.error("Error parsing stored EVE:", error)
            }
          }

          // Then, try to fetch EVE employees from the API
          try {
            const response = await fetch("http://localhost:5000/eve-employee")
            if (response.ok) {
              const data = await response.json()
              if (data.employees && data.employees.length > 0) {
                data.employees.forEach((employee) => {
                  const position = getDepartmentPosition(employee.department)
                  const randomOffset = [(Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2]

                  const eveUser: User = {
                    id: employee.id,
                    name: employee.name,
                    department: employee.department,
                    position: [
                      position[0] + randomOffset[0],
                      position[1] + randomOffset[1],
                      position[2] + randomOffset[2],
                    ] as [number, number, number],
                    isAI: employee.isAI !== undefined ? employee.isAI : true,
                    photoUrl: employee.photoUrl || "/placeholder.svg?height=80&width=80",
                    introduction: employee.introduction || "",
                    createdBy: employee.createdBy || "unknown",
                  }
                  get().addUser(eveUser)
                })
              }
            }
          } catch (error) {
            console.error("Error fetching EVE employees from API:", error)
          }

          // Add some demo EVE employees for a populated office
          const departments = [
            "HR",
            "IT",
            "QA",
            "Line-10",
            "F&A",
            "P&E CFS ENG",
            "Shave Care Operations",
            "CF PS HR MFG & Purchases",
            "GMDSO",
            "HS&E",
          ]

          // Add 10 random EVE employees
          for (let i = 0; i < 10; i++) {
            const dept = departments[Math.floor(Math.random() * departments.length)]
            const position = getDepartmentPosition(dept)

            // Add some randomness to position
            const randomOffset = [(Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2]

            const eveId = `demo-eve-${Math.random().toString(36).substring(2, 7)}`
            const eveName = `${dept} Assistant ${i + 1}`

            const eveUser: User = {
              id: eveId,
              name: eveName,
              department: dept,
              position: [
                position[0] + randomOffset[0],
                position[1] + randomOffset[1],
                position[2] + randomOffset[2],
              ] as [number, number, number],
              isAI: true,
              introduction: `I'm an AI assistant specializing in ${dept} operations. I can help with department-specific tasks and questions.`,
              createdBy: `demo-user-${Math.random().toString(36).substring(2, 7)}`,
            }

            // Add the EVE employee to the store
            get().addUser(eveUser)
          }
        } catch (error) {
          console.error("Error in fetchEveEmployees:", error)
        }
      },
    }),
    {
      name: "virtual-office-storage",
      // getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
    },
  ),
)
