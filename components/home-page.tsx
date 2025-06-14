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
import { UserPlus, MessageSquare, Users, LogOut, Globe } from "lucide-react";
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
    const storedEve = localStorage.getItem("eve-user");
    try {
      const parsed = JSON.parse(storedEve || "{}");
      const employee = parsed?.employee;
      setHasCreatedEve(!!employee);
    } catch (err) {
      setHasCreatedEve(false);
    }
  }, [user]); // أو [someTrigger] لو فيه متغير بيتغير بعد الإنشاء

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {/* <div className="w-12 h-12 relative rounded-full overflow-hidden">
              <Image
                src={user?.image || "/placeholder.svg?height=48&width=48"}
                alt={user?.name || "User"}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div> */}
            <div>
              <h2 className="text-xl font-bold">
                {t("home.welcome")}, {user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {i18n.language === "en" ? "عربي" : "English"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? t("home.loggingOut") : t("home.logout")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation("/create-eve")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-6 w-6 mr-2 text-blue-500" />
                {t("home.createEve")}
              </CardTitle>
              <CardDescription>{t("home.createEveDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <UserPlus className="h-24 w-24 text-blue-500" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation("/create-eve");
                }}
              >
                {t("home.createEveButton")}
              </Button>
            </CardFooter>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => hasCreatedEve && handleNavigation("/chat-with-eve")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-green-500" />
                {t("home.chatWithEve")}
              </CardTitle>
              <CardDescription>{t("home.chatWithEveDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <MessageSquare className="h-24 w-24 text-green-500" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!hasCreatedEve}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasCreatedEve) {
                    handleNavigation("/chat-with-eve");
                  }
                }}
              >
                {hasCreatedEve
                  ? t("home.chatWithEveButton")
                  : t("home.createEveFirst")}
              </Button>
            </CardFooter>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigation("/virtual-office")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-purple-500" />
                {t("home.virtualOffice")}
              </CardTitle>
              <CardDescription>{t("home.virtualOfficeDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Users className="h-24 w-24 text-purple-500" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation("/virtual-office");
                }}
              >
                {t("home.virtualOfficeButton")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
