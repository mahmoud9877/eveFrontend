"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip } from "lucide-react";

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

const ChatContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eveData, setEveData] = useState<EveData | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const employeeIdFromUrl = searchParams.get("employeeId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const storedMessages = localStorage.getItem(
      `chatMessages-${employeeIdFromUrl}`
    );
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [employeeIdFromUrl]);

  useEffect(() => {
    if (eveData?.id) {
      localStorage.setItem(
        `chatMessages-${eveData.id}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, eveData]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeIdFromUrl) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/${employeeIdFromUrl}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `employee${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch employee data");

        const data = await res.json();
        setEveData(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast({
          title: "Error",
          description: "Could not load employee data.",
          variant: "destructive",
        });

        setEveData({
          id: employeeIdFromUrl || "",
          photoUrl: "",
          name: "Unknown Employee",
          department: "N/A",
          introduction: "",
          status: "Offline",
        });
      }
    };

    fetchEmployeeData();
  }, [employeeIdFromUrl]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !file) return;
    if (!eveData?.id) {
      toast({ title: "Select an employee first", variant: "destructive" });
      return;
    }

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

      const responseData = await res.json();

      setMessages((prev) => [...prev, userMessage]);

      const eveResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "eve",
        content: responseData.reply,
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
      <div className="bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => router.push("/home")}
          >
            {" "}
            <ArrowLeft className="h-5 w-5" />{" "}
          </Button>
          <div className="flex items-center gap-4 min-w-0">
            <Avatar className="h-10 w-10 border border-white shadow-sm">
              {eveData?.photoUrl ? (
                <AvatarImage
                  src={`http://localhost:5000${eveData.photoUrl}`}
                  alt="employee avatar"
                />
              ) : (
                <AvatarFallback className="bg-blue-500 text-white text-lg">
                  {eveData?.name?.charAt(0) || "E"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="truncate">
              <h2 className="text-lg font-semibold text-white truncate">
                {eveData?.name || "EVE"}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-200 truncate">
                  {eveData?.department || "AI Assistant"}
                </p>
                {eveData?.status && (
                  <Badge
                    variant="outline"
                    className="text-xs whitespace-nowrap"
                  >
                    {eveData.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

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
                className={`max-w-md rounded-2xl px-3 py-2 shadow-md ${
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
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      <div className="bg-black/30 backdrop-blur-sm p-4 border-t border-white/10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={`Message ${eveData?.name || "EVE"}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/50"
            />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) {
                  setFile(selected);
                  toast({ title: "File selected", description: selected.name });
                }
              }}
            />
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && !file) || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {file && (
            <div className="text-sm text-white bg-white/10 p-2 rounded-md flex items-center justify-between mt-2">
              <span className="truncate max-w-[80%]">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 ml-2 hover:text-red-600"
                onClick={() => setFile(null)}
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

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
