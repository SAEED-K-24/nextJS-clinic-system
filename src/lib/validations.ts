import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PATIENT", "DOCTOR"]),
    specialty: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "DOCTOR") return !!data.specialty;
      return true;
    },
    { message: "Specialty is required for doctors", path: ["specialty"] }
  );

export const appointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string().datetime({ message: "Invalid date format" }),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export const updateAppointmentSchema = z.object({
  action: z.enum(["cancel", "confirm", "complete"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
