"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  UserPlus,
  MessageSquare,
  Users,
  LogOut,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface HomePageProps {
  user: any;
}

export default function HomePage({ user }: HomePageProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();
  const [hasCreatedEve, setHasCreatedEve] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    const checkIfEveCreated = async () => {
      const alreadyChecked = localStorage.getItem("eveCheckedOnce");
      if (alreadyChecked === "true") {
        setHasCreatedEve(true);
        return;
      }

      const storedEve = localStorage.getItem("eveEmployee");
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found in localStorage");
        setHasCreatedEve(false);
        return;
      }

      if (storedEve) {
        try {
          const parsed = JSON.parse(storedEve);
          const employee = parsed?.employee;
          if (employee) {
            setHasCreatedEve(true);
            localStorage.setItem("eveCheckedOnce", "true");
            return;
          }
        } catch (err) {}
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee/my-employee`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `employee${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        if (!isJson) {
          const errorText = await response.text();
          console.error("Non-JSON response:", errorText);
          setHasCreatedEve(false);
          return;
        }

        const result = await response.json();
        const exists = !!result?.employees;
        setHasCreatedEve(exists);
        if (exists) localStorage.setItem("eveCheckedOnce", "true");
      } catch (err) {
        console.error("Error checking my employee:", err);
        setHasCreatedEve(false);
      }
    };

    checkIfEveCreated();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("eveCheckedOnce");
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t("home.welcome")}, {user?.name}
            </h1>
            <p className="text-blue-200">{t("home.subtitle")}</p>
          </div>

          <div className="flex justify-end items-center gap-3 px-4 py-6">
            <Button
              variant="outline"
              className="border-indigo-400 dark:border-indigo-600 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors duration-200"
              onClick={toggleLanguage}
            >
              <Globe className="h-4 w-4 mr-2" />
              {i18n.language === "en" ? "عربي" : "English"}
            </Button>

            <Button
              variant="outline"
              className="border-red-400 dark:border-red-600 text-sm text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-700 transition-colors duration-200"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? t("home.loggingOut") : t("home.logout")}
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Create EVE */}
            <Card className="bg-white/10 backdrop-blur-md border-none hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {t("home.createEve")}
                </h2>
                <p className="text-blue-200 mb-4">{t("home.createEveDesc")}</p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigateTo("/create-eve")}
                >
                  {t("home.getStarted")}
                </Button>
              </CardContent>
            </Card>

            {/* Talk to Your EVE */}
            <Card className="bg-white/10 backdrop-blur-md border-none hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {t("home.talkToEve")}
                </h2>
                <p className="text-blue-200 mb-4">{t("home.talkToEveDesc")}</p>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigateTo("/chat-with-eve")}
                  disabled={!hasCreatedEve}
                >
                  {hasCreatedEve
                    ? t("home.startChat")
                    : t("home.createEveFirst")}
                </Button>
              </CardContent>
            </Card>

            {/* Talk to Others */}
            <Card className="bg-white/10 backdrop-blur-md border-none hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {t("home.talkToOthers")}
                </h2>
                <p className="text-blue-200 mb-4">
                  {t("home.talkToOthersDesc")}
                </p>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => navigateTo("/virtual-office")}
                >
                  {t("home.enterOffice")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
