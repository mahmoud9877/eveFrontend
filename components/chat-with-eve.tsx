"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Send, Users, Paperclip } from "lucide-react";
import { token } from "@/utils/fetchWithAuth";
import { useAuth } from "@/lib/auth-context";

interface Message {
  id: string;
  sender: "user" | "eve";
  content: string;
  timestamp: Date;
  type?: "text" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface EveData {
  id?: string;
  name: string;
  department: string;
  introduction: string;
  imageUrl?: string;
  photoUrl?: string;
  isAI?: boolean;
  status?: string;
}

const ChatWithEve: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eveData, setEveData] = useState<EveData | null>(null);
  const [myEmployees, setMyEmployees] = useState<EveData[]>([]);
  const [isFromOffice, setIsFromOffice] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    const loadEmployees = async () => {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/my-employee`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        );
        console.log("kol el employees", data.eveEmployee);
        // setEveData(data.eveEmployee);
        setMyEmployees(data.eveEmployee || []);
        setEveData(data.eveEmployee);
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `chatMessages-${eveData?.id}`,
      JSON.stringify(messages)
    );
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;
    const timestamp = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: file ? "Sent a file" : input,
      timestamp,
      type: file ? "file" : "text",
      ...(file && { fileUrl: URL.createObjectURL(file), fileName: file.name }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("message", input); // ممكن تبعت محتوى النص لو فيه
      formData.append("employeeId", myEmployees?.id);

      const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
        body: formData,
      });

      if (!data) {
        toast({
          title: "Error",
          description: "No response from EVE.",
          variant: "destructive",
        });
        return;
      }

      const eveResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "eve",
        content: data.reply,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, eveResponse]);
    } catch (err) {
      console.error("API error:", err);
      toast({
        title: "Error",
        description: "Failed to get response from EVE.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between overflow-x-auto">
          {/* اليسار: زر الرجوع */}
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() =>
              router.push(isFromOffice ? "/virtual-office" : "/home")
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* المنتصف: بيانات الموظف */}
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              {myEmployees?.imageUrl || myEmployees?.photoUrl ? (
                <AvatarImage
                  src={myEmployees.imageUrl || myEmployees.photoUrl}
                  alt="employee avatar"
                />
              ) : (
                <AvatarFallback className="bg-blue-500 text-white">
                  {myEmployees?.name?.charAt(0) || "E"}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="truncate">
              <h2 className="text-lg font-semibold text-white truncate">
                {myEmployees?.name || "EVE"}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-200 truncate">
                  {myEmployees?.department || "AI Assistant"}
                </p>
                {myEmployees?.isAI && (
                  <Badge
                    variant="secondary"
                    className="text-xs whitespace-nowrap"
                  >
                    AI
                  </Badge>
                )}
                {myEmployees?.status && (
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    {myEmployees.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* اليمين: قائمة الموظفين + زر إضافي */}
          <div className="flex items-center gap-4 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  My EVE Employees
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-white text-black">
                <h4 className="font-semibold mb-2">Employees List</h4>
                <ul className="space-y-1 max-h-60 overflow-y-auto">
                  {myEmployees.length === 0 ? (
                    <p className="text-sm text-gray-500">No employees found.</p>
                  ) : (
                    eveData.map((emp) => (
                      <li
                        key={emp.id}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => {
                          setMyEmployees(emp);
                          setMessages([]);
                          toast({ title: `Now chatting with ${emp.name}` });
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

            {isFromOffice && (
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => router.push("/virtual-office")}
              >
                <Users className="h-4 w-4 mr-2" />
                Office
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-md rounded-2xl px-3 py-2 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white backdrop-blur"
                }`}
              >
                <CardContent className="p-0">
                  {msg.type === "file" ? (
                    <div>
                      <p className="text-sm font-semibold">File:</p>
                      <a
                        href={msg.fileUrl}
                        download={msg.fileName}
                        target="_blank"
                        className="underline text-sm"
                      >
                        {msg.fileName}
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(msg.timestamp), "MMM dd, yyyy hh:mm a")}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-black/30 backdrop-blur-sm p-4 border-t border-white/10">
        <div className="container mx-auto max-w-4xl flex gap-2">
          <Input
            type="text"
            placeholder={`Message ${myEmployees?.name || "EVE"}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-white focus:border-white"
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                toast({
                  title: "File selected",
                  description: selected.name,
                });
              }
            }}
            hidden
          />
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={(!input.trim() && !file) || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithEve;
