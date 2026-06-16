import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppointmentList } from "@/components/appointments/appointment-list";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PatientDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") redirect("/login");

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.userId },
    include: {
      doctor: { select: { id: true, name: true, specialty: true } },
    },
    orderBy: { date: "desc" },
  });

  const serialized = appointments.map((a) => ({
    ...a,
    date: a.date.toISOString(),
    patient: undefined,
  }));

  const active = serialized.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "COMPLETED"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            My Appointments
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {active.length > 0
              ? `You have ${active.length} upcoming appointment${active.length > 1 ? "s" : ""}`
              : "No upcoming appointments"}
          </p>
        </div>
        <Link
          href="/doctors"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          Book New Appointment
        </Link>
      </div>

      <AppointmentList appointments={serialized} role="PATIENT" />
    </div>
  );
}
