"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Opret Rytter
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Tilmeld dig for at deltage i UGE 30
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Fulde Navn
            </Label>
            <Input
              textColor="black"
              id="name"
              type="text"
              placeholder="Indtast dit fulde navn"
              {...register("name")}
              className={`${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              textColor="black"
              id="email"
              type="email"
              placeholder="Indtast din email"
              {...register("email")}
              className={`${
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Kodeord
            </Label>
            <div className="relative">
              <Input
                textColor="black"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Opret et kodeord"
                {...register("password")}
                className={`pr-10 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Bekræft Kodeord
            </Label>
            <div className="relative">
              <Input
                textColor="black"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Bekræft dit kodeord"
                {...register("confirmPassword")}
                className={`pr-10 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? "Opretter rytter..." : "Opret Rytter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
