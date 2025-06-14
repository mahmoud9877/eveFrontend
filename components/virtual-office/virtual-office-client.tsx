"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Video,
  Search,
  Building,
  MapPin,
  UserCheck,
  Globe,
  ArrowLeft,
  Cuboid as Cube,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Office3DRedesigned from "./office-3d-redesigned";

const departments = [
  "CF PS HR MFG & Purchases",
  "CF PS MFG EGYPT",
  "F&A",
  "FPWH",
  "General Operations",
  "GMDSO",
  "HR",
  "HS&E",
  "IWS",
  "Line-1",
  "Line-10",
  "Line-2",
  "Line-9",
  "P&E CFS ENG",
  "P&E Cairo/Karachi",
  "PFSS",
  "QA",
  "Regional GMDSO",
  "Regional Tech Pack",
  "RPM WH",
  "Shave Care Operations",
  "Shave Care Qualilty",
  "Storeroom",
  "TSG Matrix",
  "TSM",
  "Utilities",
];

type EveEmployee = {
  id: number;
  name: string;
  department: string;
  position: string;
  knowledgeText: string;
  department_office: string;
  status: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  isAI?: boolean;
  introduction?: string;
  role?: string;
};

export default function VirtualOfficeClient() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("office");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [employees, setEmployees] = useState<EveEmployee[]>([]);
  const [myEmployee, setMyEmployee] = useState<EveEmployee | null>(null);
  const [myEmployees, setMyEmployees] = useState<EveEmployee[]>([]);
  const [eveData, setEveData] = useState<EveEmployee | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetcAllhEmployees = async () => {
      try {
        const response = await fetch(`http://localhost:5000/eve-employee`);
        if (response.ok) {
          const data = await response.json();
          console.log("ALL EMPLOYEES", data.employees);
          setEmployees(data.employees || []);
        }
      } catch (error) {
        console.error("Failed to fetch all employees:", error);
        toast({
          title: "Error",
          description: "Failed to fetch employees",
          variant: "destructive",
        });
      }
    };

    const fetchMyEmployees = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch(
          "http://localhost:5000/eve-employee/my-employee",
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `employee${token}`,
            },
          }
        );

        if (res.ok) {
          const { eveEmployee } = await res.json();
          console.log("My Employees response:", res);
          console.log("MY EMPLOYEES", eveEmployee);
          setMyEmployees(eveEmployee);
        } else {
          const errorData = await res.json();
          console.error("Failed with status:", res.status, errorData);
          toast({
            title: "Error",
            description: errorData.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch my employee:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your employee data",
          variant: "destructive",
        });
      }
    };

    fetchEmployees();
    fetchMyEmployee();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!myEmployee) throw new Error("Employee data not loaded");
      const updateRes = await fetch(
        `http://localhost:5000/eve-employee/${myEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `employee${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            name: myEmployee.name,
            department_office: myEmployee.department_office,
            role: myEmployee.role,
            status: myEmployee.status,
          }),
        }
      );

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.message || "Failed to update employee");
      }

      toast({
        title: "Profile Updated",
        description:
          "Your virtual office profile has been updated successfully.",
      });

      fetchEmployees();
      fetchMyEmployee();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.department &&
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  // if (!myEmployee) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
  //         <p className="text-orange-600">Loading your profile...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700/50 mr-4"
              onClick={() => router.push("/home")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
            <Building className="h-6 w-6 text-gray-300 mr-2" />
            <h1 className="text-xl font-bold text-white">
              Pixel Virtual Office
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-300 hover:text-white hover:bg-gray-700/50"
            >
              <Globe className="h-4 w-4 mr-1" />
              {i18n?.language === "en" ? "عربي" : "English"}
            </Button>
            <div className="text-gray-300 text-sm">
              {t("virtualOffice.loggedInAs")}: {user?.name}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-gray-700 to-gray-800">
            <TabsTrigger
              value="office"
              className="data-[state=active]:bg-gray-600 text-gray-300"
            >
              <Cube className="h-4 w-4 mr-2" />
              Pixel Office
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="data-[state=active]:bg-gray-600 text-gray-300"
            >
              <Users className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-gray-600 text-gray-300"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="data-[state=active]:bg-gray-600 text-gray-300"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="office" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Cube className="h-5 w-5 mr-2" />
                  Pixel Art Virtual Office Environment
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Navigate through the pixel art office space inspired by
                  classic 2D games. Click on the blue cubes to interact with
                  different areas, or click on employee avatars to start
                  conversations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Office3DRedesigned employees={employees} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-gray-800">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Quick Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                    onClick={() => router.push("/chat-with-eve")}
                  >
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-gray-800">
                    <Users className="h-4 w-4 mr-2" />
                    Team Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Online: {employees.length}
                    </span>
                    <Badge className="bg-gray-200 text-gray-800">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                  />
                </div>
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full md:w-[200px] border-gray-300">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">
                    All Departments
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-sm text-gray-800">
                            {employee.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 text-xs">
                            {employee.department}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={employee.isAI ? "secondary" : "outline"}
                          className={
                            employee.isAI
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {employee.isAI ? "AI Assistant" : "Human"}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200"
                            onClick={() => router.push("/chat-with-eve")}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {employee.introduction && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {employee.introduction}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
              <CardHeader>
                <CardTitle className="text-gray-800">
                  Your Virtual Office Profile
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your information for the pixel virtual office
                </CardDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-white/30 hover:bg-white/20"
                    >
                      My EVE Employees
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-white text-black">
                    <h4 className="font-semibold mb-2">Employees List</h4>
                    <ul className="space-y-1 max-h-60 overflow-y-auto">
                      {myEmployees?.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No employees found.
                        </p>
                      ) : (
                        myEmployees.map((emp) => (
                          <li
                            key={emp.id}
                            className="border-b pb-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                            onClick={() => {
                              setEveData(emp);
                              setMessages([]);
                              toast({
                                title: `Now chatting with ${emp.name}`,
                              });
                            }}
                          >
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-gray-500">
                              {emp.department}
                            </p>
                          </li>
                        ))
                      )}
                    </ul>
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-800">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={myEmployee?.name || ""}
                      onChange={(e) =>
                        myEmployee &&
                        setMyEmployee({ ...myEmployee, name: e.target.value })
                      }
                      className="border-gray-300 focus:border-gray-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-800">
                      Department In Office
                    </Label>
                    <Select
                      value={myEmployee?.department_office || ""}
                      onValueChange={(value) =>
                        myEmployee &&
                        setMyEmployee({
                          ...myEmployee,
                          department_office: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-800">
                      Role
                    </Label>
                    <Input
                      id="role"
                      value={myEmployee?.role || ""}
                      onChange={(e) =>
                        myEmployee &&
                        setMyEmployee({
                          ...myEmployee,
                          role: e.target.value,
                        })
                      }
                      className="border-gray-300 focus:border-gray-500"
                      placeholder="Your Role"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-800">
                      Status
                    </Label>
                    <Select
                      value={myEmployee?.status || "online"}
                      onValueChange={(value) =>
                        myEmployee &&
                        setMyEmployee({ ...myEmployee, status: value })
                      }
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="inMeeting">In a Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => {
                const deptEmployees = employees.filter(
                  (emp) => emp.department_office === dept
                );
                return (
                  <Card
                    key={dept}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-800">
                        {dept}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-xs">
                        {deptEmployees.length} employees
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {deptEmployees.slice(0, 3).map((emp) => (
                            <div
                              key={emp.id}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white flex items-center justify-center text-xs text-white"
                            >
                              {emp.name.charAt(0)}
                            </div>
                          ))}
                          {deptEmployees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white">
                              +{deptEmployees.length - 3}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:bg-gray-200"
                          onClick={() => {
                            setSelectedDepartment(dept);
                            setActiveTab("people");
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
