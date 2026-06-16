import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Card, CardBody } from "@/components/ui/card";
import { BookingForm } from "@/components/forms/booking-form";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = await prisma.user.findFirst({
    where: { id, role: "DOCTOR" },
    select: { name: true, specialty: true },
  });

  if (!doctor) return { title: "Doctor Not Found" };

  return {
    title: `Dr. ${doctor.name} - Clinic System`,
    description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty || "General Practice"}`,
  };
}

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 17; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function getNext30Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    if (day !== 0 && day !== 6) days.push(d);
  }
  return days;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const doctor = await prisma.user.findFirst({
    where: { id, role: "DOCTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      specialty: true,
      phone: true,
    },
  });

  if (!doctor) notFound();

  const availableSlots: Record<string, string[]> = {};
  const days = getNext30Days();

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: id,
      date: {
        gte: days[0],
        lt: new Date(days[days.length - 1].getTime() + 86400000),
      },
      status: { not: "CANCELLED" },
    },
    select: { date: true },
  });

  const bookedSet = new Set(
    existingAppointments.map((a) =>
      new Date(a.date).toISOString().slice(0, 16)
    )
  );

  const allSlots = getTimeSlots();

  for (const day of days) {
    const dateKey = formatDate(day);
    const daySlots: string[] = [];
    for (const slot of allSlots) {
      const slotDateTime = `${dateKey}T${slot}`;
      if (!bookedSet.has(slotDateTime)) {
        daySlots.push(slot);
      }
    }
    if (daySlots.length > 0) {
      availableSlots[dateKey] = daySlots;
    }
  }

  const initials = doctor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/doctors"
          className="mb-6 inline-flex items-center text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Back to Doctors
        </Link>

        <Card className="mb-8">
          <CardBody className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Dr. {doctor.name}
              </h1>
              <p className="mt-1 text-text-secondary">
                {doctor.specialty || "General Practice"}
              </p>
              {doctor.phone && (
                <p className="mt-1 text-sm text-gray-400">{doctor.phone}</p>
              )}
            </div>
          </CardBody>
        </Card>

        {session && session.role === "PATIENT" ? (
          <BookingForm doctorId={doctor.id} availableSlots={availableSlots} />
        ) : session && session.role !== "PATIENT" ? (
          <Card>
            <CardBody>
              <p className="text-text-secondary">
                Only patients can book appointments.
              </p>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="text-center">
              <p className="text-text-secondary mb-4">
                Please sign in to book an appointment
              </p>
              <Link
                href={`/login?redirect=/doctors/${doctor.id}`}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Sign In to Book
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
