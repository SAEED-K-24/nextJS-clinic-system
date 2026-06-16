import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateAppointmentSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (action === "cancel") {
      if (session.role === "PATIENT" && appointment.patientId !== session.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      const hoursUntil = (appointment.date.getTime() - Date.now()) / 3600000;
      if (hoursUntil < 24 && session.role === "PATIENT") {
        return Response.json(
          { error: "Cannot cancel less than 24 hours before appointment" },
          { status: 400 }
        );
      }

      if (appointment.status === "COMPLETED" || appointment.status === "CANCELLED") {
        return Response.json(
          { error: "Cannot cancel this appointment" },
          { status: 400 }
        );
      }
    }

    if (action === "confirm" || action === "complete") {
      if (session.role !== "DOCTOR" || appointment.doctorId !== session.userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      if (action === "confirm" && appointment.status !== "PENDING") {
        return Response.json(
          { error: "Only pending appointments can be confirmed" },
          { status: 400 }
        );
      }
      if (action === "complete" && appointment.status !== "CONFIRMED") {
        return Response.json(
          { error: "Only confirmed appointments can be completed" },
          { status: 400 }
        );
      }
    }

    const statusMap: Record<string, string> = {
      cancel: "CANCELLED",
      confirm: "CONFIRMED",
      complete: "COMPLETED",
    };

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: statusMap[action] as never },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    });

    return Response.json({ appointment: updated });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
