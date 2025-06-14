"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useAuth } from "@/lib/auth-context";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be selected.",
  }),
  introduction: z.string().min(10, {
    message: "Introduction must be at least 10 characters.",
  }),
});

const departments = ["Engineering", "Marketing", "Sales", "Human Resources"];

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
};

function getPositionFromDepartment(department: string) {
  switch (department) {
    case "Engineering":
      return "Software Engineer";
    case "Marketing":
      return "Marketing Specialist";
    case "Sales":
      return "Sales Representative";
    case "Human Resources":
      return "HR Generalist";
    default:
      return "General Employee";
  }
}

const CreateEveForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      introduction: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const position = getPositionFromDepartment(data.department);
      const fullData = { ...data, position };
      console.log("📤 Sending data to backend:", fullData);
      localStorage.setItem("eveEmployee", JSON.stringify(fullData));
      const response = await fetchWithAuth(
        process.env.NEXT_PUBLIC_BASE_URL + "/eve-employee", // ✅ استخدم متغير البيئة بدل localhost
        {
          method: "POST",
          body: JSON.stringify(fullData),
        },
        logout // ← ده الكولباك لو التوكن فشل يتجدد
      );

      console.log("📥 Response from backend:", response);

      // ✅ Check if the response is valid and has expected structure
      if (!response || response.error) {
        console.error(
          "❌ Backend returned error:",
          response?.error || "Unknown error"
        );
        throw new Error("Failed to create employee.");
      }

      toast({
        title: "Success",
        description: "Eve Employee created successfully!",
      });

      router.push("/chat-with-eve");
    } catch (error: any) {
      console.error("❌ Error in onSubmit:", error);
      toast({
        title: "Error",
        description:
          error?.message || "There was a problem creating the employee.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 dark">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:text-white/80 hover:bg-white/10"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-none text-white">
          <CardHeader>
            <CardTitle className="text-2xl">{t("createEve.title")}</CardTitle>
            <CardDescription className="text-blue-200">
              {t("createEve.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("createEve.name")}</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder={t("createEve.namePlaceholder")}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">
                      {t("createEve.department")}
                    </Label>
                    <Controller
                      control={control}
                      name="department"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="bg-white/20 border-white/30 text-white">
                            <SelectValue
                              placeholder={t("createEve.departmentPlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.department && (
                      <p className="text-red-400 text-sm">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="introduction">
                  {t("createEve.introduction")}
                </Label>
                <Textarea
                  id="introduction"
                  {...register("introduction")}
                  placeholder={t("createEve.introductionPlaceholder")}
                  rows={5}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
                {errors.introduction && (
                  <p className="text-red-400 text-sm">
                    {errors.introduction.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("common.submitting") : t("createEve.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEveForm;
