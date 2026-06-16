"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function bookAppointment(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    throw new Error("Only patients can book appointments");
  }

  const doctorId = formData.get("doctorId") as string;
  const date = formData.get("date") as string;
  const notes = formData.get("notes") as string;

  if (!doctorId || !date) {
    throw new Error("Doctor and date are required");
  }

  const appointmentDate = new Date(date);
  const day = appointmentDate.getDay();
  const hour = appointmentDate.getHours();

  if (day === 0 || day === 6) {
    throw new Error("Appointments are only available Monday to Friday");
  }
  if (hour < 9 || hour > 16) {
    throw new Error("Appointments must be between 9:00 AM and 5:00 PM");
  }

  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date: appointmentDate,
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    throw new Error("This time slot is already booked");
  }

  await prisma.appointment.create({
    data: {
      patientId: session.userId,
      doctorId,
      date: appointmentDate,
      notes: notes || null,
    },
  });

  revalidatePath("/dashboard/patient");
  revalidatePath("/doctors");
}

export async function cancelAppointment(appointmentId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new Error("Appointment not found");

  if (session.role === "PATIENT" && appointment.patientId !== session.userId) {
    throw new Error("Forbidden");
  }

  const hoursUntil = (appointment.date.getTime() - Date.now()) / 3600000;
  if (hoursUntil < 24 && session.role === "PATIENT") {
    throw new Error("Cannot cancel less than 24 hours before appointment");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard/patient");
  revalidatePath("/dashboard/doctor");
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "CONFIRMED" | "COMPLETED"
) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") {
    throw new Error("Only doctors can update appointment status");
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new Error("Appointment not found");
  if (appointment.doctorId !== session.userId) throw new Error("Forbidden");

  if (status === "CONFIRMED" && appointment.status !== "PENDING") {
    throw new Error("Only pending appointments can be confirmed");
  }
  if (status === "COMPLETED" && appointment.status !== "CONFIRMED") {
    throw new Error("Only confirmed appointments can be completed");
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath("/dashboard/doctor");
  revalidatePath("/dashboard/patient");
}
