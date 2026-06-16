import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (session.role === "PATIENT") where.patientId = session.userId;
    else if (session.role === "DOCTOR") where.doctorId = session.userId;
    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { id: true, name: true, email: true } },
          doctor: { select: { id: true, name: true, specialty: true } },
        },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.appointment.count({ where }),
    ]);

    return Response.json({ appointments, total, page, limit });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "PATIENT") {
      return Response.json(
        { error: "Only patients can book appointments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { doctorId, date, notes } = parsed.data;
    const appointmentDate = new Date(date);

    const day = appointmentDate.getDay();
    if (day === 0 || day === 6) {
      return Response.json(
        { error: "Appointments are only available Monday to Friday" },
        { status: 400 }
      );
    }

    const hour = appointmentDate.getHours();
    const minute = appointmentDate.getMinutes();
    if (hour < 9 || hour > 16 || (hour === 16 && minute > 30)) {
      return Response.json(
        { error: "Appointments must be between 9:00 AM and 5:00 PM" },
        { status: 400 }
      );
    }

    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        status: { not: "CANCELLED" },
      },
    });

    if (existing) {
      return Response.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.userId,
        doctorId,
        date: appointmentDate,
        notes,
      },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    });

    return Response.json({ appointment }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
