"use client";

import { ChevronDown, ArrowLeft, Send, Users, Paperclip } from "lucide-react";
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
  photoUrl?: string;
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
  const employeeCache = useRef<EveData[] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
    if (!token) {
      router.push("/");
      return;
    }
    const loadEmployees = async () => {
      if (employeeCache.current) {
        setMyEmployees(employeeCache.current);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/my-employee`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `employee${token}`,
            },
          }
        );
        const data = await res.json();
        const { employees } = data;
        const withFullImagePaths = employees.map((emp: EveData) => ({
          ...emp,
          photoUrl: emp.photoUrl
            ? `https://eve-backend.vercel.app/${emp.photoUrl}`
            : undefined,
        }));

        setMyEmployees(withFullImagePaths);
        employeeCache.current = withFullImagePaths;
      } catch (error) {
        console.error("Error loading employees:", error);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (eveData?.id) {
      localStorage.setItem(
        `chatMessages-${eveData.id}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, eveData?.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!eveData?.id) {
      toast({
        title: "Please select an employee",
        description: "You must select an employee before sending a message.",
        variant: "destructive",
      });
      return;
    }
    if (!input.trim() && !file) return;

    const timestamp = new Date();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: file ? "Sent a file" : input,
      timestamp,
      type: file ? "file" : "text",
      ...(file && {
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
      }),
    };

    // حذف الرسالة المؤقتة
    setMessages((prev) => [
      ...prev.filter((msg) => msg.id !== "temp-file"),
      userMessage,
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("message", input);
      formData.append("employeeId", eveData.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          authorization: `employee${localStorage.getItem("token")}`,
        },
        body: formData,
      });
     

      const data = await res.json();
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 text-white font-sans">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md p-4 border-b border-white/10 shadow-sm">
        <div className="container mx-auto flex items-center justify-between overflow-x-auto">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10 transition"
            onClick={() =>
              router.push(isFromOffice ? "/virtual-office" : "/home")
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              {eveData?.photoUrl ? (
                <AvatarImage src={eveData.photoUrl} alt="employee avatar" />
              ) : (
                <AvatarFallback className="bg-indigo-600 text-white">
                  {eveData?.name?.charAt(0) || "E"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="truncate">
              <h2 className="text-lg font-semibold truncate text-white">
                {eveData?.name || "EVE"}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-indigo-200 truncate">
                  {eveData?.department || "AI Assistant"}
                </p>
                {eveData?.status && (
                  <Badge
                    variant="outline"
                    className="text-xs border-indigo-400 text-indigo-100"
                  >
                    {eveData.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20 hover:bg-white/10 p-2"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-white text-black">
                <h4 className="font-semibold mb-2">Employees List</h4>
                <ul className="space-y-1 max-h-60 overflow-y-auto">
                  {myEmployees.length === 0 ? (
                    <p className="text-sm text-gray-500">No employees found.</p>
                  ) : (
                    myEmployees.map((emp) => (
                      <li
                        key={emp.id}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => {
                          setEveData(emp);
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

      {/* Chat Area */}
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
                className={`max-w-md rounded-2xl px-4 py-3 text-white shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-indigo-700 to-purple-700"
                    : "bg-white/10 backdrop-blur border border-white/10"
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
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                  <p className="text-xs opacity-60 mt-1 text-right">
                    {format(new Date(msg.timestamp), "MMM dd, yyyy hh:mm a")}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input + File Preview + Send */}
      <div className="bg-white/5 backdrop-blur-md p-4 border-t border-white/10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={
                eveData?.name
                  ? `Message ${eveData.name}...`
                  : "Select an employee first..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!eveData?.id}
              className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-white focus:border-white px-4 py-2 rounded-xl"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  const timestamp = new Date();
                  const tempFileMessage: Message = {
                    id: "temp-file",
                    sender: "user",
                    content: "Sent a file",
                    timestamp,
                    type: "file",
                    fileUrl: URL.createObjectURL(selected),
                    fileName: selected.name,
                  };

                  setMessages((prev) => [...prev, tempFileMessage]);

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
              className="text-white hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && !file) || isLoading || !eveData?.id}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* File Preview with Remove */}
          {file && (
            <div className="text-sm text-white bg-white/10 p-2 rounded-md flex items-center justify-between mt-1">
              <span className="truncate max-w-[80%]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 ml-2 hover:text-red-600"
                onClick={() => {
                  setFile(null);
                  setMessages((prev) =>
                    prev.filter((msg) => msg.id !== "temp-file")
                  );
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithEve;
