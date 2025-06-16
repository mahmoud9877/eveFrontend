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
import { ArrowLeft, Upload } from "lucide-react";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setPhotoUrl(localUrl);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const position = getPositionFromDepartment(data.department);
      const fullData = {
        ...data,
        position,
        photoUrl, // ⬅️ إضافة رابط الصورة
      };
      console.log("📤 Sending data to backend:", fullData);
      localStorage.setItem("eveEmployee", JSON.stringify(fullData));

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/eve-employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `employee${token}`,
          },
          body: JSON.stringify(fullData),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result?.error || "Failed to create employee.");
      }

      toast({
        title: "Success",
        description: "Eve Employee created successfully!",
      });

      router.push("/chat-with-eve");
    } catch (error: any) {
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

                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-white/20 mb-4 relative">
                    <Image
                      src={photoUrl || "/placeholder.svg"}
                      alt="EVE Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Label
                    htmlFor="photo"
                    className="cursor-pointer bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-md flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t("createEve.uploadPhoto")}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
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
