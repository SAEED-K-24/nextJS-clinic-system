"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const roleOptions = [
  { value: "PATIENT", label: "Patient" },
  { value: "DOCTOR", label: "Doctor" },
];

const specialtyOptions = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "ENT", label: "Ear, Nose & Throat" },
  { value: "General", label: "General Practice" },
];

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterInput) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorMsg =
          typeof json.error === "string"
            ? json.error
            : "Registration failed";
        toast.error(errorMsg);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Register as a patient or doctor
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="phone"
            label="Phone (optional)"
            type="tel"
            placeholder="+1 234 567 890"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Select
            id="role"
            label="I am a"
            options={roleOptions}
            placeholder="Select role"
            error={errors.role?.message}
            {...register("role")}
          />
          {selectedRole === "DOCTOR" && (
            <Select
              id="specialty"
              label="Specialty"
              options={specialtyOptions}
              placeholder="Select specialty"
              error={errors.specialty?.message}
              {...register("specialty")}
            />
          )}
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Create Account
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </CardBody>
    </Card>
  );
}
