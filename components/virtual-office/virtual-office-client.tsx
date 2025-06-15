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
import { fetchWithAuth } from "@/utils/fetchWithAuth";

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
  const { logout } = useAuth();

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee`,
          {},
          logout
        );
        if (response && response.employees) {
          console.log("ALL EMPLOYEES", response.employees);
          setEmployees(response.employees || []);
        } else {
          throw new Error("No employees found");
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
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/my-employee`,
          {},
          logout
        );

        if (response && response.eveEmployee) {
          console.log("MY EMPLOYEES", response.eveEmployee);
          setMyEmployees(response.eveEmployee);
        } else {
          throw new Error(response?.message || "Something went wrong");
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

    fetchAllEmployees();
    fetchMyEmployees();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!myEmployee) throw new Error("Employee data not loaded");

      const updateRes = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/${myEmployee.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: myEmployee.name,
            department_office: myEmployee.department_office,
            role: myEmployee.role,
            status: myEmployee.status,
          }),
        },
        logout
      );

      if (!updateRes || updateRes.error) {
        throw new Error(updateRes.message || "Failed to update employee");
      }

      toast({
        title: "Profile Updated",
        description:
          "Your virtual office profile has been updated successfully.",
      });
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
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center flex-wrap gap-4">
            <Button
              variant="ghost"
              className="text-white hover:text-white/80 hover:bg-white/10 p-2"
              onClick={() => router.push("/home")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-white" />
              <h1 className="text-lg md:text-xl font-semibold text-white whitespace-nowrap">
                Pixel Virtual Office
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white hover:text-white/80 hover:bg-white/10"
            >
              <Globe className="h-4 w-4 mr-1" />
              {i18n?.language === "en" ? "عربي" : "English"}
            </Button>
            <div className="text-sm text-gray-300 whitespace-nowrap">
              {t("virtualOffice.loggedInAs")}:{" "}
              <span className="font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-lg shadow-sm overflow-hidden">
            <TabsTrigger
              value="office"
              className="text-sm font-medium text-gray-300 hover:bg-gray-700/70 data-[state=active]:bg-gray-600 data-[state=active]:text-white py-2 flex items-center justify-center"
            >
              <Cube className="h-4 w-4 mr-2" />
              Office
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="text-sm font-medium text-gray-300 hover:bg-gray-700/70 data-[state=active]:bg-gray-600 data-[state=active]:text-white py-2 flex items-center justify-center"
            >
              <Users className="h-4 w-4 mr-2" />
              People
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-sm font-medium text-gray-300 hover:bg-gray-700/70 data-[state=active]:bg-gray-600 data-[state=active]:text-white py-2 flex items-center justify-center"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="departments"
              className="text-sm font-medium text-gray-300 hover:bg-gray-700/70 data-[state=active]:bg-gray-600 data-[state=active]:text-white py-2 flex items-center justify-center"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Departments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="office" className="space-y-6">
            {/* Main Office Card */}
            <Card className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800 text-lg font-semibold">
                  <Cube className="h-5 w-5 mr-2 text-blue-600" />
                  Pixel Art Virtual Office Environment
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
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
              {/* Chat Card */}
              <Card className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-gray-800 font-medium">
                    <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                    Quick Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
                    onClick={() => router.push("/chat-with-eve")}
                  >
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>

              {/* Team Status Card */}
              <Card className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center text-gray-800 font-medium">
                    <Users className="h-4 w-4 mr-2 text-green-600" />
                    Team Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Online: {employees.length}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="people" className="space-y-6">
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-gray-500"
                />
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

            {/* Employees Grid */}
            <ScrollArea className="h-[600px] pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-sm rounded-lg"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-sm text-gray-800 font-medium truncate">
                            {employee.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 text-xs truncate">
                            {employee.department}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-2">
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

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-200"
                          onClick={() => router.push("/chat-with-eve")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Full intro text without truncation */}
                      {employee.introduction && (
                        <p className="text-xs text-gray-600 mt-1 break-words">
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
            <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-md rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle className="text-gray-800 text-lg font-semibold">
                      Your Virtual Office Profile
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your information for the Pixel Virtual Office.
                    </CardDescription>
                  </div>

                  {/* Popover for My EVE Employees */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900"
                      >
                        My EVE Employees
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-white text-black shadow-lg border border-gray-200 rounded-md">
                      <h4 className="font-semibold mb-2 text-gray-800">
                        Employees List
                      </h4>
                      <ul className="space-y-1 max-h-60 overflow-y-auto">
                        {myEmployees?.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No employees found.
                          </p>
                        ) : (
                          myEmployees.map((emp) => (
                            <li
                              key={emp.id}
                              className="border-b pb-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-all"
                              onClick={() => {
                                setEveData(emp);
                                setMyEmployee(emp);
                                setMessages([]);
                                toast({
                                  title: `Now editing ${emp.name}'s profile`,
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
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="name"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      required
                      value={myEmployee?.name || ""}
                      onChange={(e) =>
                        setMyEmployee((prev) =>
                          prev ? { ...prev, name: e.target.value } : prev
                        )
                      }
                      className="border-gray-300 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                      placeholder="Enter employee name"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="department"
                      className="text-sm text-gray-700 font-medium"
                    >
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
                      <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-gray-400">
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

                  {/* Role */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="role"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Role
                    </Label>
                    <Input
                      id="role"
                      required
                      value={myEmployee?.role || ""}
                      onChange={(e) =>
                        myEmployee &&
                        setMyEmployee({ ...myEmployee, role: e.target.value })
                      }
                      className="border-gray-300 focus:ring-2 focus:ring-gray-400"
                      placeholder="e.g. Developer, Designer"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="status"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Status
                    </Label>
                    <Select
                      value={myEmployee?.status || "online"}
                      onValueChange={(value) =>
                        myEmployee &&
                        setMyEmployee({ ...myEmployee, status: value })
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-gray-400">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="inMeeting">In a Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium"
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
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-sm rounded-lg"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        {dept}
                      </CardTitle>
                      <CardDescription className="text-gray-500 text-sm">
                        {deptEmployees.length}{" "}
                        {deptEmployees.length === 1 ? "employee" : "employees"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        {/* Employee initials */}
                        <div className="flex -space-x-2">
                          {deptEmployees.slice(0, 3).map((emp) => (
                            <div
                              key={emp.id}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white flex items-center justify-center text-sm font-medium text-white shadow-sm"
                              title={emp.name}
                            >
                              {emp.name.charAt(0)}
                            </div>
                          ))}
                          {deptEmployees.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-sm font-medium text-white shadow-sm">
                              +{deptEmployees.length - 3}
                            </div>
                          )}
                        </div>

                        {/* View Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition"
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
