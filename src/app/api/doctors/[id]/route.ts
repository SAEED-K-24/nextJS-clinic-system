import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 17; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

function getNext7Days(): Date[] {
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const doctor = await prisma.user.findFirst({
      where: { id, role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
        phone: true,
        imageUrl: true,
      },
    });

    if (!doctor) {
      return Response.json({ error: "Doctor not found" }, { status: 404 });
    }

    const availableSlots: Record<string, string[]> = {};
    const days = getNext7Days();

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

    return Response.json({ doctor, availableSlots });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
